#!/usr/bin/env python3
import json
import datetime

# Load JSON file
with open('../public/data/perf.json') as f:
    data = json.load(f)

# Check trades
trades = data['trades']
may_trades = [t for t in trades if (t['Exit time'].startswith('2025-05-2') and int(t['Exit time'][8:10]) >= 24) or t['Exit time'].startswith('2025-05-3')]
print(f"Trades between May 24-31: {len(may_trades)}")
for t in may_trades:
    print(f"Date: {t['Exit time']}, Profit: {t['Profit']}")

# Check equity curve
dates = data['equity_curve']['dates']
values = data['equity_curve']['values']
print(f"\nDates in equity curve: {len(dates)}")
print(f"Values in equity curve: {len(values)}")

# Check last 10 entries
print("\nLast 10 entries in equity curve:")
for i in range(1, 11):
    idx = -i
    print(f"{dates[idx]}: {values[idx]}")

# Verify matching between dates and trades
date_set = set(date.split()[0] for date in dates)  # Get just the date part
trade_dates = set(t['Exit time'].split()[0] for t in trades)

print(f"\nUnique dates in equity curve: {len(date_set)}")
print(f"Unique dates in trades: {len(trade_dates)}")

missing_dates = trade_dates - date_set
if missing_dates:
    print(f"\nDates in trades but missing from equity curve: {missing_dates}")
else:
    print("\nAll trade dates are included in the equity curve")