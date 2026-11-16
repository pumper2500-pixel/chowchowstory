"use client";

import { useEffect, useState } from "react";
import { PageHead } from "@/components/Chrome";
import { AKC_URL, FUN_FACTS, LOOKS, STAGES, type Stage } from "@/lib/content";
import Traits from "@/components/Traits";
import { useGame } from "@/lib/game";

export default function GuidePage() {
  const { ready, earn } = useGame();
  const [tab, setTab] = useState<Stage["id"]>("puppy");

  useEffect(() => {
    if (!ready) return;
    const st = STAGES.find((s) => s.id === tab)!;
    earn(`guide-${tab}`, 5, `เปิดคู่มือ${st.label.split(" ")[0]}`);
  }, [tab, ready, earn]);

  const stage = STAGES.find((s) => s.id === tab)!;

  return (
    <>
      <PageHead img="s8" eyebrow="คู่มือเลี้ยง" title="ดูแลตามช่วงวัย" />
      <div className="pad stack">
        <p className="lead">ตัวเลขเป็นค่าทั่วไปของสายพันธุ์ น้องแต่ละตัวต่างกันได้ เปิดอ่านแต่ละช่วงวัยได้ 5 กระดูก</p>
        <div className="facts">
          <div><b>20–32 กก.</b><span>น้ำหนักโตเต็มวัย</span></div>
          <div><b>43–51 ซม.</b><span>ความสูงถึงไหล่</span></div>
          <div><b>8–12 ปี</b><span>อายุขัยโดยเฉลี่ย</span></div>
          <div><b>Non-Sporting</b><span>กลุ่มสายพันธุ์ (AKC)</span></div>
          <div><b>2446</b><span>ปีที่ AKC รับรอง (ค.ศ. 1903)</span></div>
          <div><b>5 สี</b><span>แดง ดำ บลู ซินนามอน ครีม</span></div>
        </div>
        <p className="src">ขนาด อายุขัย กลุ่ม และสีมาตรฐาน: <a href={AKC_URL} target="_blank" rel="noopener noreferrer">American Kennel Club</a></p>
        <section className="card stack" aria-labelledby="looks-h">
          <h2 id="looks-h" style={{ fontSize: 21 }}>ดูยังไงว่าใช่เชาเชา</h2>
          {LOOKS.map(([h, t]) => <div className="topic" key={h}><b>{h}</b><span>{t}</span></div>)}
        </section>
        <Traits />
        <section className="card stack facts-fun" aria-labelledby="fun-h">
          <img className="pic" src="/img/s8.png" alt="" />
          <h2 id="fun-h" style={{ fontSize: 21 }}>รู้หรือไม่</h2>
          <ul>{FUN_FACTS.map((f) => <li key={f}>{f}</li>)}</ul>
        </section>
        <h2 style={{ fontSize: 21 }}>ดูแลตามช่วงวัย</h2>
        <div className="tabs" role="tablist" aria-label="ช่วงวัย">
          {STAGES.map((s) => (
            <button key={s.id} role="tab" id={`tab-${s.id}`} aria-controls="stage-panel"
              aria-selected={tab === s.id} onClick={() => setTab(s.id)}>{s.label}</button>
          ))}
        </div>
        <div className="card" id="stage-panel" role="tabpanel" aria-labelledby={`tab-${tab}`}>
          <img className="pic" src={`/img/${stage.img}.png`} alt="" />
          {stage.topics.map(([h, t]) => (
            <div className="topic" key={h}><b>{h}</b><span>{t}</span></div>
          ))}
        </div>
        <img className="pic" src="/img/s10.png" alt="" />
        <p className="note">ข้อมูลนี้เป็นความรู้ทั่วไปสำหรับเจ้าของ ไม่ใช่การวินิจฉัย ถ้าน้องมีอาการผิดปกติให้พาไปพบสัตวแพทย์</p>
        <p className="src">เรียบเรียงจากประสบการณ์คนเลี้ยงในเมืองร้อน ร่วมกับคำแนะนำด้านสุขภาพ การแปรงขน การออกกำลัง การฝึก และอาหารของ <a href={AKC_URL} target="_blank" rel="noopener noreferrer">American Kennel Club</a></p>
      </div>
    </>
  );
}
