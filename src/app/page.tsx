'use client';

// Set nodejs runtime to avoid Edge compatibility issues
export const runtime = 'nodejs';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col space-y-8">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Antoine Pangas — Algorithmic Trading Portfolio</h1>
          <p className="text-xl mb-6">
            Short-term mean reversion strategies powered by ML, level-2 data, and real-time execution.
          </p>
          <div className="flex space-x-4">
            <Link 
              href="/projects" 
              className="bg-white text-blue-600 hover:bg-blue-50 px-5 py-2 rounded-md font-medium transition-colors"
            >
              View Project
            </Link>
            <Link
              href="/performance"
              className="bg-transparent border border-white hover:bg-white/10 px-5 py-2 rounded-md font-medium transition-colors"
            >
              See Performance
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">About Me</h2>
        <p className="text-gray-600 mb-6">
          I'm a quantitative developer and machine learning engineer based in Washington, DC. 
          I build high-frequency trading systems for futures markets, focusing on mean reversion and risk-managed execution. 
          My current system runs live on MNQ and MES micro e-minis, leveraging level-2 data and custom-trained models for short-duration trades.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Education</dt>
              <dd className="text-gray-800">B.S.E. Computer Science, University of Michigan (2024)</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="text-gray-800">Washington, DC</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Currently Running</dt>
              <dd className="text-gray-800">Live mean reversion algo on NinjaTrader (since Apr 2025)</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Skills & Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Languages</h3>
            <p className="text-gray-600 text-sm">Python, SQL, C++, TypeScript</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">ML/Modeling</h3>
            <p className="text-gray-600 text-sm">XGBoost, PyTorch, TensorFlow, scikit-learn, LightGBM, CatBoost, Optuna</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Data Processing</h3>
            <p className="text-gray-600 text-sm">Pandas, NumPy, Dask, Vaex, Power BI, Apache Spark</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Infrastructure</h3>
            <p className="text-gray-600 text-sm">Heroku, Git, Docker, REST APIs, FastAPI, Celery, PostgreSQL</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Trading Systems</h3>
            <p className="text-gray-600 text-sm">NinjaTrader, IB API, Polygon.io, Backtrader, Zipline, Futures/Options, Risk Management</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2">Monitoring</h3>
            <p className="text-gray-600 text-sm">QuantStats, Custom dashboards, Alerting systems, Performance metrics</p>
          </div>
        </div>
        <div className="flex mt-6 space-x-4">
          <a 
            href="https://github.com/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            GitHub
          </a>
          <a 
            href="https://linkedin.com/in/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}