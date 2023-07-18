import json
from tqdm import tqdm

with open("data/season_data.json", "r") as file:
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
                home_team = game["teams"]["home"]["team"]["name"]
                away_team = game["teams"]["away"]["team"]["name"]
                if "All-Stars" in home_team: continue

                if "score" not in game["teams"]["home"]: continue  # Postponed / delayed
                home_score = game["teams"]["home"]["score"]
                away_score = game["teams"]["away"]["score"]
                winner, loser = away_team, home_team
                if home_score > away_score:
                    winner = home_team
                    loser = away_team
                if home_score == away_score:
                    winner = "tied"
                    print("Tie game")
                game_data.append({
                    'home_team': home_team,
                    'away_team': away_team,
                    'home_score': home_score,
                    'away_score': away_score,
                    'winning_team': winner,
                    'losing_team': loser,
                    'date': game['gameDate'],
                })
        else:
            print("No games found for this date.")
else:
    print("No dates found in the JSON data.")


with open("data/cleaned_season_data.json", "w") as file:
    json.dump(game_data, file)  # Save the JSON data to a file
    print("Response saved to cleaned_season_data.json")
