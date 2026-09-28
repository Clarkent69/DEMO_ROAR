import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://vsgjczzksykgjukrchnm.supabase.co';

const SUPABASE_ANON_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzZ2pjenprc3lrZ2p1a3JjaG5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1NDgwNjcsImV4cCI6MjEwNjEyNDA2N30.V1BXWAiABuuzSRQJ_ZhIyXhf7w3JKJzWBvJyMMzeeU8';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
