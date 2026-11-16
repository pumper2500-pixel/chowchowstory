"use client";

import { useState } from "react";
import { AKC_URL, TRAIT_GROUPS } from "@/lib/content";

function Bones({ score }: { score: number }) {
  return (
    <span className="bones-meter" role="img" aria-label={`${score} จาก 5`}>
      {[1, 2, 3, 4, 5].map((i) => <i key={i} className={i <= score ? "on" : ""}>🦴</i>)}
    </span>
  );
}

export default function Traits() {
  const [tab, setTab] = useState<string>("family");
  const groups = tab === "all" ? TRAIT_GROUPS : TRAIT_GROUPS.filter((g) => g.id === tab);
  return (
    <section className="card stack traits" aria-labelledby="tr-h">
      <h2 id="tr-h" style={{ fontSize: 21 }}>ตัวตนเชาเชา 16 ด้าน</h2>
      <div className="tabs" role="tablist" aria-label="หมวดนิสัย">
        {[...TRAIT_GROUPS.map((g) => [g.id, g.label]), ["all", "ทั้งหมด"]].map(([id, label]) => (
          <button key={id} role="tab" aria-selected={tab === id} onClick={() => setTab(id)}>{label}</button>
        ))}
      </div>
      {groups.map((g) => (
        <div key={g.id} className="stack" style={{ gap: 4 }}>
          {tab === "all" && <h3 className="tr-group">{g.label}</h3>}
          {g.traits.map((t) => (
            <div key={t.name} className="trait">
              <div className="tr-top">
                <b>{t.name}</b>
                {t.score ? <Bones score={t.score} /> : <span className="tr-val">{t.value}</span>}
              </div>
              {t.score && <div className="tr-scale"><span>{t.low}</span><span>{t.high}</span></div>}
              <p>{t.tip}</p>
            </div>
          ))}
        </div>
      ))}
      <p className="src">คะแนน 1–5 จาก <a href={AKC_URL} target="_blank" rel="noopener noreferrer">American Kennel Club</a> · คำอธิบายและเกร็ดสำหรับคนเลี้ยงเมืองร้อนเรียบเรียงโดย ChowChowStory · น้องแต่ละตัวต่างกันได้</p>
    </section>
  );
}
