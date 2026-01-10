import { createClient } from '@supabase/supabase-js';

// Try to load environment variables from .env.local for local development
// In Vercel, environment variables are automatically available
try {
  // Only load dotenv in development (not in Vercel production)
  if (process.env.NODE_ENV !== 'production') {
    const { config } = await import('dotenv');
    config({ path: '.env.local' });
  }
} catch (error) {
  // dotenv might not be available in production, that's okay
}

// Create Supabase client with service role for admin operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Only show warning in development mode
if (process.env.NODE_ENV !== 'production' && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('Missing Supabase environment variables! Check your .env or Vercel project settings.');
  console.warn('API endpoints will return empty data for database operations.');
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
