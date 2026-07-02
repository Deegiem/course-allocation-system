// src/app/api/reports/lecturer/[id]/generate/route.ts
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    console.log(`[API] Forwarding to: ${BACKEND_URL}/reports/lecturer/${id}/generate`);
    
    const response = await fetch(`${BACKEND_URL}/reports/lecturer/${id}/generate`, {
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
    console.error('[API] Error generating lecturer report:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate lecturer report' 
      },
      { status: 500 }
    );
  }
}