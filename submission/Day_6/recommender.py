import pandas as pd
from pathlib import Path

BASE      = Path(__file__).parent.parent
PROCESSED = BASE / "data/processed"
RAW       = BASE / "data/raw"

def recommend_funds(risk_appetite: str, top_n: int = 3):
    """
    Recommend top N funds based on investor risk appetite.
    Input : 'Low' | 'Moderate' | 'High'
    Output: Top 3 funds by Sharpe ratio
    """
    scorecard = pd.read_csv(PROCESSED / "fund_scorecard.csv")
    funds     = pd.read_csv(RAW / "01_fund_master.csv")

    risk_map = {
        'Low'      : ['Low', 'Moderately Low'],
        'Moderate' : ['Moderate', 'Moderately High'],
        'High'     : ['High', 'Very High'],
    }
    valid_risk = risk_map.get(risk_appetite.title(), ['Moderate'])

    filtered = scorecard[
        scorecard['amfi_code'].isin(
            funds[funds['risk_category'].isin(valid_risk)]['amfi_code']
        )
    ].sort_values('sharpe_ratio', ascending=False)

    if filtered.empty:
        print(f"No funds found for: {risk_appetite}")
        return pd.DataFrame()

    result = filtered.head(top_n)[
        ['scheme_name','fund_house',
         'sharpe_ratio','cagr_3yr_pct','score_0_100']
    ].reset_index(drop=True)
    result.index += 1
    return result

if __name__ == "__main__":
    for risk in ['Low', 'Moderate', 'High']:
        print(f"\n── {risk} Risk Top 3 ──")
        print(recommend_funds(risk).to_string())