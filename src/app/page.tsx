import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col space-y-8">
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg p-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Algorithmic Trading Portfolio</h1>
          <p className="text-xl mb-6">
            Leveraging data science and machine learning to create profitable trading strategies
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
            I'm a quantitative trader and software engineer with expertise in algorithmic trading,
            financial modeling, and machine learning. With over 5 years of experience in developing
            trading systems, I specialize in futures and options markets.
          </p>
          <p className="text-gray-600 mb-4">
            My trading approach combines statistical arbitrage with advanced risk management techniques
            to generate consistent returns while minimizing drawdowns.
          </p>
          <div className="flex items-center mt-6">
            <div className="mr-8">
              <p className="text-sm text-gray-500">Education</p>
              <p className="font-medium">MSc in Financial Engineering</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">Chicago, IL</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Skills & Expertise</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Technical</h3>
              <ul className="space-y-1 text-gray-600">
                <li>Python, R, TypeScript</li>
                <li>Machine Learning / ML Ops</li>
                <li>Time Series Analysis</li>
                <li>Statistical Modeling</li>
                <li>Cloud Infrastructure</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Trading</h3>
              <ul className="space-y-1 text-gray-600">
                <li>Algorithmic Strategies</li>
                <li>Futures & Options</li>
                <li>Risk Management</li>
                <li>NinjaTrader</li>
                <li>Market Microstructure</li>
              </ul>
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
    </div>
  );
}
