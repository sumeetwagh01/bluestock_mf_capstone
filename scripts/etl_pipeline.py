"""
etl_pipeline.py
---------------
Master ETL pipeline for Bluestock MF Capstone.
Loads all 10 CSV datasets, prints shape/dtypes/head,
validates data quality and saves summary report.

Usage : python scripts/etl_pipeline.py
Author: Sumeet Wagh | Bluestock Fintech | June 2026
"""

import pandas as pd
import numpy as np
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

# ── Paths ──────────────────────────────────────────
BASE      = Path(__file__).parent.parent
RAW       = BASE / "data" / "raw"
PROCESSED = BASE / "data" / "processed"
PROCESSED.mkdir(parents=True, exist_ok=True)

# ── Dataset registry ───────────────────────────────
DATASETS = {
    "fund_master"          : "01_fund_master.csv",
    "nav_history"          : "02_nav_history.csv",
    "aum_by_fund_house"    : "03_aum_by_fund_house.csv",
    "monthly_sip_inflows"  : "04_monthly_sip_inflows.csv",
    "category_inflows"     : "05_category_inflows.csv",
    "industry_folio_count" : "06_industry_folio_count.csv",
    "scheme_performance"   : "07_scheme_performance.csv",
    "investor_transactions": "08_investor_transactions.csv",
    "portfolio_holdings"   : "09_portfolio_holdings.csv",
    "benchmark_indices"    : "10_benchmark_indices.csv",
}

def load_all_datasets():
    """Load all 10 CSV datasets and print diagnostics."""
    dataframes = {}
    summary    = []

    print("\n" + "="*65)
    print("  BLUESTOCK MF — ETL PIPELINE")
    print("  Data Ingestion & Quality Check")
    print("="*65)

    for name, filename in DATASETS.items():
        filepath = RAW / filename

        if not filepath.exists():
            print(f"\n  MISSING: {filename}")
            continue

        df = pd.read_csv(filepath)
        dataframes[name] = df

        nulls  = df.isnull().sum().sum()
        dupes  = df.duplicated().sum()
        status = "✅" if nulls == 0 and dupes == 0 else "⚠️"

        print(f"\n{status} [{name}]")
        print(f"   File    : {filename}")
        print(f"   Shape   : {df.shape[0]:,} rows x {df.shape[1]} cols")
        print(f"   Columns : {list(df.columns)}")
        print(f"   Nulls   : {nulls} | Duplicates: {dupes}")
        print(f"   Dtypes  :\n{df.dtypes.to_string()}")
        print(f"   Head    :\n{df.head(3).to_string()}")

        summary.append({
            "dataset"   : name,
            "file"      : filename,
            "rows"      : df.shape[0],
            "cols"      : df.shape[1],
            "nulls"     : nulls,
            "duplicates": dupes,
            "status"    : "OK" if nulls == 0 and dupes == 0 else "CHECK",
        })

    return dataframes, summary


def validate_amfi_codes(dataframes):
    """Validate all AMFI codes in fund_master exist in nav_history."""
    print("\n" + "="*65)
    print("  AMFI CODE VALIDATION")
    print("="*65)

    if "fund_master" not in dataframes or "nav_history" not in dataframes:
        print(" fund_master or nav_history not loaded — skipping")
        return

    master_codes = set(dataframes["fund_master"]["amfi_code"].astype(str))
    nav_codes    = set(dataframes["nav_history"]["amfi_code"].astype(str))

    missing = master_codes - nav_codes
    extra   = nav_codes - master_codes

    print(f"  Codes in fund_master : {len(master_codes)}")
    print(f"  Codes in nav_history : {len(nav_codes)}")
    print(f"  Missing in nav       : {len(missing)}")
    print(f"  Extra in nav         : {len(extra)}")

    if not missing:
        print("   All AMFI codes validated successfully!")
    else:
        print(f"    Missing codes: {missing}")


def save_quality_report(summary):
    """Save data quality summary to processed folder."""
    df = pd.DataFrame(summary)
    out = PROCESSED / "data_quality_report.csv"
    df.to_csv(out, index=False)
    print(f"\n Quality report saved → {out}")

    print("\n" + "="*65)
    print("  DATA QUALITY SUMMARY")
    print("="*65)
    print(df.to_string(index=False))


def main():
    # Step 1: Load all datasets
    dataframes, summary = load_all_datasets()

    # Step 2: Validate AMFI codes
    validate_amfi_codes(dataframes)

    # Step 3: Save quality report
    save_quality_report(summary)

    print("\n" + "="*65)
    print(f"  ETL COMPLETE — {len(dataframes)}/10 datasets loaded")
    print("="*65 + "\n")

    return dataframes


if __name__ == "__main__":
    main()