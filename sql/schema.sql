-- sql/schema.sql

CREATE TABLE IF NOT EXISTS dim_fund (
    amfi_code         TEXT PRIMARY KEY,
    fund_house        TEXT NOT NULL,
    scheme_name       TEXT NOT NULL,
    category          TEXT,
    sub_category      TEXT,
    plan              TEXT,
    benchmark         TEXT,
    expense_ratio_pct REAL,
    exit_load_pct     REAL,
    fund_manager      TEXT,
    risk_category     TEXT,
    launch_date       DATE
);

CREATE TABLE IF NOT EXISTS dim_date (
    date_id   INTEGER PRIMARY KEY AUTOINCREMENT,
    date      DATE UNIQUE NOT NULL,
    year      INTEGER,
    month     INTEGER,
    quarter   INTEGER,
    is_weekday INTEGER  -- 1=weekday, 0=weekend
);

CREATE TABLE IF NOT EXISTS fact_nav (
    amfi_code       TEXT REFERENCES dim_fund(amfi_code),
    date            DATE REFERENCES dim_date(date),
    nav             REAL NOT NULL,
    daily_return    REAL,
    PRIMARY KEY (amfi_code, date)
);

CREATE TABLE IF NOT EXISTS fact_transactions (
    tx_id            TEXT PRIMARY KEY,
    investor_id      TEXT,
    amfi_code        TEXT REFERENCES dim_fund(amfi_code),
    transaction_date DATE,
    transaction_type TEXT,
    amount_inr       INTEGER,
    state            TEXT,
    city             TEXT,
    city_tier        TEXT,
    age_group        TEXT,
    gender           TEXT,
    kyc_status       TEXT
);

CREATE TABLE IF NOT EXISTS fact_performance (
    amfi_code        TEXT REFERENCES dim_fund(amfi_code),
    return_1yr_pct   REAL,
    return_3yr_pct   REAL,
    return_5yr_pct   REAL,
    sharpe_ratio     REAL,
    sortino_ratio    REAL,
    alpha            REAL,
    beta             REAL,
    max_drawdown_pct REAL,
    std_dev_ann_pct  REAL,
    PRIMARY KEY (amfi_code)
);

CREATE TABLE IF NOT EXISTS fact_aum (
    fund_house    TEXT,
    date          DATE,
    aum_crore     REAL,
    num_schemes   INTEGER,
    PRIMARY KEY (fund_house, date)
);