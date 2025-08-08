// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Read from environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Throw an error early if env vars are missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Make sure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set in Vercel.'
  );
}

// Create the client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
