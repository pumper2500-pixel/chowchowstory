"use client";

import { useState } from "react";
import { PageHead } from "@/components/Chrome";
import { COSTS, READY_ITEMS } from "@/lib/content";
import { heatVerdict } from "@/lib/game-core.mjs";
import { useGame } from "@/lib/game";

const LEVEL_COLOR: Record<string, string> = { ok: "var(--ok)", warn: "var(--warn)", bad: "var(--bad)" };

export default function ToolsPage() {
  const { earn, today } = useGame();
  const [temp, setTemp] = useState(33);
  const [hum, setHum] = useState(70);
  const [costs, setCosts] = useState<Record<string, number>>(Object.fromEntries(COSTS.map(([k, , v]) => [k, v])));
  const [checks, setChecks] = useState<boolean[]>(READY_ITEMS.map(() => false));

  const v = heatVerdict(temp, hum);
  const sum = Object.values(costs).reduce((a, b) => a + Math.max(0, b || 0), 0);
  const n = checks.filter(Boolean).length;
  const allReady = n === READY_ITEMS.length;

  const heatDone = () => earn(`heat-${today}`, 5, "เช็กความร้อนวันนี้");

  return (
    <>
      <PageHead img="s2" eyebrow="เครื่องมือ" title="คิดก่อนเลี้ยง คิดระหว่างเลี้ยง" />
      <div className="pad stack">
        <section className="heat">
          <h2>วันนี้พาน้องออกเดินได้ไหม</h2>
          <div className="sl">
            <label htmlFor="t">อุณหภูมิ</label>
            <input id="t" type="range" min={18} max={42} value={temp} onChange={(e) => setTemp(+e.target.value)} onPointerUp={heatDone} onKeyUp={heatDone} />
            <output htmlFor="t">{temp}°C</output>
          </div>
          <div className="sl">
            <label htmlFor="h">ความชื้น</label>
            <input id="h" type="range" min={30} max={100} step={5} value={hum} onChange={(e) => setHum(+e.target.value)} onPointerUp={heatDone} onKeyUp={heatDone} />
            <output htmlFor="h">{hum}%</output>
          </div>
          <div className="verdict" role="status" aria-live="polite">
            <img src={`/img/${v.img}.png`} alt="" />
            <div><i className="dot" style={{ background: LEVEL_COLOR[v.level] }} /><b>{v.title}</b><span>{v.detail}</span></div>
          </div>
          <p className="fine">เกณฑ์คร่าว ๆ สำหรับหมาขนหนา ไม่แทนคำแนะนำของสัตวแพทย์ ก่อนเดินให้เอาหลังมือแตะพื้นถนน 5 วินาที ถ้าเราทนไม่ได้ น้องก็ทนไม่ได้</p>
        </section>

        <section className="card stack">
          <img className="pic" src="/img/s31.png" alt="" />
          <h2 style={{ fontSize: 21 }}>ค่าใช้จ่ายต่อเดือน</h2>
          <p className="lead" style={{ fontSize: 14 }}>ตัวเลขตั้งต้นเป็นตัวอย่างเท่านั้น แก้เป็นราคาจริงของบ้านเราได้</p>
          {COSTS.map(([k, label]) => (
            <div className="row" key={k}>
              <label htmlFor={`c-${k}`}>{label}</label>
              <input id={`c-${k}`} type="number" inputMode="numeric" min={0} value={costs[k]}
                onChange={(e) => setCosts({ ...costs, [k]: +e.target.value })}
                onBlur={() => earn("cost", 5, "ลองคิดค่าใช้จ่าย")} />
            </div>
          ))}
          <div className="total"><span>รวมต่อเดือน</span><b>฿{sum.toLocaleString("en-US")}</b></div>
          <p className="lead" style={{ fontSize: 14 }}>ประมาณ {(sum * 12).toLocaleString("en-US")} บาทต่อปี ยังไม่รวมค่ารักษาฉุกเฉิน</p>
        </section>

        <section className="card stack check">
          <h2 style={{ fontSize: 21 }}>บ้านเราพร้อมเลี้ยงเชาเชาไหม</h2>
          {READY_ITEMS.map((t, i) => (
            <label key={i}>
              <input type="checkbox" checked={checks[i]} onChange={(e) => {
                const c = [...checks]; c[i] = e.target.checked; setChecks(c);
                if (c.every(Boolean)) earn("ready", 10, "พร้อมครบทุกข้อ");
              }} />{t}
            </label>
          ))}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <img className="pic" src={`/img/${allReady ? "s23" : n >= 4 ? "s18" : "s24"}.png`} alt="" />
            <p style={{ fontWeight: 600 }} role="status" aria-live="polite">
              {allReady ? "ครบทุกข้อ บ้านนี้พร้อมมาก"
                : n >= 4 ? `พร้อม ${n} จาก ${READY_ITEMS.length} ข้อ ลองวางแผนข้อที่เหลือก่อนรับน้อง`
                : `พร้อม ${n} จาก ${READY_ITEMS.length} ข้อ ข้อที่ยังไม่ติ๊กคือสิ่งที่ต้องเตรียมก่อน`}
            </p>
          </div>
        </section>

        <section className="card stack">
          <h2 style={{ fontSize: 21 }}>ของที่เชาเชาเมืองร้อนควรมี</h2>
          <div className="topic"><b>คลายร้อน</b><span>แผ่นเจลเย็น พัดลมตั้งพื้น ชามน้ำหลายจุดในบ้าน</span></div>
          <div className="topic"><b>ขน</b><span>แปรงสลิกเกอร์ หวีซี่ห่าง ไดร์เป่าขนแรงลม</span></div>
          <div className="topic"><b>เดินเล่น</b><span>สายรัดอกแบบไม่กดคอ ขวดน้ำพกพา</span></div>
          <p className="note">ส่วนนี้เตรียมไว้สำหรับรีวิวสินค้าและลิงก์ Affiliate ใน Milestone 05</p>
        </section>
      </div>
    </>
  );
}
