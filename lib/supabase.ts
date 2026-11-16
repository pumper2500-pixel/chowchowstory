import { createClient } from "@supabase/supabase-js";

// โปรเจกต์ Supabase ของ ChowChowStory — ตั้งค่าตรงนี้ที่เดียว
// จงใจไม่อ่าน NEXT_PUBLIC_SUPABASE_* : การเชื่อม Supabase ผ่านหน้า Vercel จะสร้างโปรเจกต์ใหม่
// แล้วใส่ค่าทับให้อัตโนมัติ ทำให้เว็บไปต่อผิดฐานข้อมูล (เกิดขึ้นจริงแล้วครั้งหนึ่ง)
//
// คีย์นี้เป็น publishable key ฝังในเว็บได้ ข้อมูลป้องกันด้วย RLS ฝั่งฐานข้อมูล
// ห้ามใส่ service_role / secret key ในโค้ดฝั่งเว็บเด็ดขาด
export const SUPABASE_URL = "https://bemlqajyipfxlhpingnl.supabase.co";
const SUPABASE_KEY = "sb_publishable_-AF9Ogu0P4SXMNfmvYo6AA_0nwozbTe";

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
