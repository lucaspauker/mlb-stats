import requests
import json
import statsapi

from datetime import date, timedelta

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

# Get current season data
today_date = date.today()
last_month_end = today_date - timedelta(days=today_date.day)
end_date = str(last_month_end.year) + '-' + str(last_month_end.month) + '-' + str(last_month_end.day)
print("Data until", end_date)
data = statsapi.get("schedule", {"sportId": 1, "startDate": str(today_date.year)+"-03-30", "endDate": end_date, "hydrate": "probablePitcher"})

with open("data/season_data.json", "w") as file:
    json.dump(data, file)  # Save the JSON data to a file
    print("Response saved to season_data.json")


# Get past seasons data
N = 10  # Number of past seasons

for i in range(1, 1+N):
    current_year = str(date.today().year - i)
    start_date = get_start_date(current_year)
    end_date = current_year + '-12-30'
    data = statsapi.get("schedule", {"sportId": 1, "startDate": start_date, "endDate": end_date, "hydrate": "probablePitcher"})
    with open("data/past_season_data/" + current_year + ".json", "w") as file:
        json.dump(data, file)  # Save the JSON data to a file
        print("Processed past_season_data/" + current_year + ".json")

