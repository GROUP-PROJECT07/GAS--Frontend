import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_KEY || process.env.VITE_SUPABASE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing.');
  throw new Error('Missing Supabase environment variables! Check Vercel or .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
