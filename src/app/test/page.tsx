'use client';

export default function TestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p className="mb-4">This is a test page to diagnose routing issues on Vercel.</p>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <h2 className="font-bold mb-2">Navigation Test Links:</h2>
        <ul className="list-disc pl-6">
          <li><a href="/" className="text-blue-600 hover:underline">Home</a></li>
          <li><a href="/projects" className="text-blue-600 hover:underline">Projects</a></li>
          <li><a href="/performance" className="text-blue-600 hover:underline">Performance</a></li>
        </ul>
      </div>
      
      <div className="bg-green-50 p-4 rounded-lg mb-4">
        <h2 className="font-bold mb-2">API Test:</h2>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            try {
              const response = await fetch('/api/trading-data');
              const data = await response.json();
              alert(JSON.stringify(data, null, 2));
            } catch (error) {
              alert(`API Test Error: ${error instanceof Error ? error.message : String(error)}`);
            }
          }}
        >
          Test API Endpoint
        </button>
      </div>
      
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h2 className="font-bold mb-2">Data Files Test:</h2>
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={async () => {
            try {
              const response = await fetch('/data/NinjaTrader-sample.csv');
              const text = await response.text();
              alert(`CSV File Response: Status ${response.status}\nContent (first 100 chars): ${text.substring(0, 100)}...`);
            } catch (error) {
              alert(`CSV Test Error: ${error instanceof Error ? error.message : String(error)}`);
            }
          }}
        >
          Test CSV File
        </button>
        
        <button 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={async () => {
            try {
              const response = await fetch('/data/perf.json');
              const data = await response.json();
              alert(`JSON File Response: Status ${response.status}\nContent: ${JSON.stringify(data.metrics, null, 2)}`);
            } catch (error) {
              alert(`JSON Test Error: ${error instanceof Error ? error.message : String(error)}`);
            }
          }}
        >
          Test JSON File
        </button>
      </div>
    </div>
  );
}