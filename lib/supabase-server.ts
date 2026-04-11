import { createClient } from '@supabase/supabase-js';

const getSupabaseServerClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const anonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  if (!supabaseUrl) {
    throw new Error('Missing Supabase URL. Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL');
  }

  // Only use service role key if it's valid (not a placeholder)
  const isValidServiceRole = serviceRoleKey && !serviceRoleKey.includes('your_') && serviceRoleKey.length > 20;
  const supabaseKey = isValidServiceRole ? serviceRoleKey : anonKey;
  
  if (!supabaseKey) {
    throw new Error('Missing Supabase key. Set SUPABASE_SERVICE_ROLE_KEY, SUPABASE_ANON_KEY, or NEXT_PUBLIC_SUPABASE_ANON_KEY');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
};

export { getSupabaseServerClient };
