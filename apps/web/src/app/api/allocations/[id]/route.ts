import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const response = await fetch(
      `${BACKEND_URL}/allocations/${id}`,
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] GET /allocations/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch allocation' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    // Handle different actions
    let url = `${BACKEND_URL}/allocations/${id}`;
    const { action, ...data } = body;
    
    if (action === 'approve') {
      url = `${BACKEND_URL}/allocations/${id}/approve`;
    } else if (action === 'reject') {
      url = `${BACKEND_URL}/allocations/${id}/reject`;
    } else if (action === 'override') {
      url = `${BACKEND_URL}/allocations/${id}/override`;
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    return NextResponse.json(result, { status: response.status });
  } catch (error) {
    console.error('[API] PUT /allocations/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update allocation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const response = await fetch(
      `${BACKEND_URL}/allocations/${id}`,
      { 
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    const data = await response.json();
    
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('[API] DELETE /allocations/[id] error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete allocation' },
      { status: 500 }
    );
  }
}