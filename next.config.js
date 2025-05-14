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
  experimental: {
    // Help with troubleshooting by showing more detailed error messages
    logging: 'verbose'
  },
  // Set this to help with debugging 404s
  trailingSlash: false,
  // Adding output configuration
  output: 'standalone',
  // Ensure source maps are generated
  productionBrowserSourceMaps: true
};

module.exports = nextConfig;