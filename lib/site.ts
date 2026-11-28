// โดเมนจริง (ใช้ทำ canonical / sitemap / ลิงก์แชร์) · chowchowstory.vercel.app ยังเปิดได้ แต่ชี้ canonical มาที่นี่
export const SITE_URL = "https://chowchowstory.com";
export const SITE_NAME = "ChowChowStory";

// โปรเจกต์ Supabase ของ ChowChowStory — ตั้งค่าตรงนี้ที่เดียว
// จงใจไม่อ่าน NEXT_PUBLIC_SUPABASE_* : การเชื่อม Supabase ผ่านหน้า Vercel จะสร้างโปรเจกต์ใหม่
// แล้วใส่ค่าทับให้อัตโนมัติ ทำให้เว็บไปต่อผิดฐานข้อมูล (เกิดขึ้นจริงแล้วครั้งหนึ่ง)
// คีย์นี้เป็น publishable key ฝังในเว็บได้ ข้อมูลป้องกันด้วย RLS — ห้ามใส่ service_role / secret key
export const SUPABASE_URL = "https://bemlqajyipfxlhpingnl.supabase.co";
export const SUPABASE_KEY = "sb_publishable_-AF9Ogu0P4SXMNfmvYo6AA_0nwozbTe";
