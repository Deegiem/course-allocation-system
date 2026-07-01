import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    
    // Your logic here - fetch workload for lecturer
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/lecturers/${id}/workload`
    );
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch workload' },
      { status: 500 }
    );
  }
}