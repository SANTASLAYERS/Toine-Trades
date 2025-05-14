import { NextResponse } from 'next/server';

// Set nodejs runtime to avoid Edge compatibility issues
export const runtime = 'nodejs';

export async function GET() {
  console.log('API Route Handler Triggered');
  
  try {
    // When deployed on Vercel, use the full URL from the server environment
    // For local development, fall back to a relative path
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000';
    
    console.log('Base URL for fetching:', baseUrl);
    
    // Try to fetch the sample CSV file first
    const sampleUrl = `${baseUrl}/data/NinjaTrader-sample.csv`;
    console.log('Attempting to fetch CSV from:', sampleUrl);
    let response = await fetch(sampleUrl, { cache: 'no-store' });
    
    // If that fails, try the most recent CSV file
    if (!response.ok) {
      const fullUrl = `${baseUrl}/data/NinjaTrader Grid 2025-05-13 08-18 PM.csv`;
      console.log('First fetch failed, trying:', fullUrl);
      response = await fetch(fullUrl, { cache: 'no-store' });
    }
    
    // If both attempts fail, try a direct fetch as a last resort
    if (!response.ok) {
      console.log('Second fetch failed, trying direct fetch to /data/perf.json');
      response = await fetch(`${baseUrl}/data/perf.json`, { cache: 'no-store' });
    }
    
    // If all attempts fail
    if (!response.ok) {
      console.error('All fetch attempts failed, last status:', response.status);
      return NextResponse.json({ 
        success: false, 
        error: 'No NinjaTrader CSV file found in public/data directory',
        attempted_urls: [
          `${baseUrl}/data/NinjaTrader-sample.csv`,
          `${baseUrl}/data/NinjaTrader Grid 2025-05-13 08-18 PM.csv`,
          `${baseUrl}/data/perf.json`
        ]
      }, { status: 404 });
    }
    
    // Get the CSV data as text
    console.log('Fetch successful, getting text content');
    const csvData = await response.text();
    console.log('CSV data retrieved, content length:', csvData.length);
    
    // Return the CSV data
    return NextResponse.json({ 
      success: true, 
      csvData,
      fileName: response.url.split('/').pop() || 'NinjaTrader-sample.csv'
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to read CSV file',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}