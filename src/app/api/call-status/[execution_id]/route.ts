import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ execution_id: string }> } // In Next.js 15 route handlers, params is a Promise
) {
    try {
        const { execution_id } = await params;

        if (!execution_id) {
            return NextResponse.json({ error: 'Missing execution_id' }, { status: 400 });
        }

        // Use 127.0.0.1 instead of localhost for more consistent Node.js fetch resolution
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

        console.log(`[API Proxy] GET /api/call-status -> ${backendUrl}/api/call-status/${execution_id}`);

        const response = await fetch(`${backendUrl}/api/call-status/${execution_id}`);
        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || 'Failed to fetch status' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API proxy error (call-status):', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
