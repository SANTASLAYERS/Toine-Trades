import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col space-y-8">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Antoine Pangas — Algorithmic Trading Portfolio</h1>
          <p className="text-xl mb-6">
            Short-term mean reversion strategies powered by real-time ML modeling, level-2 data, and automated execution.
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

      <section className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">About Me</h2>
          <p className="text-gray-600 mb-4">
            I&apos;m a quantitative developer and machine learning engineer focused on short-term trading in futures markets. 
            My current system is a production-grade mean reversion strategy running live on micro e-mini futures (MNQ, MES) 
            via NinjaTrader.
          </p>
          <p className="text-gray-600 mb-4">
            The strategy combines real-time level-2 feature engineering with independently trained entry and exit models. 
            It&apos;s deployed on a Heroku-based backend and designed for modular research, efficient backtesting, 
            and live trading under tight latency constraints.
          </p>
          <div className="flex items-center mt-6">
            <div className="mr-8">
              <p className="text-sm text-gray-500">Education</p>
              <p className="font-medium">B.S.E. Computer Science, University of Michigan, 2024</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">Washington, DC</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Skills & Tools</h2>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Languages</h3>
              <p className="text-gray-600 text-sm">Python, SQL, C++, TypeScript</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">ML/Modeling</h3>
              <p className="text-gray-600 text-sm">XGBoost, PyTorch, TensorFlow, scikit-learn, LightGBM, CatBoost, Optuna</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Data Processing</h3>
              <p className="text-gray-600 text-sm">Pandas, NumPy, Dask, Vaex, Power BI, Apache Spark</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Infrastructure</h3>
              <p className="text-gray-600 text-sm">Heroku, Git, Docker, REST APIs, FastAPI, Celery, PostgreSQL</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-1">Trading Systems</h3>
              <p className="text-gray-600 text-sm">NinjaTrader, IB API, Polygon.io, Backtrader, Zipline, Futures/Options, Risk Management</p>
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
        </div>
      </section>

      <section className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Mean Reversion Futures Strategy</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 text-gray-700">Overview</h3>
          <p className="text-gray-600 mb-2">
            A high-frequency, short-term mean reversion system for micro e-mini futures.
            90% of trades close within 10 seconds to 5 minutes, targeting microstructure inefficiencies around temporary price dislocations.
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2 text-gray-700">Core Design</h3>
          
          <div className="mb-4">
            <h4 className="font-bold text-gray-700">Feature Pipeline:</h4>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Real-time level-2 metrics: bid/ask depth ratios, liquidity voids, imbalance shifts</li>
              <li>Rolling statistical indicators (adaptive z-scores, local trend reversals, entropy)</li>
              <li>PCA-reduced latent states to compress recent order book windows</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-bold text-gray-700">Modeling Structure:</h4>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Entry model: Gradient-boosted classifier trained on high-confidence reversal patterns</li>
              <li>Exit model: Regression model predicting optimal hold time adjusted for volatility</li>
              <li className="mt-2">Custom loss for exit model:
                <div className="my-2 text-center italic">
                  Loss = (r<sub>t</sub>/σ<sub>t</sub>)<sup>2</sup> + λ·Δt
                </div>
                <div className="text-sm">where r<sub>t</sub> is realized return, σ<sub>t</sub> is local volatility, and Δt is trade duration</div>
              </li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-bold text-gray-700">Risk Management:</h4>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Volatility-scaled position sizing</li>
              <li>Dynamic stop-loss models informed by intra-trade volatility and slippage clusters</li>
              <li>Real-time throttling during equity drawdowns or poor fill environments</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-bold text-gray-700">Execution Stack:</h4>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Signal generation hosted on Heroku</li>
              <li>Custom order management logic bridged into NinjaTrader</li>
              <li>Instant cancel/replace handling with basic latency profiling</li>
            </ul>
          </div>
          
          <div className="mb-4">
            <h4 className="font-bold text-gray-700">Analytics & Monitoring:</h4>
            <ul className="list-disc pl-6 text-gray-600">
              <li>Daily JSON logs rendered into QuantStats tear sheets</li>
              <li>Equity curves, PnL stats, Sharpe, win rate, drawdowns</li>
              <li>Auto-refreshed performance dashboard served from static site</li>
            </ul>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 text-gray-700">Performance</h3>
          <p className="text-gray-600 mb-2">
            Live deployment since April 2025. The <Link href="/performance" className="text-blue-600 hover:underline">Performance</Link> page 
            displays real trade data: equity curve, Sharpe ratio, daily PnL, drawdowns, and trade logs—refreshed daily from live CSV exports.
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 text-gray-700">Development Process</h3>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Market hypothesis & event labeling</li>
            <li>Feature engineering and model iteration using walk-forward cross-validation</li>
            <li>Execution-aware backtesting with slippage, latency, and fee modeling</li>
            <li>Paper trading verification</li>
            <li>Live deployment with progressive capital scaling</li>
            <li>Ongoing performance monitoring and model refinement</li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-bold mb-2 text-gray-700">Roadmap</h3>
          <ul className="list-disc pl-6 text-gray-600">
            <li>Extend strategy to additional tickers (CL, RTY, NQ options)</li>
            <li>Integrate Gaussian HMM regime segmentation</li>
            <li>Add stop refinement via Q-learning or DDPG</li>
            <li>Automate retraining and monitor model drift on feature stability</li>
          </ul>
        </div>
      </section>
    </div>
  );
}