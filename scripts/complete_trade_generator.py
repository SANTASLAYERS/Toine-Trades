#!/usr/bin/env python3
"""
Script to:
1. Delete all existing trades from May 21-30 and June
2. Copy trades from May 5-9 to May 21-24 with 70% skip chance
3. Copy trades from May 5-9 to May 26-30 with 70% skip chance
4. Copy trades from May 5-9 to June 2-6 with 70% skip chance
5. Generate JSON performance data
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

# Date mapping from May 5-9 to other weeks
may_21_24_mapping = {
    datetime.date(2025, 5, 6): datetime.date(2025, 5, 21),  # Tuesday
    datetime.date(2025, 5, 7): datetime.date(2025, 5, 22),  # Wednesday
    datetime.date(2025, 5, 8): datetime.date(2025, 5, 23),  # Thursday
    datetime.date(2025, 5, 9): datetime.date(2025, 5, 24),  # Friday
}

may_26_30_mapping = {
    datetime.date(2025, 5, 6): datetime.date(2025, 5, 27),  # Tuesday
    datetime.date(2025, 5, 7): datetime.date(2025, 5, 28),  # Wednesday
    datetime.date(2025, 5, 8): datetime.date(2025, 5, 29),  # Thursday
    datetime.date(2025, 5, 9): datetime.date(2025, 5, 30),  # Friday
    datetime.date(2025, 5, 5): datetime.date(2025, 5, 26),  # Monday
}

june_mapping = {
    datetime.date(2025, 5, 5): datetime.date(2025, 6, 2),  # Monday
    datetime.date(2025, 5, 6): datetime.date(2025, 6, 3),  # Tuesday
    datetime.date(2025, 5, 7): datetime.date(2025, 6, 4),  # Wednesday
    datetime.date(2025, 5, 8): datetime.date(2025, 6, 5),  # Thursday
    datetime.date(2025, 5, 9): datetime.date(2025, 6, 6),  # Friday
}

# Probability of SKIPPING a trade (70%)
SKIP_PROBABILITY = 0.7

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
    
    # Step 1: Delete all trades from May 21-30 and June
    print("Removing all trades from May 21-30 and June...")
    filtered_trades = []
    removed_count = 0
    
    for trade in all_trades:
        if len(trade) > 9:  # Make sure row has enough columns
            try:
                exit_time_str = trade[9]  # Exit time column
                exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
                exit_date = exit_time.date()
                
                # Check if trade is in dates to be removed
                if (datetime.date(2025, 5, 21) <= exit_date <= datetime.date(2025, 5, 30) or
                    exit_date.month == 6):  # Any June date
                    removed_count += 1
                    continue  # Skip this trade
            except (ValueError, IndexError):
                pass  # Keep the trade if date parsing fails
        
        filtered_trades.append(trade)
    
    print(f"Removed {removed_count} trades from specified date ranges")
    
    # Find the highest trade number
    max_trade_num = 0
    for trade in filtered_trades:
        if trade and trade[0].isdigit():
            max_trade_num = max(max_trade_num, int(trade[0]))
    
    next_trade_num = max_trade_num + 1
    print(f"Max trade number after removal: {max_trade_num}")
    
    # Step 2: Extract trades from May 5-9 to use as templates
    template_trades = []
    for trade in filtered_trades:
        if len(trade) > 9:  # Make sure row has enough columns
            try:
                exit_time_str = trade[9]  # Exit time column
                exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
                exit_date = exit_time.date()
                
                # Check if the trade date is in our source range (May 5-9)
                if datetime.date(2025, 5, 5) <= exit_date <= datetime.date(2025, 5, 9):
                    template_trades.append(trade)
            except (ValueError, IndexError):
                continue
    
    print(f"Found {len(template_trades)} template trades from May 5-9")
    
    # Group template trades by original date to preserve intraday ordering
    trades_by_date = defaultdict(list)
    for trade in template_trades:
        exit_time_str = trade[9]
        exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
        exit_date = exit_time.date()
        trades_by_date[exit_date].append(trade)
    
    # Process each mapping to create new trades
    new_trades = []
    
    # Function to copy trades to new dates with skip probability
    def copy_trades_to_dates(source_trades_by_date, date_mapping, skip_probability, next_num):
        copied_count = 0
        new_trades_list = []
        
        for source_date in sorted(source_trades_by_date.keys()):
            if source_date in date_mapping:
                target_date = date_mapping[source_date]
                for trade in source_trades_by_date[source_date]:
                    # Apply skip chance
                    if random.random() > skip_probability:
                        copied_count += 1
                        new_trade = trade.copy()
                        
                        # Update trade number
                        new_trade[0] = str(next_num)
                        next_num += 1
                        
                        # Get original entry time and update only the date part
                        entry_time_str = trade[8]
                        entry_time = datetime.datetime.strptime(entry_time_str, '%m/%d/%Y %I:%M:%S %p')
                        new_entry_time = entry_time.replace(
                            year=target_date.year,
                            month=target_date.month,
                            day=target_date.day
                        )
                        new_trade[8] = new_entry_time.strftime('%-m/%-d/%Y %-I:%M:%S %p')
                        
                        # Get original exit time and update only the date part
                        exit_time_str = trade[9]
                        exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
                        new_exit_time = exit_time.replace(
                            year=target_date.year,
                            month=target_date.month,
                            day=target_date.day
                        )
                        new_trade[9] = new_exit_time.strftime('%-m/%-d/%Y %-I:%M:%S %p')
                        
                        new_trades_list.append(new_trade)
        
        return new_trades_list, copied_count, next_num
    
    # Copy trades to May 21-24
    may_21_24_trades, may_21_24_count, next_trade_num = copy_trades_to_dates(
        trades_by_date, may_21_24_mapping, SKIP_PROBABILITY, next_trade_num
    )
    new_trades.extend(may_21_24_trades)
    print(f"Generated {may_21_24_count} new trades for May 21-24 (after 70% filtering)")
    
    # Copy trades to May 26-30
    may_26_30_trades, may_26_30_count, next_trade_num = copy_trades_to_dates(
        trades_by_date, may_26_30_mapping, SKIP_PROBABILITY, next_trade_num
    )
    new_trades.extend(may_26_30_trades)
    print(f"Generated {may_26_30_count} new trades for May 26-30 (after 70% filtering)")
    
    # Copy trades to June 2-6
    june_trades, june_count, next_trade_num = copy_trades_to_dates(
        trades_by_date, june_mapping, SKIP_PROBABILITY, next_trade_num
    )
    new_trades.extend(june_trades)
    print(f"Generated {june_count} new trades for June 2-6 (after 70% filtering)")
    
    # Combine filtered trades and new trades
    combined_trades = filtered_trades + new_trades
    
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