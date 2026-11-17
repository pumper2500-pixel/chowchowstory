"use client";

import { useState } from "react";

// Chow Chow Live Simulator: ฝังเกมเมืองเชาเชา 3D (/farm/) ไว้ในแอป
const MODES = [
  { id: "farm", src: "/farm/", label: "🏡 เมืองเชาเชา 3D" },
] as const;

export default function SimPage() {
  const [mode, setMode] = useState<(typeof MODES)[number]["id"]>("farm");
  const cur = MODES.find((m) => m.id === mode)!;
  return (
    <div className="sim">
      <header className="sim-bar">
        <b>Chow Chow Live Simulator</b>
        <div className="sim-modes" role="tablist" aria-label="เลือกโลก">
          {MODES.map((m) => (
            <button key={m.id} type="button" role="tab" aria-selected={m.id === mode} className={m.id === mode ? "on" : ""} onClick={() => setMode(m.id)}>{m.label}</button>
          ))}
          <a className="sim-full" href={cur.src} aria-label="เปิดเต็มจอ">⛶</a>
        </div>
      </header>
      <iframe key={cur.id} className="sim-frame" src={cur.src} title={`Chow Chow Live Simulator · ${cur.label}`} allow="fullscreen; autoplay; gamepad" />
    </div>
  );
}
