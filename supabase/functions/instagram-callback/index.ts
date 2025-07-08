
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')
    const error = url.searchParams.get('error')

    if (error) {
      return new Response(
        `<html><body><script>window.close()</script></body></html>`,
        { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
      )
    }

    if (!code) {
      throw new Error('No authorization code received')
    }

    // Trocar código por access token
    const tokenResponse = await fetch('https://api.instagram.com/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: Deno.env.get('INSTAGRAM_CLIENT_ID') || '',
        client_secret: Deno.env.get('INSTAGRAM_CLIENT_SECRET') || '',
        grant_type: 'authorization_code',
        redirect_uri: `${url.origin}/functions/v1/instagram-callback`,
        code: code,
      }),
    })

    const tokenData = await tokenResponse.json()
    
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_message || 'Failed to exchange code for token')
    }

    // Buscar dados do perfil
    const profileResponse = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${tokenData.access_token}`
    )
    const profileData = await profileResponse.json()

    // Salvar no banco de dados
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: dbError } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: req.headers.get('user-id'), // Você precisará passar isso no estado
        platform: 'instagram',
        account_id: profileData.id,
        username: profileData.username,
        display_name: profileData.username,
        access_token: tokenData.access_token,
        followers_count: profileData.media_count || 0,
        connected_at: new Date().toISOString(),
      })

    if (dbError) {
      throw dbError
    }

    // Redirecionar de volta para o app
    return new Response(
      `<html><body><script>
        window.opener?.postMessage({type: 'INSTAGRAM_SUCCESS'}, '*');
        window.close();
      </script></body></html>`,
      { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
    )

  } catch (error) {
    console.error('Instagram callback error:', error)
    return new Response(
      `<html><body><script>
        window.opener?.postMessage({type: 'INSTAGRAM_ERROR', error: '${error.message}'}, '*');
        window.close();
      </script></body></html>`,
      { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
    )
  }
})
