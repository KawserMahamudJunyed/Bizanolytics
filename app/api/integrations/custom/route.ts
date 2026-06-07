import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { endpointUrl, bearerToken } = await req.json();

    if (!endpointUrl) {
      return NextResponse.json({ error: 'Missing endpointUrl' }, { status: 400 });
    }

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };

    if (bearerToken) {
      headers['Authorization'] = `Bearer ${bearerToken}`;
    }

    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `External API returned status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ products: data, endpointUrl });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
