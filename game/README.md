# ซอร์สเกม Chow Chow Live Simulator (`/sim` → `public/farm/`)

ซอร์ส TypeScript เดิม (`ccs-3d`: world.ts, chars.ts, nature.ts, shops3d.ts) หายไปพร้อมแชทเก่าเมื่อ 20 พ.ย. 2026
โฟลเดอร์นี้กู้คืนมาจากไฟล์เกม farm-v78 ที่ build แล้ว ตอนนี้ใช้โฟลเดอร์นี้เป็นซอร์สหลักของเกมแทน

| ไฟล์ | คืออะไร |
|---|---|
| `src/main.js` | โค้ดทั้งหมดในไฟล์เดียว จัดรูปแบบให้อ่านได้ ข้อความไทยเป็นตัวอักษรจริง (ชื่อตัวแปรยังเป็นชื่อสั้นจากการย่อโค้ด) |
| `index.template.html` | โครง HTML ของ HUD/ปุ่ม/แผง (`<!--STYLE-->` `<!--IMG-->` `<!--MAIN-->` ถูกแทนตอน build) |
| `style.css` | CSS ทั้งหมดของเกม |
| `img/*.png` | ไอคอนอาหาร ฯลฯ → `window.__IMG[ชื่อไฟล์]` (`_order.json` = ลำดับเดิม; ใส่รูปใหม่ได้เลย) |
| `build.mjs` | ประกอบกลับเป็น `public/farm/index.html` |

## แผนที่ใน `src/main.js` (ประมาณ)
- บรรทัด 1–29,440: Three.js r170
- 29,440–35,300: ส่วนเสริม Three.js (รวมเมช, GLTFLoader ฯลฯ)
- 35,300–ท้ายไฟล์: ตัวเกม — หาด้วยข้อความไทยที่เห็นในเกม เช่น ค้น `"เข้าบ้าน"`, `"ถูกจัง"`, `cdn-ok.txt`

## แก้เกมแล้ว deploy
1. แก้ `game/src/main.js` / `style.css` / `index.template.html`
2. `npm run game` → เขียน `public/farm/index.html`
3. ทดสอบในเครื่อง: `npx serve public/farm` แล้วเปิดเบราว์เซอร์ (localhost จะใช้ไฟล์โมเดลในเครื่อง ไม่ใช้ Cloudflare)
4. เพิ่มเลข `VERSION` ใน `public/farm/sw.js`
5. commit + push `main` → Vercel deploy เว็บ, Cloudflare build ไฟล์โมเดลใหม่ (`scripts/build-cdn.sh`) ให้เอง

ทดสอบแล้ว (20 พ.ย. 2026): build จากโฟลเดอร์นี้ได้หน้าเกมเหมือนต้นฉบับ เข้าเกม เดิน HUD ทำงาน ไม่มี error

## โมเดลเพิ่มเติม (v81) → `public/farm/r81.glb`
`game/tools/pack.mjs` แปลงโมเดลต้นฉบับ (ต้องมี `@gltf-transform/*`, `meshoptimizer`, `sharp`, และแปลง FBX ด้วย `fbx2gltf` ก่อน) แล้ว `merge.mjs` รวมเป็นไฟล์เดียว
- `rb_garden` สวนสายรุ้ง (CHOWCHOW_RAINBOW_GARDEN_v1 ของพี่ปั๊ม) แก้สีให้ตรง sRGB รวมเมชเหลือ ~7 ชิ้น
- `lamp_rice` โคมกระดาษสา (ตัดสายยาวออก) · `lighthouse` ประภาคาร (ลดเหลือ ~12k เหลี่ยม ภาพ 256px)

## v82 → `public/farm/r82.glb` + `public/farm/emoji3d.png`
`game/tools/pack2.mjs` (ต้นไม้ Trees Set A, ใบไม้ร่วง, รุ้ง, ตุ๊กตา 5 ตัว, Porsche Macan, เรือซาชิมิ, ชั้นขนม) → `merge.mjs` รวมเป็น r82.glb
`emoji3d.png` = อีโมจิ 3D จาก emojis_pack.glb เรนเดอร์เป็นตาราง 8×6 (ดู `ccsE3` ใน main.js ว่าช่องไหนคืออีโมจิตัวไหน)
