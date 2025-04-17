
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Mercado Pago access token
const MERCADO_PAGO_ACCESS_TOKEN = Deno.env.get('MERCADO_PAGO_ACCESS_TOKEN') || 'TEST-1074197040461480-041717-beb14c913921e2b42e8fbbb1bc3e5a9f-602507643'

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { amount, description, memberId } = await req.json()

    if (!amount || !memberId) {
      return new Response(JSON.stringify({ error: 'Amount and memberId are required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    // Configura a preferência de pagamento
    const preference = {
      items: [{
        title: description || 'Pagamento',
        unit_price: Number(amount),
        quantity: 1,
      }],
      external_reference: memberId,
      back_urls: {
        success: `${req.headers.get('origin')}/payments/success`,
        failure: `${req.headers.get('origin')}/payments/failure`,
        pending: `${req.headers.get('origin')}/payments/pending`,
      },
      auto_return: "approved",
      notification_url: `${Deno.env.get('SUPABASE_URL') || req.headers.get('origin')}/mercadopago-webhook`,
    }

    console.log('Creating Mercado Pago preference:', JSON.stringify(preference))
    console.log('Using access token:', MERCADO_PAGO_ACCESS_TOKEN.substring(0, 10) + '...')

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(preference),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('Mercado Pago error response:', response.status, errorData)
      throw new Error(`Failed to create preference (status ${response.status}): ${errorData}`)
    }

    const data = await response.json()
    console.log('Mercado Pago preference created successfully:', data.id)

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Error in mercadopago function:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
