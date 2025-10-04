import requests
from bs4 import BeautifulSoup
import argparse
import json
import re
from pathlib import Path
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

TEAM = "ΠΟΣΕΙΔΩΝ ΔΙΔΥΜΩΝ"
ATHENS = ZoneInfo("Europe/Athens")

BASE_URL = 'https://www.epsarg.gr/results/display_schedule.php?league_id={league_id}'
HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; FixturesScraper/1.0; +https://example.com)"
}
SEASONS = {
    "25-26": 1020
}

def fetch_html(league_id: int) -> str:
    url = BASE_URL.format(league_id=league_id)
    resp = requests.get(url, headers=HEADERS, timeout=20)
    resp.raise_for_status()
    return resp.text
def parse_ddmmyy(date_str: str, time_str: str | None):
    m = re.match(r"^(\d{2})/(\d{2})/(\d{2})$", date_str.strip())
    if not m:
        return None
    d, mo, yy = map(int, m.groups())
    yy += 2000  
    hh, mm = 0, 0
    if time_str and re.match(r"^\d{1,2}:\d{2}$", time_str.strip()):
        hh, mm = map(int, time_str.split(":"))
    return datetime(yy, mo, d, hh, mm, tzinfo=ATHENS)
def parse_fixtures(html: str, team: str):
    soup = BeautifulSoup(html, "html.parser")
    fixtures = []
    current_round = None

    for el in soup.find_all(["h2", "h3", "div", "tr"]):
        txt = el.get_text(" ", strip=True)
        if re.search(r"\bΑγωνιστικ", txt, re.IGNORECASE):
            current_round = txt

        if el.name == "tr":
            tds = el.find_all("td")
            if len(tds) < 5:
                continue

            teams_text = tds[0].get_text(" ", strip=True)
            if team not in teams_text:
                continue

            venue = tds[1].get_text(" ", strip=True)
            day_name = tds[2].get_text(" ", strip=True)            # Ημέρα (π.χ. Σάββατο)
            date_str = tds[3].get_text(" ", strip=True)            # Ημ/νία (dd/mm/yy)
            time_str = tds[4].get_text(" ", strip=True)            # Ώρα (HH:MM)
            result = (tds[-1].get_text(" ", strip=True) or "").strip()

            # Διάσπαση ομάδων σε έδρα/φιλοξενούμενο
            parts = re.split(r"\s*[-–]\s*", teams_text)
            home_team = parts[0] if parts else teams_text
            away_team = parts[1] if len(parts) > 1 else ""

            dt = parse_ddmmyy(date_str, time_str)
            start_iso = dt.isoformat() if dt else None
            start_ts = int(dt.timestamp()) if dt else None
            end_ts = int((dt + timedelta(hours=2)).timestamp()) if dt else None

            home_away = "home" if team == home_team else ("away" if team == away_team else "")

            fixtures.append({
                "round": current_round,
                "teams": teams_text,
                "home_team": home_team,
                "away_team": away_team,
                "home_away": home_away,
                "venue": venue,
                "day_name": day_name,
                "date": date_str,
                "time": time_str,
                "start_iso": start_iso,
                "start_ts": start_ts,
                "end_ts": end_ts,
                "result": result,
            })
    return fixtures
def main():
    ap = argparse.ArgumentParser(description="Scrape fixtures for a season/league and export JSON.")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--season", help="π.χ. 24-25 (θα χαρτογραφηθεί σε league_id από το SEASONS)")
    g.add_argument("--league-id", type=int, help="π.χ. 979")
    ap.add_argument("--team", default=TEAM, help="Όνομα ομάδας όπως εμφανίζεται στο site")
    ap.add_argument("--out", help="Αρχείο εξόδου JSON (προεπιλογή fixtures_<season or id>.json)")
    args = ap.parse_args()

    if args.league_id:
        league_id = args.league_id
        label = f"lid-{league_id}"
    else:
        if args.season not in SEASONS:
            raise SystemExit(f"Άγνωστη season '{args.season}'. Συμπλήρωσέ την στο SEASONS ή δώσε --league-id.")
        league_id = SEASONS[args.season]
        label = args.season

    html = fetch_html(league_id)
    fixtures = parse_fixtures(html, args.team)

    out = args.out or f"fixtures_{label}.json"
    with open(out, "w", encoding="utf-8") as f:
        json.dump({"team": args.team, "league_id": league_id, "fixtures": fixtures}, f, ensure_ascii=False, indent=2)

    print(f"OK: {out} (matches: {len(fixtures)})")

if __name__ == "__main__":
    main()