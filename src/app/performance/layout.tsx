import React from 'react';

// This ensures the performance page is always server-rendered with fresh data
export const dynamic = 'force-dynamic';

export default function PerformanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
    </>
  );
}