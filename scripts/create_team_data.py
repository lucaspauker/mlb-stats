# -------------- IMPORTS -------------

import json
import glob
from datetime import datetime

# -------------- FUNCTIONS -------------

def calculate_expected(elo_a, elo_b):
    """Function to calculate the expected probability of winning"""
    return 1 / (1 + 10 ** ((elo_b - elo_a) / 400))


def update_elo(winner, loser, elo_ratings, margin_of_victory):
    K = 4  # Elo rating update constant
    K *= (margin_of_victory ** (1/3))
    # https://www.baseballprospectus.com/news/article/5247/lies-damned-lies-we-are-elo/

    # Calculate expected probabilities
    expected_winner = calculate_expected(elo_ratings[winner], elo_ratings[loser])
    expected_loser = calculate_expected(elo_ratings[loser], elo_ratings[winner])

    # Update Elo ratings
    elo_ratings[winner] += K * (1 - expected_winner)
    elo_ratings[loser] += K * (0 - expected_loser)

# -------------- SCRIPT -------------

# First get all MLB teams and records
with open("data/cleaned_season_data.json", "r") as file:
    current_season_data = json.load(file)

teams = []
for game in current_season_data:
    teams.append(game['home_team'])
teams = list(set(teams))


# Get number of wins and losses per team
wins_losses = {}
for game in current_season_data:
    winner = game['winning_team']
    loser = game['losing_team']
    if winner in wins_losses:
        wins_losses[winner]['wins'] += 1
    else:
        wins_losses[winner] = {'wins': 1, 'losses': 0}
    if loser in wins_losses:
        wins_losses[loser]['losses'] += 1
    else:
        wins_losses[loser] = {'wins': 0, 'losses': 1}


# Set ELO of each team
elo_ratings = {}
initial_elo = 1500

# Go through all games in past seasons
for x in sorted(glob.glob("data/cleaned_past_season_data/*.json")):
    with open(x, "r") as file:
        past_season_data = json.load(file)

    for game in past_season_data:
        winner = game['winning_team']
        loser = game['losing_team']
        margin_of_victory = abs(game['home_score'] - game['away_score'])

        # Initialize Elo ratings for each team if not already present
        if winner not in elo_ratings:
            elo_ratings[winner] = initial_elo
        if loser not in elo_ratings:
            elo_ratings[loser] = initial_elo

        # Update Elo ratings based on the game result
        update_elo(winner, loser, elo_ratings, margin_of_victory)

    # Bring ELOs closer to mean after season ends
    for team in teams:
        elo_ratings[team] = (2 * elo_ratings[team] + initial_elo) / 3

    print("Finished calculating ELOs for", x, "data")

# Keep track of ELO over time for each team
team_elos = {}
for team in teams: team_elos[team] = []
start_timestamp = datetime.strptime(current_season_data[0]["official_date"], "%Y-%m-%d").timestamp()

# Go through all games in current season
for game in current_season_data:
    winner = game['winning_team']
    loser = game['losing_team']
    margin_of_victory = abs(game['home_score'] - game['away_score'])

    # Initialize Elo ratings for each team if not already present
    if winner not in elo_ratings:
        elo_ratings[winner] = initial_elo
    if loser not in elo_ratings:
        elo_ratings[loser] = initial_elo

    # Update Elo ratings based on the game result
    update_elo(winner, loser, elo_ratings, margin_of_victory)

    date_object = datetime.strptime(game["official_date"], "%Y-%m-%d")
    timestamp = round((date_object.timestamp() - start_timestamp) / (24*60*60))

    if winner in teams:
        team_elos[winner].append({"date": game["official_date"], "timestamp": timestamp, "elo": round(elo_ratings[winner])})
    if loser in teams:
        team_elos[loser].append({"date": game["official_date"], "timestamp": timestamp, "elo": round(elo_ratings[loser])})

# Sort teams by ELO
sorted_ratings = sorted(elo_ratings.items(), key=lambda x: x[1], reverse=True)

team_data = {}
for elem in sorted_ratings:
    if elem[0] not in teams: continue
    games_left = 162 - (wins_losses[elem[0]]['wins'] + wins_losses[elem[0]]['losses'])
    projected_wins = int(games_left * calculate_expected(elem[1], 1500)) + wins_losses[elem[0]]['wins']
    projected_losses = 162 - projected_wins
    team_data[elem[0]] = {'name': elem[0],
         'wins': wins_losses[elem[0]]['wins'],
         'losses': wins_losses[elem[0]]['losses'],
         'elo': round(elem[1]),
         'projected_wins': projected_wins,
         'projected_losses': projected_losses,
        }

for team, elo in sorted_ratings:
    if team not in teams: continue
    print(f'{team}: {round(elo)}')

with open("data/team_data.json", "w") as file:
    json.dump(team_data, file)
with open("data/team_over_time.json", "w") as file:
    json.dump(team_elos, file)

