import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    const authHeader = req.headers.get('authorization');
    const token = authHeader ? authHeader.replace('Bearer ', '') : undefined;
    
    const { data: { user }, error: authError } = token ? await supabase.auth.getUser(token) : await supabase.auth.getUser();
    
    if (!user) {
      console.error("Auth error in subscription POST:", authError);
      return NextResponse.json({ error: 'Your login session has expired or is invalid. Please refresh the page to log in again.' }, { status: 401 });
    }

    const { platform, subscription_tier } = await req.json();

    if (!platform || !subscription_tier) {
      return NextResponse.json({ error: 'Missing required configuration' }, { status: 400 });
    }

    const { error } = await supabase
      .from('user_integrations')
      .update({ subscription_tier })
      .eq('user_id', user.id)
      .eq('platform', platform);

    if (error) {
      console.error("DB Update Error", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
