'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col space-y-10">
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

      <section className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">About Me</h2>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          I'm a quantitative developer and machine learning engineer based in Washington, DC. 
          My work focuses on developing high-frequency trading systems for futures markets, with an
          emphasis on mean reversion strategies and risk-managed execution. Currently, I maintain
          a live trading system on MNQ and MES micro e-minis that leverages level-2 market data and 
          proprietary prediction models to capture short-duration price inefficiencies.
        </p>

        <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 my-6">
          My approach combines rigorous statistical analysis with machine learning to identify temporary 
          market dislocations while maintaining strict risk parameters.
        </blockquote>

        <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Education</dt>
              <dd className="text-gray-800">B.S.E. Computer Science, University of Michigan (2024)</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Location</dt>
              <dd className="text-gray-800">Washington, DC</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">Current System</dt>
              <dd className="text-gray-800">Live mean reversion algorithm on NinjaTrader (since Apr 2025)</dd>
            </div>
          </dl>
        </div>
      </section>

      <section className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-5 text-gray-800">Technical Expertise</h2>
        
        <p className="text-gray-700 mb-6 leading-relaxed">
          My technical stack is built around production-grade quantitative trading systems, 
          with emphasis on real-time data processing, statistical modeling, and low-latency execution.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <h3 className="font-medium text-gray-800 mb-2 text-lg">Languages</h3>
            <p className="text-gray-600">Python, SQL, C++, TypeScript</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2 text-lg">ML/Modeling</h3>
            <p className="text-gray-600">XGBoost, PyTorch, TensorFlow, scikit-learn, Optuna</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2 text-lg">Data Processing</h3>
            <p className="text-gray-600">Pandas, NumPy, Dask, Vaex, Apache Spark</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2 text-lg">Infrastructure</h3>
            <p className="text-gray-600">Heroku, Git, Docker, REST APIs, FastAPI</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2 text-lg">Trading Systems</h3>
            <p className="text-gray-600">NinjaTrader, IB API, Polygon.io, Futures/Options</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-800 mb-2 text-lg">Monitoring</h3>
            <p className="text-gray-600">QuantStats, Custom dashboards, Performance metrics</p>
          </div>
        </div>
        
        <div className="flex mt-8 space-x-6">
          <a 
            href="https://github.com/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
          >
            GitHub Profile
          </a>
          <a 
            href="https://linkedin.com/in/yourusername" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 transition-colors text-sm"
          >
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}