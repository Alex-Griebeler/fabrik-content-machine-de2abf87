import { createClient } from "@supabase/supabase-js";

// Cliente conectado ao Supabase externo do projeto Fabrik
const EXTERNAL_SUPABASE_URL = "https://ziyotbtiaeyvsdawthpl.supabase.co";
const EXTERNAL_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeW90YnRpYWV5dnNkYXd0aHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwNzM4ODEsImV4cCI6MjA4ODY0OTg4MX0.bkAm-0j7EN7gekOggMOsaA-QEkGmxkcXyKTQiNRvQ30";

export const supabaseExternal = createClient(
  EXTERNAL_SUPABASE_URL,
  EXTERNAL_SUPABASE_ANON_KEY
);
