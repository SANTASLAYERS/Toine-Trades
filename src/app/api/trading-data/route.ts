import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch the CSV file from the public directory via its URL
    // This works better on Vercel than using the file system
    const response = await fetch(process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}/data/NinjaTrader-sample.csv` 
      : 'http://localhost:3000/data/NinjaTrader-sample.csv');

    if (!response.ok) {
      return NextResponse.json({ 
        success: false, 
        error: 'No NinjaTrader CSV file found in public/data directory' 
      }, { status: 404 });
    }
    
    // Get the CSV data as text
    const csvData = await response.text();
    
    // Return the CSV data
    return NextResponse.json({ 
      success: true, 
      csvData,
      fileName: 'NinjaTrader-sample.csv' // Hardcoded for simplicity
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to read CSV file' 
    }, { status: 500 });
  }
}