-- Q1: Top 5 funds by AUM
SELECT fund_house, SUM(aum_crore) as total_aum
FROM fact_aum
GROUP BY fund_house
ORDER BY total_aum DESC
LIMIT 5;

-- Q2: Average NAV per month for each fund
SELECT amfi_code,
       strftime('%Y-%m', date) as month,
       ROUND(AVG(nav), 2) as avg_nav
FROM fact_nav
GROUP BY amfi_code, month
ORDER BY amfi_code, month;

-- Q3: SIP inflow YoY growth
SELECT strftime('%Y', month) as year,
       SUM(sip_inflow_crore) as total_sip
FROM fact_sip_industry
GROUP BY year
ORDER BY year;

-- Q4: Transactions count by state
SELECT state, COUNT(*) as tx_count,
       ROUND(SUM(amount_inr)/1e7, 2) as total_crore
FROM fact_transactions
GROUP BY state
ORDER BY tx_count DESC;

-- Q5: Funds with expense_ratio < 1%
SELECT amfi_code, scheme_name, fund_house, expense_ratio_pct
FROM dim_fund
WHERE expense_ratio_pct < 1.0
ORDER BY expense_ratio_pct;

-- Q6: Top 5 funds by Sharpe ratio
SELECT f.scheme_name, p.sharpe_ratio, p.return_3yr_pct
FROM fact_performance p
JOIN dim_fund f ON p.amfi_code = f.amfi_code
ORDER BY p.sharpe_ratio DESC
LIMIT 5;

-- Q7: SIP vs Lumpsum vs Redemption split
SELECT transaction_type,
       COUNT(*) as count,
       ROUND(SUM(amount_inr)/1e7, 2) as total_crore
FROM fact_transactions
GROUP BY transaction_type;

-- Q8: Funds with highest max drawdown (worst risk)
SELECT f.scheme_name, p.max_drawdown_pct
FROM fact_performance p
JOIN dim_fund f ON p.amfi_code = f.amfi_code
ORDER BY p.max_drawdown_pct ASC
LIMIT 5;

-- Q9: Monthly average NAV trend for SBI Bluechip (119551)
SELECT strftime('%Y-%m', date) as month,
       ROUND(AVG(nav), 2) as avg_nav
FROM fact_nav
WHERE amfi_code = '119551'
GROUP BY month
ORDER BY month;

-- Q10: Investor count by age group and gender
SELECT age_group, gender, COUNT(DISTINCT investor_id) as investors
FROM fact_transactions
GROUP BY age_group, gender
ORDER BY age_group;