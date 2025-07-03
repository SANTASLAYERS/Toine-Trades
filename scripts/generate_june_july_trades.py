#!/usr/bin/env python3
"""
Script to generate trades for:
1. June 23-27 with 40% keep rate (60% skip)
2. June 30-July 2 with 70% keep rate (30% skip)

Uses May 5-9 trades as templates, copying patterns to new date ranges
with specified probability filtering.
"""
import csv
import random
import datetime
import os
import sys
from collections import defaultdict

# Input and output files
input_csv = '/home/pangasa/personal_website/temp_project/NinjaTrader Grid 2025-06-20 12-52 AM.csv'
output_csv = '/home/pangasa/personal_website/temp_project/NinjaTrader Grid 2025-07-02 12-52 AM.csv'

# Date mapping for June 23-27 (40% keep rate)
june_23_27_mapping = {
    datetime.date(2025, 5, 5): datetime.date(2025, 6, 23),  # Monday
    datetime.date(2025, 5, 6): datetime.date(2025, 6, 24),  # Tuesday
    datetime.date(2025, 5, 7): datetime.date(2025, 6, 25),  # Wednesday
    datetime.date(2025, 5, 8): datetime.date(2025, 6, 26),  # Thursday
    datetime.date(2025, 5, 9): datetime.date(2025, 6, 27),  # Friday
}

# Date mapping for June 30-July 2 (70% keep rate)
june_30_july_2_mapping = {
    datetime.date(2025, 5, 5): datetime.date(2025, 6, 30),  # Monday
    datetime.date(2025, 5, 6): datetime.date(2025, 7, 1),   # Tuesday
    datetime.date(2025, 5, 7): datetime.date(2025, 7, 2),   # Wednesday
}

# Skip probabilities (inverse of keep rates)
JUNE_23_27_SKIP_PROBABILITY = 0.6  # 40% keep rate
JUNE_30_JULY_2_SKIP_PROBABILITY = 0.3  # 70% keep rate

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
    
    # Step 1: Remove any existing trades from target date ranges
    print("Removing any existing trades from June 23-27 and June 30-July 2...")
    filtered_trades = []
    removed_count = 0

    for trade in all_trades:
        if len(trade) > 9:  # Make sure row has enough columns
            try:
                exit_time_str = trade[9]  # Exit time column
                exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
                exit_date = exit_time.date()

                # Check if trade is in dates to be removed
                if (datetime.date(2025, 6, 23) <= exit_date <= datetime.date(2025, 6, 27) or
                    datetime.date(2025, 6, 30) <= exit_date <= datetime.date(2025, 7, 2)):
                    removed_count += 1
                    continue  # Skip this trade
            except (ValueError, IndexError):
                pass  # Keep the trade if date parsing fails

        filtered_trades.append(trade)
    
    print(f"Removed {removed_count} existing trades from target date ranges")
    
    # Find the highest trade number
    max_trade_num = 0
    for trade in filtered_trades:
        if trade and trade[0].isdigit():
            max_trade_num = max(max_trade_num, int(trade[0]))
    
    next_trade_num = max_trade_num + 1
    print(f"Starting new trades from number: {next_trade_num}")
    
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
    
    # Function to generate trades for a period
    def generate_trades_for_period(date_mapping, skip_probability, period_name):
        new_trades = []
        kept_count = 0
        nonlocal next_trade_num
        
        for source_date in sorted(trades_by_date.keys()):
            if source_date in date_mapping:
                target_date = date_mapping[source_date]
                for trade in trades_by_date[source_date]:
                    # Apply skip probability
                    if random.random() > skip_probability:
                        kept_count += 1
                        new_trade = trade.copy()
                        
                        # Update trade number
                        new_trade[0] = str(next_trade_num)
                        next_trade_num += 1
                        
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
                        
                        new_trades.append(new_trade)
        
        keep_rate = (1 - skip_probability) * 100
        print(f"Generated {kept_count} new trades for {period_name} (after {keep_rate:.0f}% keep rate)")
        return new_trades
    
    # Generate trades for June 23-27 (40% keep rate)
    june_23_27_trades = generate_trades_for_period(
        june_23_27_mapping, 
        JUNE_23_27_SKIP_PROBABILITY, 
        "June 23-27"
    )
    
    # Generate trades for June 30-July 2 (70% keep rate)
    june_30_july_2_trades = generate_trades_for_period(
        june_30_july_2_mapping, 
        JUNE_30_JULY_2_SKIP_PROBABILITY, 
        "June 30-July 2"
    )
    
    # Combine all trades
    combined_trades = filtered_trades + june_23_27_trades + june_30_july_2_trades
    
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
    print(f"Total new trades added: {len(june_23_27_trades) + len(june_30_july_2_trades)}")

if __name__ == "__main__":
    main()