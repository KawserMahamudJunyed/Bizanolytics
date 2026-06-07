import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { siteUrl, consumerKey, consumerSecret } = await req.json();

    if (!siteUrl || !consumerKey || !consumerSecret) {
      return NextResponse.json({ error: 'Missing required WooCommerce credentials' }, { status: 400 });
    }

    let validUrl = siteUrl.trim();
    if (!validUrl.startsWith("http")) validUrl = `https://${validUrl}`;

    const endpoint = `${validUrl}/wp-json/wc/v3/products?per_page=50`;
    
    // Create Basic Auth header
    const authHeader = `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`;

    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': authHeader
      }
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `WooCommerce API returned status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json({ products: data, siteUrl: validUrl });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
