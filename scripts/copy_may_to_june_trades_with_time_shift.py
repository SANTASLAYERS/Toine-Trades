#!/usr/bin/env python3
"""
Script to copy trades from May 5-9, 2025 to June 2-6, 2025.
Each trade has a 30% chance of being skipped to introduce variation.
Trade times are also shifted randomly to avoid exact time matches.
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

# Market hours (9:30 AM - 4:00 PM Eastern)
MARKET_OPEN_HOUR = 9
MARKET_OPEN_MINUTE = 30
MARKET_CLOSE_HOUR = 16
MARKET_CLOSE_MINUTE = 0

def get_random_time_shift():
    """Generate a random time shift between -90 and +90 minutes"""
    # Random shift between -90 and +90 minutes
    minutes_shift = random.randint(-90, 90)
    return datetime.timedelta(minutes=minutes_shift)

def ensure_market_hours(dt):
    """Ensure the datetime is within market hours (9:30 AM - 4:00 PM)"""
    market_open = dt.replace(hour=MARKET_OPEN_HOUR, minute=MARKET_OPEN_MINUTE, second=0)
    market_close = dt.replace(hour=MARKET_CLOSE_HOUR, minute=MARKET_CLOSE_MINUTE, second=0)
    
    if dt < market_open:
        # If before market open, set to a random time in the first hour
        minutes_after_open = random.randint(5, 55)
        return dt.replace(hour=MARKET_OPEN_HOUR, minute=MARKET_OPEN_MINUTE) + datetime.timedelta(minutes=minutes_after_open)
    elif dt > market_close:
        # If after market close, set to a random time in the last hour
        minutes_before_close = random.randint(5, 55)
        return dt.replace(hour=MARKET_CLOSE_HOUR, minute=0) - datetime.timedelta(minutes=minutes_before_close)
    return dt

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
        
        # Keep track of used times to avoid conflicts
        used_times = []
        
        for trade in trades_by_date[may_date]:
            new_trade = trade.copy()
            
            # Update trade number
            new_trade[0] = str(next_trade_num)
            next_trade_num += 1
            
            # Get the original times
            entry_time_str = trade[8]
            exit_time_str = trade[9]
            
            entry_time = datetime.datetime.strptime(entry_time_str, '%m/%d/%Y %I:%M:%S %p')
            exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
            
            # Calculate the trade duration
            trade_duration = exit_time - entry_time
            
            # Generate a random time shift (same for both entry and exit to maintain duration)
            time_shift = get_random_time_shift()
            
            # Apply date change and time shift
            days_delta = (june_date - may_date).days
            new_entry_time = entry_time + datetime.timedelta(days=days_delta) + time_shift
            
            # Ensure the new time is within market hours
            new_entry_time = ensure_market_hours(new_entry_time)
            
            # Calculate new exit time while preserving trade duration
            new_exit_time = new_entry_time + trade_duration
            
            # Ensure exit time is also within market hours
            new_exit_time = ensure_market_hours(new_exit_time)
            
            # If exit time adjustment changed the duration, recalculate entry time
            if (new_exit_time - new_entry_time) != trade_duration:
                # If exit time was adjusted to be within market hours, adjust entry time accordingly
                # to maintain at least some duration (at least 1 minute, up to original duration)
                min_duration = min(trade_duration, datetime.timedelta(minutes=1))
                new_entry_time = new_exit_time - min_duration
                new_entry_time = ensure_market_hours(new_entry_time)
            
            # Avoid time conflicts by checking if time is already used
            attempt = 0
            while attempt < 10:  # Try up to 10 times to find a non-conflicting time
                conflict = False
                for used_entry, used_exit in used_times:
                    # Check if new trade overlaps with existing trade
                    if (new_entry_time <= used_exit and new_exit_time >= used_entry):
                        conflict = True
                        break
                
                if not conflict:
                    break
                
                # If conflict, shift time by 5-15 minutes
                shift = datetime.timedelta(minutes=random.randint(5, 15))
                new_entry_time += shift
                new_exit_time += shift
                
                # Ensure times are within market hours
                new_entry_time = ensure_market_hours(new_entry_time)
                new_exit_time = ensure_market_hours(new_exit_time)
                
                attempt += 1
            
            # Add to used times list
            used_times.append((new_entry_time, new_exit_time))
            
            # Update entry and exit times in trade
            new_trade[8] = new_entry_time.strftime('%-m/%-d/%Y %-I:%M:%S %p')
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