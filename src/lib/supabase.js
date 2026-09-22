import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://ndzhbpllbajujofkhhxc.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kemhicGxsYmFqdWpvZmtoaHhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAwNDM3OTgsImV4cCI6MjEwNTYxOTc5OH0.b9CzF8gTlNcHbaV_72cB9I7XlsK5C7-bqdkN9slB4oY";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
