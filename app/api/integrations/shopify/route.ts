import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { domain, storefrontToken } = await req.json();

    if (!domain || !storefrontToken) {
      return NextResponse.json({ error: 'Missing domain or storefrontToken' }, { status: 400 });
    }

    const shopUrl = domain.includes('myshopify.com') ? domain : `${domain}.myshopify.com`;
    const endpoint = `https://${shopUrl}/api/2024-01/graphql.json`;

    // A basic query to get products from Shopify Storefront API
    const query = `
      {
        products(first: 50) {
          edges {
            node {
              id
              title
              description
              productType
              totalInventory
              variants(first: 1) {
                edges {
                  node {
                    price { amount }
                  }
                }
              }
            }
          }
        }
      }
    `;

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontToken
      },
      body: JSON.stringify({ query })
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Shopify API returned status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Map price { amount } to price string so normalizeShopify works
    const edges = data.data?.products?.edges || [];
    edges.forEach((edge: any) => {
      const variants = edge.node?.variants?.edges || [];
      variants.forEach((vEdge: any) => {
        if (vEdge.node?.price?.amount) {
          vEdge.node.price = vEdge.node.price.amount;
        }
      });
    });

    return NextResponse.json({ products: edges, domain });

  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
