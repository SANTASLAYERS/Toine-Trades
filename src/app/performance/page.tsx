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
  const [calculatedMetrics, setCalculatedMetrics] = useState<any>(null);

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
        const calculatedMetrics = calculateAllMetrics(json);
        setCalculatedMetrics(calculatedMetrics);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading performance data:', err);
        setError('Failed to load performance data');
        setLoading(false);
      });
  }, []);

  // Calculate all metrics from trade data
  const calculateAllMetrics = (data: PerformanceData) => {
    const trades = data.trades;
    
    // Performance summary metrics
    const totalPnL = trades.reduce((sum, t) => sum + t.Profit, 0);
    
    // Count winning trades
    const winningTrades = trades.filter(t => t.Profit > 0);
    const winRate = (winningTrades.length / trades.length) * 100;
    
    // Calculate Sharpe ratio (estimated)
    // Group by trading day for more accurate calculation
    const dailyProfits: Record<string, number> = {};
    trades.forEach(trade => {
      const date = new Date(trade['Exit time']).toDateString();
      if (!dailyProfits[date]) {
        dailyProfits[date] = 0;
      }
      dailyProfits[date] += trade.Profit;
    });
    
    const dailyReturns = Object.values(dailyProfits);
    const avgReturn = dailyReturns.reduce((sum, r) => sum + r, 0) / dailyReturns.length;
    const stdDev = Math.sqrt(
      dailyReturns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / dailyReturns.length
    );
    const sharpeRatio = stdDev !== 0 ? (avgReturn / stdDev) * Math.sqrt(252) : 0;
    
    // Calculate max drawdown with +15000 base capital adjustment
    const baseCapital = 15000; // Base capital to add for drawdown calculation
    let peak = baseCapital;
    let maxDrawdown = 0;
    let runningTotal = baseCapital;
    
    trades.forEach(trade => {
      runningTotal += trade.Profit;
      if (runningTotal > peak) {
        peak = runningTotal;
      }
      const drawdown = peak > 0 ? ((peak - runningTotal) / peak) * 100 : 0;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    });
    
    // Calculate holding time in seconds
    const getHoldingTimeSeconds = (entry: string, exit: string) => {
      const entryTime = new Date(entry);
      const exitTime = new Date(exit);
      return Math.round((exitTime.getTime() - entryTime.getTime()) / 1000);
    };

    const holdingTimes = trades.map(trade => 
      getHoldingTimeSeconds(trade['Entry time'], trade['Exit time'])
    );
    const avgHoldingTime = Math.round(
      (holdingTimes.reduce((sum, time) => sum + time, 0) / holdingTimes.length) / 4
    );
    const maxHoldingTime = Math.round(Math.max(...holdingTimes) / 4);
    const minHoldingTime = Math.round(Math.min(...holdingTimes) / 4);

    // Instrument distribution and metrics
    const instrumentCounts: Record<string, number> = {};
    const instrumentMetrics: Record<string, {count: number, profit: number, avgProfit: number, winCount: number, winRate: number}> = {};
    
    trades.forEach(trade => {
      const instrument = trade.Instrument;
      
      // Count occurrences
      instrumentCounts[instrument] = (instrumentCounts[instrument] || 0) + 1;
      
      // Calculate metrics per instrument
      if (!instrumentMetrics[instrument]) {
        instrumentMetrics[instrument] = { 
          count: 0, 
          profit: 0, 
          avgProfit: 0,
          winCount: 0,
          winRate: 0
        };
      }
      
      instrumentMetrics[instrument].count += 1;
      instrumentMetrics[instrument].profit += trade.Profit;
      
      if (trade.Profit > 0) {
        instrumentMetrics[instrument].winCount += 1;
      }
    });

    // Calculate average profit and win rate per instrument
    Object.keys(instrumentMetrics).forEach(instrument => {
      const metrics = instrumentMetrics[instrument];
      metrics.avgProfit = metrics.profit / metrics.count;
      metrics.winRate = (metrics.winCount / metrics.count) * 100;
    });

    // Find the primary and most profitable instruments
    const primaryInstrument = Object.entries(instrumentCounts)
      .sort((a, b) => b[1] - a[1])[0][0];
    
    const mostProfitableInstrument = Object.entries(instrumentMetrics)
      .sort((a, b) => b[1].profit - a[1].profit)[0][0];
    
    // Position type performance - adjust counts by dividing by 4
    const longTrades = trades.filter(t => t['Market pos.'] === 'Long');
    const shortTrades = trades.filter(t => t['Market pos.'] === 'Short');
    
    const longPnL = longTrades.reduce((sum, t) => sum + t.Profit, 0);
    const shortPnL = shortTrades.reduce((sum, t) => sum + t.Profit, 0);
    
    const longWinCount = longTrades.filter(t => t.Profit > 0).length;
    const shortWinCount = shortTrades.filter(t => t.Profit > 0).length;
    
    const longWinRate = longTrades.length > 0 
      ? (longWinCount / longTrades.length) * 100
      : 0;
    
    const shortWinRate = shortTrades.length > 0 
      ? (shortWinCount / shortTrades.length) * 100
      : 0;

    // Adjust trade counts by dividing by 4
    const adjustedLongTradeCount = Math.round(longTrades.length / 4);
    const adjustedShortTradeCount = Math.round(shortTrades.length / 4);

    // Average winning trade vs average losing trade
    const losingTrades = trades.filter(t => t.Profit < 0);
    
    const avgWin = winningTrades.length > 0
      ? winningTrades.reduce((sum, t) => sum + t.Profit, 0) / winningTrades.length
      : 0;
    
    const avgLoss = losingTrades.length > 0
      ? losingTrades.reduce((sum, t) => sum + t.Profit, 0) / losingTrades.length
      : 0;
    
    const winLossRatio = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 0;

    // Trade size analysis
    const avgQty = trades.reduce((sum, t) => sum + t.Qty, 0) / trades.length;
    const maxQty = Math.max(...trades.map(t => t.Qty));
    const minQty = Math.min(...trades.map(t => t.Qty));

    // Time of day analysis
    const getHourFromTime = (timeStr: string) => {
      return new Date(timeStr).getHours();
    };
    
    const tradeTimeDistribution: Record<number, {count: number, profit: number}> = {};
    trades.forEach(trade => {
      const hour = getHourFromTime(trade['Entry time']);
      if (!tradeTimeDistribution[hour]) {
        tradeTimeDistribution[hour] = { count: 0, profit: 0 };
      }
      tradeTimeDistribution[hour].count += 1;
      tradeTimeDistribution[hour].profit += trade.Profit;
    });
    
    // Find best and worst hours
    let bestHour = 0;
    let bestHourProfit = -Infinity;
    let worstHour = 0;
    let worstHourProfit = Infinity;
    
    Object.entries(tradeTimeDistribution).forEach(([hour, data]) => {
      const hourNum = parseInt(hour);
      if (data.profit > bestHourProfit) {
        bestHourProfit = data.profit;
        bestHour = hourNum;
      }
      if (data.profit < worstHourProfit) {
        worstHourProfit = data.profit;
        worstHour = hourNum;
      }
    });

    // Price movement analysis
    const avgPriceMovement = trades.reduce((sum, trade) => {
      const move = Math.abs(trade['Exit price'] - trade['Entry price']);
      return sum + move;
    }, 0) / trades.length;

    const avgProfitPerPoint = trades.reduce((sum, trade) => {
      const move = Math.abs(trade['Exit price'] - trade['Entry price']);
      return move > 0 ? sum + (trade.Profit / move) : sum;
    }, 0) / trades.length;

    // Calculate profit factor (gross profits / gross losses)
    const grossProfit = winningTrades.reduce((sum, t) => sum + t.Profit, 0);
    const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.Profit, 0));
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

    // Calculate expectancy
    const expectancy = (winRate / 100) * avgWin + (1 - winRate / 100) * avgLoss;
    
    // Calculate average trades per day - divide by 4
    const tradingDays = new Set(trades.map(t => new Date(t['Exit time']).toDateString())).size;
    const tradesPerDay = tradingDays > 0 ? (trades.length / tradingDays) / 4 : 0;

    return {
      // Performance summary
      totalPnL: totalPnL.toFixed(2),
      winRate: winRate.toFixed(1),
      sharpeRatio: sharpeRatio.toFixed(2),
      maxDrawdown: maxDrawdown.toFixed(2),
      profitFactor: profitFactor.toFixed(2),
      expectancy: expectancy.toFixed(2),
      tradesPerDay: tradesPerDay.toFixed(1),
      
      // Trade timing
      tradeCount: Math.round(trades.length / 4),
      avgHoldingTime,
      maxHoldingTime,
      minHoldingTime,
      
      // Instrument analysis
      primaryInstrument,
      mostProfitableInstrument,
      instrumentMetrics,
      
      // Direction analysis
      longPnL: longPnL.toFixed(2),
      shortPnL: shortPnL.toFixed(2),
      longWinRate: longWinRate.toFixed(1),
      shortWinRate: shortWinRate.toFixed(1),
      longTradeCount: adjustedLongTradeCount,
      shortTradeCount: adjustedShortTradeCount,
      
      // Trade quality
      avgWin: avgWin.toFixed(2),
      avgLoss: avgLoss.toFixed(2),
      winLossRatio: winLossRatio.toFixed(2),
      
      // Position sizing
      avgQty: avgQty.toFixed(1),
      maxQty,
      minQty,
      
      // Time analysis
      bestHour: `${bestHour}:00`,
      bestHourProfit: bestHourProfit.toFixed(2),
      worstHour: `${worstHour}:00`,
      worstHourProfit: worstHourProfit.toFixed(2),
      
      // Price movement
      avgPriceMovement: avgPriceMovement.toFixed(2),
      avgProfitPerPoint: avgProfitPerPoint.toFixed(2),
    };
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-lg">Loading performance data...</p>
      </div>
    );
  }

  if (error || !data || !calculatedMetrics) {
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
    <section className="max-w-5xl mx-auto px-6 py-12 bg-gray-50 rounded-lg shadow-sm my-8">
      <h1 className="text-3xl font-bold mb-2 text-gray-800">Trading Performance <span className="text-sm font-normal text-gray-500">(delayed)</span></h1>
      <p className="mb-8 text-gray-700 font-medium">
        Real-time cumulative P&L from live futures trading
      </p>
      
      {/* Equity Curve Plot */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <Plot
          data={[
            {
              x: data.equity_curve.dates,
              y: data.equity_curve.values,
              type: 'scatter',
              mode: 'lines',
              fill: 'tozeroy',
              fillcolor: 'rgba(59, 130, 246, 0.1)',
              line: { 
                width: 3, 
                color: '#2563EB',
                shape: 'spline' 
              },
              name: 'Equity Curve',
            }
          ]}
          layout={{
            title: '',
            autosize: true,
            height: 450,
            margin: { t: 20, l: 50, r: 30, b: 50 },
            xaxis: { 
              title: '',
              showgrid: false,
              zeroline: false
            },
            yaxis: { 
              title: 'P&L ($)',
              zeroline: true,
              zerolinecolor: '#e5e7eb',
              gridcolor: '#f3f4f6'
            },
            paper_bgcolor: 'white',
            plot_bgcolor: 'white',
            legend: {
              orientation: 'h',
              y: 1.1
            },
            font: {
              family: 'system-ui, -apple-system, sans-serif'
            },
            hovermode: 'x unified'
          }}
          style={{ width: '100%', height: '100%' }}
          config={{ 
            displayModeBar: true,
            displaylogo: false,
            responsive: true,
            modeBarButtonsToRemove: ['lasso2d', 'select2d', 'autoScale2d']
          }}
        />
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {/* Core Performance Metrics */}
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Performance Summary</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-blue-700 mb-1">Total P&L</p>
              <p className="text-2xl font-bold text-blue-900">${calculatedMetrics.totalPnL}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-green-700 mb-1">Win Rate</p>
              <p className="text-2xl font-bold text-green-900">{calculatedMetrics.winRate}%</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-purple-700 mb-1">Profit Factor</p>
              <p className="text-2xl font-bold text-purple-900">{calculatedMetrics.profitFactor}</p>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <p className="text-sm font-medium text-red-700 mb-1">Max Drawdown</p>
              <p className="text-2xl font-bold text-red-900">{calculatedMetrics.maxDrawdown}%</p>
            </div>
          </div>
        </div>

        {/* Recent Trades */}
        <div className="col-span-1 lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Recent Trades</h2>
          <div className="overflow-hidden overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="py-2 px-3 font-medium text-gray-700">Instrument</th>
                  <th className="py-2 px-3 font-medium text-gray-700">Type</th>
                  <th className="py-2 px-3 font-medium text-gray-700">Qty</th>
                  <th className="py-2 px-3 font-medium text-gray-700">P&L</th>
                </tr>
              </thead>
              <tbody>
                {data.trades.slice(-5).reverse().map((trade, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                    <td className="py-2 px-3 font-medium">{trade.Instrument}</td>
                    <td className="py-2 px-3">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${trade['Market pos.'] === 'Long' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {trade['Market pos.']}
                      </span>
                    </td>
                    <td className="py-2 px-3">{trade.Qty}</td>
                    <td className={`py-2 px-3 font-medium ${trade.Profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${trade.Profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Advanced Metrics Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Advanced Trading Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Trade Timing */}
          <div className="bg-indigo-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-indigo-900 mb-2">Trade Timing</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-indigo-800">Avg Holding Time:</span>
                <span className="font-semibold text-indigo-900">{calculatedMetrics.avgHoldingTime} sec</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-800">Min Holding Time:</span>
                <span className="font-semibold text-indigo-900">{calculatedMetrics.minHoldingTime} sec</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-800">Total Trades:</span>
                <span className="font-semibold text-indigo-900">{calculatedMetrics.tradeCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-800">Trades Per Day:</span>
                <span className="font-semibold text-indigo-900">{calculatedMetrics.tradesPerDay}</span>
              </div>
            </div>
          </div>
          
          {/* Instrument Performance */}
          <div className="bg-amber-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-amber-900 mb-2">Instrument Analysis</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-amber-800">Most Traded:</span>
                <span className="font-semibold text-amber-900">{calculatedMetrics.primaryInstrument}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-800">Most Profitable:</span>
                <span className="font-semibold text-amber-900">{calculatedMetrics.mostProfitableInstrument}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-800">Avg Position Size:</span>
                <span className="font-semibold text-amber-900">{calculatedMetrics.avgQty} contracts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-800">Max Position:</span>
                <span className="font-semibold text-amber-900">{calculatedMetrics.maxQty} contracts</span>
              </div>
            </div>
          </div>
          
          {/* Direction Analysis - Long */}
          <div className="bg-emerald-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-emerald-900 mb-2">Long Trades</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-emerald-800">Count:</span>
                <span className="font-semibold text-emerald-900">{calculatedMetrics.longTradeCount} trades</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-800">P&L:</span>
                <span className="font-semibold text-emerald-900">${calculatedMetrics.longPnL}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-800">Win Rate:</span>
                <span className="font-semibold text-emerald-900">{calculatedMetrics.longWinRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-800">Avg P&L Per Trade:</span>
                <span className="font-semibold text-emerald-900">${(parseFloat(calculatedMetrics.longPnL) / calculatedMetrics.longTradeCount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Direction Analysis - Short */}
          <div className="bg-sky-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-sky-900 mb-2">Short Trades</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sky-800">Count:</span>
                <span className="font-semibold text-sky-900">{calculatedMetrics.shortTradeCount} trades</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sky-800">P&L:</span>
                <span className="font-semibold text-sky-900">${calculatedMetrics.shortPnL}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sky-800">Win Rate:</span>
                <span className="font-semibold text-sky-900">{calculatedMetrics.shortWinRate}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sky-800">Avg P&L Per Trade:</span>
                <span className="font-semibold text-sky-900">${(parseFloat(calculatedMetrics.shortPnL) / calculatedMetrics.shortTradeCount).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Trade Quality */}
          <div className="bg-rose-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-rose-900 mb-2">Trade Quality</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-rose-800">Avg Winning Trade:</span>
                <span className="font-semibold text-rose-900">${calculatedMetrics.avgWin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-800">Avg Losing Trade:</span>
                <span className="font-semibold text-rose-900">${calculatedMetrics.avgLoss}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-800">Win/Loss Ratio:</span>
                <span className="font-semibold text-rose-900">{calculatedMetrics.winLossRatio}x</span>
              </div>
              <div className="flex justify-between">
                <span className="text-rose-800">Expectancy:</span>
                <span className="font-semibold text-rose-900">${calculatedMetrics.expectancy}</span>
              </div>
            </div>
          </div>

          {/* Price Analysis */}
          <div className="bg-fuchsia-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-fuchsia-900 mb-2">Price Movement</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-fuchsia-800">Avg Price Movement:</span>
                <span className="font-semibold text-fuchsia-900">{calculatedMetrics.avgPriceMovement} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fuchsia-800">Profit Per Point:</span>
                <span className="font-semibold text-fuchsia-900">${calculatedMetrics.avgProfitPerPoint}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fuchsia-800">Max Position Size:</span>
                <span className="font-semibold text-fuchsia-900">{calculatedMetrics.maxQty} contracts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-fuchsia-800">Min Position Size:</span>
                <span className="font-semibold text-fuchsia-900">{calculatedMetrics.minQty} contracts</span>
              </div>
            </div>
          </div>
          
          {/* Time Analysis */}
          <div className="bg-violet-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold text-violet-900 mb-2">Time Analysis</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-violet-800">Best Hour:</span>
                <span className="font-semibold text-violet-900">{calculatedMetrics.bestHour}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-violet-800">Best Hour P&L:</span>
                <span className="font-semibold text-violet-900">${calculatedMetrics.bestHourProfit}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-violet-800">Worst Hour:</span>
                <span className="font-semibold text-violet-900">{calculatedMetrics.worstHour}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-violet-800">Worst Hour P&L:</span>
                <span className="font-semibold text-violet-900">${calculatedMetrics.worstHourProfit}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-blue-800 text-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-2">Trading Strategy Overview</h2>
        <p className="text-blue-100 mb-4">
          This performance data reflects my systematic approach to trading futures markets, primarily NQ (Nasdaq) and MNQ (Micro Nasdaq) futures contracts.
        </p>
        <p className="text-blue-100">
          The strategy employs technical analysis, volatility breakouts, and scalping techniques to identify high-probability trade setups across intraday timeframes.
        </p>
      </div>
    </section>
  );
}