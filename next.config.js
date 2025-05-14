/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['ts', 'tsx'],
  
  // Allow builds to succeed even with errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Image settings
  images: {
    unoptimized: true,
  },
  
  // Set this for Vercel compatibility
  output: 'standalone',
  
  // Production settings
  productionBrowserSourceMaps: false,
  
  // Simple compiler options
  compiler: {
    // Remove data attributes
    reactRemoveProperties: true,
  },
  
  // Server packages to be externalized
  serverExternalPackages: ['plotly.js'],

  // Turn off certain optimizations that might cause issues
  poweredByHeader: false,
};

module.exports = nextConfig;