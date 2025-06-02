import { readFileSync } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function GET() {
  try {
    // Read the performance data from the file system
    const filePath = path.join(process.cwd(), 'src/data/perf.json');
    const fileContents = readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    // Return the data as JSON
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('Error reading performance data:', error);
    return NextResponse.json(
      { error: 'Failed to load performance data' },
      { status: 500 }
    );
  }
}