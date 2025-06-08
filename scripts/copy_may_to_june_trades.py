#!/usr/bin/env python3
"""
Script to copy trades from May 5-9, 2025 to June 2-6, 2025.
Each trade has a 30% chance of being skipped to introduce variation.
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

# Probability of keeping a trade (70%)
KEEP_PROBABILITY = 0.7

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
    
    # Find the highest trade number
    max_trade_num = 0
    for trade in all_trades:
        if trade and trade[0].isdigit():
            max_trade_num = max(max_trade_num, int(trade[0]))
    
    next_trade_num = max_trade_num + 1
    print(f"Max trade number: {max_trade_num}")
    
    # Extract trades from May 5-9
    may_trades = []
    for trade in all_trades:
        if len(trade) > 9:  # Make sure row has enough columns
            try:
                exit_time_str = trade[9]  # Exit time column
                exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
                exit_date = exit_time.date()
                
                # Check if the trade date is in our mapping
                if exit_date in date_mapping:
                    # Apply 30% chance of skipping
                    if random.random() < KEEP_PROBABILITY:
                        may_trades.append(trade)
            except (ValueError, IndexError) as e:
                print(f"Error parsing date: {e}")
                continue
    
    print(f"Found {len(may_trades)} trades from May 5-9 (after 30% filtering)")
    
    # Create copies with June dates
    june_trades = []
    cumulative_profit = 0
    
    # Get the last cumulative profit value from the existing trades
    if all_trades:
        try:
            last_cum_profit_str = all_trades[-1][13].replace('$', '').replace(',', '')
            if '(' in last_cum_profit_str and ')' in last_cum_profit_str:
                last_cum_profit_str = last_cum_profit_str.replace('(', '-').replace(')', '')
            cumulative_profit = float(last_cum_profit_str)
        except (ValueError, IndexError) as e:
            print(f"Error getting last cumulative profit: {e}")
            cumulative_profit = 0
    
    print(f"Starting cumulative profit: ${cumulative_profit:.2f}")
    
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
            
            # Update entry time
            entry_time_str = trade[8]
            entry_time = datetime.datetime.strptime(entry_time_str, '%m/%d/%Y %I:%M:%S %p')
            entry_date = entry_time.date()
            days_delta = (june_date - may_date).days
            new_entry_time = entry_time + datetime.timedelta(days=days_delta)
            new_trade[8] = new_entry_time.strftime('%-m/%-d/%Y %-I:%M:%S %p')
            
            # Update exit time
            exit_time_str = trade[9]
            exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
            new_exit_time = exit_time + datetime.timedelta(days=days_delta)
            new_trade[9] = new_exit_time.strftime('%-m/%-d/%Y %-I:%M:%S %p')
            
            # Update profit
            profit_str = trade[12].replace('$', '').replace(',', '')
            if '(' in profit_str and ')' in profit_str:
                profit_str = profit_str.replace('(', '-').replace(')', '')
            profit = float(profit_str)
            
            # Add profit to cumulative total
            cumulative_profit += profit
            
            # Format profit and cumulative profit
            if profit < 0:
                new_trade[12] = f"(${abs(profit):.2f})"
            else:
                new_trade[12] = f"${profit:.2f}"
                
            if cumulative_profit < 0:
                new_trade[13] = f"(${abs(cumulative_profit):.2f})"
            else:
                new_trade[13] = f"${cumulative_profit:.2f}"
            
            june_trades.append(new_trade)
    
    print(f"Generated {len(june_trades)} new trades for June 2-6")
    
    # Combine original trades and new June trades
    combined_trades = all_trades + june_trades
    
    # Sort by exit time
    combined_trades.sort(key=lambda x: datetime.datetime.strptime(x[9], '%m/%d/%Y %I:%M:%S %p') if len(x) > 9 else datetime.datetime.min)
    
    # Renumber all trades and recalculate cumulative profit
    cumulative_profit = 0
    for i, trade in enumerate(combined_trades, 1):
        trade[0] = str(i)
        
        # Recalculate cumulative profit
        profit_str = trade[12].replace('$', '').replace(',', '')
        if '(' in profit_str and ')' in profit_str:
            profit_str = profit_str.replace('(', '-').replace(')', '')
        profit = float(profit_str)
        
        cumulative_profit += profit
        
        if cumulative_profit < 0:
            trade[13] = f"(${abs(cumulative_profit):.2f})"
        else:
            trade[13] = f"${cumulative_profit:.2f}"
    
    # Write to output file
    with open(output_csv, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(header)
        writer.writerows(combined_trades)
    
    print(f"Wrote {len(combined_trades)} trades to: {output_csv}")
    print(f"Final cumulative profit: ${cumulative_profit:.2f}")

if __name__ == "__main__":
    main()