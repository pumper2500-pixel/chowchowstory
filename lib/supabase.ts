import { createClient } from "@supabase/supabase-js";

import { SUPABASE_KEY, SUPABASE_URL } from "@/lib/site";

export { SUPABASE_URL };

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export type Article = { slug: string; title: string; kind: string; minutes: number; body: string[] };
export type Memorial = { id: string; dog_name: string; years: string | null; message: string; status: string; created_at: string };

export type DogPost = {
  id: string; dog_name: string; caption: string; photo_path: string; status: "pending" | "approved" | "rejected";
  reject_reason: string | null; created_at: string; user_id?: string;
};

export const photoUrl = (path: string) => supabase.storage.from("dog-photos").getPublicUrl(path).data.publicUrl;
