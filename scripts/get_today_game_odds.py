import requests
import json
import math
import statsapi

games = statsapi.get("schedule", {"sportId": 1, "hydrate": "probablePitcher(note)"})['dates'][0]['games']

with open("data/team_data.json", "r") as file:
    team_data= json.load(file)

def get_am_odds(p):
    if p > 0.5:  # Negative odds
        am_odds = -100 / (1 / p - 1)
    else:
        am_odds = (100 / p) - 100
    if am_odds > 0: return "+" + str(round(am_odds))
    return str(round(am_odds))

def elo_probability(rating_a, rating_b):
    probability_a = 1 / (1 + math.pow(10, (rating_b - rating_a) / 400))
    return round(probability_a * 100, 1)

today_data = []
for game in games:
    home_team = game['teams']['home']['team']['name']
    away_team = game['teams']['away']['team']['name']
    print(home_team)
    print('vs.')
    print(away_team)

    # https://fivethirtyeight.com/methodology/how-our-mlb-predictions-work/
    prob = elo_probability(team_data[home_team]['elo'] + 24, team_data[away_team]['elo'])
    print("Probability " + home_team + " wins: " + str(prob))
    print("American odds:", get_am_odds(prob / 100))
    print()

    home_pitcher, away_pitcher = "TBD", "TBD"
    home_pitcher_stats, away_pitcher_stats = {}, {}
    if 'probablePitcher' in game['teams']['home']:
        home_pitcher = game['teams']['home']['probablePitcher']['fullName']
        tmp = statsapi.player_stat_data(game['teams']['home']['probablePitcher']['id'], 'pitching', 'season')['stats'][0]['stats']
        home_pitcher_stats = {'record': str(tmp['wins'])+'-'+str(tmp['losses']), 'era': tmp['era']}
    if 'probablePitcher' in game['teams']['away']:
        away_pitcher = game['teams']['away']['probablePitcher']['fullName']
        tmp = statsapi.player_stat_data(game['teams']['away']['probablePitcher']['id'], 'pitching', 'season')['stats'][0]['stats']
        away_pitcher_stats = {'record': str(tmp['wins'])+'-'+str(tmp['losses']), 'era': tmp['era']}

    today_data.append(
        {
            'home_team': home_team,
            'away_team': away_team,
            'prob_home': prob,
            'prob_away': round(100 - prob, 1),
            'game_time': game['gameDate'],
            'home_pitcher': home_pitcher,
            'away_pitcher': away_pitcher,
            'home_pitcher_stats': home_pitcher_stats,
            'away_pitcher_stats': away_pitcher_stats,
            'odds_home': get_am_odds(prob / 100),
            'odds_away': get_am_odds((100 - prob) / 100),
        }
    )

with open("data/today_data.json", "w") as file:
    json.dump(today_data, file)

