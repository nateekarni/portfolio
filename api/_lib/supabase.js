import { createClient } from '@supabase/supabase-js';

// Create Supabase client with service role for admin operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables! Check your .env or Vercel project settings.');
}

// Admin client (fallback to null if config missing to prevent crash on import)
export const supabaseAdmin = (supabaseUrl && (supabaseServiceKey || supabaseAnonKey))
  ? createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  : null;

// Public client
export const supabasePublic = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  : null;

export default supabaseAdmin;
