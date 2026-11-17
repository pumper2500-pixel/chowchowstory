// เก็บเกมไว้ในเครื่อง เล่นได้แม้ไม่มีเน็ต (ยกเว้นฟอนต์) — เปลี่ยน VERSION เมื่ออัปเดตเกม
const VERSION = "farm-v34";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin) return;
  // เครือข่ายก่อน ถ้าออฟไลน์ค่อยใช้ของในเครื่อง จะได้เวอร์ชันใหม่เสมอเมื่อมีเน็ต
  e.respondWith(fetch(e.request).then((r) => { const cp = r.clone(); caches.open(VERSION).then((c) => c.put(e.request, cp)); return r; }).catch(() => caches.match(e.request).then((m) => m || caches.match("./index.html"))));
});
