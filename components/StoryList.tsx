"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useGame } from "@/lib/game";

type Item = { slug: string; title: string; kind: string; minutes: number; excerpt: string; text: string };

export default function StoryList({ items }: { items: Item[] }) {
  const { state } = useGame();
  const [q, setQ] = useState("");
  const shown = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return items;
    return items.filter((i) => (i.title + " " + i.kind + " " + i.text).toLowerCase().includes(k));
  }, [q, items]);

  return (
    <section className="stack" aria-label="รายการเรื่องเล่า">
      <div className="search">
        <label htmlFor="q" className="sr-only">ค้นหาเรื่องเล่า</label>
        <input id="q" type="search" placeholder="ค้นหา เช่น ลิ้น ขน ความร้อน" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <p className="lead">{q ? `พบ ${shown.length} เรื่อง` : "แตะเพื่ออ่าน อ่านจบแต่ละเรื่องได้ 10 กระดูก"}</p>
      {shown.map((s) => {
        const read = !!state.done[`story-${s.slug}`];
        return (
          <Link key={s.slug} href={`/stories/${s.slug}/`} className={`story-card${read ? " read" : ""}`}>
            <div>
              <h3>{s.title}</h3>
              <span className="meta">{s.kind} · อ่าน {s.minutes} นาที</span>
              <p>{s.excerpt}</p>
            </div>
            <span className="rw">{read ? "อ่านแล้ว ✓" : "+10 🦴"}</span>
          </Link>
        );
      })}
      {q && shown.length === 0 && <p className="lead">ยังไม่มีเรื่องที่ตรงกับ “{q}”</p>}
    </section>
  );
}
