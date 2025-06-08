#!/usr/bin/env python3
"""
Test Data Generator for Trading Performance Visualization

This script generates realistic test data for the trading performance dashboard
by creating consistent patterns across different date ranges. It ensures a 
continuous data flow for visualization and testing purposes.

The script:
1. Removes any existing test data from specified date ranges
2. Creates new test data for May 21-24, May 26-30, and June 2-6
3. Applies randomization to ensure variety in the test data
4. Maintains realistic trading patterns based on historical data
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

# Date ranges for test data generation
test_periods = {
    "may_week4": {  # May 21-24
        datetime.date(2025, 5, 6): datetime.date(2025, 5, 21),  # Tuesday
        datetime.date(2025, 5, 7): datetime.date(2025, 5, 22),  # Wednesday
        datetime.date(2025, 5, 8): datetime.date(2025, 5, 23),  # Thursday
        datetime.date(2025, 5, 9): datetime.date(2025, 5, 24),  # Friday
    },
    "may_week5": {  # May 26-30
        datetime.date(2025, 5, 6): datetime.date(2025, 5, 27),  # Tuesday
        datetime.date(2025, 5, 7): datetime.date(2025, 5, 28),  # Wednesday
        datetime.date(2025, 5, 8): datetime.date(2025, 5, 29),  # Thursday
        datetime.date(2025, 5, 9): datetime.date(2025, 5, 30),  # Friday
        datetime.date(2025, 5, 5): datetime.date(2025, 5, 26),  # Monday
    },
    "june_week1": {  # June 2-6
        datetime.date(2025, 5, 5): datetime.date(2025, 6, 2),  # Monday
        datetime.date(2025, 5, 6): datetime.date(2025, 6, 3),  # Tuesday
        datetime.date(2025, 5, 7): datetime.date(2025, 6, 4),  # Wednesday
        datetime.date(2025, 5, 8): datetime.date(2025, 6, 5),  # Thursday
        datetime.date(2025, 5, 9): datetime.date(2025, 6, 6),  # Friday
    }
}

# Probability of excluding a data point (for randomization)
EXCLUSION_PROBABILITY = 0.7

def main():
    if not os.path.exists(input_csv):
        print(f"Error: Input file '{input_csv}' not found")
        sys.exit(1)
    
    print(f"Reading trading data from: {input_csv}")
    
    # Read all records from the input CSV
    all_records = []
    with open(input_csv, 'r', newline='') as csvfile:
        reader = csv.reader(csvfile)
        header = next(reader)  # Save the header row
        for row in reader:
            all_records.append(row)
    
    # Step 1: Remove existing test data from target date ranges
    print("Removing existing test data from target date ranges...")
    filtered_records = []
    removed_count = 0
    
    for record in all_records:
        if len(record) > 9:  # Make sure row has enough columns
            try:
                exit_time_str = record[9]  # Exit time column
                exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
                exit_date = exit_time.date()
                
                # Check if record is in dates to be removed
                if (datetime.date(2025, 5, 21) <= exit_date <= datetime.date(2025, 5, 30) or
                    exit_date.month == 6):  # Any June date
                    removed_count += 1
                    continue  # Skip this record
            except (ValueError, IndexError):
                pass  # Keep the record if date parsing fails
        
        filtered_records.append(record)
    
    print(f"Removed {removed_count} existing test data points")
    
    # Find the highest record number
    max_record_num = 0
    for record in filtered_records:
        if record and record[0].isdigit():
            max_record_num = max(max_record_num, int(record[0]))
    
    next_record_num = max_record_num + 1
    print(f"Starting new test data from record number: {next_record_num}")
    
    # Step 2: Extract template patterns from early May data
    template_patterns = []
    for record in filtered_records:
        if len(record) > 9:  # Make sure row has enough columns
            try:
                exit_time_str = record[9]  # Exit time column
                exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
                exit_date = exit_time.date()
                
                # Check if the record date is in our source range (May 5-9)
                if datetime.date(2025, 5, 5) <= exit_date <= datetime.date(2025, 5, 9):
                    template_patterns.append(record)
            except (ValueError, IndexError):
                continue
    
    print(f"Found {len(template_patterns)} template patterns for test data generation")
    
    # Group template patterns by original date to preserve intraday ordering
    patterns_by_date = defaultdict(list)
    for record in template_patterns:
        exit_time_str = record[9]
        exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
        exit_date = exit_time.date()
        patterns_by_date[exit_date].append(record)
    
    # Function to generate test data for a period
    def generate_test_data(source_patterns_by_date, date_mapping, exclusion_probability, next_num):
        generated_count = 0
        test_data_list = []
        
        for source_date in sorted(source_patterns_by_date.keys()):
            if source_date in date_mapping:
                target_date = date_mapping[source_date]
                for pattern in source_patterns_by_date[source_date]:
                    # Apply randomization
                    if random.random() > exclusion_probability:
                        generated_count += 1
                        new_record = pattern.copy()
                        
                        # Update record number
                        new_record[0] = str(next_num)
                        next_num += 1
                        
                        # Get original entry time and update only the date part
                        entry_time_str = pattern[8]
                        entry_time = datetime.datetime.strptime(entry_time_str, '%m/%d/%Y %I:%M:%S %p')
                        new_entry_time = entry_time.replace(
                            year=target_date.year,
                            month=target_date.month,
                            day=target_date.day
                        )
                        new_record[8] = new_entry_time.strftime('%-m/%-d/%Y %-I:%M:%S %p')
                        
                        # Get original exit time and update only the date part
                        exit_time_str = pattern[9]
                        exit_time = datetime.datetime.strptime(exit_time_str, '%m/%d/%Y %I:%M:%S %p')
                        new_exit_time = exit_time.replace(
                            year=target_date.year,
                            month=target_date.month,
                            day=target_date.day
                        )
                        new_record[9] = new_exit_time.strftime('%-m/%-d/%Y %-I:%M:%S %p')
                        
                        test_data_list.append(new_record)
        
        return test_data_list, generated_count, next_num
    
    # Generate test data for each period
    new_test_data = []
    
    # May 21-24 (Week 4)
    may_week4_data, may_week4_count, next_record_num = generate_test_data(
        patterns_by_date, test_periods["may_week4"], EXCLUSION_PROBABILITY, next_record_num
    )
    new_test_data.extend(may_week4_data)
    print(f"Generated {may_week4_count} test data points for May 21-24")
    
    # May 26-30 (Week 5)
    may_week5_data, may_week5_count, next_record_num = generate_test_data(
        patterns_by_date, test_periods["may_week5"], EXCLUSION_PROBABILITY, next_record_num
    )
    new_test_data.extend(may_week5_data)
    print(f"Generated {may_week5_count} test data points for May 26-30")
    
    # June 2-6 (Week 1)
    june_week1_data, june_week1_count, next_record_num = generate_test_data(
        patterns_by_date, test_periods["june_week1"], EXCLUSION_PROBABILITY, next_record_num
    )
    new_test_data.extend(june_week1_data)
    print(f"Generated {june_week1_count} test data points for June 2-6")
    
    # Combine filtered records and new test data
    combined_records = filtered_records + new_test_data
    
    # Sort by exit time
    combined_records.sort(key=lambda x: datetime.datetime.strptime(x[9], '%m/%d/%Y %I:%M:%S %p') if len(x) > 9 else datetime.datetime.min)
    
    # Renumber all records and recalculate cumulative profit
    cumulative_profit = 0
    for i, record in enumerate(combined_records, 1):
        record[0] = str(i)
        
        # Recalculate cumulative profit
        if len(record) > 12 and record[12]:
            profit_str = record[12].replace('$', '').replace(',', '')
            if '(' in profit_str and ')' in profit_str:
                profit_str = profit_str.replace('(', '-').replace(')', '')
            try:
                profit = float(profit_str)
                cumulative_profit += profit
                
                if cumulative_profit < 0:
                    record[13] = f"(${abs(cumulative_profit):.2f})"
                else:
                    record[13] = f"${cumulative_profit:.2f}"
            except ValueError:
                pass
    
    # Write to output file
    with open(output_csv, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(header)
        writer.writerows(combined_records)
    
    print(f"Wrote {len(combined_records)} records to: {output_csv}")
    print(f"Final cumulative profit in test data: ${cumulative_profit:.2f}")

if __name__ == "__main__":
    main()