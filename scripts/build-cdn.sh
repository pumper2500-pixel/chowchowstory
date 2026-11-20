#!/usr/bin/env bash
# สร้างโฟลเดอร์ cdn/ สำหรับ Cloudflare Pages (เฉพาะไฟล์หนักของเกม: .glb / .mp3)
# ตั้งค่าใน Cloudflare Pages: Build command = bash scripts/build-cdn.sh · Build output directory = cdn
set -euo pipefail
rm -rf cdn && mkdir -p cdn/farm
cp public/farm/*.glb public/farm/*.mp3 cdn/farm/
cp cloudflare/_headers cdn/_headers
# รายชื่อไฟล์ + แฮช (เกมเช็กไฟล์นี้ก่อน: ไฟล์ไหนไม่มีบน Cloudflare จะใช้ของ Vercel แทน)
{ echo "ccs $(date -u +%Y%m%d%H%M)"; for f in cdn/farm/*.glb cdn/farm/*.mp3; do echo "$(basename "$f") $(md5sum "$f" | cut -c1-10)"; done; } > cdn/farm/cdn-ok.txt
echo '<!doctype html><meta charset="utf-8"><title>ChowChowStory assets</title><p>ไฟล์เกม ChowChowStory · <a href="https://chowchowstory.vercel.app/sim">เล่นเกม</a></p>' > cdn/index.html
echo "cdn: $(ls cdn/farm | wc -l) files, $(du -sh cdn | cut -f1)"
