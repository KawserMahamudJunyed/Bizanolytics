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
    
    // Attempt to extract array from various common response structures
    let productsArray: any[] = [];
    if (Array.isArray(data)) {
        productsArray = data;
    } else if (data && Array.isArray(data.products)) {
        productsArray = data.products;
    } else if (data && Array.isArray(data.data)) {
        productsArray = data.data;
    } else if (data && Array.isArray(data.items)) {
        productsArray = data.items;
    } else {
        productsArray = [data]; // Fallback
    }

    return NextResponse.json({ products: productsArray, endpointUrl });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
