"use client";

import { useEffect, useRef, useState } from "react";
import { PageHead } from "@/components/Chrome";
import { STORIES } from "@/lib/content";
import { supabase, type Article } from "@/lib/supabase";
import { useGame } from "@/lib/game";

export default function StoriesPage() {
  const { state, earn } = useGame();
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  // เริ่มจากเนื้อหาในตัวแอป แล้วแทนด้วยของจากฐานข้อมูลเมื่อโหลดได้ (ออฟไลน์ก็ยังอ่านได้)
  const [stories, setStories] = useState<Article[]>(STORIES);
  useEffect(() => {
    supabase.from("articles").select("slug,title,kind,minutes,body").eq("published", true).order("position")
      .then(({ data, error }) => { if (!error && data && data.length) setStories(data as Article[]); });
  }, []);

  // อ่านค้างไว้ 4 วินาทีถึงนับว่าอ่าน กันการกดเปิดปิดรัว ๆ เพื่อเก็บแต้ม
  const onToggle = (slug: string, open: boolean) => {
    const key = `story-${slug}`;
    clearTimeout(timers.current[key]);
    if (open && !state.done[key]) timers.current[key] = setTimeout(() => earn(key, 10, "อ่านจบแล้ว"), 4000);
  };

  return (
    <>
      <PageHead img="s39" eyebrow="เรื่องเล่า" title="เรื่องของหมาหน้าสิงโต" />
      <div className="pad stack">
        <p className="lead">แตะเพื่ออ่าน อ่านจบแต่ละเรื่องได้ 10 กระดูก</p>
        {stories.map((s) => {
          const read = !!state.done[`story-${s.slug}`];
          return (
            <details key={s.slug} className={`story${read ? " read" : ""}`} id={s.slug}
              onToggle={(e) => onToggle(s.slug, (e.currentTarget as HTMLDetailsElement).open)}>
              <summary>
                <h3>{s.title}<span className="meta">{s.kind} · อ่าน {s.minutes} นาที</span></h3>
                <span className="rw">{read ? "อ่านแล้ว ✓" : "+10 🦴"}</span>
              </summary>
              <div className="body">{s.body.map((p, i) => <p key={i}>{p}</p>)}</div>
            </details>
          );
        })}
        <div className="slot stack">
          <img className="pic" src="/img/s27.png" alt="" />
          <h3>เรื่องของน้องของเรา</h3>
          <p>เรื่องที่ทำให้เว็บนี้ไม่เหมือนใครคือเรื่องจริงของน้องที่เคยอยู่ด้วยกัน ลองเขียนตามหัวข้อนี้</p>
          <ul><li>วันแรกที่น้องมาถึงบ้าน</li><li>นิสัยที่มีแต่น้องตัวนี้ทำ</li><li>สิ่งที่อยากรู้ตั้งแต่วันแรก แต่มารู้ทีหลัง</li></ul>
        </div>
      </div>
    </>
  );
}
