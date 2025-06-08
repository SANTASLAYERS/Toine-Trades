#!/usr/bin/env python3
"""
Script to:
1. Delete all trades from May 22 to June 1
2. Copy trades from May 5-9 to June 2-6 with a 75% skip chance
3. Generate JSON performance data
"""
import csv
import random
import datetime
import os
import sys
from collections import defaultdict

# Input and output files
input_csv = '/home/pangasa/personal_website/temp_project/NinjaTrader Grid 2025-05-31 12-52 AM.csv'
output_csv = '/home/pangasa/personal_website/temp_project/NinjaTrader Grid 2025-06-06 12-52 AM.csv'

# Date mapping from May to June (weekdays only)
date_mapping = {
    datetime.date(2025, 5, 5): datetime.date(2025, 6, 2),  # Monday to Monday
    datetime.date(2025, 5, 6): datetime.date(2025, 6, 3),  # Tuesday to Tuesday
    datetime.date(2025, 5, 7): datetime.date(2025, 6, 4),  # Wednesday to Wednesday
    datetime.date(2025, 5, 8): datetime.date(2025, 6, 5),  # Thursday to Thursday
    datetime.date(2025, 5, 9): datetime.date(2025, 6, 6),  # Friday to Friday
}

# Probability of SKIPPING a trade (75%)
SKIP_PROBABILITY = 0.75

def main():
    if not os.path.exists(input_csv):
        print(f"Error: Input file '{input_csv}' not found")
        sys.exit(1)
    
    print(f"Reading trades from: {input_csv}")
    
    # Read all trades from the input CSV
    all_trades = []
    with open(input_csv, 'r', newline='') as csvfile:
        reader = csv.reader(csvfile)
        header = next(reader)  # Save the header row
        for row in reader:
            all_trades.append(row)
    
    # Step 1: Delete all trades from May 22 to June 1
    print("Removing trades from May 22 to June 1...")
    filtered_trades = []
    removed_count = 0
    
    for trade in all_trades:
        if len(trade) > 9:  # Make sure row has enough columns
            try:
                exit_time_str = trade[9]  # Exit time column
                exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
                exit_date = exit_time.date()
                
                # Check if trade is in the date range to be removed
                if (datetime.date(2025, 5, 22) <= exit_date <= datetime.date(2025, 6, 1)):
                    removed_count += 1
                    continue  # Skip this trade
            except (ValueError, IndexError):
                pass  # Keep the trade if date parsing fails
        
        filtered_trades.append(trade)
    
    print(f"Removed {removed_count} trades from May 22 to June 1")
    
    # Find the highest trade number
    max_trade_num = 0
    for trade in filtered_trades:
        if trade and trade[0].isdigit():
            max_trade_num = max(max_trade_num, int(trade[0]))
    
    next_trade_num = max_trade_num + 1
    print(f"Max trade number after removal: {max_trade_num}")
    
    # Step 2: Extract trades from May 5-9
    may_trades = []
    for trade in filtered_trades:
        if len(trade) > 9:  # Make sure row has enough columns
            try:
                exit_time_str = trade[9]  # Exit time column
                exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
                exit_date = exit_time.date()
                
                # Check if the trade date is in our mapping
                if exit_date in date_mapping:
                    # Apply 75% chance of skipping (keep only 25%)
                    if random.random() > SKIP_PROBABILITY:
                        may_trades.append(trade)
            except (ValueError, IndexError):
                continue
    
    print(f"Found {len(may_trades)} trades from May 5-9 (after 75% filtering)")
    
    # Create copies with June dates
    june_trades = []
    
    # Group trades by original date to preserve intraday ordering
    trades_by_date = defaultdict(list)
    for trade in may_trades:
        exit_time_str = trade[9]
        exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
        exit_date = exit_time.date()
        trades_by_date[exit_date].append(trade)
    
    # Process each day's trades in order
    for may_date in sorted(trades_by_date.keys()):
        june_date = date_mapping[may_date]
        for trade in trades_by_date[may_date]:
            new_trade = trade.copy()
            
            # Update trade number
            new_trade[0] = str(next_trade_num)
            next_trade_num += 1
            
            # Get original entry time and update only the date part
            entry_time_str = trade[8]
            entry_time = datetime.datetime.strptime(entry_time_str, '%m/%d/%Y %I:%M:%S %p')
            new_entry_time = entry_time.replace(
                year=june_date.year,
                month=june_date.month,
                day=june_date.day
            )
            new_trade[8] = new_entry_time.strftime('%-m/%-d/%Y %-I:%M:%S %p')
            
            # Get original exit time and update only the date part
            exit_time_str = trade[9]
            exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
            new_exit_time = exit_time.replace(
                year=june_date.year,
                month=june_date.month,
                day=june_date.day
            )
            new_trade[9] = new_exit_time.strftime('%-m/%-d/%Y %-I:%M:%S %p')
            
            june_trades.append(new_trade)
    
    print(f"Generated {len(june_trades)} new trades for June 2-6")
    
    # Combine filtered trades and new June trades
    combined_trades = filtered_trades + june_trades
    
    # Sort by exit time
    combined_trades.sort(key=lambda x: datetime.datetime.strptime(x[9], '%m/%d/%Y %I:%M:%S %p') if len(x) > 9 else datetime.datetime.min)
    
    # Renumber all trades and recalculate cumulative profit
    cumulative_profit = 0
    for i, trade in enumerate(combined_trades, 1):
        trade[0] = str(i)
        
        # Recalculate cumulative profit
        if len(trade) > 12 and trade[12]:
            profit_str = trade[12].replace('$', '').replace(',', '')
            if '(' in profit_str and ')' in profit_str:
                profit_str = profit_str.replace('(', '-').replace(')', '')
            try:
                profit = float(profit_str)
                cumulative_profit += profit
                
                if cumulative_profit < 0:
                    trade[13] = f"(${abs(cumulative_profit):.2f})"
                else:
                    trade[13] = f"${cumulative_profit:.2f}"
            except ValueError:
                pass
    
    # Write to output file
    with open(output_csv, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(header)
        writer.writerows(combined_trades)
    
    print(f"Wrote {len(combined_trades)} trades to: {output_csv}")
    print(f"Final cumulative profit: ${cumulative_profit:.2f}")

if __name__ == "__main__":
    main()