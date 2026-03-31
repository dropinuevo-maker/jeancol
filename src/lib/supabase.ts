import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar credenciales
const hasCredentials = supabaseUrl && supabaseAnonKey && supabaseUrl.includes('supabase.co');

// Crear cliente siempre (Supabase maneja credenciales inválidas mejor)
export const supabase: SupabaseClient = createClient(
  hasCredentials ? supabaseUrl : 'https://mfrgvkrhrzxmuuadprrx.supabase.co',
  hasCredentials ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcmd2a3Jocnp4bXV1YWRwcnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODMzMDcsImV4cCI6MjA5MDE1OTMwN30.RFog6BanjMbvqCMsT4nFgve3a7JKVnC24jwFHg4XDJw',
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        // Evitar errores en browser
        'apikey': hasCredentials ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mcmd2a3Jocnp4bXV1YWRwcnJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1ODMzMDcsImV4cCI6MjA5MDE1OTMwN30.RFog6BanjMbvqCMsT4nFgve3a7JKVnC24jwFHg4XDJw'
      }
    }
  }
);
