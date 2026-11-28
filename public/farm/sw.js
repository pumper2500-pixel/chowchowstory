// เก็บเกมไว้ในเครื่อง เล่นได้แม้ไม่มีเน็ต (ยกเว้นฟอนต์) — เปลี่ยน VERSION เมื่ออัปเดตเกม
const VERSION = "farm-v130";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION && k !== "ccs-cdn").map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  // ไฟล์โมเดล/เพลงจาก Cloudflare (มี ?v=แฮช ไม่เปลี่ยนแล้ว) → ใช้ของในเครื่องก่อน ไม่ต้องโหลดซ้ำ + เล่นออฟไลน์ได้
  if (u.hostname === "chowchowstory-cdn.pumper2500.workers.dev" || u.hostname === "chowchowstory-cdn.pages.dev") {
    e.respondWith(caches.open("ccs-cdn").then((c) => c.match(e.request).then((m) => m || fetch(e.request).then((r) => { if (r.ok && u.searchParams.has("v")) { c.put(e.request, r.clone()); c.keys().then((ks) => ks.forEach((k) => { const ku = new URL(k.url); if (ku.pathname === u.pathname && ku.search !== u.search) c.delete(k); })); } return r; }))));   // ลบไฟล์รุ่นเก่าชื่อเดียวกัน
    return;
  }
  if (u.origin !== location.origin) return;
  // เครือข่ายก่อน ถ้าออฟไลน์ค่อยใช้ของในเครื่อง จะได้เวอร์ชันใหม่เสมอเมื่อมีเน็ต
  e.respondWith(fetch(e.request).then((r) => { const cp = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then((m) => m || caches.match("./index.html"))));
});
