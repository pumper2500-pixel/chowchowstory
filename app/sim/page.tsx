"use client";

import { useEffect, useRef, useState } from "react";
import { useGame } from "@/lib/game";
import { supabase } from "@/lib/supabase";

// Chow Chow Live Simulator: ฝังเกมเมืองเชาเชา 3D (/farm/) ไว้ในแอป
const MODES = [
  { id: "farm", src: "/farm/", label: "🏡 เมืองเชาเชา 3D" },
] as const;

export default function SimPage() {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("farm");
  const cur = MODES.find((m) => m.id === mode)!;
  // แอดมิน (ตรวจจากฐานข้อมูล is_admin) เข้าเกมโหมดทดสอบ: เงิน 9999 · ผู้เล่นทั่วไปเริ่มที่ 100
  const { session } = useGame();
  const [admin, setAdmin] = useState(false);
  useEffect(() => { if (!session) { setAdmin(false); return; } supabase.rpc("is_admin").then(({ data }) => setAdmin(!!data)); }, [session]);
  const src = admin ? `${cur.src}?admin=1` : cur.src;
  // ส่งขอบรอยบาก (safe area) ให้เกมใน iframe — ใน iframe อ่านค่าเองไม่ได้ เกมเต็มจอแล้ว HUD จะได้ไม่จมใต้รอยบาก
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const probe = document.createElement("div");
    probe.style.cssText = "position:fixed;visibility:hidden;pointer-events:none;padding:env(safe-area-inset-top,0px) env(safe-area-inset-right,0px) env(safe-area-inset-bottom,0px) env(safe-area-inset-left,0px)";
    document.body.appendChild(probe);
    const send = () => { const cs = getComputedStyle(probe); const v = (x: string) => parseFloat(x) || 0;
      const T = v(cs.paddingTop), R = v(cs.paddingRight), B = v(cs.paddingBottom), L = v(cs.paddingLeft);
      // แนวตั้งที่หมุนเกม 90°: ขอบบนจอ (รอยบาก) = ซ้ายของเกม, ขอบล่าง (แถบโฮม) = ขวาของเกม
      const rot = matchMedia("(orientation: portrait) and (max-width: 600px)").matches;
      frame.current?.contentWindow?.postMessage(rot ? { type: "ccs-safe", l: T, r: B, t: R, b: L } : { type: "ccs-safe", t: T, r: R, b: B, l: L }, location.origin); };
    const iv = setInterval(send, 1500); addEventListener("resize", send); addEventListener("orientationchange", send); send();
    return () => { clearInterval(iv); removeEventListener("resize", send); removeEventListener("orientationchange", send); probe.remove(); };
  }, [src]);
  return (
    <div className="sim">
      <header className="sim-bar">
        <b>Chow Chow Live Simulator</b>
        <div className="sim-modes" role="tablist" aria-label="เลือกโลก">
          {MODES.map((m) => (
            <button key={m.id} type="button" role="tab" aria-selected={m.id === mode} className={m.id === mode ? "on" : ""} onClick={() => setMode(m.id)}>{m.label}</button>
          ))}
          <a className="sim-full" href={src} aria-label="เปิดเต็มจอ">⛶</a>
        </div>
      </header>
      <a className="sim-exit" href="/" aria-label="ออกจากเกม">✕</a>
      <iframe ref={frame} onLoad={() => setTimeout(() => dispatchEvent(new Event("resize")), 300)} key={cur.id + (admin ? "-a" : "")} className="sim-frame" src={src} title={`Chow Chow Live Simulator · ${cur.label}`} allow="fullscreen; autoplay; gamepad" />
    </div>
  );
}
