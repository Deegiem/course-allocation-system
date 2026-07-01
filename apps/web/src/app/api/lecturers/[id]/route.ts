import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch single lecturer
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lecturers/${id}`
    );
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch lecturer' },
      { status: 500 }
    );
  }
}

// PUT - Update lecturer
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lecturers/${id}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update lecturer' },
      { status: 500 }
    );
  }
}

// DELETE - Delete lecturer
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lecturers/${id}`,
      { method: 'DELETE' }
    );
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete lecturer' },
      { status: 500 }
    );
  }
}