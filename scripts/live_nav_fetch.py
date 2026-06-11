"""
live_nav_fetch.py
-----------------
Fetches live NAV data from mfapi.in REST API
for 6 key mutual fund schemes.
Saves raw CSVs to data/raw/

Usage: python scripts/live_nav_fetch.py
Author: Sumeet Wagh | Bluestock Fintech | June 2026
"""



import requests
import pandas as pd
from pathlib import Path
from datetime import datetime

BASE_URL = "https://api.mfapi.in/mf/"

# The 5 key schemes to fetch
schemes = {
    "HDFC_Top100_Direct":   125497,
    "SBI_Bluechip":         119551,
    "ICICI_Bluechip":       120503,
    "Nippon_LargeCap":      118632,
    "Axis_Bluechip":        119092,
    "Kotak_Bluechip":       120841,
}

output_dir = Path("data/raw")
output_dir.mkdir(parents=True, exist_ok=True)

for name, code in schemes.items():
    try:
        response = requests.get(f"{BASE_URL}{code}", timeout=30)
        response.raise_for_status()
        data = response.json()

        # Parse the NAV history
        df = pd.DataFrame(data['data'])
        df['scheme_code'] = code
        df['scheme_name'] = data['meta']['scheme_name']
        df['date'] = pd.to_datetime(df['date'], format='%d-%m-%Y')
        df['nav'] = pd.to_numeric(df['nav'], errors='coerce')
        df = df.sort_values('date')

        # Save to raw CSV
        file_path = output_dir / f"nav_{name}.csv"
        df.to_csv(file_path, index=False)
        print(f"✅ Saved {name}: {len(df)} rows → {file_path}")

    except Exception as e:
        print(f"❌ Failed {name} ({code}): {e}")