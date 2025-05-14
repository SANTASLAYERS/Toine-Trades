'use client';

// Client component for styled-jsx and other client-side features

// Since we're in a client component now, we can't use metadata exports
// We'll need to add a separate layout for this page if we want custom metadata

export default function ProjectsPage() {
  // Generate unique IDs for the gradient animation
  const gradientId = "gradient-" + Math.random().toString(36).substring(2, 9);
  
  return (
    <div>
      {/* Add SVG definition for gradient animation */}
      <svg width="0" height="0" className="hidden">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4f46e5">
              <animate attributeName="stop-color" 
                values="#4f46e5; #3b82f6; #8b5cf6; #4f46e5" 
                dur="15s" 
                repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#3b82f6">
              <animate attributeName="stop-color" 
                values="#3b82f6; #8b5cf6; #4f46e5; #3b82f6" 
                dur="15s" 
                repeatCount="indefinite" />
            </stop>
          </linearGradient>
        </defs>
      </svg>
      
      <article className="prose lg:prose-xl max-w-none text-gray-100">
        <header className="relative">
          <div className="absolute -top-8 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
          <h1 className="text-4xl font-bold mb-8 pb-3 relative">
            Mean Reversion Trading System
            <span className="absolute bottom-0 left-0 w-32 h-0.5 bg-blue-600"></span>
          </h1>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">System Architecture</h2>
          
          <p className="text-gray-300 mb-5 leading-relaxed">
            This trading system implements a short-term mean reversion strategy targeting price dislocations in 
            micro e-mini futures markets. The architecture prioritizes rapid signal generation, precise execution timing, 
            and robust risk controls—all critical for capturing fleeting market inefficiencies that typically
            resolve within seconds to minutes.
          </p>
          
          <blockquote className="border-l-4 border-indigo-500 pl-4 italic text-blue-300 my-6 bg-gray-800/30 p-3 rounded-r">
            Over 90% of trades complete within 10 seconds to 5 minutes, requiring a system architecture 
            optimized for low-latency decision making and execution.
          </blockquote>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white group">
            Core Components
            <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-blue-400 font-light">⚙️</span>
          </h2>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-blue-300">Feature Pipeline</h3>
            <p className="text-gray-300 mb-4">
              The feature pipeline ingests real-time market data, transforms it into predictive signals, 
              and delivers these to the model stack with minimal latency.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong className="text-blue-200">Level-2 Data Processing:</strong> Real-time analysis of orderbook imbalance, 
              spread volatility, and depth distribution patterns</li>
              <li><strong className="text-blue-200">Statistical Feature Generation:</strong> Calculation of adaptive z-scores, 
              rolling volatility metrics, and momentum oscillators calibrated to short timeframes</li>
              <li><strong className="text-blue-200">Dimensional Reduction:</strong> PCA-based compression of order book state vectors 
              to capture essential microstructure dynamics while reducing noise</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-blue-300">Model Architecture</h3>
            <p className="text-gray-300 mb-4">
              The system employs a dual-model approach, separating entry signal generation from exit timing 
              optimization to achieve greater specialization.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong className="text-blue-200">Entry Model:</strong> Gradient-boosted classifier trained specifically on 
              high-confidence reversal patterns identified through historical analysis</li>
              <li><strong className="text-blue-200">Exit Model:</strong> Regression-based approach optimizing for risk-adjusted returns 
              rather than absolute profit, using a custom loss function:
              <div className="my-4 text-center font-mono text-white">
                Loss = (r<sub>t</sub>/σ<sub>t</sub>)<sup>2</sup> + λ·Δt
              </div>
              <div className="text-sm text-gray-400 mb-2">
                Where r<sub>t</sub> represents realized return, σ<sub>t</sub> is local volatility, 
                and Δt is trade duration. This formulation balances profit capture against time exposure.
              </div>
              </li>
              <li><strong className="text-blue-200">Market Regime Detection:</strong> Gaussian Hidden Markov Models identify latent
              market states, allowing for dynamic parameter adjustments based on prevailing conditions</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-blue-300">Risk Management Framework</h3>
            <p className="text-gray-300 mb-4">
              The risk framework operates at multiple time scales, from trade-level stop placement 
              to system-wide position sizing and drawdown controls.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong className="text-blue-200">Position Sizing:</strong> Dynamic allocation based on recent volatility measurements,
              scaling exposure inversely with market turbulence</li>
              <li><strong className="text-blue-200">Stop-Loss Mechanism:</strong> Adaptive stops calculated from intrabar volatility patterns 
              and historical slippage distribution analysis</li>
              <li><strong className="text-blue-200">System Throttling:</strong> Automated reduction in trade frequency and size 
              during drawdown periods or degraded execution conditions</li>
            </ul>
          </div>
          
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-3 text-blue-300">Execution Infrastructure</h3>
            <p className="text-gray-300 mb-4">
              The execution layer bridges the gap between signal generation and market interaction,
              optimizing for minimal latency and slippage.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-300">
              <li><strong className="text-blue-200">Signal Generation:</strong> Hosted on Heroku for reliable cloud compute with 
              consistent performance characteristics</li>
              <li><strong className="text-blue-200">Order Management:</strong> Custom interface layer connecting to NinjaTrader's API 
              with comprehensive error handling and retry logic</li>
              <li><strong className="text-blue-200">Execution Optimization:</strong> Latency-aware cancel/replace functionality with 
              monitoring to identify and adapt to varying market conditions</li>
            </ul>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">Development Methodology</h2>
          <p className="text-gray-300 mb-5">
            The development process follows a structured path from hypothesis formation to live deployment,
            with each stage building confidence in the strategy's robustness.
          </p>
          <ol className="list-decimal pl-6 space-y-3 text-gray-300">
            <li><strong className="text-blue-200">Hypothesis Formulation:</strong> Identification of potential market inefficiencies through 
            statistical analysis and market microstructure research</li>
            <li><strong className="text-blue-200">Feature Engineering:</strong> Development of signal generators capturing the identified 
            inefficiencies with appropriate normalization and preprocessing</li>
            <li><strong className="text-blue-200">Model Training and Validation:</strong> Walk-forward cross-validation with strict attention 
            to preventing lookahead bias and overfitting</li>
            <li><strong className="text-blue-200">Backtesting:</strong> Realistic simulation incorporating execution costs, slippage models, 
            and adverse selection effects</li>
            <li><strong className="text-blue-200">Paper Trading:</strong> Live market verification without capital deployment to measure 
            performance against expectations</li>
            <li><strong className="text-blue-200">Phased Deployment:</strong> Gradual scaling of capital allocation based on realized 
            performance metrics and drawdown characteristics</li>
            <li><strong className="text-blue-200">Continuous Monitoring:</strong> Ongoing assessment of strategy health, market regime shifts, 
            and potential model drift</li>
          </ol>
        </section>

        <section className="mb-12 relative">
          {/* Cool feature: Interactive hover cards */}
          <h2 className="text-2xl font-bold mb-6 text-white">Technical Implementation</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/50 hover:bg-gray-800/70 p-5 rounded-lg border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-900/20 hover:-translate-y-1">
              <h3 className="text-lg font-semibold mb-2 text-blue-300">Languages</h3>
              <p className="text-gray-300">Python for data processing and modeling, C++ for latency-critical components, TypeScript for monitoring dashboards</p>
            </div>
            
            <div className="bg-gray-800/50 hover:bg-gray-800/70 p-5 rounded-lg border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20 hover:-translate-y-1">
              <h3 className="text-lg font-semibold mb-2 text-blue-300">Machine Learning</h3>
              <p className="text-gray-300">XGBoost for primary models, PyTorch for experimental neural approaches, Optuna for hyperparameter optimization</p>
            </div>
            
            <div className="bg-gray-800/50 hover:bg-gray-800/70 p-5 rounded-lg border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-green-900/20 hover:-translate-y-1">
              <h3 className="text-lg font-semibold mb-2 text-blue-300">Data Processing</h3>
              <p className="text-gray-300">Pandas and NumPy for research, with Dask for distributed processing of historical datasets</p>
            </div>
            
            <div className="bg-gray-800/50 hover:bg-gray-800/70 p-5 rounded-lg border border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-900/20 hover:-translate-y-1">
              <h3 className="text-lg font-semibold mb-2 text-blue-300">Infrastructure</h3>
              <p className="text-gray-300">Heroku for signal generation, Docker for containerization, FastAPI for internal service communication</p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white">System Roadmap</h2>
          <p className="text-gray-300 mb-5">
            Ongoing development focuses on extending market coverage, enhancing model sophistication,
            and implementing additional automation for system maintenance.
          </p>
          
          {/* Cool feature: Progress bars */}
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-blue-200 font-medium">Market Expansion</span>
                <span className="text-gray-400 text-xs">35% complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: "35%"}}></div>
              </div>
              <p className="text-gray-400 text-sm mt-1">Extend strategy coverage to crude oil futures and Russell 2000 micro contracts</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-blue-200 font-medium">Exit Optimization</span>
                <span className="text-gray-400 text-xs">65% complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{width: "65%"}}></div>
              </div>
              <p className="text-gray-400 text-sm mt-1">Implement reinforcement learning approaches for dynamic exit decisions</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-blue-200 font-medium">Model Maintenance</span>
                <span className="text-gray-400 text-xs">20% complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: "20%"}}></div>
              </div>
              <p className="text-gray-400 text-sm mt-1">Develop automated retraining pipeline with drift detection</p>
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-blue-200 font-medium">Regime Awareness</span>
                <span className="text-gray-400 text-xs">50% complete</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-indigo-500 h-2 rounded-full" style={{width: "50%"}}></div>
              </div>
              <p className="text-gray-400 text-sm mt-1">Deploy more sophisticated regime classification to optimize strategy selection</p>
            </div>
          </div>
        </section>

        <footer className="mt-12 pt-6 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-sm">
            View system performance metrics on the{" "}
            <a href="/performance" className="text-blue-400 hover:text-blue-300 transition-colors">Performance</a> page.
          </p>
          
          {/* Cool Feature: Dynamic SVG gradient text */}
          <p className="mt-4 text-sm">
            <span 
              className="font-mono font-bold" 
              style={{
                background: `url(#${gradientId})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                backgroundSize: '200% 100%'
              }}>
              System Last Updated: May 13, 2025
            </span>
          </p>
        </footer>
      </article>
      
      <style jsx>{`
        article {
          background-color: #111827;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        @keyframes gradientMove {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}