#\!/usr/bin/env python3
"""
Convert NinjaTrader CSV to perf.json

Usage: python nt2json.py nt_export.csv data/perf.json

CSV Schema:
 < /dev/null |  Column name        | Example value                | Notes                         |
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
        
        # Remove all trades on 5/12/2025 due to misreporting
        indices_to_remove = []
        if not may_12_trades.empty:
            indices_to_remove.extend(may_12_trades.index.tolist())
            print(f"Removing all trades on 5/12/2025 due to misreporting: {len(may_12_trades)} trades")
        
        # Identify trades on 5/13/2025
        may_13_mask = df['Exit time'].dt.strftime('%m/%d/%Y') == '05/13/2025'
        may_13_trades = df[may_13_mask].copy()
        
        # If there are losing trades on 5/13, remove the single largest loss
        if not may_13_trades.empty:
            losing_trades_13 = may_13_trades[may_13_trades['Profit'] < 0].sort_values('Profit')
            if not losing_trades_13.empty:
                indices_to_remove.append(losing_trades_13.index[0])
                print(f"Removing largest losing trade on 5/13/2025: {losing_trades_13['Profit'].iloc[0]}")

        # Filter trades on 5/21/2025 - keep only the 2 largest losers, remove all others
        may_21_mask = df['Exit time'].dt.strftime('%m/%d/%Y') == '05/21/2025'
        may_21_trades = df[may_21_mask].copy()
        if not may_21_trades.empty:
            losing_trades_21 = may_21_trades[may_21_trades['Profit'] < 0].sort_values('Profit')
            if len(losing_trades_21) >= 2:
                # Keep only the 2 largest losers, remove all other trades from 5/21
                trades_to_keep = losing_trades_21.index[:2]
                trades_to_remove = may_21_trades[~may_21_trades.index.isin(trades_to_keep)].index.tolist()
                indices_to_remove.extend(trades_to_remove)
                print(f"Keeping only 2 largest losing trades on 5/21/2025: {losing_trades_21['Profit'].iloc[:2].tolist()}")
                print(f"Removing {len(trades_to_remove)} other trades on 5/21/2025")
            else:
                # If less than 2 losing trades, remove all trades from 5/21
                indices_to_remove.extend(may_21_trades.index.tolist())
                print(f"Removing all {len(may_21_trades)} trades on 5/21/2025 (insufficient losing trades)")

        # Filter trades on 5/22/2025 - remove 2 largest winners
        may_22_mask = df['Exit time'].dt.strftime('%m/%d/%Y') == '05/22/2025'
        may_22_trades = df[may_22_mask].copy()
        if not may_22_trades.empty:
            winning_trades_22 = may_22_trades[may_22_trades['Profit'] > 0].sort_values('Profit', ascending=False)
            if len(winning_trades_22) >= 2:
                indices_to_remove.extend(winning_trades_22.index[:2].tolist())
                print(f"Removing 2 largest winning trades on 5/22/2025: {winning_trades_22['Profit'].iloc[:2].tolist()}")
            elif len(winning_trades_22) == 1:
                indices_to_remove.append(winning_trades_22.index[0])
                print(f"Removing 1 winning trade on 5/22/2025: {winning_trades_22['Profit'].iloc[0]}")

        # Filter trades on 5/23/2025 - remove largest winner and largest loser
        may_23_mask = df['Exit time'].dt.strftime('%m/%d/%Y') == '05/23/2025'
        may_23_trades = df[may_23_mask].copy()
        if not may_23_trades.empty:
            # Remove largest winner
            winning_trades_23 = may_23_trades[may_23_trades['Profit'] > 0].sort_values('Profit', ascending=False)
            if not winning_trades_23.empty:
                indices_to_remove.append(winning_trades_23.index[0])
                print(f"Removing largest winning trade on 5/23/2025: {winning_trades_23['Profit'].iloc[0]}")

            # Remove 2 largest losers
            losing_trades_23 = may_23_trades[may_23_trades['Profit'] < 0].sort_values('Profit')
            if len(losing_trades_23) >= 2:
                indices_to_remove.extend(losing_trades_23.index[:2].tolist())
                print(f"Removing 2 largest losing trades on 5/23/2025: {losing_trades_23['Profit'].iloc[:2].tolist()}")
            elif len(losing_trades_23) == 1:
                indices_to_remove.append(losing_trades_23.index[0])
                print(f"Removing 1 losing trade on 5/23/2025: {losing_trades_23['Profit'].iloc[0]}")

        # Remove the identified trades
        if indices_to_remove:
            df = df.drop(indices_to_remove)
            print(f"Removed {len(indices_to_remove)} trades total as requested")
            
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
