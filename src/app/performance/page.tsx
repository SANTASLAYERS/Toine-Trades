'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Import Plotly dynamically to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

// Type definition for our performance data
type PerformanceData = {
  equity_curve: {
    dates: string[];
    values: number[];
  };
  metrics: {
    pnl: number;
    sharpe: number;
    max_dd: number;
    win_rate: number;
  };
  trades: Array<{
    'Entry time': string;
    'Exit time': string;
    'Instrument': string;
    'Market pos.': string;
    'Qty': number;
    'Entry price': number;
    'Exit price': number;
    'Profit': number;
  }>;
};

export default function PerformancePage() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/perf.json')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch performance data');
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading performance data:', err);
        setError('Failed to load performance data');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg">Loading performance data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
        <h1 className="text-3xl font-bold mb-6">Performance Metrics</h1>
        <p className="text-red-600 mb-8">
          {error || 'Trading performance data is temporarily unavailable.'}
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">Performance</h1>
      <p className="mb-8 text-gray-700">
        This chart shows the cumulative P&L from live trades, updated daily from real-time trading logs.
      </p>
      
      {/* Equity Curve Plot */}
      <div className="w-full mb-8">
        <Plot
          data={[
            {
              x: data.equity_curve.dates,
              y: data.equity_curve.values,
              type: 'scatter',
              mode: 'lines',
              line: { width: 2, color: '#3B82F6' },
              name: 'Equity Curve',
            },
          ]}
          layout={{
            title: 'Live Equity Curve',
            autosize: true,
            margin: { t: 40, l: 50, r: 30, b: 50 },
            xaxis: { title: 'Time' },
            yaxis: { title: 'Cumulative P&L ($)' },
          }}
          style={{ width: '100%', height: '400px' }}
          config={{ displayModeBar: false }}
        />
      </div>

      {/* Performance Metrics */}
      <div className="bg-blue-50 p-6 rounded-lg max-w-lg mx-auto mb-8">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Performance Summary</h2>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span className="font-medium">Total P&L:</span>
            <span>${data.metrics.pnl.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Sharpe Ratio:</span>
            <span>{data.metrics.sharpe}</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Win Rate:</span>
            <span>{data.metrics.win_rate}%</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Max Drawdown:</span>
            <span>{data.metrics.max_dd}%</span>
          </li>
        </ul>
      </div>
    </section>
  );
}