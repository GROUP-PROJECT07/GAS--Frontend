import { createClient } from '@supabase/supabase-js';

<<<<<<< HEAD
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Ensure environment variables are loaded
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase; 

=======
/**
 * Reads Supabase configuration from environment variables.
 * 
 * IMPORTANT:
 * - In React, env vars must be prefixed with REACT_APP_ to be accessible in the browser.
 * - On Vercel, add REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY
 *   in Project Settings > Environment Variables.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Ensure the environment variables exist before creating the client
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    ' Missing Supabase environment variables. ' +
    'Ensure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are set.'
  );
}

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: quick connection check on startup
(async () => {
  try {
    const { error } = await supabase.from('_test').select('*').limit(1);
    if (error) {
      console.warn(' Supabase connection test failed:', error.message);
    } else {
      console.log(' Supabase client initialized successfully.');
    }
  } catch (err) {
    console.error(' Error initializing Supabase:', err);
  }
})();

export default supabase;
>>>>>>> 40c6c857a1e519340b39f19e58e801da0ed95b7e
