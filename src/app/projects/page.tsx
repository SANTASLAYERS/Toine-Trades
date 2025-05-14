import type { Metadata } from "next";

// This is a static page, no need for runtime or dynamic settings

export const metadata: Metadata = {
  title: "Project Overview",
  description: "Details about the algorithmic trading system architecture and components",
};

export default function ProjectsPage() {
  return (
    <article className="prose lg:prose-xl max-w-none">
      <header>
        <h1 className="text-3xl font-bold mb-8">Mean Reversion Trading System</h1>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">System Architecture</h2>
        
        <p className="text-gray-700 mb-5 leading-relaxed">
          This trading system implements a short-term mean reversion strategy targeting price dislocations in 
          micro e-mini futures markets. The architecture prioritizes rapid signal generation, precise execution timing, 
          and robust risk controls—all critical for capturing fleeting market inefficiencies that typically
          resolve within seconds to minutes.
        </p>
        
        <blockquote className="border-l-4 border-gray-200 pl-4 italic text-gray-600 my-6">
          Over 90% of trades complete within 10 seconds to 5 minutes, requiring a system architecture 
          optimized for low-latency decision making and execution.
        </blockquote>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Core Components</h2>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-3">Feature Pipeline</h3>
          <p className="text-gray-700 mb-4">
            The feature pipeline ingests real-time market data, transforms it into predictive signals, 
            and delivers these to the model stack with minimal latency.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Level-2 Data Processing:</strong> Real-time analysis of orderbook imbalance, 
            spread volatility, and depth distribution patterns</li>
            <li><strong>Statistical Feature Generation:</strong> Calculation of adaptive z-scores, 
            rolling volatility metrics, and momentum oscillators calibrated to short timeframes</li>
            <li><strong>Dimensional Reduction:</strong> PCA-based compression of order book state vectors 
            to capture essential microstructure dynamics while reducing noise</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-3">Model Architecture</h3>
          <p className="text-gray-700 mb-4">
            The system employs a dual-model approach, separating entry signal generation from exit timing 
            optimization to achieve greater specialization.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Entry Model:</strong> Gradient-boosted classifier trained specifically on 
            high-confidence reversal patterns identified through historical analysis</li>
            <li><strong>Exit Model:</strong> Regression-based approach optimizing for risk-adjusted returns 
            rather than absolute profit, using a custom loss function:
            <div className="my-4 text-center font-mono">
              Loss = (r<sub>t</sub>/σ<sub>t</sub>)<sup>2</sup> + λ·Δt
            </div>
            <div className="text-sm mb-2">
              Where r<sub>t</sub> represents realized return, σ<sub>t</sub> is local volatility, 
              and Δt is trade duration. This formulation balances profit capture against time exposure.
            </div>
            </li>
            <li><strong>Market Regime Detection:</strong> Gaussian Hidden Markov Models identify latent
            market states, allowing for dynamic parameter adjustments based on prevailing conditions</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-3">Risk Management Framework</h3>
          <p className="text-gray-700 mb-4">
            The risk framework operates at multiple time scales, from trade-level stop placement 
            to system-wide position sizing and drawdown controls.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Position Sizing:</strong> Dynamic allocation based on recent volatility measurements,
            scaling exposure inversely with market turbulence</li>
            <li><strong>Stop-Loss Mechanism:</strong> Adaptive stops calculated from intrabar volatility patterns 
            and historical slippage distribution analysis</li>
            <li><strong>System Throttling:</strong> Automated reduction in trade frequency and size 
            during drawdown periods or degraded execution conditions</li>
          </ul>
        </div>
        
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-3">Execution Infrastructure</h3>
          <p className="text-gray-700 mb-4">
            The execution layer bridges the gap between signal generation and market interaction,
            optimizing for minimal latency and slippage.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li><strong>Signal Generation:</strong> Hosted on Heroku for reliable cloud compute with 
            consistent performance characteristics</li>
            <li><strong>Order Management:</strong> Custom interface layer connecting to NinjaTrader's API 
            with comprehensive error handling and retry logic</li>
            <li><strong>Execution Optimization:</strong> Latency-aware cancel/replace functionality with 
            monitoring to identify and adapt to varying market conditions</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Development Methodology</h2>
        <p className="text-gray-700 mb-5">
          The development process follows a structured path from hypothesis formation to live deployment,
          with each stage building confidence in the strategy's robustness.
        </p>
        <ol className="list-decimal pl-6 space-y-3 text-gray-700">
          <li><strong>Hypothesis Formulation:</strong> Identification of potential market inefficiencies through 
          statistical analysis and market microstructure research</li>
          <li><strong>Feature Engineering:</strong> Development of signal generators capturing the identified 
          inefficiencies with appropriate normalization and preprocessing</li>
          <li><strong>Model Training and Validation:</strong> Walk-forward cross-validation with strict attention 
          to preventing lookahead bias and overfitting</li>
          <li><strong>Backtesting:</strong> Realistic simulation incorporating execution costs, slippage models, 
          and adverse selection effects</li>
          <li><strong>Paper Trading:</strong> Live market verification without capital deployment to measure 
          performance against expectations</li>
          <li><strong>Phased Deployment:</strong> Gradual scaling of capital allocation based on realized 
          performance metrics and drawdown characteristics</li>
          <li><strong>Continuous Monitoring:</strong> Ongoing assessment of strategy health, market regime shifts, 
          and potential model drift</li>
        </ol>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Technical Implementation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
          <div>
            <h3 className="text-lg font-semibold mb-2">Languages</h3>
            <p>Python for data processing and modeling, C++ for latency-critical components, TypeScript for the monitoring dashboard</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Machine Learning</h3>
            <p>XGBoost for the primary models, with PyTorch for experimental neural approaches and Optuna for hyperparameter optimization</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Data Processing</h3>
            <p>Pandas and NumPy for research, with Dask for distributed processing of historical datasets</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Infrastructure</h3>
            <p>Heroku for signal generation, Docker for containerization, FastAPI for internal service communication</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">System Roadmap</h2>
        <p className="text-gray-700 mb-5">
          Ongoing development focuses on extending market coverage, enhancing model sophistication,
          and implementing additional automation for system maintenance.
        </p>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li><strong>Market Expansion:</strong> Extend strategy coverage to crude oil futures and Russell 2000 micro contracts</li>
          <li><strong>Exit Optimization:</strong> Implement reinforcement learning approaches for dynamic exit decisions</li>
          <li><strong>Model Maintenance:</strong> Develop automated retraining pipeline with drift detection</li>
          <li><strong>Regime Awareness:</strong> Deploy more sophisticated regime classification to optimize strategy selection</li>
        </ul>
      </section>

      <footer className="mt-12 pt-6 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          View system performance metrics on the{" "}
          <a href="/performance" className="text-blue-600 hover:underline">Performance</a> page.
        </p>
      </footer>
    </article>
  );
}