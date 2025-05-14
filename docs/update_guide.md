# Performance Update Guide

This document outlines the process for updating trading performance data on the website.

## Prerequisites

- NinjaTrader software with access to trade history
- Python 3 installed with `pandas` library
- Git installed and configured with repository access

## Workflows

There are two methods to update performance data:

### Method 1: Convert CSV to JSON (Recommended)

This method gives you more control over the data transformation and is more reliable for ensuring the website displays correctly.

#### 1. Export Trade Data from NinjaTrader

1. Open NinjaTrader platform
2. Navigate to **Control Center** > **Trade Performance** > **Executions**
3. Set desired date range for the export
4. Click **Export** button (CSV format)
5. Save the file with a descriptive name like `NinjaTrader Grid YYYY-MM-DD HH-MM PM.csv`
6. Move the file to the `public/data/` directory in your project

#### 2. Convert CSV to JSON using nt2json.py

Run the Python converter script to transform the CSV data into the required JSON format:

```bash
cd /home/pangasa/personal_website/temp_project
python scripts/nt2json.py "public/data/NinjaTrader Grid YYYY-MM-DD HH-MM PM.csv" "public/perf.json"
```

Replace `YYYY-MM-DD HH-MM PM` with the actual date and time in your filename.

#### 3. Verify the JSON Output

Check that the `perf.json` file was created successfully and contains:
- Equity curve data (dates and values)
- Performance metrics (sharpe ratio, win rate, etc.)
- Trade records with proper formatting

#### 4. Commit and Push Changes

```bash
git add "public/data/NinjaTrader*.csv" "public/perf.json"
git commit -m "perf update $(date +%F)"
git push origin main
```

### Method 2: Direct CSV Upload (Alternative)

This method is simpler but relies on the website to parse the CSV file directly.

#### 1. Export Trade Data from NinjaTrader

1. Open NinjaTrader platform
2. Navigate to **Control Center** > **Trade Performance** > **Executions**
3. Set desired date range for the export
4. Click **Export** button (CSV format)
5. Save the file and rename it as `NinjaTrader-sample.csv`
6. Move the file to the `public/data/` directory in your project, replacing the existing file

#### 2. Push the CSV File to the Repository

```bash
git add "public/data/NinjaTrader-sample.csv"
git commit -m "perf update $(date +%F)"
git push origin main
```

## CSV Format Requirements

Your NinjaTrader CSV export must have the following columns:

| Column name     | Example value                | Description               |
|-----------------|------------------------------|---------------------------|
| Entry time      | 2025‑04‑29 09:35:17          | Trade entry timestamp     |
| Exit time       | 2025‑04‑29 10:02:43          | Trade exit timestamp      |
| Instrument      | MNQ 06‑25                    | Trading instrument name   |
| Market pos.     | Long / Short                 | Position direction        |
| Qty             | 2                            | Position size             |
| Entry price     | 17823.50                     | Entry price               |
| Exit price      | 17831.75                     | Exit price                |
| Profit          | $162.50 or ($42.50)          | Profit/loss with $ symbol |
| Cum. net profit | $6,972.50                    | Running equity total      |

## Troubleshooting

### CSV Format Issues

If the converter fails with errors related to column names or data formats:

1. Ensure your NinjaTrader export has all the required columns
2. Check for any special characters or encoding issues in the CSV
3. Verify that date formats match expectations (YYYY-MM-DD HH:MM:SS)
4. Remove any BOM (Byte Order Mark) characters from the file if present

### Python Script Errors

If the Python script fails:

1. Install required packages: `pip install pandas`
2. Verify the CSV file exists and is readable
3. Ensure you have write permissions for the target directory
4. Check for proper quoting of filepaths (especially if they contain spaces)

### Data Display Issues

If the performance metrics look incorrect:

1. Check the CSV file for data integrity
2. Verify that profit/loss values are formatted correctly with $ and parentheses
3. Look for missing or NULL values in important columns
4. Ensure the script is calculating metrics correctly (Sharpe, drawdown, etc.)

### Deployment Issues

If the website doesn't reflect your updates:

1. Verify the JSON file or CSV was successfully updated
2. Check that changes were committed and pushed to the main branch
3. Look for any build errors in the Vercel dashboard
4. Try a hard refresh (Ctrl+F5) in your browser

## Complete Process Example

Here's a full example of updating performance data:

```bash
# Start in the project directory
cd /home/pangasa/personal_website/temp_project

# Copy your NinjaTrader export to the data directory
cp ~/Downloads/NinjaTrader\ Grid\ 2025-05-15\ 04-22\ PM.csv public/data/

# Convert CSV to JSON
python scripts/nt2json.py "public/data/NinjaTrader Grid 2025-05-15 04-22 PM.csv" "public/perf.json"

# Add both files to git
git add "public/data/NinjaTrader Grid 2025-05-15 04-22 PM.csv" public/perf.json

# Commit and push
git commit -m "Update performance data for May 15, 2025"
git push origin main
```

## Schedule

It's recommended to update performance data:
- At the end of each trading day
- At least weekly for public transparency
- Before sharing the website with new contacts

By following this consistent update process, you ensure that your trading performance page always displays the most current and accurate information.