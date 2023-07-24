# -------------- IMPORTS -------------

import glob
import json
import statsapi

from datetime import datetime, timedelta
from tqdm import tqdm

# -------------- FUNCTIONS -------------

def calculate_expected(elo_a, elo_b):
    """Function to calculate the expected probability of winning"""
    return 1 / (1 + 10 ** ((elo_b - elo_a) / 400))


def update_elo(winner, loser, elo_ratings):
    K = 4  # Elo rating update constant
    # https://www.baseballprospectus.com/news/article/5247/lies-damned-lies-we-are-elo/

    # Calculate expected probabilities
    expected_winner = calculate_expected(elo_ratings[winner], elo_ratings[loser])
    expected_loser = calculate_expected(elo_ratings[loser], elo_ratings[winner])

    # Update Elo ratings
    elo_ratings[winner] += K * (1 - expected_winner)
    elo_ratings[loser] += K * (0 - expected_loser)

def one_day_earlier(date_str):
    # Convert the input string to a datetime object
    date_format = "%Y-%m-%d"
    date_obj = datetime.strptime(date_str, date_format)

    # Subtract one day from the datetime object
    one_day = timedelta(days=1)
    new_date = date_obj - one_day

    # Convert the result back to the string format and return it
    return new_date.strftime(date_format)

def get_start_date(year):
    start_date = year + '-03-20'
    if year == "2013":
        start_date = year + '-04-01'
    if year == "2014":
        start_date = year + '-03-22'
    if year == "2015":
        start_date = year + '-04-05'
    if year == "2016":
        start_date = year + '-04-03'
    if year == "2017":
        start_date = year + '-04-02'
    if year == "2018":
        start_date = year + '-03-29'
    if year == "2019":
        start_date = year + '-03-20'
    if year == "2020":
        start_date = year + '-07-24'
    if year == "2021":
        start_date = year + '-04-01'
    if year == "2022":
        start_date = year + '-04-07'
    if year == "2023":
        start_date = year + '-03-30'
    return start_date

def get_pitcher_stats(pitcher_id, end_date, year):
    try:
        ret = statsapi.get("people", {"personIds": pitcher_id, "hydrate": "stats(group=[pitching],type=[byDateRange],startDate=" + get_start_date(year) + ",endDate=" + end_date + ",season=" + year + ")"})['people'][0]
    except:
        print("Error getting pitcher stats data")
        return None

    if 'stats' in ret:
        try:
            assert(len(ret['stats']) == 1)
            if len(ret['stats'][0]['splits']) == 0: return None
            stats = ret['stats'][0]['splits'][0]['stat']

            era = stats['era']
            if era == '-.--': era = 0
            else: era = float(era)

            wins = stats['wins']
            losses = stats['losses']

            win_percentage = stats['winPercentage']
            if win_percentage == '.---': win_percentage = 0
            else: win_percentage = float(win_percentage)

            whip = stats['whip']
            if whip == '-.--': whip = 0
            else: whip = float(whip)

            extracted_entry = {
                'era': era,
                'wins': wins,
                'losses': losses,
                'win_percentage': win_percentage,
                'whip': whip,
            }
            return extracted_entry
        except:
            print("Error processing pitcher stats data")
            return None
    else:
        return None

# -------------- SCRIPT -------------

# First get all MLB teams
with open("data/cleaned_season_data.json", "r") as file:
    current_season_data = json.load(file)
teams = []
for game in current_season_data:
    teams.append(game['home_team'])
teams = list(set(teams))

# statsapi.get("people", {"personIds": 657006, "hydrate": "stats(group=[pitching],type=[byDateRange],startDate=01/01/2023,endDate=05/05/2023,season=2023)"})['people'][0]

X, y = [], []

# Set ELO of each team
elo_ratings = {}
initial_elo = 1500
warmup = 1000  # Need this since the ELO starts at 1500 for everyone

# Go through all games in past seasons
c = 0
for x in sorted(glob.glob("data/cleaned_past_season_data/*.json")):
    year = x.split('/')[-1].split('.')[0]
    print("Processing", year, "data")
    with open(x, "r") as file:
        past_season_data = json.load(file)

    for game in tqdm(past_season_data):
        c += 1

        winner = game['winning_team']
        loser = game['losing_team']

        # Initialize Elo ratings for each team if not already present
        if winner not in elo_ratings:
            elo_ratings[winner] = initial_elo
        if loser not in elo_ratings:
            elo_ratings[loser] = initial_elo

        update_elo(winner, loser, elo_ratings)
        if c < warmup:
            # Update Elo ratings based on the game result
            continue

        if game['home_pitcher_name'] == "TBD" or game['away_pitcher_name'] == "TBD": continue

        end_date = one_day_earlier(game['official_date'])
        home_pitcher_stats = get_pitcher_stats(game['home_pitcher_id'], end_date, year)
        if not home_pitcher_stats: continue
        away_pitcher_stats = get_pitcher_stats(game['away_pitcher_id'], end_date, year)
        if not away_pitcher_stats: continue

        # Add entry to the training data
        X.append([elo_ratings[game['home_team']], elo_ratings[game['away_team']]] + list(home_pitcher_stats.values()) + list(away_pitcher_stats.values()))
        y.append(game['home_team'] == winner)


    # Bring ELOs closer to mean after season ends
    for team in teams:
        elo_ratings[team] = (2 * elo_ratings[team] + initial_elo) / 3

print(X[:5])
print(y[:5])

with open("data/training_data/inputs.json", 'w') as file:
    json.dump(X, file)
with open("data/training_data/outputs.json", 'w') as file:
    json.dump(y, file)


