import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const response = await fetch(`${BACKEND_URL}/reports/${id}/export`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Check if response is PDF (content-type application/pdf)
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/pdf')) {
      // Get the PDF buffer
      const pdfBuffer = await response.arrayBuffer();
      
      // Return the PDF with proper headers
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': response.headers.get('content-disposition') || 'attachment; filename=report.pdf',
          'Content-Length': response.headers.get('content-length') || String(pdfBuffer.byteLength),
        },
      });
    } else {
      // If not PDF, return as JSON
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error('[API] Export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export report' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const response = await fetch(`${BACKEND_URL}/reports/${id}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/pdf')) {
      const pdfBuffer = await response.arrayBuffer();
      
      return new NextResponse(pdfBuffer, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': response.headers.get('content-disposition') || 'attachment; filename=report.pdf',
          'Content-Length': response.headers.get('content-length') || String(pdfBuffer.byteLength),
        },
      });
    } else {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error('[API] Export error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to export report' },
      { status: 500 }
    );
  }
}