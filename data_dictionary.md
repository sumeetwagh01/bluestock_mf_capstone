# Data Dictionary — Bluestock MF Capstone

## dim_fund
| Column | Type | Description |
|--------|------|-------------|
| amfi_code | TEXT (PK) | AMFI unique scheme identifier |
| fund_house | TEXT | AMC name |
| scheme_name | TEXT | Full scheme name |
| category | TEXT | Equity / Debt |
| sub_category | TEXT | Large Cap, Mid Cap, etc. |
| expense_ratio_pct | REAL | Annual expense ratio |
| risk_category | TEXT | Risk classification |

## fact_nav
| Column | Type | Description |
|--------|------|-------------|
| amfi_code | TEXT (FK) | Links to dim_fund |
| date | DATE | NAV date |
| nav | REAL | Net Asset Value |
| daily_return | REAL | Daily return percentage |

## fact_transactions
| Column | Type | Description |
|--------|------|-------------|
| tx_id | TEXT (PK) | Unique transaction ID |
| investor_id | TEXT | Investor identifier |
| transaction_type | TEXT | SIP / Lumpsum / Redemption |
| amount_inr | INTEGER | Transaction amount |
| city_tier | TEXT | T30 / B30 |
| kyc_status | TEXT | Verified / Pending |

## fact_performance
| Column | Type | Description |
|--------|------|-------------|
| amfi_code | TEXT (FK) | Fund identifier |
| return_1yr_pct | REAL | 1-year return |
| return_3yr_pct | REAL | 3-year return |
| return_5yr_pct | REAL | 5-year return |
| sharpe_ratio | REAL | Risk-adjusted return metric |
| alpha | REAL | Excess return over benchmark |
| beta | REAL | Volatility measure |

## fact_aum
| Column | Type | Description |
|--------|------|-------------|
| fund_house | TEXT | AMC name |
| date | DATE | Reporting date |
| aum_crore | REAL | Assets Under Management (₹ Cr) |
| num_schemes | INTEGER | Number of schemes |