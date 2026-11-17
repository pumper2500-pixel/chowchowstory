"use client";

import { useEffect, useState } from "react";
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
      <iframe key={cur.id + (admin ? "-a" : "")} className="sim-frame" src={src} title={`Chow Chow Live Simulator · ${cur.label}`} allow="fullscreen; autoplay; gamepad" />
    </div>
  );
}
