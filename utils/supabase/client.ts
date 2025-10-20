import { createBrowserClient } from '@supabase/ssr'
export function createClient() {
  return createBrowserClient(
    "https://wzyaqtfctpkqrfdntwog.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6eWFxdGZjdHBrcXJmZG50d29nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzE4NDMsImV4cCI6MjA3NDcwNzg0M30.vW9eCMKJSLuWqQ1PGRF7s-5uMPFXlMWGVTSiVPHduqk"
  ,{ auth: {
      persistSession: true,
      detectSessionInUrl: true,
    }
  }
  )
  
  }

