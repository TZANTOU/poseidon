import requests
from bs4 import BeautifulSoup
import argparse
import json
import re
from pathlib import Path

SEASONS = {
    "25-26": 1020,     
    "24-25": 979,    
    "23-24": 929,
    "22-23": 858,
    "21-22": 793,
    "20-21": 780,
    "19-20": 751, 
    "18-19": 693, 
    "17-18": 629, 
    "16-17": 557, 
    "15-16": 507, 
    "14-15": 449, 
    "13-14": 363, 
    "12-13": 307
}

BASE_URL = 'https://www.epsarg.gr/results/display_ranking.php?league_id={league_id}'
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; RankingScraper/1.0; +https://example.com)"
}


def fetch_html(league_id: int) -> str:
    url = BASE_URL.format(league_id=league_id)
    resp = requests.get(url, headers=HEADERS, timeout=20)
    resp.raise_for_status()
    return resp.text

def parse_ranking(html: str):
    soup = BeautifulSoup(html, "html.parser")

    table = soup.select_one("table")
    candidate_tables =[]
    if table:
        candidate_tables.append(table)
    if not table:
        for t in soup.find_all("table"):
            rows = t.find_all("tr")
            if any(len(r.find_all("td")) >= 3 for r in rows):
                candidate_tables.append(t)

    ranking_data = []
    def extract_from_table(t):
        rows = t.find_all("tr")
        for row in rows:
            if row.find("th"):
                continue
            cols = row.find_all("td")
            if len(cols) < 3:
                continue
            position = cols[0].get_text(strip=True)
            team_name = cols[1].get_text(strip=True)
            points = cols[2].get_text(strip=True)
            if not position or not team_name or not points:
                continue
            ranking_data.append({
                "position": position,
                "name": team_name,
                "points": points
            })
    for t in candidate_tables:
        extract_from_table(t)
        if ranking_data:
            break

    if not ranking_data:
        for row in soup.find_all("tr"):
            cols = row.find_all("td")
            if len(cols) >= 3:
                position = cols[0].get_text(strip=True)
                team_name = cols[1].get_text(strip=True)
                points = cols[2].get_text(strip=True)
                if position and team_name and points:
                    ranking_data.append({
                        "position": position,
                        "name": team_name,
                        "points": points
                    })

    return ranking_data

def save_json(data, out_path: Path):
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump({"ranking": data}, f, ensure_ascii=False, indent=2)

def main():
    parser = argparse.ArgumentParser(description="Λήψη βαθμολογίας EPS Arg για διαφορετικές χρονιές.")
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--season", help="Χρονιά όπως '23-24' (θα μετατραπεί σε league_id από το mapping).")
    group.add_argument("--league-id", type=int, help="Άμεση χρήση συγκεκριμένου league_id (π.χ. 929).")
    parser.add_argument("--out", help="Όνομα αρχείου εξόδου (προαιρετικό). Αν δεν δοθεί, δημιουργείται αυτόματα.")
    args = parser.parse_args()

    if args.league_id is not None:
        league_id = args.league_id
        season_label = next((s for s, lid in SEASONS.items() if lid == league_id), f"lid-{league_id}")
    else:
        season = args.season.strip()
        if season not in SEASONS:
            raise SystemExit(
                f"Η χρονιά '{season}' δεν υπάρχει στο mapping. "
                f"Πρόσθεσέ την στο SEASONS ή χρησιμοποίησε --league-id."
            )
        league_id = SEASONS[season]
        season_label = season

    html = fetch_html(league_id)
    ranking = parse_ranking(html)

    # Όνομα αρχείου
    out_name = args.out or f"ranking_{season_label}.json"
    out_path = Path(out_name)

    save_json(ranking, out_path)
    print(f"Αποθηκεύτηκε: {out_path.resolve()}  (εγγραφές: {len(ranking)})")

if __name__ == "__main__":
    main()