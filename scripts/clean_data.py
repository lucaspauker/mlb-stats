import json
import glob
from tqdm import tqdm

def clean_data(filename="season_data.json"):
    with open("data/" + filename, "r") as file:
        data = json.load(file)
    game_data = []  # main data structure
# Check if 'dates' key exists in the data
    if "dates" in data:
        dates = data["dates"]
        # Iterate over each date
        for date in tqdm(dates):
            if "games" in date:
                games = date["games"]
                # Iterate over each game in the date
                for game in games:
                    try:
                        if "score" not in game["teams"]["home"]: continue  # Postponed / delayed

                        home_team = game["teams"]["home"]["team"]["name"]
                        away_team = game["teams"]["away"]["team"]["name"]
                        if home_team == "Cleveland Indians": home_team = "Cleveland Guardians"
                        if away_team == "Cleveland Indians": away_team = "Cleveland Guardians"
                        if "All-Stars" in home_team: continue

                        home_score = game["teams"]["home"]["score"]
                        away_score = game["teams"]["away"]["score"]

                        home_pitcher_name, away_pitcher_name, home_pitcher_id, away_pitcher_id = "TBD", "TBD", "TBD", "TBD"
                        if 'probablePitcher' in game['teams']['home']:
                            home_pitcher_name = game['teams']['home']['probablePitcher']['fullName']
                            home_pitcher_id = game['teams']['home']['probablePitcher']['id']
                        if 'probablePitcher' in game['teams']['away']:
                            away_pitcher_name = game['teams']['away']['probablePitcher']['fullName']
                            away_pitcher_id = game['teams']['away']['probablePitcher']['id']

                        winner, loser = away_team, home_team
                        if home_score > away_score:
                            winner = home_team
                            loser = away_team
                        if home_score == away_score:
                            winner = "tied"
                            continue
                    except:
                        continue
                    game_data.append({
                        'home_team': home_team,
                        'away_team': away_team,
                        'home_score': home_score,
                        'away_score': away_score,
                        'winning_team': winner,
                        'losing_team': loser,
                        'date': game['gameDate'],
                        'official_date': game['officialDate'],
                        'home_pitcher_name': home_pitcher_name,
                        'away_pitcher_name': away_pitcher_name,
                        'home_pitcher_id': home_pitcher_id,
                        'away_pitcher_id': away_pitcher_id,
                    })
            else:
                print("No games found for this date.")
    else:
        print("No dates found in the JSON data.")


    with open("data/cleaned_" + filename, "w") as file:
        json.dump(game_data, file)  # Save the JSON data to a file
        print("Response saved to cleaned_" + filename)
        print("# of games:", len(game_data))

clean_data()

N = 5  # Number of past seasons
for x in ["/".join(x.split("/")[1:]) for x in glob.glob("data/past_season_data/*.json")]:
    clean_data(x)




