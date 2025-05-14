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
  
  // Image optimization settings
  images: {
    unoptimized: true, // For static exports
  },
  
  // Debug settings
  experimental: {
    logging: 'verbose'
  },
  
  // Production settings
  productionBrowserSourceMaps: true,
  
  // Compiler options
  compiler: {
    reactRemoveProperties: { properties: ['^data-test$'] },
  },
};

module.exports = nextConfig;