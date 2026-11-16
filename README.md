# ChowChowStory

เว็บ + แอปเรื่องเล่าและคู่มือเลี้ยงเชาเชาในเมืองร้อน มีน้องเชาเชาเดินเล่นในฉาก สะสมกระดูกแล้วปลดล็อกเพื่อนตัวใหม่

**Stack:** Next.js 15 (App Router, static export) · Tailwind 4 · Supabase (ตั้งแต่ M02) · Capacitor (M06)

## รันในเครื่อง

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # ทดสอบตรรกะเลเวล / กระดูก / เกณฑ์ความร้อน
npm run build      # ได้ไฟล์ static ใน out/
```

## ขึ้น Vercel

ทางที่ 1 — ผ่าน GitHub (แนะนำ ได้ deploy อัตโนมัติทุกครั้งที่ push)
1. สร้าง repo เปล่าบน GitHub แล้ว push โฟลเดอร์นี้ขึ้นไป
2. Vercel › Add New › Project › Import repo นั้น › Deploy (ค่าตั้งต้นใช้ได้เลย)

ทางที่ 2 — จากเครื่องตรง ๆ
```bash
npx vercel        # ครั้งแรกจะให้ login และถามชื่อโปรเจกต์
npx vercel --prod
```

## โครงสร้าง

```
app/            หน้าเว็บ: / stories guide tools memorial
components/     Scene (ฉากน้องเดิน), Chrome (เมนูล่าง, toast, หัวหน้า)
lib/content.ts  คอนเทนต์ทั้งหมด (M02 ย้ายเข้า Supabase)
lib/game-core.mjs  ตรรกะล้วน: เลเวล กระดูก เกณฑ์ความร้อน (+ test)
lib/game.tsx    state ของเกม (M01 = localStorage, M02 = Supabase)
public/img/     ตัวการ์ตูนเชาเชา (ลิขสิทธิ์ของเจ้าของโปรเจกต์)
```

## Milestones

| # | งาน | สถานะ |
|---|---|---|
| 01 | App Structure: Next.js + Tailwind, 5 หน้า, ฉากน้องเดิน, ระบบกระดูก, build static | ✅ |
| 02 | Supabase: ตาราง articles / profiles / memorials, สมัคร-เข้าสู่ระบบ, sync กระดูกข้ามเครื่อง | ⏳ |
| 03 | Upload: ส่งรูปและเรื่องของน้อง, ย่อรูป, คิวอนุมัติ | |
| 04 | หน้าอ่าน: URL บทความแยก, ค้นหา, กำแพงความทรงจำ, SEO | |
| 05 | Studio: เขียนบทความ, อนุมัติโพสต์, สินค้า Affiliate, สถิติ | |
| 06 | แอป: Capacitor, แจ้งเตือนความร้อน, ส่ง App Store / Play Store | |

### ตรวจรับ M01 (ผ่านแล้ว)
- เปิดครบ 5 หน้าบนจอมือถือ 390px ไม่มี error
- น้องเดินจริง แตะแล้วพูดคำแนะนำ
- ทำภารกิจครบได้ 70 กระดูก = ผลรวมที่คาดไว้ เลเวลขึ้นแล้วมีน้องตัวที่ 2 เดินเข้ามา
- รีโหลดแล้วกระดูกยังอยู่
- เกณฑ์ความร้อนผ่าน unit test
