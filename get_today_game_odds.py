import requests
import json
import math

url = "http://statsapi.mlb.com/api/v1/schedule/games/?sportId=1"
r = requests.get(url)

if r.status_code == 200:
    data = r.json()  # Convert the response text to JSON
    games = data['dates'][0]['games']
else:
    print("Request failed with status code:", r.status_code)

with open("data/team_data.json", "r") as file:
    team_data= json.load(file)

def elo_probability(rating_a, rating_b):
    probability_a = 1 / (1 + math.pow(10, (rating_b - rating_a) / 400))
    return round(probability_a * 100, 2)

today_data = []
for game in games:
    home_team = game['teams']['home']['team']['name']
    away_team = game['teams']['away']['team']['name']
    print(home_team)
    print('vs.')
    print(away_team)
    prob = elo_probability(team_data[home_team]['elo'], team_data[away_team]['elo'])
    print("Probability " + home_team + " wins: " + str(prob))
    print()

    today_data.append(
        {
            'home_team': home_team,
            'away_team': away_team,
            'prob_home': prob,
        }
    )
