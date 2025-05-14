import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Overview",
  description: "Details about the algorithmic trading system architecture and components",
};

export default function ProjectsPage() {
  return (
    <div className="prose lg:prose-xl max-w-none">
      <h1 className="text-3xl font-bold mb-6">Algorithmic Trading System</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Project Overview</h2>
        <p>
          This project is a comprehensive algorithmic trading system designed to identify and exploit 
          market inefficiencies in futures markets. The system combines statistical analysis, machine learning, 
          and robust risk management to generate consistent returns while minimizing drawdowns.
        </p>
        <p>
          The trading algorithm currently focuses on the micro e-mini futures markets (MNQ, MES, etc.) 
          with a medium-frequency trading approach, executing approximately 5-15 trades per day.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Architecture</h2>
        <div className="w-full mb-6 bg-gray-100 p-4 rounded-lg flex justify-center">
          <Image 
            src="/arch.png" 
            alt="Trading System Architecture" 
            width={800} 
            height={400}
            className="max-w-full h-auto"
          />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">System Components</h2>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">1. Data Pipeline</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Market Data Feeds:</strong> Direct connections to market data providers offering low-latency price feeds.</li>
            <li><strong>Feature Engineering:</strong> Custom technical indicators and statistical features derived from raw market data.</li>
            <li><strong>Normalization Engine:</strong> Real-time normalization of features to ensure consistent model inputs regardless of market conditions.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">2. Model Stack</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Primary Alpha Model:</strong> Ensemble of gradient-boosted decision trees and neural networks for price movement prediction.</li>
            <li><strong>Regime Detection:</strong> Hidden Markov Models to identify different market regimes and adjust strategy parameters.</li>
            <li><strong>Entry/Exit Optimization:</strong> Reinforcement learning models to optimize trade timing and execution.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">3. Risk Management</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Position Sizing:</strong> Dynamic position sizing based on market volatility and model confidence.</li>
            <li><strong>Stop Loss System:</strong> Adaptive stop-loss mechanisms with volatility-based adjustments.</li>
            <li><strong>Drawdown Controls:</strong> Automatic trading reduction during underperformance periods.</li>
            <li><strong>Correlation Engine:</strong> Monitors correlation between strategies to maintain portfolio diversity.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">4. Execution Layer</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Order Management:</strong> Custom order management system interfacing with NinjaTrader.</li>
            <li><strong>Execution Algorithms:</strong> Smart order routing and execution to minimize slippage.</li>
            <li><strong>Latency Optimization:</strong> Advanced techniques to minimize execution delays.</li>
          </ul>
        </div>
        
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-2">5. Performance Analytics</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Real-time Dashboard:</strong> Live monitoring of strategy performance and risk metrics.</li>
            <li><strong>Post-trade Analysis:</strong> Detailed analysis of executed trades to identify improvement opportunities.</li>
            <li><strong>Reporting Engine:</strong> Automated generation of performance reports and visualizations.</li>
          </ul>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Development Process</h2>
        <p>
          The system follows a rigorous development and deployment process:
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li><strong>Research & Hypothesis:</strong> Formulate trading hypotheses based on market observations and research.</li>
          <li><strong>Feature Development:</strong> Design and implement features that capture the identified market inefficiencies.</li>
          <li><strong>Model Training:</strong> Train and validate models on historical data with proper cross-validation.</li>
          <li><strong>Backtesting:</strong> Extensive backtesting with transaction costs and realistic execution assumptions.</li>
          <li><strong>Paper Trading:</strong> Live testing with simulated money to verify performance in real market conditions.</li>
          <li><strong>Gradual Deployment:</strong> Phased deployment with increasing capital allocation based on performance.</li>
          <li><strong>Continuous Monitoring:</strong> Ongoing monitoring and refinement of all system components.</li>
        </ol>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Technologies Used</h2>
        <ul className="list-disc pl-6 grid grid-cols-1 md:grid-cols-2 gap-2">
          <li><strong>Programming Languages:</strong> Python, TypeScript, C#</li>
          <li><strong>Machine Learning:</strong> TensorFlow, XGBoost, scikit-learn</li>
          <li><strong>Data Processing:</strong> Pandas, NumPy, Apache Spark</li>
          <li><strong>Trading Platform:</strong> NinjaTrader, Interactive Brokers API</li>
          <li><strong>Infrastructure:</strong> AWS, Docker, Kubernetes</li>
          <li><strong>Monitoring:</strong> Prometheus, Grafana, custom dashboards</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Results</h2>
        <p>
          The trading system has demonstrated consistent performance across various market conditions. 
          Detailed performance metrics can be found on the <a href="/performance" className="text-blue-600 hover:text-blue-800">Performance</a> page, 
          which shows actual trading results including the equity curve, Sharpe ratio, drawdowns, and win rate.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Future Development</h2>
        <p>
          Ongoing and planned improvements to the system include:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Expansion to additional futures markets and asset classes</li>
          <li>Integration of alternative data sources</li>
          <li>Further optimization of execution algorithms</li>
          <li>Implementation of deep reinforcement learning for dynamic strategy adaptation</li>
        </ul>
      </section>
    </div>
  );
}