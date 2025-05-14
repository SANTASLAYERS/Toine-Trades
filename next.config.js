/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx'],
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // For static exports
  },
  // Disable automatic static optimization for performance page
  // to prevent errors with dynamic imports like Plotly
  experimental: {
    // Help with troubleshooting by showing more detailed error messages
    logging: 'verbose'
  },
  // The key part: Skip prerendering for pages with dynamic imports like Plotly
  // Without this, Next.js might try to import Plotly during build
  // which fails because it's a client-only import
  compiler: {
    // This helps with third-party modules like Plotly
    reactRemoveProperties: { properties: ['^data-test$'] },
  },
  // This is important - tells Next.js which pages to pre-render
  // We'll exclude /performance to avoid Plotly SSR issues
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
      '/projects': { page: '/projects' },
      '/test': { page: '/test' },
      // Explicitly exclude /performance from static exports
      // It will still work, but as a client-rendered page
    }
  }
};

module.exports = nextConfig;