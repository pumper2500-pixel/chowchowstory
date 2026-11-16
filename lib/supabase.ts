import { createClient } from "@supabase/supabase-js";

// คีย์นี้เป็น publishable key (ฝังในเว็บได้) ข้อมูลถูกป้องกันด้วย RLS ฝั่งฐานข้อมูล
// ห้ามใส่ service_role / secret key ในโค้ดฝั่งเว็บเด็ดขาด
const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://bemlqajyipfxlhpingnl.supabase.co";
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_-AF9Ogu0P4SXMNfmvYo6AA_0nwozbTe";

export const supabase = createClient(URL, KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
});

export type Article = { slug: string; title: string; kind: string; minutes: number; body: string[] };
export type Memorial = { id: string; dog_name: string; years: string | null; message: string; status: string; created_at: string };
