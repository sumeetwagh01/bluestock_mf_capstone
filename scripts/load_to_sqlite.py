from sqlalchemy import create_engine
import sqlite3
import pandas as pd
from pathlib import Path
from sqlalchemy import create_engine
import sqlite3

RAW = Path("data/raw")

DB_PATH = "data/db/bluestock_mf.db"
Path("data/db").mkdir(parents=True, exist_ok=True)

engine = create_engine(f"sqlite:///{DB_PATH}")
DB_PATH = "data/db/bluestock_mf.db"
engine = create_engine(f"sqlite:///{DB_PATH}")

# Load dim_fund
fund_master = pd.read_csv(RAW / "01_fund_master.csv")
fund_master.to_sql("dim_fund", engine, if_exists="replace", index=False)
nav = pd.read_csv("data/processed/clean_nav.csv")
tx = pd.read_csv("data/processed/clean_transactions.csv")
perf = pd.read_csv("data/processed/clean_performance.csv")
print(f"✅ dim_fund: {len(fund_master)} rows")

# Load fact_nav
nav.to_sql("fact_nav", engine, if_exists="replace", index=False)
print(f"✅ fact_nav: {len(nav)} rows")

# Load fact_transactions
tx.to_sql("fact_transactions", engine, if_exists="replace", index=False)
print(f"✅ fact_transactions: {len(tx)} rows")

# Load fact_performance
perf.to_sql("fact_performance", engine, if_exists="replace", index=False)
print(f"✅ fact_performance: {len(perf)} rows")

# Load fact_aum
aum = pd.read_csv(RAW / "03_aum_by_fund_house.csv")
aum.to_sql("fact_aum", engine, if_exists="replace", index=False)
print(f"✅ fact_aum: {len(aum)} rows")

# Load remaining tables
sip = pd.read_csv(RAW / "04_monthly_sip_inflows.csv")
sip.to_sql("fact_sip_industry", engine, if_exists="replace", index=False)

benchmark = pd.read_csv(RAW / "10_benchmark_indices.csv")
benchmark.to_sql("fact_benchmark", engine, if_exists="replace", index=False)

print("\n✅ All tables loaded into bluestock_mf.db")

# Verify row counts
with sqlite3.connect(DB_PATH) as conn:
    for table in ["dim_fund","fact_nav","fact_transactions","fact_performance","fact_aum"]:
        count = pd.read_sql(f"SELECT COUNT(*) as n FROM {table}", conn).iloc[0,0]
        print(f"  {table}: {count} rows")