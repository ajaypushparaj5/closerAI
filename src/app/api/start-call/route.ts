import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();

        // Ensure we handle localhost or environment variable based backend URL
        // Use 127.0.0.1 instead of localhost for more consistent Node.js fetch resolution
        const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';

        console.log(`[API Proxy] POST /api/start-call -> ${backendUrl}/api/start-call`);

        const response = await fetch(`${backendUrl}/api/start-call`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(
                { error: data.error || 'Failed to start call' },
                { status: response.status }
            );
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error('API proxy error (start-call):', error);
        return NextResponse.json(
            { error: 'Internal Server Error', details: error.message },
            { status: 500 }
        );
    }
}
