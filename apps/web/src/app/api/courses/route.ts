import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';

export async function GET(request: NextRequest) {
  try {
    console.log(`[API] Forwarding to: ${BACKEND_URL}/courses`);
    
    const searchParams = request.nextUrl.searchParams;
    const active = searchParams.get('active');
    const level = searchParams.get('level');
    const unallocated = searchParams.get('unallocated');
    
    let url = `${BACKEND_URL}/courses`;
    if (active === 'true') {
      url = `${BACKEND_URL}/courses/active`;
    } else if (level) {
      url = `${BACKEND_URL}/courses/level/${level}`;
    } else if (unallocated === 'true') {
      url = `${BACKEND_URL}/courses/unallocated`;
    }

    console.log(`[API] Fetching from: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    console.log(`[API] Response status: ${response.status}`);

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Error fetching courses:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch courses',
        details: 'Check if backend is running on http://localhost:5000'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log(`[API] POST to: ${BACKEND_URL}/courses`);
    console.log(`[API] Body:`, body);
    
    const response = await fetch(`${BACKEND_URL}/courses`, {
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
    console.error('[API] Error creating course:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to create course' 
      },
      { status: 500 }
    );
  }
}