import { createClient } from '@supabase/supabase-js';

// Helper to safely access environment variables in various environments (Vite, Node, etc.)
const getEnvVar = (key: string) => {
  try {
    // Check for Vite's import.meta.env
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
    // Check for process.env
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore errors if accessing objects fails
  }
  return null;
};

// Use a valid placeholder URL to prevent 'Invalid supabaseUrl' crashes if env vars are missing.
// Note: Calls to Supabase will fail network requests until valid credentials are provided.
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 'https://agajzyxsdksgdikiuwqc.supabase.co';
const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnYWp6eXhzZGtzZ2Rpa2l1d3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NjI2MjAsImV4cCI6MjA4NjUzODYyMH0.BbQswkP-gN59lo9JRxpAcQqmHvbUCZ5LwshKcwICKXQ';

export const supabase = createClient(supabaseUrl, supabaseKey);