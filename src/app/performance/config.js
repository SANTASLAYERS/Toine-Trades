// This file contains configuration for the performance page
// to ensure it's handled correctly during build

// Skip static optimization for this page
export const dynamic = 'force-dynamic';

// Explicitly mark this as a client-side rendered page
export const generateStaticParams = () => {
  return [];
};