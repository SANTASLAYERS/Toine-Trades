"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import type { NextPage } from "next";

// Import performance data
import performanceData from "@/data/perf.json";

// Import Plotly dynamically (client-side only)
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const PerformancePage: NextPage = () => {
  // State for trade table sorting
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showTrades, setShowTrades] = useState(false);

  // Get data from the JSON file
  const { equity_curve, metrics, trades } = performanceData;

  // Define trade type
  type Trade = {
    [key: string]: string | number;
    "Entry time": string;
    "Exit time": string;
    "Instrument": string;
    "Market pos.": string;
    "Qty": number;
    "Entry price": number;
    "Exit price": number;
    "Profit": number;
  };

  // Sort trades if needed
  const sortedTrades = [...trades] as Trade[];
  if (sortField) {
    sortedTrades.sort((a: Trade, b: Trade) => {
      if (a[sortField] < b[sortField]) return sortDirection === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }

  // Handle column click for sorting
  const handleColumnClick = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

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
              {metrics.max_dd.toFixed(2)}%
            </p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-purple-700">Win Rate</h3>
            <p className="text-2xl font-bold text-purple-900">
              {metrics.win_rate.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Equity Curve Chart */}
        <div className="w-full h-96 bg-gray-50 rounded-lg p-4">
          <Plot
            data={[
              {
                x: equity_curve.dates,
                y: equity_curve.values,
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
                {sortedTrades.map((trade, index) => (
                  <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
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
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                        parseFloat(trade.Profit.toString()) >= 0
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      ${parseFloat(trade.Profit.toString()).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerformancePage;