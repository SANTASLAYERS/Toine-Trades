# Vercel Deployment Guide

This document provides detailed instructions for deploying the trading algorithm portfolio website to Vercel.

## Prerequisites

- GitHub account
- Vercel account (can sign up with GitHub)
- Git installed locally

## Initial Deployment Steps

1. **Push to GitHub**

   First, create a repository on GitHub and push your code:

   ```bash
   # Initialize git if not already done
   git init

   # Add the remote
   git remote add origin https://github.com/yourusername/trading-portfolio.git

   # Add files
   git add .

   # Commit
   git commit -m "Initial commit"

   # Push to GitHub
   git push -u origin main
   ```

2. **Connect to Vercel**

   a. Log in to [Vercel](https://vercel.com)
   b. Click "Add New..." > "Project"
   c. Import the GitHub repository you just created
   d. Keep the default settings:
      - Framework preset: Next.js
      - Root directory: ./
      - Build command: `next build`
      - Output directory: .next
   e. Click "Deploy"

3. **Verify Deployment**

   Once deployment is complete, Vercel will provide you with a URL (e.g., `your-project.vercel.app`). Visit this URL to ensure your site is working correctly.

## Important Deployment Notes

1. **CSV File Requirement**
   - Make sure to include a NinjaTrader CSV file in the `public/data/` directory before deploying
   - **Critical requirement:** The file must be named `NinjaTrader-sample.csv` exactly
   - Using the public directory ensures the file can be accessed via URL in production
   - The file is fetched via HTTP request rather than file system for Vercel compatibility

2. **Environment Variables**
   - No special environment variables are required for this project

3. **Custom Domain (Optional)**
   a. Go to your project in the Vercel dashboard
   b. Click on "Settings" > "Domains"
   c. Add your custom domain and follow the verification steps

## Updating the Website

### Updating Trading Data

When you have new trading data to display:

1. Export a new CSV file from NinjaTrader
2. Save it with a name starting with "NinjaTrader" in the project root
3. Commit and push to GitHub:
   ```bash
   git add "NinjaTrader*.csv"
   git commit -m "perf update $(date +%F)"
   git push origin main
   ```
4. Vercel will automatically deploy the changes

### Updating Content or Code

When you need to update the website content or code:

1. Make your changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update website content"
   git push origin main
   ```
3. Vercel will automatically deploy the changes

## Troubleshooting Vercel Deployments

If you encounter issues with your Vercel deployment:

1. **Build Failures**
   - Check the build logs in the Vercel dashboard
   - Ensure all dependencies are properly installed
   - Verify that the NinjaTrader CSV file is in the repository root

2. **Performance Page Issues**
   - Check browser console for JavaScript errors
   - Verify the CSV file format matches the expected format
   - Ensure the API is correctly serving the CSV data

3. **Deployment Stuck**
   - Try triggering a manual redeploy in the Vercel dashboard
   - Check GitHub webhooks are properly configured

For additional help, refer to [Vercel's documentation](https://vercel.com/docs) or contact support through the Vercel dashboard.