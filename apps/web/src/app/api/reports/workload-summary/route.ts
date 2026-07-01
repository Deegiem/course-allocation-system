import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';

export async function POST(request: NextRequest) {
  try {
    const response = await fetch(`${BACKEND_URL}/reports/workload-summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate workload summary' },
      { status: 500 }
    );
  }
}