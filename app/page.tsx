"use client";

import Link from "next/link";
import { useRef } from "react";
import Scene from "@/components/Scene";
import { DOGS, LEVELS, levelOf, progress } from "@/lib/game-core.mjs";
import { useEarnOnMount, useGame } from "@/lib/game";
import { STAGES, STORIES, missionsFor } from "@/lib/content";

export default function Home() {
  const { state, shownBones, preview, setPreview, today, session, sync } = useGame();
  useEarnOnMount(`visit-${today}`, 5, "ยินดีต้อนรับกลับมา");
  const sheet = useRef<HTMLDialogElement>(null);

  const li = levelOf(shownBones);
  const next = LEVELS[li + 1];
  const p = progress(shownBones);
  const missions = missionsFor(today);
  const open = missions.filter((m) => !state.done[m.key]);
  const done = missions.filter((m) => state.done[m.key]);
  const all = (keys: string[]) => keys.every((k) => state.done[k]);

  const openSheet = () => sheet.current?.showModal();
  const closeSheet = () => sheet.current?.close();

  return (
    <>
      <Scene onEarnClick={openSheet} hasMissions={open.length > 0} />

      <section className="tier">
        <div>
          <div className="lvl-label">ระดับของคุณ</div>
          <div className="lvl">{LEVELS[li].name}</div>
        </div>
        <div className="bones"><span className="ic">🦴</span><span>{shownBones.toLocaleString("en-US")}</span><small>กระดูก</small></div>
        <div className="tip">
          {next ? (
            <>สะสมอีก <b>{next.min - shownBones} กระดูก</b> เพื่อขึ้นระดับ {next.name} และชวน<b>{DOGS[li + 1].name}</b>มาเดินเล่นด้วย</>
          ) : (
            <>ครบทั้ง <b>6 ตัว</b> แล้ว ระดับสูงสุดของชาวเชาเชา</>
          )}
        </div>
        <div className="meter" aria-hidden="true">
          <div className="fill" style={{ width: `calc(${p * 100}% - 6px)` }} />
          <div className="knob" style={{ left: `calc(20px + ${p} * (100% - 40px))` }}>
            <img src={`/img/${DOGS[Math.min(li + 1, DOGS.length - 1)].img}.png`} alt="" />
          </div>
        </div>
        <div className="friends">
          {DOGS.map((d, i) => (
            <span key={d.name} className={`f${i <= li ? "" : " lock"}`} title={i <= li ? d.name : "ยังไม่ปลดล็อก"}>
              {i <= li ? <img src={`/img/${d.img}.png`} alt={d.name} /> : "?"}
            </span>
          ))}
          <span>เพื่อนในฉาก {li + 1}/6</span>
        </div>
        <Link href="/account/" className={`acct-pill${session ? " in" : ""}`}>
          {session
            ? <>☁️ {sync === "error" ? "ซิงก์ไม่สำเร็จ แตะเพื่อดู" : sync === "syncing" ? "กำลังซิงก์…" : "กระดูกเก็บในบัญชีแล้ว"}</>
            : <>💾 สมัครฟรี เก็บกระดูกไว้ทุกเครื่อง ›</>}
        </Link>
      </section>

      <nav className="tiles" aria-label="ทางลัด">
        <Tile href="/tools/" img="s6" title="เช็กความร้อน" sub="ก่อนพาน้องเดิน" dot={!state.done[`heat-${today}`]} />
        <Tile href="/stories/" img="s39" title="เรื่องเล่า" sub="ตำนาน ประวัติ นิสัย" dot={!all(STORIES.map((s) => `story-${s.slug}`))} />
        <Tile href="/guide/" img="s8" title="คู่มือเลี้ยง" sub="แยกตามช่วงวัย" dot={!all(STAGES.map((s) => `guide-${s.id}`))} />
        <Tile href="/memorial/" img="s15" title="ความทรงจำ" sub="ถึงน้องที่จากไป" dot={!state.done.memorial} />
        <Tile href="/share/" img="s27" title="ส่งรูปน้องเชาเชา" sub="ขึ้นแกลเลอรีหลังผ่านการตรวจ · +20 🦴" dot={!state.done.post} wide />
      </nav>

      <section className="missions">
        <h2>ภารกิจ</h2>
        {[...open, ...done].map((m) => {
          const isDone = !!state.done[m.key];
          return (
            <Link key={m.key} href={m.href} className={`mi${isDone ? " done" : ""}`}>
              <span className="ck">{isDone ? "✓" : ""}</span>
              <span className="t">{m.label}{m.sub && <small>{m.sub}</small>}</span>
              <span className="pts">+{m.pts} 🦴</span>
            </Link>
          );
        })}
      </section>

      <dialog className="sheet" ref={sheet} aria-labelledby="earn-t" onClick={(e) => { if (e.target === sheet.current) closeSheet(); }}>
        <h2 id="earn-t">สะสมกระดูก ชวนเพื่อนเชาเชามาเดินเล่น</h2>
        <p className="lead" style={{ marginTop: 6 }}>ทุกครั้งที่เลเวลขึ้น จะมีเพื่อนเชาเชาตัวใหม่เดินเข้ามาในฉากหน้าแรก มีทั้งหมด 6 ตัว</p>
        <div className="earn">
          <span>เปิดแอปวันละครั้ง</span><b>+5</b>
          <span>เช็กความร้อนก่อนพาเดิน (วันละครั้ง)</span><b>+5</b>
          <span>อ่านเรื่องเล่าจบ (เรื่องละครั้ง)</span><b>+10</b>
          <span>เปิดคู่มือแต่ละช่วงวัย</span><b>+5</b>
          <span>ลองคิดค่าใช้จ่าย</span><b>+5</b>
          <span>ติ๊กความพร้อมครบทุกข้อ</span><b>+10</b>
          <span>เขียนถึงน้องที่จากไป</span><b>+20</b>
          <span>ส่งรูปน้องเชาเชาครั้งแรก</span><b>+20</b>
        </div>
        <p className="lead" style={{ fontSize: 13 }}>{session ? "กระดูกเก็บในบัญชี เปิดเครื่องไหนก็เห็น" : "ตอนนี้กระดูกเก็บในเครื่องนี้ สมัครสมาชิกฟรีเพื่อเก็บข้ามเครื่อง"}</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
          <button className="btn" type="button" onClick={closeSheet}>เข้าใจแล้ว</button>
          <button className="btn ghost" type="button" onClick={() => { setPreview(!preview); closeSheet(); window.scrollTo(0, 0); }}>
            {preview ? "กลับไปที่กระดูกของฉัน" : "ดูตัวอย่างครบ 6 ตัว"}
          </button>
        </div>
      </dialog>
    </>
  );
}

function Tile({ href, img, title, sub, dot, wide }: { href: string; img: string; title: string; sub: string; dot: boolean; wide?: boolean }) {
  return (
    <Link href={href} className={wide ? "wide" : undefined}>
      <img src={`/img/${img}.png`} alt="" />
      <span>{title}<small>{sub}</small></span>
      {dot && <i className="rd" />}
    </Link>
  );
}
