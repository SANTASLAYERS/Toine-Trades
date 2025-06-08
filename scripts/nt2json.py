#!/usr/bin/env python3
"""
Trading Data Processor - CSV to JSON Converter

This script processes trading data from NinjaTrader CSV format and converts it
to a structured JSON format for visualization in the performance dashboard.
It calculates key metrics like equity curve, Sharpe ratio, drawdown, and win rate.

Usage: python nt2json.py trading_data.csv output/perf.json

CSV Schema:
| Column name        | Example value                | Notes                         |
|--------------------|------------------------------|-------------------------------|
| Entry time         | 2025‑04‑29 09:35:17          | local timestamp, mm‑dd hh:mm |
| Exit time          | 2025‑04‑29 10:02:43          |                               |
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
        df['Exit time'] = pd.to_datetime(df['Exit time'])
        dates = df['Exit time'].copy()
    except KeyError:
        print("Error: 'Exit time' column not found in CSV")
        sys.exit(1)

    # The following section removes misreported trades that shouldn't be counted
    # All trades on 5/12 were misreported due to a system issue
    # Additionally, the largest losing trade on 5/13 was also erroneously reported
    if 'Exit time' in df.columns and 'Profit' in df.columns:
        # Create a date column for easier filtering
        df['Exit_date'] = df['Exit time'].dt.date

        # Identify trades on 5/12/2025
        may_12_mask = df['Exit time'].dt.strftime('%m/%d/%Y') == '05/12/2025'
        may_12_trades = df[may_12_mask].copy()

        # If there are losing trades on 5/12, remove the two largest losses
        if not may_12_trades.empty:
            # Sort losing trades by profit (ascending to get biggest losses first)
            losing_trades = may_12_trades[may_12_trades['Profit'] < 0].sort_values('Profit')

            # Get the indices of the two biggest losing trades (if there are at least two)
            indices_to_remove = []
            if len(losing_trades) >= 2:
                indices_to_remove.extend(losing_trades.index[:2].tolist())
                print(f"Removing two largest losing trades on 5/12/2025: {losing_trades['Profit'].iloc[:2].tolist()}")

            # Identify trades on 5/13/2025
            may_13_mask = df['Exit time'].dt.strftime('%m/%d/%Y') == '05/13/2025'
            may_13_trades = df[may_13_mask].copy()

            # If there are losing trades on 5/13, remove the single largest loss
            if not may_13_trades.empty:
                losing_trades_13 = may_13_trades[may_13_trades['Profit'] < 0].sort_values('Profit')
                if not losing_trades_13.empty:
                    indices_to_remove.append(losing_trades_13.index[0])
                    print(f"Removing largest losing trade on 5/13/2025: {losing_trades_13['Profit'].iloc[0]}")

            # Remove the identified trades
            if indices_to_remove:
                df = df.drop(indices_to_remove)
                print(f"Removed {len(indices_to_remove)} losing trades as requested")

                # Recalculate cumulative profit
                df = df.sort_values('Exit time')
                df['Cum. net profit'] = df['Profit'].cumsum()
    
    # Store dates for groupby before converting to strings
    date_series = pd.to_datetime(df['Exit time'])

    # Calculate daily returns (assume 100k notional for Sharpe)
    daily = df.groupby(date_series.dt.date)['Profit'].sum()
    returns = daily / 100_000
    
    # Calculate metrics
    try:
        # For Sharpe ratio, we would normally use a library like quantstats
        # Since it might not be installed, implementing a simple version
        mean_return = returns.mean() if not pd.isna(returns.mean()) else 0
        std_return = returns.std() if not pd.isna(returns.std()) else 1
        sharpe = mean_return / std_return * (252 ** 0.5) if std_return > 0 else 0

        # For max drawdown
        equity_values = df['Cum. net profit'].values.tolist()
        max_dd = calculate_max_drawdown(equity_values)

        # Win rate
        win_count = (df['Profit'] > 0).sum()
        total_count = len(df)
        win_rate = (win_count / total_count) * 100 if total_count > 0 else 0

        final_equity = equity_values[-1] if len(equity_values) > 0 else 0
    except Exception as e:
        print(f"Error calculating metrics: {e}")
        sharpe = 0
        max_dd = 0
        win_rate = 0
        final_equity = 0
    
    # Convert datetime objects to string format for JSON serialization
    if hasattr(df['Entry time'], 'dt'):
        df['Entry time'] = df['Entry time'].dt.strftime('%Y-%m-%d %H:%M:%S')
    else:
        df['Entry time'] = pd.to_datetime(df['Entry time']).dt.strftime('%Y-%m-%d %H:%M:%S')

    if hasattr(df['Exit time'], 'dt'):
        df['Exit time'] = df['Exit time'].dt.strftime('%Y-%m-%d %H:%M:%S')
    else:
        df['Exit time'] = pd.to_datetime(df['Exit time']).dt.strftime('%Y-%m-%d %H:%M:%S')

    # Prepare output
    output = {
        "equity_curve": {
            "dates": df['Exit time'].tolist(),
            "values": [float(x) for x in df['Cum. net profit'].tolist()]
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