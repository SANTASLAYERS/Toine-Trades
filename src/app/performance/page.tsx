'use client';

// This is a simplified performance page to help troubleshoot deployment issues
export default function PerformancePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-8">
      <h1 className="text-3xl font-bold mb-6">Performance Metrics</h1>
      <p className="text-gray-600 mb-8">
        Trading performance data is temporarily unavailable during site maintenance.
      </p>
      <div className="bg-blue-50 p-6 rounded-lg max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-blue-800">Recent Performance Summary</h2>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span className="font-medium">Total P&L:</span>
            <span>$6,972.50</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Sharpe Ratio:</span>
            <span>2.75</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Win Rate:</span>
            <span>67.5%</span>
          </li>
          <li className="flex justify-between">
            <span className="font-medium">Max Drawdown:</span>
            <span>8.54%</span>
          </li>
        </ul>
      </div>
      <p className="mt-8 text-sm text-gray-500">
        Full interactive performance dashboard will be available soon.
      </p>
    </div>
  );
}