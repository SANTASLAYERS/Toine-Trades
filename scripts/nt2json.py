#!/usr/bin/env python3
"""
Convert NinjaTrader CSV to perf.json

Usage: python nt2json.py nt_export.csv data/perf.json

CSV Schema:
| Column name        | Example value                | Notes                         |
|--------------------|------------------------------|-------------------------------|
| Entry time         | 2025‑04‑29 09:35:17          | local timestamp, mm‑dd hh:mm |
| Exit time          | 2025‑04‑29 10:02:43          |                                |
| Instrument         | MNQ 06‑25                    | string                        |
| Market pos.        | Long / Short                 | string                        |
| Qty                | 2                            | integer                       |
| Entry price        | 17823.50                     | float                         |
| Exit price         | 17831.75                     | float                         |
| Profit             | $162.50                      | may include "(…)" for losses  |
| Cum. net profit    | $6 972.50                    | running equity                |
| Commission         | $4.50                        | optional—ignore if absent     |
"""
import sys
import json
import pandas as pd
from typing import Dict, List, Any, Optional, Union, Tuple

def clean_money_value(value: str) -> float:
    """
    Clean money values by removing $, commas, and handling parentheses for negative values.
    
    Args:
        value: String representation of a money value (e.g. "$162.50" or "($42.75)")
        
    Returns:
        Cleaned float value
    """
    if not value or pd.isna(value):
        return 0.0
    
    # Remove $, commas and spaces
    clean_value = value.replace('$', '').replace(',', '').replace(' ', '')
    
    # Handle parentheses for negative values
    if '(' in clean_value and ')' in clean_value:
        clean_value = clean_value.replace('(', '').replace(')', '')
        return -float(clean_value)
    
    return float(clean_value)

def process_csv(csv_path: str) -> Dict[str, Any]:
    """
    Process NinjaTrader CSV and convert to structured data format.
    
    Args:
        csv_path: Path to CSV file exported from NinjaTrader
        
    Returns:
        Dictionary containing equity curve, metrics, and trade data
    """
    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        print(f"Error reading CSV file: {e}")
        sys.exit(1)
    
    # Clean numeric columns
    money_cols = ['Profit', 'Cum. net profit']
    for col in money_cols:
        if col in df.columns:
            df[col] = df[col].apply(clean_money_value)
    
    # Convert timestamps to datetime
    try:
        dates = pd.to_datetime(df['Exit time'])
    except KeyError:
        print("Error: 'Exit time' column not found in CSV")
        sys.exit(1)
    
    # Calculate daily returns (assume 100k notional for Sharpe)
    daily = df.groupby(dates.dt.date)['Profit'].sum()
    returns = daily / 100_000
    
    # Calculate metrics
    try:
        # For Sharpe ratio, we would normally use a library like quantstats
        # Since it might not be installed, implementing a simple version
        sharpe = returns.mean() / returns.std() * (252 ** 0.5) if returns.std() > 0 else 0
        
        # For max drawdown
        equity = df['Cum. net profit'].values
        max_dd = calculate_max_drawdown(equity)
        
        # Win rate
        win_rate = (df['Profit'] > 0).mean() * 100
        
        final_equity = equity[-1] if len(equity) > 0 else 0
    except Exception as e:
        print(f"Error calculating metrics: {e}")
        sharpe = 0
        max_dd = 0
        win_rate = 0
        final_equity = 0
    
    # Prepare output
    output = {
        "equity_curve": {
            "dates": dates.dt.strftime('%Y-%m-%d %H:%M').tolist(),
            "values": df['Cum. net profit'].tolist()
        },
        "metrics": {
            "pnl": float(final_equity),
            "sharpe": float(sharpe),
            "max_dd": float(max_dd),
            "win_rate": float(win_rate)
        },
        "trades": df[['Entry time', 'Exit time', 'Instrument', 'Market pos.', 'Qty',
                      'Entry price', 'Exit price', 'Profit']].to_dict('records')
    }
    
    return output

def calculate_max_drawdown(equity_curve: List[float]) -> float:
    """
    Calculate maximum drawdown from an equity curve.
    
    Args:
        equity_curve: List of equity values
        
    Returns:
        Maximum drawdown as a percentage
    """
    if not equity_curve or len(equity_curve) < 2:
        return 0.0
    
    max_dd = 0.0
    peak = equity_curve[0]
    
    for value in equity_curve:
        if value > peak:
            peak = value
        dd = (peak - value) / peak * 100 if peak > 0 else 0
        max_dd = max(max_dd, dd)
    
    return max_dd

def main():
    """Main function to run the converter"""
    if len(sys.argv) != 3:
        print(f"Usage: {sys.argv[0]} <csv_path> <output_json_path>")
        sys.exit(1)
    
    csv_path, output_path = sys.argv[1:]
    
    # Process the CSV
    data = process_csv(csv_path)
    
    # Write to JSON file
    try:
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=2)
        print(f"Successfully converted {csv_path} to {output_path}")
    except Exception as e:
        print(f"Error writing JSON file: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()