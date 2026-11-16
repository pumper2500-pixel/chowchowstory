// ใช้ตอน build เท่านั้น (server): ดึงบทความจาก Supabase เพื่อสร้างหน้า HTML ล่วงหน้าให้ Google อ่านได้
// ถ้าต่อฐานข้อมูลไม่ได้ ใช้เนื้อหาในตัวแอป (lib/content.ts) แทน build จะไม่พัง
import { STORIES, type Story } from "@/lib/content";
import { SUPABASE_KEY as KEY, SUPABASE_URL } from "@/lib/site";
let cache: Promise<Story[]> | null = null;

export function getArticles(): Promise<Story[]> {
  if (!cache) cache = load();
  return cache;
}

async function load(): Promise<Story[]> {
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 6000);
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/articles?select=slug,title,kind,minutes,body,cover&published=eq.true&order=position`,
      { headers: { apikey: KEY }, signal: ctrl.signal, cache: "force-cache" },
    );
    clearTimeout(t);
    if (!res.ok) throw new Error(String(res.status));
    const rows = (await res.json()) as Story[];
    if (rows.length) return rows;
  } catch (e) {
    console.warn("[articles] ใช้เนื้อหาในตัวแอปแทน:", (e as Error).message);
  }
  return STORIES;
}

export const excerpt = (s: Story, n = 110) => {
  const t = s.body.join(" ");
  return t.length > n ? t.slice(0, n).trimEnd() + "…" : t;
};
