import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Try to fetch the sample CSV file first
    let response = await fetch('/data/NinjaTrader-sample.csv');

    // If that fails, try the most recent CSV file
    if (!response.ok) {
      response = await fetch('/data/NinjaTrader Grid 2025-05-13 08-18 PM.csv');
    }

    // If all attempts fail
    if (!response.ok) {
      console.error('Failed to fetch CSV file, status:', response.status);
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
      fileName: response.url.split('/').pop() || 'NinjaTrader-sample.csv'
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to read CSV file' 
    }, { status: 500 });
  }
}