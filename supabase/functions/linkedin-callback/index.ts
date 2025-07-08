
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
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: `${url.origin}/functions/v1/linkedin-callback`,
        client_id: Deno.env.get('LINKEDIN_CLIENT_ID') || '',
        client_secret: Deno.env.get('LINKEDIN_CLIENT_SECRET') || '',
      }),
    })

    const tokenData = await tokenResponse.json()
    
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || 'Failed to exchange code for token')
    }

    // Buscar dados do perfil
    const profileResponse = await fetch(
      'https://api.linkedin.com/v2/people/~:(id,firstName,lastName,profilePicture(displayImage~:playableStreams))',
      {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      }
    )
    const profileData = await profileResponse.json()

    // Salvar no banco de dados
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const displayName = `${profileData.firstName?.localized?.pt_BR || profileData.firstName?.localized?.en_US || ''} ${profileData.lastName?.localized?.pt_BR || profileData.lastName?.localized?.en_US || ''}`.trim()

    const { error: dbError } = await supabase
      .from('social_accounts')
      .upsert({
        user_id: req.headers.get('user-id'), // Você precisará passar isso no estado
        platform: 'linkedin',
        account_id: profileData.id,
        username: profileData.id,
        display_name: displayName,
        access_token: tokenData.access_token,
        refresh_token: tokenData.refresh_token,
        token_expires_at: new Date(Date.now() + tokenData.expires_in * 1000).toISOString(),
        profile_picture_url: profileData.profilePicture?.displayImage?.elements?.[0]?.identifiers?.[0]?.identifier,
        connected_at: new Date().toISOString(),
      })

    if (dbError) {
      throw dbError
    }

    // Redirecionar de volta para o app
    return new Response(
      `<html><body><script>
        window.opener?.postMessage({type: 'LINKEDIN_SUCCESS'}, '*');
        window.close();
      </script></body></html>`,
      { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
    )

  } catch (error) {
    console.error('LinkedIn callback error:', error)
    return new Response(
      `<html><body><script>
        window.opener?.postMessage({type: 'LINKEDIN_ERROR', error: '${error.message}'}, '*');
        window.close();
      </script></body></html>`,
      { headers: { ...corsHeaders, 'Content-Type': 'text/html' } }
    )
  }
})
