import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';

export async function GET(request: NextRequest) {
  try {
    console.log(`[API] Forwarding to: ${BACKEND_URL}/lecturers`);
    
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get('active');
    const staffId = searchParams.get('staffId');
    
    let url = `${BACKEND_URL}/lecturers`;
    if (active === 'true') {
      url = `${BACKEND_URL}/lecturers/active`;
    } else if (staffId) {
      url = `${BACKEND_URL}/lecturers/staff/${staffId}`;
    }

    console.log(`[API] Fetching from: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      // Add timeout to avoid hanging
      signal: AbortSignal.timeout(10000),
    });

    console.log(`[API] Response status: ${response.status}`);

    const data = await response.json();
    console.log(`[API] Response data:`, data);

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Error fetching lecturers:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch lecturers',
        details: 'Check if backend is running on http://localhost:5000'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log(`[API] POST to: ${BACKEND_URL}/lecturers`);
    console.log(`[API] Body:`, body);
    
    const response = await fetch(`${BACKEND_URL}/lecturers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Error creating lecturer:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create lecturer' 
      },
      { status: 500 }
    );
  }
}