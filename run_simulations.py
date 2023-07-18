import json

# First get all MLB teams
with open("data/cleaned_season_data.json", "r") as file:
    data = json.load(file)

teams = []
for game in data:
    teams.append(game['home_team'])
teams = list(set(teams))


# Set ELO of each team
elo_ratings = {}
initial_elo = 1500


# Function to calculate the expected probability of winning
def calculate_expected(elo_a, elo_b):
    return 1 / (1 + 10 ** ((elo_b - elo_a) / 400))


# Function to update the Elo ratings
def update_elo(winner, loser):
    K = 32  # Elo rating update constant

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


# Print the ELO ratings of each team
sorted_ratings = sorted(elo_ratings.items(), key=lambda x: x[1], reverse=True)
for team, elo in sorted_ratings:
    print(f'{team}: {round(elo, 2)}')


