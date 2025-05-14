# Performance Update Guide

This document outlines the process for updating trading performance data on the website.

## Prerequisites

- NinjaTrader software with access to trade history
- Git installed and configured with repository access

## Workflow

### 1. Export Trade Data from NinjaTrader

1. Open NinjaTrader platform
2. Navigate to **Control Center** > **Trade Performance** > **Executions**
3. Set desired date range for the export
4. Click **Export** button (CSV format)
5. Save the file and rename it exactly as `NinjaTrader-sample.csv`
6. Move the file to the `public/data/` directory in your project, replacing the existing file

### 2. Push the CSV File to the Repository

After exporting the CSV file and placing it in the public/data directory, commit and push it to the repository:

```bash
git add "public/data/NinjaTrader*.csv"
git commit -m "perf update $(date +%F)"
git push origin main
```

The website will automatically load the most recent NinjaTrader CSV file from the public/data directory when visitors access the performance page.

> **Important:** Always place CSV files in the `public/data/` directory, not in the project root. This ensures compatibility with Vercel's file system structure.

> **Note:** The old method using the Python converter (nt2json.py) is no longer required as the application now reads directly from the CSV file.

### 3. Verify Deployment

The Vercel deployment will automatically trigger when changes are pushed to the main branch. To verify:

1. Wait 1-2 minutes for deployment to complete
2. Visit the performance page of your website
3. Verify that the latest data is displayed correctly
4. Check that the equity curve and metrics have updated

## Troubleshooting

### CSV Format Issues

If the script fails with errors related to column names or data formats:

1. Ensure your NinjaTrader export has the expected columns
2. Check for any special characters or encoding issues in the CSV
3. Verify that date formats match expectations (YYYY-MM-DD HH:MM:SS)

### Script Errors

If the Python script fails:

1. Check that all required Python packages are installed
2. Verify the CSV file exists and is readable
3. Ensure you have write permissions for the data directory

### Deployment Issues

If the website doesn't reflect your updates:

1. Verify the JSON file was successfully updated
2. Check that changes were committed and pushed to the main branch
3. Look for any build errors in the Vercel dashboard
4. Try a hard refresh (Ctrl+F5) in your browser

## Schedule

It's recommended to update performance data:
- At the end of each trading day
- At least weekly for public transparency
- Before sharing the website with new contacts

By following this consistent update process, you ensure that your trading performance page always displays the most current and accurate information.