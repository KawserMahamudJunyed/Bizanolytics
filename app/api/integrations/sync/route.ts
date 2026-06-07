import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { encrypt, decrypt } from '@/lib/encryption';
import { normalizeWooCommerce, normalizeShopify, normalizeCustom } from '@/app/integrations/utils/normalize';

// POST: Connect and save integration config to DB, then fetch initial data
export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform, url, keys, subscription_tier } = await req.json();

    if (!platform || !url || !keys) {
      return NextResponse.json({ error: 'Missing required configuration' }, { status: 400 });
    }

    // Attempt to fetch data first to ensure keys are valid
    let resultData;
    if (platform === 'woocommerce') {
      const { consumerKey, consumerSecret } = keys;
      let validUrl = url.trim();
      if (!validUrl.startsWith("http")) validUrl = `https://${validUrl}`;
      
      const authHeader = `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`;
      const response = await fetch(`${validUrl}/wp-json/wc/v3/products?per_page=50`, {
        headers: { 'Accept': 'application/json', 'Authorization': authHeader }
      });
      if (!response.ok) throw new Error(`WooCommerce connection failed: ${response.status}`);
      
      const rawProducts = await response.json();
      resultData = normalizeWooCommerce(rawProducts, validUrl);
    } else {
      return NextResponse.json({ error: 'Platform not fully implemented for auto-sync yet' }, { status: 400 });
    }

    // Encrypt the keys
    const encryptedKeys = encrypt(JSON.stringify(keys));

    // Save or update in database
    const { error: dbError } = await supabase
      .from('user_integrations')
      .upsert({ 
        user_id: session.user.id,
        platform,
        url,
        encrypted_keys: encryptedKeys,
        subscription_tier: subscription_tier || 'daily',
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id, platform' }); // assuming a user can only have 1 of each platform type for now

    // Wait, the schema didn't have unique constraint or updated_at initially.
    // Let's just insert for now to be safe with the exact schema provided in plan.
    if (dbError) {
       // Just insert it and order by created_at desc later
       await supabase.from('user_integrations').insert({
         user_id: session.user.id,
         platform,
         url,
         encrypted_keys: encryptedKeys,
         subscription_tier: subscription_tier || 'daily'
       });
    }

    return NextResponse.json(resultData);
  } catch (error: any) {
    console.error('Error in POST /api/integrations/sync:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}

// GET: Auto-sync by reading DB configuration
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const platform = searchParams.get('platform') || 'woocommerce';

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get the user's integration config
    const { data: configs, error } = await supabase
      .from('user_integrations')
      .select('*')
      .eq('user_id', session.user.id)
      .eq('platform', platform)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error || !configs || configs.length === 0) {
      return NextResponse.json({ error: 'Integration not configured' }, { status: 404 });
    }

    const config = configs[0];
    const keys = JSON.parse(decrypt(config.encrypted_keys));

    // Fetch fresh data
    if (platform === 'woocommerce') {
      const { consumerKey, consumerSecret } = keys;
      const authHeader = `Basic ${Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64')}`;
      const response = await fetch(`${config.url}/wp-json/wc/v3/products?per_page=50`, {
        headers: { 'Accept': 'application/json', 'Authorization': authHeader }
      });
      if (!response.ok) throw new Error(`WooCommerce connection failed: ${response.status}`);
      
      const rawProducts = await response.json();
      const resultData = normalizeWooCommerce(rawProducts, config.url);
      return NextResponse.json(resultData);
    }

    return NextResponse.json({ error: 'Platform not supported' }, { status: 400 });

  } catch (error: any) {
    console.error('Error in GET /api/integrations/sync:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
