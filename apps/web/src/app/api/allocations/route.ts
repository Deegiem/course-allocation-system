import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lecturerId = searchParams.get('lecturerId');
    const courseId = searchParams.get('courseId');
    const status = searchParams.get('status');
    const distribution = searchParams.get('distribution');
    
    let url = `${BACKEND_URL}/allocations`;
    
    // Build query string instead of using path params
    const params = new URLSearchParams();
    if (lecturerId) params.append('lecturerId', lecturerId);
    if (courseId) params.append('courseId', courseId);
    if (status) params.append('status', status);
    if (distribution === 'true') params.append('distribution', 'true');
    
    const queryString = params.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    console.log(`[API] Fetching from: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(10000),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Error fetching allocations:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch allocations',
        details: 'Check if backend is running on http://localhost:5000'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${BACKEND_URL}/allocations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] Error creating allocation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create allocation' },
      { status: 500 }
    );
  }
}