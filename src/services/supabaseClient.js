// Import Supabase
import { createClient } from '@supabase/supabase-js';

// Environment variables (must start with REACT_APP_ in CRA)
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Throw error if missing
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables!");
  throw new Error("Supabase URL or Anon Key not set in environment variables.");
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
