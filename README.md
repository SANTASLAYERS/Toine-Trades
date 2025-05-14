# Trading Algorithm Portfolio Website

This is a portfolio website showcasing an algorithmic trading system built with Next.js, TypeScript, TailwindCSS, and Plotly.js. The site displays performance metrics from actual trading results, project architecture, and background information.

## Live Demo

[Visit the live website](#) <!-- Replace with actual URL once deployed -->

## Features

- **Landing Page**: Bio, skills, and introduction to the trading approach
- **Project Page**: Documentation of trading system architecture using MDX
- **Performance Page**: Interactive equity curve and metrics using Plotly
  - Total P&L
  - Sharpe Ratio
  - Maximum Drawdown
  - Win Rate
  - Expandable trade table (sortable)

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Charts**: Plotly.js
- **Content**: MDX for rich content
- **Hosting**: Vercel (static deployment)

## Local Development

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/trading-portfolio.git
cd trading-portfolio

# Install dependencies
npm install
# or
pnpm install
```

### Development Server

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Build

```bash
npm run build
# or
pnpm build
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx    # Shared layout with nav and footer
│   │   ├── page.tsx      # Landing page
│   │   ├── projects/     # Project page with system details
│   │   └── performance/  # Performance metrics and charts
│   ├── data/
│   │   └── perf.json     # Performance data from NinjaTrader
│   └── components/       # Reusable React components
├── scripts/
│   └── nt2json.py        # Converter for NinjaTrader CSV to JSON
├── public/               # Static assets
│   ├── favicon.svg
│   └── arch.png          # Architecture diagram
└── docs/                 # Documentation
    ├── architecture.md
    └── update_guide.md
```

## Data Updates

The website displays performance data from real trading results. To update this data:

1. Export trade data from NinjaTrader as CSV
2. Save the file and rename it exactly as `NinjaTrader-sample.csv`
3. Place the file in the `public/data/` directory, replacing the existing file
4. Commit and push changes:
   ```bash
   git add "public/data/NinjaTrader*.csv"
   git commit -m "perf update $(date +%F)"
   git push origin main
   ```

The website will automatically load the most recent NinjaTrader CSV file from the public/data directory when visitors access the performance page.

> **Important for Vercel compatibility:** Always place CSV files in the `public/data/` directory, not in the project root.

For detailed instructions, see [docs/update_guide.md](docs/update_guide.md).

## Deployment

This project is configured for easy deployment on Vercel. For full instructions, see [docs/deployment_guide.md](docs/deployment_guide.md).

Quick deployment steps:

```bash
# Push to GitHub first
git push origin main

# Then deploy to Vercel
vercel login
vercel --prod
```

Important: Make sure to include a NinjaTrader CSV file in the `public/data/` directory before deploying to Vercel.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.