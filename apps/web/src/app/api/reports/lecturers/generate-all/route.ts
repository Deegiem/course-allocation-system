// src/app/api/reports/lecturers/generate-all/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log(`[API] Forwarding to: ${BACKEND_URL}/reports/lecturers/generate-all`);
    
    const response = await fetch(`${BACKEND_URL}/reports/lecturers/generate-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    console.log(`[API] Response status: ${response.status}`);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Error generating all lecturer reports:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate lecturer reports' 
      },
      { status: 500 }
    );
  }
}