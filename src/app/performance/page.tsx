'use client';

// This tells Next.js that this page should be excluded from static generation
// By returning an empty array, we're saying there are no static params for this page
export const generateStaticParams = () => [];

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import type { NextPage } from "next";
import Papa from 'papaparse';

// Import Plotly dynamically with explicit SSR: false flag
const Plot = dynamic(() => import("react-plotly.js"), {
  ssr: false,
  loading: () => <div className="w-full h-96 bg-gray-100 flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
});

// Define trade type
type Trade = {
  'Trade number': string;
  'Instrument': string;
  'Market pos.': string;
  'Qty': string;
  'Entry price': string;
  'Exit price': string;
  'Entry time': string;
  'Exit time': string;
  'Profit': string;
  'Cum. net profit': string;
  'Commission': string;
  [key: string]: string;
};

type PerformanceData = {
  trades: Trade[];
  equityCurve: {
    dates: string[];
    values: number[];
  };
  metrics: {
    pnl: number;
    sharpe: number;
    maxDrawdown: number;
    winRate: number;
  };
};

const PerformancePage: NextPage = () => {
  // State for trade table sorting
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showTrades, setShowTrades] = useState(false);
  const [performanceData, setPerformanceData] = useState<PerformanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        try {
          // First try the API route
          const response = await fetch('/api/trading-data');
          const data = await response.json();

          if (data.success) {
            processTradeData(data.csvData);
            return;
          } else {
            console.error("API route failed:", data.error);
          }
        } catch (apiError) {
          console.error("API route error:", apiError);
        }

        try {
          // Fallback to direct fetch if API fails
          const directResponse = await fetch('/data/NinjaTrader-sample.csv');
          if (directResponse.ok) {
            const csvData = await directResponse.text();
            processTradeData(csvData);
            return;
          }
        } catch (directError) {
          console.error("Direct fetch error:", directError);
        }

        // If all else fails, use the data.json as last resort
        try {
          const jsonResponse = await fetch('/data/perf.json');
          if (jsonResponse.ok) {
            const jsonData = await jsonResponse.json();
            // Process the data directly from JSON
            setPerformanceData({
              trades: jsonData.trades || [],
              equityCurve: {
                dates: jsonData.equity_curve?.dates || [],
                values: jsonData.equity_curve?.values || [],
              },
              metrics: {
                pnl: jsonData.metrics?.pnl || 0,
                sharpe: jsonData.metrics?.sharpe || 0,
                maxDrawdown: jsonData.metrics?.max_dd || 0,
                winRate: jsonData.metrics?.win_rate || 0,
              }
            });
            return;
          }
        } catch (jsonError) {
          console.error("JSON fallback error:", jsonError);
        }

        console.error("Failed to load trading data from all sources");
      } catch (error) {
        console.error("Error in data fetching:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processTradeData = (csvData: string) => {
    // Parse CSV data
    const parsedData = Papa.parse<Trade>(csvData, {
      header: true,
      skipEmptyLines: true,
    });

    if (parsedData.errors.length > 0) {
      console.error("CSV parsing errors:", parsedData.errors);
      return;
    }

    const trades = parsedData.data;
    
    // Extract date and equity data for the chart
    const dates = trades.map(trade => trade['Exit time']);
    
    // Clean profit values (remove $ and handle parentheses for negative values)
    const cleanProfitValue = (value: string): number => {
      if (!value) return 0;
      
      // Remove $ and commas
      let cleanValue = value.replace(/[$,\s]/g, '');
      
      // Handle parentheses for negative values
      if (cleanValue.startsWith('(') && cleanValue.endsWith(')')) {
        cleanValue = '-' + cleanValue.slice(1, -1);
      }
      
      return parseFloat(cleanValue) || 0;
    };

    // Get cumulative equity values
    const equityValues = trades.map(trade => 
      cleanProfitValue(trade['Cum. net profit'])
    );

    // Calculate metrics
    const profits = trades.map(trade => cleanProfitValue(trade['Profit']));
    const totalPnL = equityValues.length > 0 ? equityValues[equityValues.length - 1] : 0;
    const winningTrades = profits.filter(p => p > 0).length;
    const winRate = trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;
    
    // Calculate max drawdown
    let maxDrawdown = 0;
    let peak = equityValues[0] || 0;
    
    for (const value of equityValues) {
      if (value > peak) {
        peak = value;
      }
      const drawdown = ((peak - value) / peak) * 100;
      if (drawdown > maxDrawdown) {
        maxDrawdown = drawdown;
      }
    }
    
    // Simple Sharpe ratio calculation (very simplified)
    const dailyReturns: number[] = [];
    for (let i = 1; i < equityValues.length; i++) {
      const dailyReturn = (equityValues[i] - equityValues[i - 1]) / 100000; // Assuming 100k notional
      dailyReturns.push(dailyReturn);
    }
    
    const meanReturn = dailyReturns.reduce((sum, value) => sum + value, 0) / dailyReturns.length;
    const stdDev = Math.sqrt(
      dailyReturns.reduce((sum, value) => sum + Math.pow(value - meanReturn, 2), 0) / dailyReturns.length
    );
    
    const sharpe = stdDev > 0 ? (meanReturn / stdDev) * Math.sqrt(252) : 0; // Annualized
    
    setPerformanceData({
      trades,
      equityCurve: {
        dates,
        values: equityValues,
      },
      metrics: {
        pnl: totalPnL,
        sharpe,
        maxDrawdown,
        winRate,
      }
    });
  };

  // Handle column click for sorting
  const handleColumnClick = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Sort trades if needed
  const getSortedTrades = () => {
    if (!performanceData) return [];
    
    const sortedTrades = [...performanceData.trades];
    
    if (sortField) {
      sortedTrades.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        // Handle numeric sorting for price and profit columns
        if (['Entry price', 'Exit price', 'Profit', 'Cum. net profit'].includes(sortField)) {
          const aNum = parseFloat(aValue.replace(/[$,()]/g, '')) || 0;
          const bNum = parseFloat(bValue.replace(/[$,()]/g, '')) || 0;
          return sortDirection === "asc" ? aNum - bNum : bNum - aNum;
        }
        
        // String comparison for other fields
        if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
        if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
        return 0;
      });
    }
    
    return sortedTrades;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading trading data...</div>
      </div>
    );
  }

  if (!performanceData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-red-600">
          Failed to load trading data. Please check the console for errors.
        </div>
      </div>
    );
  }

  const { equityCurve, metrics } = performanceData;
  const sortedTrades = getSortedTrades();

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Trading Performance</h1>
        <p className="text-gray-600 mb-6">
          Real-time performance metrics from actual trading results
        </p>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-blue-700">Total P&L</h3>
            <p className="text-2xl font-bold text-blue-900">
              ${metrics.pnl.toLocaleString()}
            </p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-green-700">Sharpe Ratio</h3>
            <p className="text-2xl font-bold text-green-900">
              {metrics.sharpe.toFixed(2)}
            </p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-red-700">Max Drawdown</h3>
            <p className="text-2xl font-bold text-red-900">
              {metrics.maxDrawdown.toFixed(2)}%
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-700">Win Rate</h3>
            <p className="text-2xl font-bold text-purple-900">
              {metrics.winRate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Equity Curve Chart */}
        <div className="w-full h-96 bg-gray-50 rounded-lg p-4">
          <Plot
            data={[
              {
                x: equityCurve.dates,
                y: equityCurve.values,
                type: "scatter",
                mode: "lines",
                marker: { color: "rgb(59, 130, 246)" },
                name: "Equity",
              },
            ]}
            layout={{
              title: "Equity Curve",
              autosize: true,
              margin: { l: 50, r: 50, b: 50, t: 50, pad: 4 },
              paper_bgcolor: "rgba(0,0,0,0)",
              plot_bgcolor: "rgba(0,0,0,0)",
              xaxis: {
                title: "Date",
                showgrid: false,
              },
              yaxis: {
                title: "Equity ($)",
                showgrid: true,
                gridcolor: "rgba(0,0,0,0.1)",
              },
            }}
            useResizeHandler={true}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </div>

      {/* Trades Table - Collapsible */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Trades</h2>
          <button
            onClick={() => setShowTrades(!showTrades)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            {showTrades ? "Hide Trades" : "Show Trades"}
          </button>
        </div>

        {showTrades && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    onClick={() => handleColumnClick("Trade number")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    #
                    {sortField === "Trade number" && (
                      <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleColumnClick("Entry time")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Entry Time
                    {sortField === "Entry time" && (
                      <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleColumnClick("Exit time")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Exit Time
                    {sortField === "Exit time" && (
                      <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleColumnClick("Instrument")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Instrument
                    {sortField === "Instrument" && (
                      <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleColumnClick("Market pos.")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Direction
                    {sortField === "Market pos." && (
                      <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleColumnClick("Qty")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Qty
                    {sortField === "Qty" && (
                      <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleColumnClick("Entry price")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Entry Price
                    {sortField === "Entry price" && (
                      <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleColumnClick("Exit price")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Exit Price
                    {sortField === "Exit price" && (
                      <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                  <th
                    scope="col"
                    onClick={() => handleColumnClick("Profit")}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  >
                    Profit
                    {sortField === "Profit" && (
                      <span>{sortDirection === "asc" ? " ↑" : " ↓"}</span>
                    )}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTrades.map((trade, index) => {
                  // Parse profit value for coloring
                  const profitValue = trade.Profit || "";
                  const isNegative = profitValue.includes('(');
                  const profitClass = isNegative ? "text-red-700" : "text-green-700";

                  return (
                    <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trade["Trade number"]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trade["Entry time"]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trade["Exit time"]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trade.Instrument}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            trade["Market pos."] === "Long"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {trade["Market pos."]}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trade.Qty}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trade["Entry price"]}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {trade["Exit price"]}
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${profitClass}`}>
                        {trade.Profit}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformancePage;