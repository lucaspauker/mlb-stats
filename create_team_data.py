import json

# First get all MLB teams and records
with open("data/cleaned_season_data.json", "r") as file:
    data = json.load(file)

teams = []
for game in data:
    teams.append(game['home_team'])
teams = list(set(teams))


# Get number of wins and losses per team
wins_losses = {}
for game in data:
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


# Function to calculate the expected probability of winning
def calculate_expected(elo_a, elo_b):
    return 1 / (1 + 10 ** ((elo_b - elo_a) / 400))


# Function to update the Elo ratings
def update_elo(winner, loser):
    K = 4  # Elo rating update constant
    # https://www.baseballprospectus.com/news/article/5247/lies-damned-lies-we-are-elo/

    # Calculate expected probabilities
    expected_winner = calculate_expected(elo_ratings[winner], elo_ratings[loser])
    expected_loser = calculate_expected(elo_ratings[loser], elo_ratings[winner])

    # Update Elo ratings
    elo_ratings[winner] += K * (1 - expected_winner)
    elo_ratings[loser] += K * (0 - expected_loser)


# Go through all games
for game in data:
    winner = game['winning_team']
    loser = game['losing_team']

    # Initialize Elo ratings for each team if not already present
    if winner not in elo_ratings:
        elo_ratings[winner] = initial_elo
    if loser not in elo_ratings:
        elo_ratings[loser] = initial_elo

    # Update Elo ratings based on the game result
    update_elo(winner, loser)


# Sort teams by ELO
sorted_ratings = sorted(elo_ratings.items(), key=lambda x: x[1], reverse=True)


team_data = {}
for elem in sorted_ratings:
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
    print(f'{team}: {round(elo)}')

with open("data/team_data.json", "w") as file:
    json.dump(team_data, file)

