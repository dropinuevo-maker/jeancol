import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las variables existan
const isConfigured = supabaseUrl && supabaseAnonKey;

if (typeof window !== 'undefined' && !isConfigured) {
  console.warn('⚠️ Supabase: Faltan variables de entorno. Agrega VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en Vercel Settings → Environment Variables');
}

// Cliente de Supabase (funciona incluso sin credenciales, pero fallará en requests)
export const supabase = createClient(
  supabaseUrl || 'https://invalid.supabase.co',
  supabaseAnonKey || 'invalid-key',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    }
  }
);
