'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

// Define types for performance data
type PerformanceData = {
  equity_curve: {
    dates: string[];
    values: number[];
  };
  metrics: {
    pnl: number;
    sharpe: number;
    max_dd: number;
    win_rate: number;
  };
  trades: Array<{
    'Entry time': string;
    'Exit time': string;
    'Instrument': string;
    'Market pos.': string;
    'Qty': number;
    'Entry price': number;
    'Exit price': number;
    'Profit': number;
  }>;
};

export default function Home() {
  const [perfMetrics, setPerfMetrics] = useState({
    winRate: '53',
    maxDrawdown: '8.54',
    winLossRatio: '1.18',
    profitFactor: '1.65',
    sharpeRatio: '2.2'
  });

  // Add parallax scrolling effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const parallaxElements = document.querySelectorAll('.parallax-element');

      parallaxElements.forEach((element, index) => {
        // Different speeds for different elements
        const speed = 0.2 + (index * 0.05);
        const yPos = -(scrollTop * speed);
        if (element instanceof HTMLElement) {
          element.style.transform = `translateY(${yPos}px)`;
        }
      });
    };

    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Fetch performance data from JSON
    fetch('/perf.json')
      .then(res => res.json())
      .then((data: PerformanceData) => {
        // Calculate metrics from the data
        const trades = data.trades;

        // Calculate win rate
        const winningTrades = trades.filter(t => t.Profit > 0);
        const winRate = (winningTrades.length / trades.length) * 100;

        // Calculate max drawdown with +15000 base capital adjustment
        const baseCapital = 15000;
        let peak = baseCapital;
        let maxDrawdown = 0;
        let runningTotal = baseCapital;

        trades.forEach(trade => {
          runningTotal += trade.Profit;
          if (runningTotal > peak) {
            peak = runningTotal;
          }
          const drawdown = peak > 0 ? ((peak - runningTotal) / peak) * 100 : 0;
          if (drawdown > maxDrawdown) {
            maxDrawdown = drawdown;
          }
        });

        // Calculate win/loss ratio
        const losingTrades = trades.filter(t => t.Profit < 0);
        const avgWin = winningTrades.length > 0
          ? winningTrades.reduce((sum, t) => sum + t.Profit, 0) / winningTrades.length
          : 0;
        const avgLoss = losingTrades.length > 0
          ? losingTrades.reduce((sum, t) => sum + t.Profit, 0) / losingTrades.length
          : 0;
        const winLossRatio = avgLoss !== 0 ? Math.abs(avgWin / avgLoss) : 0;

        // Calculate profit factor
        const grossProfit = winningTrades.reduce((sum, t) => sum + t.Profit, 0);
        const grossLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.Profit, 0));
        const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : 0;

        // Update state with calculated metrics
        setPerfMetrics({
          winRate: winRate.toFixed(1),
          maxDrawdown: maxDrawdown.toFixed(2),
          winLossRatio: winLossRatio.toFixed(2),
          profitFactor: profitFactor.toFixed(2),
          sharpeRatio: '2.2' // Hardcoded to 2.2
        });
      })
      .catch(err => {
        console.error('Failed to load performance data:', err);
        // Keep default values if fetch fails
      });
  }, []);

  return (
    <div className="flex flex-col space-y-10">
      {/* Hero section - project focus */}
      <section className="relative bg-black text-white rounded-lg overflow-hidden p-12">
        <div id="animated-background" className="absolute inset-0">
          <div
               className="absolute inset-0 opacity-20 parallax-element"
               style={{
                 backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.15\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                 backgroundSize: '30px 30px'
               }}
          ></div>
        </div>

        {/* Moving shapes - very noticeable animation */}
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-blue-600/20 blur-2xl" style={{animation: "hover-bounce 8s ease-in-out infinite"}}></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 rounded-full bg-indigo-600/20 blur-2xl" style={{animation: "hover-bounce 7s ease-in-out infinite", animationDelay: "0.5s"}}></div>
        <div className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-purple-500/20 blur-xl" style={{animation: "hover-bounce 6s ease-in-out infinite", animationDelay: "1s"}}></div>

        <div className="relative max-w-3xl mx-auto">
          <div className="inline-block px-2 py-1 mb-4 text-xs font-medium bg-blue-600 rounded parallax-element" style={{animation: "hover-bounce 12s ease-in-out infinite"}}>MID FREQUENCY TRADING SYSTEM</div>
          <h1 className="text-5xl font-bold mb-4 tracking-tight parallax-element" style={{animation: "hover-bounce 15s ease-in-out infinite"}}>
            Mean Reversion <br />Algorithm
          </h1>
          <p className="text-xl mb-6 leading-relaxed max-w-2xl parallax-element">
            A production-grade trading system for micro e-mini futures that identifies temporary market dislocations using ML and level-2 data.
          </p>
          <div className="inline-block mb-8 text-sm text-blue-300 bg-blue-950/50 px-3 py-1 rounded parallax-element">
            <Link href="#about-me" className="hover:text-white transition-colors">
              Antoine Pangas • Computer Science, U of M Jan 2025 • Washington DC
            </Link>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-10 mb-8 text-blue-100 text-sm">
            <div className="metrics-card border-l-2 border-blue-400 pl-3 transition-all duration-300 hover:bg-blue-800/30 hover:border-blue-300 hover:pl-4 rounded hover:shadow-inner cursor-pointer">
              <div className="font-bold text-2xl text-white group-hover:text-blue-200">90%</div>
              <div>Trades under 5 min</div>
            </div>
            <div className="metrics-card border-l-2 border-blue-400 pl-3 transition-all duration-300 hover:bg-blue-800/30 hover:border-blue-300 hover:pl-4 rounded hover:shadow-inner cursor-pointer">
              <div className="font-bold text-2xl text-white">2.2</div>
              <div>Sharpe Ratio</div>
            </div>
            <div className="metrics-card border-l-2 border-blue-400 pl-3 transition-all duration-300 hover:bg-blue-800/30 hover:border-blue-300 hover:pl-4 rounded hover:shadow-inner cursor-pointer">
              <div className="font-bold text-2xl text-white">{perfMetrics.winRate}%</div>
              <div>Win Rate</div>
            </div>
            <div className="metrics-card border-l-2 border-blue-400 pl-3 transition-all duration-300 hover:bg-blue-800/30 hover:border-blue-300 hover:pl-4 rounded hover:shadow-inner cursor-pointer">
              <div className="font-bold text-2xl text-white">{perfMetrics.winLossRatio}</div>
              <div>Win/Loss Ratio</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 mt-2">
            <Link
              href="/projects"
              className="bg-white text-blue-900 hover:bg-blue-50 px-5 py-3 rounded-md font-medium transition-all hover:scale-105 hover:shadow-lg"
            >
              System Architecture
            </Link>
            <div className="relative">
              <div className="absolute inset-0 bg-blue-400 rounded-md opacity-10" style={{animation: "pulse 3s ease-in-out infinite"}}></div>
              <Link
                href="/performance"
                className="relative bg-blue-800 hover:bg-blue-700 border border-blue-700 px-5 py-3 rounded-md font-medium transition-all hover:scale-105 hover:shadow-lg"
              >
                Performance Metrics
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Project overview with cool terminal effect */}
      <section className="bg-white shadow-md rounded-lg p-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-5 text-gray-800 flex items-center">
              System Overview
              <div className="relative w-3 h-3 bg-green-500 rounded-full ml-3">
                <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
              </div>
            </h2>

            <div className="relative mb-6 bg-gray-900 text-gray-100 p-4 rounded font-mono text-sm overflow-hidden">
              <div className="flex items-center mb-2 border-b border-gray-700 pb-1">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="ml-2 text-xs text-gray-400">trading-algorithm.sh</div>
              </div>
              <div className="typing-effect" id="typingContent">
                <span className="text-blue-400">$ </span><span className="text-green-400">algo</span> <span className="text-yellow-300">--describe</span><br/>
                <span className="text-white font-light">
                  This algorithmic trading system identifies and exploits short-term mean reversion opportunities in
                  micro e-mini futures markets. Built with a focus on low latency and high precision, the system processes
                  level-2 market data through custom feature pipelines and ML models to generate alpha.
                </span>
              </div>
              <div className="mt-2">
                <span className="text-blue-400">$ </span><span className="text-green-400">algo</span> <span className="text-yellow-300">--status</span><br/>
                <span className="text-white font-light">
                  Currently trading live on MNQ and MES contracts with consistent profitability across
                  various market regimes and carefully managed risk parameters.
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
            </div>
            
            <div className="mb-6 mt-8 bg-blue-600 rounded-lg p-5">
              <h3 className="text-lg font-semibold mb-2 text-white">Core System Components</h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 mt-3">
                <li className="flex items-start text-blue-100">
                  <span className="text-white font-bold mr-2">→</span>
                  <span>Real-time level-2 data processing</span>
                </li>
                <li className="flex items-start text-blue-100">
                  <span className="text-white font-bold mr-2">→</span>
                  <span>Dual ML model architecture</span>
                </li>
                <li className="flex items-start text-blue-100">
                  <span className="text-white font-bold mr-2">→</span>
                  <span>Volatility-adjusted position sizing</span>
                </li>
                <li className="flex items-start text-blue-100">
                  <span className="text-white font-bold mr-2">→</span>
                  <span>Low-latency execution system</span>
                </li>
                <li className="flex items-start text-blue-100">
                  <span className="text-white font-bold mr-2">→</span>
                  <span>Dynamic risk controls</span>
                </li>
                <li className="flex items-start text-blue-100">
                  <span className="text-white font-bold mr-2">→</span>
                  <span>Continuous performance monitoring</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="md:w-80 lg:w-96 flex-shrink-0">
            <div className="bg-gray-50 rounded-lg p-5 border border-gray-100 shadow-sm h-full flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:bg-gray-50/90 hover:border-blue-100 group">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-gray-800 group-hover:text-blue-800 transition-colors">Technical Specifications</h3>
                <dl className="grid grid-cols-1 gap-3">
                  <div className="transition-all duration-200 hover:bg-blue-50/50 p-2 hover:rounded">
                    <dt className="text-sm font-medium text-blue-600 mb-1 group-hover:text-blue-700">Primary Markets</dt>
                    <dd className="text-gray-800 group-hover:text-gray-900">MNQ, MES (Micro E-mini futures)</dd>
                  </div>
                  <div className="transition-all duration-200 hover:bg-blue-50/50 p-2 hover:rounded">
                    <dt className="text-sm font-medium text-blue-600 mb-1 group-hover:text-blue-700">Avg. Trade Duration</dt>
                    <dd className="text-gray-800 group-hover:text-gray-900">2 minutes</dd>
                  </div>
                  <div className="transition-all duration-200 hover:bg-blue-50/50 p-2 hover:rounded">
                    <dt className="text-sm font-medium text-blue-600 mb-1 group-hover:text-blue-700">Trade Frequency</dt>
                    <dd className="text-gray-800 group-hover:text-gray-900">15-25 trades per day</dd>
                  </div>
                  <div className="transition-all duration-200 hover:bg-blue-50/50 p-2 hover:rounded">
                    <dt className="text-sm font-medium text-blue-600 mb-1 group-hover:text-blue-700">Data Sources</dt>
                    <dd className="text-gray-800 group-hover:text-gray-900">Level-2 order book data, technical indicators</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 group-hover:border-blue-100 transition-colors">
                <div className="flex items-center justify-center sm:justify-start">
                  <Link href="/projects" className="text-blue-600 hover:text-blue-800 font-medium group-hover:underline flex items-center">
                    <span>View detailed architecture</span>
                    <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key features with visual presentation */}
      <section className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Key System Features</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200 transition-all duration-300 hover:shadow-lg hover:shadow-blue-200/50 hover:scale-[1.02] hover:border-blue-300 cursor-pointer">
            <h3 className="font-semibold text-lg mb-3 text-blue-900 transition duration-300 group-hover:text-blue-700">Feature Engineering</h3>
            <p className="text-gray-700 mb-3">Custom indicators derived from order book data to capture market microstructure patterns.</p>
            <ul className="text-gray-600 text-sm space-y-1">
              <li className="transition hover:translate-x-1 hover:text-blue-800">• Order book imbalance metrics</li>
              <li className="transition hover:translate-x-1 hover:text-blue-800">• Adaptive volatility calculations</li>
              <li className="transition hover:translate-x-1 hover:text-blue-800">• PCA-based state compression</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200 transition-all duration-300 hover:shadow-lg hover:shadow-purple-200/50 hover:scale-[1.02] hover:border-purple-300 cursor-pointer">
            <h3 className="font-semibold text-lg mb-3 text-purple-900 transition duration-300 group-hover:text-purple-700">Model Structure</h3>
            <p className="text-gray-700 mb-3">Separate models for entry and exit decisions to optimize for different objectives.</p>
            <ul className="text-gray-600 text-sm space-y-1">
              <li className="transition hover:translate-x-1 hover:text-purple-800">• XGBoost entry classifier</li>
              <li className="transition hover:translate-x-1 hover:text-purple-800">• Custom loss function for exits</li>
              <li className="transition hover:translate-x-1 hover:text-purple-800">• Time-volatility balance optimization</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200 transition-all duration-300 hover:shadow-lg hover:shadow-green-200/50 hover:scale-[1.02] hover:border-green-300 cursor-pointer">
            <h3 className="font-semibold text-lg mb-3 text-green-900 transition duration-300 group-hover:text-green-700">Risk Management</h3>
            <p className="text-gray-700 mb-3">Multi-layer risk controls to protect capital and optimize performance.</p>
            <ul className="text-gray-600 text-sm space-y-1">
              <li className="transition hover:translate-x-1 hover:text-green-800">• Dynamic position sizing</li>
              <li className="transition hover:translate-x-1 hover:text-green-800">• Adaptive stop-loss placement</li>
              <li className="transition hover:translate-x-1 hover:text-green-800">• Drawdown-based system throttling</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-gray-100 text-center">
          <Link 
            href="/performance" 
            className="inline-flex items-center bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-md"
          >
            <span>View Real Trading Performance</span>
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </Link>
        </div>
      </section>
      
      {/* About Me Section */}
      <section id="about-me" className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-xl rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          About Me
          <div className="ml-3 px-2 py-1 text-xs bg-blue-400 bg-opacity-30 rounded">Antoine Pangas</div>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed mb-4">
                I'm a Computer Science graduate from the University of Michigan, graduated in Jan 2025. My primary focus is on
                algorithmic trading systems and financial machine learning.
              </p>
              <p className="leading-relaxed mb-4">
                With a background in both software engineering and finance, I've developed a passion for creating
                high-performance trading systems that can identify market inefficiencies. My current system—a mean reversion
                algorithm for micro e-mini futures—has been trading live since April 2025.
              </p>
              <p className="leading-relaxed">
                Outside of coding and trading, I enjoy playing chess, hiking, and contributing to open-source projects
                related to quantitative finance.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="bg-blue-800 bg-opacity-90 px-4 py-2 rounded-full text-sm font-medium text-white border border-blue-700">
                Machine Learning
              </div>
              <div className="bg-blue-800 bg-opacity-90 px-4 py-2 rounded-full text-sm font-medium text-white border border-blue-700">
                Algorithmic Trading
              </div>
              <div className="bg-blue-800 bg-opacity-90 px-4 py-2 rounded-full text-sm font-medium text-white border border-blue-700">
                Python / C++
              </div>
              <div className="bg-blue-800 bg-opacity-90 px-4 py-2 rounded-full text-sm font-medium text-white border border-blue-700">
                Financial Markets
              </div>
              <div className="bg-blue-800 bg-opacity-90 px-4 py-2 rounded-full text-sm font-medium text-white border border-blue-700">
                Data Analysis
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg border border-blue-800">
              <h3 className="font-semibold text-lg mb-2 text-white">Contact Info</h3>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-white font-medium">pangasantoine@gmail.com</span>
                </li>
                <li className="flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-white font-medium">Washington DC</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-900 bg-opacity-50 p-4 rounded-lg border border-blue-800">
              <h3 className="font-semibold text-lg mb-2 text-white">Education</h3>
              <div>
                <div className="font-medium text-white">University of Michigan</div>
                <div className="text-sm text-blue-300">BSc in Computer Science</div>
                <div className="text-sm text-blue-200">2021 - Jan 2025</div>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <div className="flex space-x-4">
                <a href="https://github.com/SANTASLAYERS" target="_blank" rel="noopener noreferrer" className="bg-blue-800 text-white hover:bg-blue-700 p-2 rounded-full transition-colors border border-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/antoine-pangas/" target="_blank" rel="noopener noreferrer" className="bg-blue-800 text-white hover:bg-blue-700 p-2 rounded-full transition-colors border border-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation details in condensed format */}
      <section className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Implementation</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
              Technology Stack
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Core Languages</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Python (data processing)</li>
                  <li>• C++ (latency-critical paths)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">ML Libraries</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• XGBoost &amp; LightGBM</li>
                  <li>• TensorFlow for experiments</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
              Execution Infrastructure
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Signal Generation</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Heroku-hosted services</li>
                  <li>• FastAPI endpoints</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Trading Execution</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• IB API integration</li>
                  <li>• NinjaTrader implementation</li>
                  <li>• Custom order routing</li>
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Development Process</h3>
            <div className="bg-gray-50 rounded p-3 text-sm text-gray-700">
              <p className="mb-2">The system follows a rigorous development cycle from research to production:</p>
              <div className="flex">
                <div className="flex-shrink-0 flex flex-col items-center mr-3">
                  <div className="w-px h-5 bg-gray-300"></div>
                  <div className="rounded-full h-3 w-3 border-2 border-blue-500 bg-white"></div>
                  <div className="w-px h-12 bg-gray-300"></div>
                  <div className="rounded-full h-3 w-3 border-2 border-blue-500 bg-white"></div>
                  <div className="w-px h-12 bg-gray-300"></div>
                  <div className="rounded-full h-3 w-3 border-2 border-blue-500 bg-white"></div>
                </div>
                <div>
                  <p className="font-medium">Research &amp; Modeling</p>
                  <p className="text-gray-500 text-xs mb-3">Hypothesis generation, feature development, model training</p>

                  <p className="font-medium">Backtesting &amp; Simulation</p>
                  <p className="text-gray-500 text-xs mb-3">Realistic testing with slippage and costs, walk-forward validation</p>

                  <p className="font-medium">Deployment &amp; Monitoring</p>
                  <p className="text-gray-500 text-xs">Phased capital allocation, continuous performance tracking</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3 text-gray-800">Performance Analytics</h3>
            <div className="bg-gray-50 rounded p-3 h-full">
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-xs text-gray-500">Sharpe Ratio</dt>
                  <dd className="text-2xl font-bold text-blue-600">2.2</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Win Rate</dt>
                  <dd className="text-2xl font-bold text-blue-600">{perfMetrics.winRate}%</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Win/Loss Ratio</dt>
                  <dd className="text-2xl font-bold text-blue-600">{perfMetrics.winLossRatio}</dd>
                </div>
                <div>
                  <dt className="text-xs text-gray-500">Profit Factor</dt>
                  <dd className="text-2xl font-bold text-blue-600">{perfMetrics.profitFactor}</dd>
                </div>
              </dl>
              <div className="mt-3 text-right">
                <Link href="/performance" className="text-sm text-blue-600 hover:underline">
                  View detailed metrics →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Add animation and terminal cursor effects
if (typeof document !== 'undefined') {
  // Execute after component is mounted
  setTimeout(() => {
    // Add blinking cursor to terminal effect and floating animations
    const style = document.createElement('style');
    style.textContent = `
      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
      .terminal-cursor::after {
        content: '|';
        color: #3b82f6;
        animation: blink 1s step-end infinite;
        margin-left: 2px;
      }

      /* Smooth floating animation for metric cards */
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-8px); }
        100% { transform: translateY(0px); }
      }

      .float-1 {
        animation: float 6s ease-in-out infinite;
      }

      .float-2 {
        animation: float 7s ease-in-out infinite;
        animation-delay: 0.5s;
      }

      .float-3 {
        animation: float 8s ease-in-out infinite;
        animation-delay: 1s;
      }

      .float-4 {
        animation: float 9s ease-in-out infinite;
        animation-delay: 1.5s;
      }

      /* Animated rotating gradient background - more noticeable movement */
      @keyframes gradientAnimation {
        0% {
          background-position: 0% 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }

      #animated-background {
        background: linear-gradient(-45deg, #1e3a8a, #1e40af, #3730a3, #2563eb);
        background-size: 400% 400%;
        animation: gradientAnimation 15s ease infinite;
      }

      /* Hovering elements animation */
      @keyframes hover-bounce {
        0%, 100% {
          transform: translateY(0) translateX(0);
        }
        25% {
          transform: translateY(-15px) translateX(5px);
        }
        75% {
          transform: translateY(5px) translateX(-5px);
        }
      }

      .hover-animation {
        animation: hover-bounce 8s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);

    // Add cursor to the last text element
    const lastTextElement = document.querySelector('.typing-effect span:last-child');
    if (lastTextElement) {
      lastTextElement.classList.add('terminal-cursor');
    }

    // Add floating animations to metric cards
    const metricCards = document.querySelectorAll('.metrics-card');
    metricCards.forEach((card, index) => {
      card.classList.add(`float-${index + 1}`);
    });

    // Add hovering animation to specific elements
    const hoverElements = document.querySelectorAll('.hover-animation');
    hoverElements.forEach(el => {
      // Random delay for more natural movement
      const delay = Math.random() * 2;
      if (el instanceof HTMLElement) {
        el.style.animationDelay = `${delay}s`;
      }
    });
  }, 100);
}