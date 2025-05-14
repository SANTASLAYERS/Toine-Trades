'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console in development
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-6">
      <div className="bg-red-50 p-6 rounded-lg shadow-md max-w-lg w-full">
        <h2 className="text-2xl font-bold text-red-700 mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but we encountered an error while loading this page.
        </p>
        <div className="bg-white p-4 rounded mb-6 text-sm font-mono overflow-x-auto">
          <p className="text-red-500">{error.message || "Unknown error"}</p>
          {error.digest && <p className="text-gray-500 mt-2">Error ID: {error.digest}</p>}
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => window.location.href = '/'}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded"
          >
            Go Home
          </button>
          <button
            onClick={() => reset()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}