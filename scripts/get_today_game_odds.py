import requests
import json
import math
import pickle
import datetime
import statsapi
import numpy as np

with open("data/model_data/scaler_model.p", 'rb') as file:
    scaler = pickle.load(file)
with open("data/model_data/main_model.p", 'rb') as file:
    clf = pickle.load(file)
with open("data/team_data.json", "r") as file:
    team_data= json.load(file)

current_date = datetime.datetime.now()
formatted_date = current_date.strftime("%Y-%m-%d")
games = statsapi.get("schedule", {"date": formatted_date, "sportId": 1, "hydrate": "probablePitcher(note)"})['dates'][0]['games']

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

def get_probability(rating_home, rating_away, home_pitcher_stats, away_pitcher_stats):
    home_win, away_win, home_whip, away_whip, home_era, away_era = 0, 0, 0, 0, 0, 0

    if 'win_percentage' in home_pitcher_stats and home_pitcher_stats['win_percentage'] != ".---": home_win = float(home_pitcher_stats['win_percentage'])
    if 'whip' in home_pitcher_stats and home_pitcher_stats['whip'] != "-.--": home_whip = float(home_pitcher_stats['whip'])
    if 'era' in home_pitcher_stats and home_pitcher_stats['era'] != "-.--": home_era = float(home_pitcher_stats['era'])

    if 'win_percentage' in away_pitcher_stats and away_pitcher_stats['win_percentage'] != ".---": away_win = float(away_pitcher_stats['win_percentage'])
    if 'whip' in away_pitcher_stats and away_pitcher_stats['whip'] != "-.--": away_whip = float(away_pitcher_stats['whip'])
    if 'era' in away_pitcher_stats and away_pitcher_stats['era'] != "-.--": away_era = float(away_pitcher_stats['era'])

    pt = np.array([rating_home, rating_away,
                   home_era, home_pitcher_stats['wins'], home_pitcher_stats['losses'], home_win, home_whip,
                   away_era, away_pitcher_stats['wins'], away_pitcher_stats['losses'], away_win, away_whip,
                   ]).reshape(1,-1)
    return clf.predict_proba(scaler.transform(pt))[0][1] * 100;

today_data = []
for game in games:
    home_team = game['teams']['home']['team']['name']
    away_team = game['teams']['away']['team']['name']
    print(home_team)
    print('vs.')
    print(away_team)


    home_pitcher, away_pitcher = "TBD", "TBD"
    home_pitcher_stats, away_pitcher_stats = {}, {}
    if 'probablePitcher' in game['teams']['home']:
        home_pitcher = game['teams']['home']['probablePitcher']['fullName']
        tmp = statsapi.player_stat_data(game['teams']['home']['probablePitcher']['id'], 'pitching', 'season')['stats'][0]['stats']
        home_pitcher_stats = {'record': str(tmp['wins'])+'-'+str(tmp['losses']), 'era': tmp['era'], 'win_percentage': tmp['winPercentage'], 'wins': tmp['wins'], 'losses': tmp['losses'], 'whip': tmp['whip']}
    if 'probablePitcher' in game['teams']['away']:
        away_pitcher = game['teams']['away']['probablePitcher']['fullName']
        tmp = statsapi.player_stat_data(game['teams']['away']['probablePitcher']['id'], 'pitching', 'season')['stats'][0]['stats']
        away_pitcher_stats = {'record': str(tmp['wins'])+'-'+str(tmp['losses']), 'era': tmp['era'], 'win_percentage': tmp['winPercentage'], 'wins': tmp['wins'], 'losses': tmp['losses'], 'whip': tmp['whip']}

    if home_pitcher == "TBD" or away_pitcher == "TBD":
        # https://fivethirtyeight.com/methodology/how-our-mlb-predictions-work/
        prob = elo_probability(team_data[home_team]['elo'] + 24, team_data[away_team]['elo'])
    else:
        prob = get_probability(team_data[home_team]['elo'], team_data[away_team]['elo'], home_pitcher_stats, away_pitcher_stats)

    print("Probability " + home_team + " wins: " + str(round(prob, 1)))
    print("American odds:", get_am_odds(prob / 100))
    print()

    today_data.append(
        {
            'home_team': home_team,
            'away_team': away_team,
            'prob_home': round(prob, 1),
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

