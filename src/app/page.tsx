'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col space-y-10">
      <section className="relative bg-black text-white rounded-lg overflow-hidden p-12">
        {/* Modern abstract background with pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900">
          <div
               className="absolute inset-0 opacity-20"
               style={{
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                 backgroundSize: '30px 30px'
               }}
          ></div>
        </div>

        {/* Content with enhanced typography */}
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-block px-2 py-1 mb-4 text-xs font-medium bg-blue-600 rounded">PORTFOLIO</div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">
            Antoine Pangas
            <span className="block text-blue-300 mt-2">Algorithmic Trading Engineer</span>
          </h1>
          <p className="text-xl mb-8 leading-relaxed max-w-2xl">
            Developing high-frequency mean reversion strategies using machine learning,
            market microstructure analysis, and real-time signal processing.
          </p>

          {/* Stats Bar */}
          <div className="flex flex-wrap gap-8 mb-8 text-blue-100 text-sm">
            <div>
              <div className="font-bold text-2xl text-white">90%</div>
              <div>Trades under 5 min</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-white">2.75</div>
              <div>Sharpe Ratio</div>
            </div>
            <div>
              <div className="font-bold text-2xl text-white">Live</div>
              <div>Since April 2025</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="bg-white text-blue-900 hover:bg-blue-50 px-5 py-3 rounded-md font-medium transition-colors"
            >
              View Project
            </Link>
            <Link
              href="/performance"
              className="bg-blue-800 hover:bg-blue-700 border border-blue-700 px-5 py-3 rounded-md font-medium transition-colors"
            >
              See Performance
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white shadow-md rounded-lg p-8 overflow-hidden relative">
        {/* Animated gradient accent */}
        <div
             className="absolute top-0 right-0 h-1 w-full bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 animate-[gradient_3s_ease_infinite]"
             style={{backgroundSize: '200% 200%'}}
        ></div>

        <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">
          About Me
          {/* Subtle animated typing cursor */}
          <span className="inline-block h-5 w-0.5 ml-1 bg-blue-500 animate-[blink_1s_step-end_infinite]"></span>
        </h2>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <p className="text-gray-700 mb-6 leading-relaxed">
              I'm a quantitative developer and machine learning engineer based in Washington, DC.
              My work focuses on developing high-frequency trading systems for futures markets, with an
              emphasis on mean reversion strategies and risk-managed execution. Currently, I maintain
              a live trading system on MNQ and MES micro e-minis that leverages level-2 market data and
              proprietary prediction models to capture short-duration price inefficiencies.
            </p>

            <blockquote className="border-l-4 border-blue-200 pl-4 italic text-gray-600 my-6 bg-blue-50/40 p-3 rounded-r">
              My approach combines rigorous statistical analysis with machine learning to identify temporary
              market dislocations while maintaining strict risk parameters.
            </blockquote>
          </div>

          <div className="md:w-80 flex-shrink-0">
            <div className="glassmorphism bg-gradient-to-br from-white to-blue-50 rounded-lg p-5 border border-blue-50 shadow-sm">
              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-blue-600 mb-1">Education</dt>
                  <dd className="text-gray-800 font-medium">B.S.E. Computer Science, University of Michigan (2024)</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-blue-600 mb-1">Location</dt>
                  <dd className="text-gray-800 font-medium">Washington, DC</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-blue-600 mb-1">Current System</dt>
                  <dd className="text-gray-800 font-medium">Live mean reversion algorithm on NinjaTrader (since Apr 2025)</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>

        {/* Tech ticker */}
        <div className="mt-8 pt-4 border-t border-gray-100 overflow-hidden">
          <div className="animate-[ticker_35s_linear_infinite] whitespace-nowrap inline-block">
            {[
              "Python", "TensorFlow", "PyTorch", "XGBoost", "Pandas", "NumPy",
              "SQL", "REST APIs", "Docker", "Kubernetes", "AWS", "Heroku",
              "NinjaTrader", "Level-2 Data", "TypeScript", "React", "Next.js", "Plotly"
            ].map((tech, i) => (
              <span key={i} className="inline-block px-3 py-1 mr-3 text-sm bg-gray-100 text-gray-800 rounded-full">{tech}</span>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes gradient {
            0% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
            100% { background-position: 0% 50% }
          }
          @keyframes blink {
            0%, 100% { opacity: 1 }
            50% { opacity: 0 }
          }
          @keyframes ticker {
            0% { transform: translateX(0) }
            100% { transform: translateX(-50%) }
          }
        `}</style>
      </section>

      <section className="bg-white shadow-md rounded-lg p-8 relative">
        {/* Background pattern */}
        <div className="absolute right-0 bottom-0 h-48 w-48 opacity-5">
          <svg viewBox="0 0 128 128" xmlns="http://www.w3.org/2000/svg">
            <path fill="#000" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0zm32.2 36.1L115.8 56l-64 64-39.6-39.6 19.6-19.6 20 20 25.4-25.4 20 19.6z"/>
          </svg>
        </div>

        <h2 className="text-2xl font-bold mb-5 text-gray-800">Technical Expertise</h2>

        <p className="text-gray-700 mb-8 leading-relaxed max-w-3xl">
          My technical stack is built around production-grade quantitative trading systems,
          with emphasis on real-time data processing, statistical modeling, and low-latency execution.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Languages",
              items: ["Python", "SQL", "C++", "TypeScript"],
              icon: "",
              color: "bg-blue-50 border-blue-100"
            },
            {
              title: "ML/Modeling",
              items: ["XGBoost", "PyTorch", "TensorFlow", "scikit-learn", "Optuna"],
              icon: "",
              color: "bg-purple-50 border-purple-100"
            },
            {
              title: "Data Processing",
              items: ["Pandas", "NumPy", "Dask", "Vaex", "Apache Spark"],
              icon: "",
              color: "bg-green-50 border-green-100"
            },
            {
              title: "Infrastructure",
              items: ["Heroku", "Git", "Docker", "REST APIs", "FastAPI"],
              icon: "",
              color: "bg-yellow-50 border-yellow-100"
            },
            {
              title: "Trading Systems",
              items: ["NinjaTrader", "IB API", "Polygon.io", "Futures/Options"],
              icon: "",
              color: "bg-red-50 border-red-100"
            },
            {
              title: "Monitoring",
              items: ["QuantStats", "Custom dashboards", "Performance metrics"],
              icon: "",
              color: "bg-indigo-50 border-indigo-100"
            }
          ].map((category, i) => (
            <div key={i} className={`p-4 rounded-lg border ${category.color} hover:shadow-md transition-shadow`}>
              <div className="mb-3">
                <h3 className="font-medium text-gray-800 text-lg">{category.title}</h3>
              </div>
              <ul className="space-y-1">
                {category.items.map((item, j) => (
                  <li key={j} className="text-gray-700">• {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex mt-10 pt-4 border-t border-gray-100">
          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 transition-colors py-2 px-4 rounded-md text-gray-800"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors py-2 px-4 rounded-md text-white ml-3"
          >
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
            </svg>
            LinkedIn
          </a>
        </div>
      </section>
    </div>
  );
}