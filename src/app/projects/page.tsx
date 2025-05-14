import type { Metadata } from "next";

// This is a static page, no need for runtime or dynamic settings

export const metadata: Metadata = {
  title: "Project Overview",
  description: "Details about the algorithmic trading system architecture and components",
};

export default function ProjectsPage() {
  return (
    <div className="prose lg:prose-xl max-w-none">
      <h1 className="text-3xl font-bold mb-6">Algorithmic Trading System</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Project Summary</h2>
        <p>
          A short-term mean reversion trading system targeting dislocations in micro e-mini futures. 
          Over 90% of trades complete within 10 seconds to 5 minutes. The system uses separate ML models for 
          entry and exit decisions and is deployed live via Heroku, with execution through NinjaTrader.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">System Components</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Feature Pipeline</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Level-2 data:</strong> imbalance, spread volatility, depth imbalance</li>
            <li><strong>Rolling stats:</strong> z-scores, local volatility, momentum shifts</li>
            <li><strong>PCA-based compression</strong> of microstructure state windows</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Model Stack</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Entry:</strong> XGBoost classifier on divergence signals</li>
            <li><strong>Exit:</strong> Regression model minimizing
              <div className="my-2 text-center italic">
                Loss = (r<sub>t</sub>/σ<sub>t</sub>)<sup>2</sup> + λ·Δt
              </div>
              <div className="text-sm">where r<sub>t</sub> is realized return, σ<sub>t</sub> is local volatility, and Δt is trade duration</div>
            </li>
            <li><strong>Regime segmentation (optional):</strong> Gaussian HMM</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Risk Management</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Position Sizing:</strong> Volatility-scaled position sizing</li>
            <li><strong>Stop-Loss:</strong> Dynamic stop-loss based on intrabar volatility</li>
            <li><strong>Drawdown Control:</strong> Equity curve-based drawdown throttle</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Execution</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Server:</strong> Signal server on Heroku</li>
            <li><strong>Order Bridge:</strong> Custom order bridge to NinjaTrader</li>
            <li><strong>Execution:</strong> Cancel/replace handling to minimize slippage</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">Monitoring</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Logging:</strong> Logs output daily as JSON</li>
            <li><strong>Analytics:</strong> QuantStats tear sheets and trade tables auto-updated</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Development Process</h2>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Hypothesis Generation:</strong> Formulate trading hypotheses based on market observations</li>
          <li><strong>Feature Research:</strong> Design and test features to capture market inefficiencies</li>
          <li><strong>Model Training:</strong> Cross-validated training with realistic assumptions</li>
          <li><strong>Backtesting:</strong> Slippage-aware backtests across different market regimes</li>
          <li><strong>Paper Trading:</strong> Validation in live markets without real capital</li>
          <li><strong>Live Deployment:</strong> Gradual scaling of capital based on performance metrics</li>
          <li><strong>Monitoring & Refinement:</strong> Continuous monitoring and model improvements</li>
        </ol>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Languages</h3>
            <p className="text-gray-600">Python, SQL, C++, TypeScript</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">ML/Modeling</h3>
            <p className="text-gray-600">XGBoost, PyTorch, TensorFlow, scikit-learn, Optuna</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Data</h3>
            <p className="text-gray-600">Pandas, NumPy, Dask, Vaex</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Infrastructure</h3>
            <p className="text-gray-600">Heroku, Docker, Git, REST APIs, FastAPI</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Trading</h3>
            <p className="text-gray-600">NinjaTrader, Polygon.io, IBKR API</p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Roadmap</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>Add support for crude oil and RTY futures</li>
          <li>Train RL-based dynamic exit modules</li>
          <li>Incorporate model retraining pipeline</li>
          <li>Deploy regime filters to optimize model switching</li>
        </ul>
      </section>
    </div>
  );
}