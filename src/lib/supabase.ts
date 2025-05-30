// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js';

// Access environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
