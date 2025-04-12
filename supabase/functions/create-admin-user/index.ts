
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase environment variables are not set')
    }

    // Create Supabase client with admin privileges using service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Define admin user
    const adminEmail = 'admin@example.com'
    const adminPassword = 'admin'

    // Check if admin user already exists
    const { data: existingUser, error: existingUserError } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', adminEmail)
      .maybeSingle()

    if (existingUserError) {
      throw new Error(`Error checking existing user: ${existingUserError.message}`)
    }

    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          message: 'Admin user already exists',
          user: adminEmail,
          password: adminPassword
        }), 
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // Create admin user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { username: 'admin' }
    })

    if (authError) {
      throw new Error(`Error creating admin user: ${authError.message}`)
    }

    return new Response(
      JSON.stringify({ 
        message: 'Admin user created successfully', 
        user: adminEmail,
        password: adminPassword
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error creating admin user:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
