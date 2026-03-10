import { createClient } from "@supabase/supabase-js";

// Cliente conectado ao Supabase externo do projeto Fabrik
const EXTERNAL_SUPABASE_URL = "https://ziyotbtiaeyvsdawthpl.supabase.co";
const EXTERNAL_SUPABASE_ANON_KEY = "sb_publishable_2WXDiYXeEPJ6RQ2hRI2qEw_HSJ0WgQ3";

export const supabaseExternal = createClient(
  EXTERNAL_SUPABASE_URL,
  EXTERNAL_SUPABASE_ANON_KEY
);
