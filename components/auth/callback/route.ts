import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  console.log('=== CALLBACK ROUTE HIT ===');
  console.log('Code:', code);
  console.log('Full URL:', requestUrl.href);

  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      console.log('Exchanging code for session...');
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('❌ Error exchanging code:', error);
        return NextResponse.redirect(`${requestUrl.origin}/auth?error=auth_failed`);
      }

      console.log('✅ Session established successfully');
      console.log('Session ID:', data.session?.user?.id);
      console.log('Provider token exists:', !!data.session?.provider_token);
      console.log('Access token exists:', !!data.session?.access_token);
      
      // Wait a moment for cookies to be set
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return NextResponse.redirect(`${requestUrl.origin}/demo`);
    } catch (err) {
      console.error('❌ Unexpected error:', err);
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=unexpected`);
    }
  }

  console.error('❌ No code in callback URL');
  return NextResponse.redirect(`${requestUrl.origin}/auth?error=no_code`);
}

export const dynamic = 'force-dynamic';