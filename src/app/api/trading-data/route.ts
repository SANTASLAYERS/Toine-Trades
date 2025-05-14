import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Find the NinjaTrader CSV file in the project root
    const projectRoot = process.cwd();
    const files = fs.readdirSync(projectRoot);
    const csvFile = files.find(file => file.startsWith('NinjaTrader') && file.endsWith('.csv'));
    
    if (!csvFile) {
      return NextResponse.json({ 
        success: false, 
        error: 'No NinjaTrader CSV file found' 
      }, { status: 404 });
    }
    
    // Read the CSV file content
    const filePath = path.join(projectRoot, csvFile);
    const csvData = fs.readFileSync(filePath, 'utf-8');
    
    // Return the CSV data
    return NextResponse.json({ 
      success: true, 
      csvData,
      fileName: csvFile
    });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to read CSV file' 
    }, { status: 500 });
  }
}