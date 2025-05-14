# Trading Algorithm Architecture

This document provides details on the architecture of the algorithmic trading system and the website that showcases its performance.

## System Architecture

The trading system follows a modular architecture with several key components:

```
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│                     │     │                     │     │                     │
│   Data Pipeline     │────▶│    Model Stack      │────▶│    Risk Manager     │
│                     │     │                     │     │                     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
          │                           │                           │
          │                           │                           │
          ▼                           ▼                           ▼
┌─────────────────────┐     ┌─────────────────────┐     ┌─────────────────────┐
│                     │     │                     │     │                     │
│   Feature Store     │◀───▶│  Execution Engine   │◀───▶│ Performance Tracker │
│                     │     │                     │     │                     │
└─────────────────────┘     └─────────────────────┘     └─────────────────────┘
                                      │
                                      │
                                      ▼
                            ┌─────────────────────┐
                            │                     │
                            │    NinjaTrader      │
                            │                     │
                            └─────────────────────┘
```

### Data Flow

1. **Market Data Ingestion**
   - Real-time price feeds are collected from market data providers
   - Data is normalized and preprocessed for analysis

2. **Feature Generation**
   - Technical indicators are calculated 
   - Statistical features are derived from raw data
   - Features are stored in a Feature Store for model consumption

3. **Prediction & Decision**
   - ML models analyze features and generate predictions
   - Trading signals are generated based on model outputs
   - Risk parameters are calculated and applied

4. **Execution**
   - Orders are generated with appropriate size and risk parameters
   - Orders are sent to NinjaTrader via API
   - Execution quality is monitored and tracked

5. **Performance Tracking**
   - Trade results are recorded in a database
   - Performance metrics are calculated
   - Results are exported for analysis and visualization

## Website Architecture

The website is built using Next.js, TypeScript, TailwindCSS, and Plotly, following the App Router pattern:

```
src/
├── app/
│   ├── layout.tsx       # Shared layout (nav + footer)
│   ├── page.tsx         # Landing page ("About me")
│   ├── projects/
│   │   └── page.mdx     # Project background in MDX
│   └── performance/
│       └── page.tsx     # Interactive equity + metrics
├── data/
│   └── perf.json        # Performance data (from NinjaTrader)
└── components/          # Reusable React components
```

### Data Pipeline

The data pipeline for the website is as follows:

1. NinjaTrader exports trade data to CSV
2. `scripts/nt2json.py` converts CSV to structured JSON
3. JSON is stored in `src/data/perf.json`
4. Next.js imports and renders the data with Plotly

This architecture allows for:
- Clear separation of concerns
- Easy manual updates via CSV exports
- Interactive visualizations with Plotly
- Static site generation for fast performance

## Deployment

The website is deployed on Vercel, which provides:
- Seamless integration with Next.js
- Automatic deployments from GitHub
- Global CDN for fast access
- SSL encryption

The deployment process is triggered automatically when changes are pushed to the main branch of the GitHub repository.