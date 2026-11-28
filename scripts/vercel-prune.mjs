// ตอน build บน Vercel: ลบไฟล์หนักของเกม (.glb / .mp3) ออกจาก public/farm ก่อน next build
// ไฟล์พวกนี้เสิร์ฟจาก Cloudflare อยู่แล้ว (scripts/build-cdn.sh) → แต่ละ deploy บน Vercel เล็กลงมาก ไม่กินพื้นที่ Deployment Storage
// รันเฉพาะบน Vercel (มีตัวแปร VERCEL=1) · บนเครื่องเรา/Cloudflare ไฟล์ยังอยู่ครบ
import { readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
if (process.env.VERCEL) {
  const dir = "public/farm";
  let n = 0, bytes = 0;
  for (const f of readdirSync(dir)) {
    if (!/\.(glb|mp3)$/i.test(f)) continue;
    const p = join(dir, f);
    bytes += statSync(p).size;
    rmSync(p);
    n++;
  }
  console.log(`[vercel-prune] removed ${n} files (${(bytes / 1048576).toFixed(1)} MB) — served from Cloudflare`);
}
