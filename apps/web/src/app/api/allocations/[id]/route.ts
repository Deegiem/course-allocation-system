import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000/api/v1';

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { action, ...data } = body;

        let url = `${BACKEND_URL}/allocations/${id}`;
        if (action === 'approve') {
            url = `${BACKEND_URL}/allocations/${id}/approve`;
        } else if (action === 'reject') {
            url = `${BACKEND_URL}/allocations/${id}/reject`;
        } else if (action === 'override') {
            url = `${BACKEND_URL}/allocations/${id}/override`;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return NextResponse.json(result, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to update allocation' },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const response = await fetch(`${BACKEND_URL}/allocations/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: 'Failed to delete allocation' },
            { status: 500 }
        );
    }
}