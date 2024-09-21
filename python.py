import requests
from bs4 import BeautifulSoup
import json

url = 'https://www.epsarg.gr/results/display_ranking.php?league_id=979' # Ενημερώστε με την πραγματική διεύθυνση
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

ranking_data = []
for row in soup.find_all('tr')[0:]:  # Αν η βαθμολογία είναι σε πίνακα
    cols = row.find_all('td')
    position = cols[0].text.strip()
    team_name = cols[1].text.strip()
    points = cols[2].text.strip()
    ranking_data.append({
        'position': position,
        'name': team_name,
        'points': points
    })

with open('ranking.json', 'w') as f:
    json.dump({'ranking': ranking_data}, f)
