"use client";

import { useEffect, useState } from "react";
import { PageHead } from "@/components/Chrome";
import { STAGES, type Stage } from "@/lib/content";
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
        </div>
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
      </div>
    </>
  );
}
