"use client";

import { useEffect, useRef } from "react";
import { useGame } from "@/lib/game";

// นับว่าอ่านจบเมื่อเลื่อนถึงท้ายบทความ หรืออยู่ในหน้านาน 4 วินาทีขึ้นไปสำหรับบทความสั้นที่ไม่ต้องเลื่อน
export default function ReadReward({ slug }: { slug: string }) {
  const { ready, earn, state } = useGame();
  const end = useRef<HTMLDivElement>(null);
  const key = `story-${slug}`;

  useEffect(() => {
    if (!ready || state.done[key]) return;
    let seen = false, timeUp = false;
    const tryEarn = () => { if (seen && timeUp) earn(key, 10, "อ่านจบแล้ว"); };
    const t = setTimeout(() => { timeUp = true; tryEarn(); }, 4000);
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { seen = true; tryEarn(); } });
    if (end.current) io.observe(end.current);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [ready, key, earn, state.done]);

  return <div ref={end} className="read-end">{state.done[key] ? "อ่านจบแล้ว ✓ ได้ 10 กระดูก" : "อ่านจบแล้วรับ 10 กระดูก 🦴"}</div>;
}
