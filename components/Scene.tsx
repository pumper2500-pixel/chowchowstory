"use client";

import { useEffect, useRef, useState } from "react";
import { DOGS, levelOf } from "@/lib/game-core.mjs";
import { TIPS } from "@/lib/content";
import { useGame } from "@/lib/game";
import { AccountButton } from "@/components/Chrome";
import { Street, MID_TILE, PedArt, PEDS, Sky, Birds, Critters, Rain, FlowerFace, type Phase } from "@/components/StreetArt";

// ฉากเดินด้านข้าง: น้องเดินอยู่กับที่ ฉากเลื่อนผ่านเป็นชั้น ๆ (parallax)
// ความเร็วของแต่ละชั้นเทียบกับพื้นหญ้า
const TILE = 1600;          // ความกว้างหนึ่งช่วงฉาก (px) วนซ้ำต่อกันไม่รู้จบ
const GROUND_SPEED = 46;    // px/วินาที ตอนเดิน
const LAYERS = { cloud: 0.12, far: 0.3, mid: 0.65, ground: 1 } as const;
const TILE_OF: Record<keyof typeof LAYERS, number> = { cloud: TILE, far: TILE, mid: MID_TILE, ground: TILE };
const W_DOG = 80;
const TOP = 62;             // น้องเดินได้สูงสุดกี่ px จากขอบล่าง (ยิ่งสูง = ยิ่งไกล ตัวเล็กลง)
const PHASES: Phase[] = ["morning", "day", "evening", "night"];
const PHASE_TH: Record<Phase, string> = { morning: "ตอนเช้า", day: "กลางวัน", evening: "ตอนเย็น", night: "กลางคืน" };
const phaseOf = (h: number): Phase => (h >= 5 && h < 10 ? "morning" : h >= 10 && h < 16 ? "day" : h >= 16 && h < 19 ? "evening" : "night");
const EMOTES = ["♥", "♪", "!", "☺", "♥", "✿"];

const PAW = '<svg viewBox="0 0 20 20"><ellipse cx="10" cy="13.2" rx="5.2" ry="4.4"/><ellipse cx="4.2" cy="8" rx="1.9" ry="2.4"/><ellipse cx="8" cy="5.2" rx="1.9" ry="2.5"/><ellipse cx="12" cy="5.2" rx="1.9" ry="2.5"/><ellipse cx="15.8" cy="8" rx="1.9" ry="2.4"/></svg>';

// ของกินที่วางบนหญ้า (วาดเองทั้งหมด)
const S = 'stroke="#4A2A12" stroke-linecap="round" stroke-linejoin="round"';
const BONE = (x1: number, y1: number, x2: number, y2: number) =>
  `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#4A2A12" stroke-width="7.5" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="#F3E3C8" stroke-width="4" stroke-linecap="round"/>` +
  `<circle cx="${x1 - 2}" cy="${y1 - 1}" r="3" fill="#F3E3C8" ${S} stroke-width="1.6"/><circle cx="${x1 + 1}" cy="${y1 + 2}" r="3" fill="#F3E3C8" ${S} stroke-width="1.6"/>`;
const FOODS = [
  { name: "ไส้กรอก", note: "ไส้กรอกเค็มและมันเยอะ ของจริงให้แค่ชิ้นเล็ก ๆ นาน ๆ ครั้งพอ",
    svg: `<path d="M26 14c5-6 12-3 11 3-3-1-7 0-11-3z" fill="#7CC04B" ${S} stroke-width="2"/><rect x="3" y="15" width="32" height="13" rx="6.5" fill="#D9694A" ${S} stroke-width="2.4"/><path d="M11 18l-2 6M18 18l-2 6M25 18l-2 6" stroke="#A8432B" stroke-width="2" stroke-linecap="round"/><circle cx="14" cy="21" r=".9" fill="#F6D9A8"/><circle cx="21" cy="24" r=".9" fill="#F6D9A8"/>` },
  { name: "น่องไก่", note: "กระดูกไก่สุกเปราะ แตกเป็นเสี้ยนได้ ของจริงห้ามให้นะ แกะเนื้อให้แทน",
    svg: BONE(9, 32, 19, 22) + `<ellipse cx="25" cy="15" rx="12" ry="8.5" transform="rotate(-40 25 15)" fill="#D98A45" ${S} stroke-width="2.4"/><path d="M20 15l8-6M24 20l8-6" stroke="#A85E25" stroke-width="2" stroke-linecap="round"/>` },
  { name: "เนื้อติดกระดูก", note: "เนื้อต้มไม่ปรุงรสให้เป็นรางวัลได้ แต่กระดูกสุกอย่าให้แทะ",
    svg: BONE(7, 33, 33, 8) + `<ellipse cx="19" cy="21" rx="12.5" ry="10" transform="rotate(-40 19 21)" fill="#B83A2A" ${S} stroke-width="2.4"/><ellipse cx="25" cy="15" rx="4.5" ry="6.5" transform="rotate(-40 25 15)" fill="#F08A8A" ${S} stroke-width="1.6"/>` },
  { name: "ไก่อบ", note: "ไก่อบหนังมันและเครื่องปรุงเยอะ ของจริงเลือกอกไก่ต้มเปล่าดีกว่า",
    svg: `<path d="M14 18l-5-9M26 18l5-9" stroke="#4A2A12" stroke-width="7" stroke-linecap="round"/><path d="M14 18l-5-9M26 18l5-9" stroke="#E8964E" stroke-width="4" stroke-linecap="round"/><circle cx="8" cy="8" r="3" fill="#F3E3C8" ${S} stroke-width="1.6"/><circle cx="32" cy="8" r="3" fill="#F3E3C8" ${S} stroke-width="1.6"/><path d="M4 31q0-16 16-16t16 16z" fill="#E8964E" ${S} stroke-width="2.4"/><path d="M25 22q5 2 7 7" fill="none" ${S} stroke-width="1.6"/><circle cx="16" cy="21" r="1" fill="#4A2A12"/><circle cx="19" cy="23" r="1" fill="#4A2A12"/>` },
];
const POOP = `<svg viewBox="0 0 40 40"><path d="M7 34q-4-7 4-9q-2-7 7-8q0-7 7-9q-1 6 4 8q6 2 3 8q8 2 4 10z" fill="#8A5530" ${S} stroke-width="2.2"/><path d="M12 27q7 2 16 0M15 20q5 2 10 0" fill="none" stroke="#B07A4E" stroke-width="1.8" stroke-linecap="round"/></svg>`;

type Item = { x: number; kind: "food" | "poop"; food?: number; el: HTMLElement; done: boolean };

type Walker = {
  i: number; side: 1 | -1; step: number; talk: number; el: HTMLButtonElement | null; bub: HTMLSpanElement | null; enter: boolean;
  px: number; py: number; tx: number; ty: number; wt: number; pace: number; vx: number;
};

export default function Scene({ onEarnClick, hasMissions }: { onEarnClick: () => void; hasMissions: boolean }) {
  const { shownBones, ready, levelUpTick, showToast } = useGame();
  const count = levelOf(shownBones) + 1;
  const [phase, setPhase] = useState<Phase>("day");
  const [rain, setRain] = useState(false);
  const [, force] = useState(0);

  const sceneRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pawsRef = useRef<HTMLDivElement>(null);
  const walkers = useRef<Walker[]>([]);
  const lastCount = useRef(0);
  const countRef = useRef(count);
  const world = useRef({ x: 0, walking: true, t: 6 + Math.random() * 6, speed: 0, nextFood: 9 + Math.random() * 6, eating: false });
  const items = useRef<Item[]>([]);
  // คนเดินบนทางเท้า: ตำแหน่งในพิกัดชั้นร้าน + ทิศ + ความเร็วของตัวเอง
  const peds = useRef(PEDS.map((pd, i) => ({
    x: i * 70 + Math.random() * 30, dir: (i % 2 ? -1 : 1) as 1 | -1, speed: (pd.speed ?? 18) * (0.8 + Math.random() * 0.4),
    el: null as HTMLDivElement | null, inner: null as HTMLDivElement | null, emo: null as HTMLSpanElement | null, et: 2 + Math.random() * 8,
  })));
  const toastRef = useRef(showToast);
  toastRef.current = showToast;
  countRef.current = count;

  useEffect(() => {
    const now = new Date();
    setPhase(phaseOf(now.getHours()));
    // ฝนตกบางวัน (ราว 1 ใน 5 วัน สุ่มตามวันที่ ทุกคนเห็นเหมือนกันทั้งวัน)
    const seed = now.getFullYear() * 372 + now.getMonth() * 31 + now.getDate();
    setRain(((seed * 9301 + 49297) % 233280) / 233280 < 0.2);
  }, []);
  // แตะดวงอาทิตย์/พระจันทร์ เพื่อเปลี่ยนช่วงเวลา: เช้า → กลางวัน → เย็น → กลางคืน → ฝนตก → ...
  const cycleSky = () => {
    if (rain) { setRain(false); setPhase("morning"); toastRef.current(`🌤 ${PHASE_TH.morning}`); return; }
    const i = PHASES.indexOf(phase);
    if (phase === "night") { setRain(true); setPhase("day"); toastRef.current("🌧 ฝนตก"); return; }
    const nx = PHASES[i + 1];
    setPhase(nx);
    toastRef.current(`${nx === "night" ? "🌙" : nx === "evening" ? "🌇" : "☀️"} ${PHASE_TH[nx]}`);
  };

  // จำนวนน้องในขบวน = เลเวล
  useEffect(() => {
    if (!ready) return;
    const entering = lastCount.current > 0 && count > lastCount.current;
    const list = walkers.current.slice(0, count);
    for (let i = list.length; i < count; i++) list.push({ i, side: 1, step: Math.random() * 14, talk: 0, el: null, bub: null, enter: entering,
      px: entering ? -90 : NaN, py: (i * 23) % TOP, tx: NaN, ty: (i * 23) % TOP, wt: 1 + Math.random() * 2, pace: 20, vx: 0 });
    walkers.current = list;
    lastCount.current = count;
    force((n) => n + 1);
  }, [count, ready, levelUpTick]);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // จัดตำแหน่งน้อง: แต่ละตัวมีจุดหมายของตัวเองในสนาม เปลี่ยนทุก 3-6 วินาที
    // บางช่วงเดินเร็วแซงขึ้นหน้า บางช่วงเดินช้าตกไปข้างหลัง ขึ้น-ลงสลับกันไปมา
    // ตัวหน้าสุดไม่เกิน ~62% ของจอ และดันออกจากกันถ้าเข้าใกล้เกินไป
    const layout = (W: number, dt: number, moving: boolean) => {
      const list = walkers.current;
      const n = list.length;
      const left = 6, right = Math.max(110, Math.min(W * 0.56 + n * 12, W - W_DOG - 30));
      for (const d of list) {
        if (Number.isNaN(d.tx)) d.tx = right - (d.i * (right - left)) / Math.max(1, n - 1 || 1) * (n > 1 ? 1 : 0);
        if (Number.isNaN(d.px)) { d.px = d.tx; d.py = d.ty; }
        d.wt -= dt * (moving ? 1 : 0.5);
        if (d.wt <= 0) {
          d.wt = 3 + Math.random() * 3.5;
          d.tx = left + Math.random() * (right - left);
          d.ty = Math.random() * TOP;
          d.pace = Math.random() < 0.5 ? 12 + Math.random() * 8 : 34 + Math.random() * 16; // ช้า / เร็ว
        }
        const dx = d.tx - d.px, dy = d.ty - d.py, dist = Math.hypot(dx, dy);
        const step = Math.min(dist, d.pace * (moving ? 1 : 0.45) * dt);
        const mx = dist > 0.01 ? (dx / dist) * step : 0, my = dist > 0.01 ? (dy / dist) * step : 0;
        d.px += mx; d.py += my;
        d.vx += ((dt > 0 ? mx / dt : 0) - d.vx) * Math.min(1, dt * 4);
      }
      for (let pass = 0; pass < 3; pass++) {
        for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) {
          const A = list[a], B = list[b];
          const dx = B.px - A.px, dy = (B.py - A.py) * 1.7;
          const dist = Math.hypot(dx, dy) || 0.01, need = 70;
          if (dist >= need) continue;
          const push = (need - dist) / 2;
          const ux = dx / dist, uy = dy / dist / 1.7;
          A.px -= ux * push; A.py -= uy * push; B.px += ux * push; B.py += uy * push;
        }
      }
      for (const d of list) {
        d.px = Math.max(left, Math.min(right + 20, d.px));
        d.py = Math.max(0, Math.min(TOP, d.py));
      }
    };
    let raf = 0, last = 0;
    const tick = (ts: number) => {
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      const w = world.current;
      const W = sceneRef.current?.clientWidth || 360;

      if (!reduced) {
        // เดิน ↔ หยุดพัก (ค่อย ๆ ชะลอ/เร่ง)
        w.t -= dt;
        if (w.t <= 0) {
          w.walking = !w.walking;
          w.t = w.walking ? 7 + Math.random() * 7 : 2 + Math.random() * 2.5;
          if (w.walking) w.eating = false;
          // พักแล้วบางทีก็... ขอทำธุระ
          else if (pawsRef.current && Math.random() < 0.35) {
            const d = walkers.current[Math.floor(Math.random() * walkers.current.length)];
            if (d) {
              items.current.push(makePoop(pawsRef.current, w.x + d.px + 6, d.py + 2, () => toastRef.current("เก็บอึให้น้องแล้ว เจ้าของดีเด่น ✨")));
              say(d, `${DOGS[d.i].name}: ขอทำธุระแป๊บนะ 💩`, 2.4);
            }
          }
        }
        // วางของกินไว้ข้างหน้า แล้วให้น้องตัวนำเดินไปเจอ
        if (w.walking && pawsRef.current) {
          w.nextFood -= dt;
          if (w.nextFood <= 0) {
            w.nextFood = 16 + Math.random() * 14;
            const f = Math.floor(Math.random() * FOODS.length);
            items.current.push(makeFood(pawsRef.current, w.x + W + 30, 6, f));
          }
        }
        const lead = walkers.current.reduce<Walker | null>((m, d) => (!m || d.px > m.px ? d : m), null);
        if (lead) {
          const front = w.x + lead.px + W_DOG * 0.75;
          for (const it of items.current) {
            if (it.kind !== "food" || it.done || it.x > front) continue;
            it.done = true;
            it.el.classList.add("eaten");
            w.walking = false; w.eating = true; w.t = 2.8;
            const fd = FOODS[it.food!];
            say(lead, `${DOGS[lead.i].name}: เจอ${fd.name}! 😋`, 2.6, true);
            toastRef.current(`🐾 ${fd.note}`);
          }
        }
        const target = w.walking ? GROUND_SPEED : 0;
        w.speed += (target - w.speed) * Math.min(1, dt * 3);
        w.x += w.speed * dt;
      }
      for (const [k, f] of Object.entries(LAYERS)) {
        const el = layerRefs.current[k];
        if (el) el.style.transform = `translateX(${-((w.x * f) % TILE_OF[k as keyof typeof LAYERS])}px)`;
      }
      if (pawsRef.current) pawsRef.current.style.transform = `translateX(${-w.x}px)`;
      const span = W + 160;
      for (const p of peds.current) {
        if (!reduced) p.x += p.dir * p.speed * dt;
        const sx = ((((p.x - w.x * LAYERS.mid) % span) + span) % span) - 80;
        if (p.el) p.el.style.transform = `translateX(${sx.toFixed(1)}px)`;
        if (p.inner) p.inner.style.transform = `scaleX(${p.dir})`;
        if (!reduced && p.emo) {
          p.et -= dt;
          if (p.et <= 0) {
            p.et = 5 + Math.random() * 9;
            p.emo.textContent = EMOTES[Math.floor(Math.random() * EMOTES.length)];
            p.emo.classList.remove("on"); void p.emo.offsetWidth; p.emo.classList.add("on");
          }
        }
      }
      if (items.current.length) {
        items.current = items.current.filter((it) => {
          const gone = !it.el.isConnected || it.x < w.x - 140;
          if (gone) it.el.remove();
          return !gone;
        });
      }

      const moving = w.speed > 6;
      sceneRef.current?.classList.toggle("resting", !moving);
      layout(W, reduced ? 1 : dt, moving);
      for (const d of walkers.current) {
        const a = { x: d.px, y: d.py };
        if (d.el) {
          const sc = 1 - a.y / 320;
          d.el.style.transform = `translateX(${a.x.toFixed(1)}px) scale(${sc.toFixed(3)})`;
          d.el.style.bottom = `${a.y.toFixed(1)}px`;
          d.el.style.zIndex = String(100 - Math.round(a.y));
          const selfMove = Math.abs(d.vx) > 4;
          d.el.classList.toggle("walk", moving || selfMove);
          d.el.classList.toggle("fast", (moving && d.vx > 8) || (!moving && Math.abs(d.vx) > 14));
          d.el.classList.toggle("slow", moving && d.vx < -4);
          d.el.classList.toggle("flip", !moving && d.vx < -4);
        }
        if (d.talk > 0) { d.talk -= dt; if (d.talk <= 0) d.bub?.classList.remove("on"); }
        if (moving && pawsRef.current) {
          d.step += w.speed * dt;
          if (d.step >= 15) {
            d.step = 0; d.side = (d.side * -1) as 1 | -1;
            dropPaw(pawsRef.current, w.x + a.x + W_DOG / 2 - 20, a.y + 3 + d.side * 4);
          }
        }
      }
      if (!reduced) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const onResize = () => { if (reduced) requestAnimationFrame(tick); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); };
  }, [count]);

  const talk = (d: Walker) => say(d, `${DOGS[d.i].name}: ${TIPS[Math.floor(Math.random() * TIPS.length)]}`, 3.2);

  const strip = (k: keyof typeof LAYERS, art: React.ReactNode) => (
    <div className={`layer layer-${k}`} style={{ width: TILE_OF[k] * 2 }} ref={(el) => { layerRefs.current[k] = el; }} aria-hidden="true">
      {art}{art}
    </div>
  );

  return (
    <div className={`scene phase-${phase}${phase === "night" ? " night" : ""}${rain ? " rainy" : ""}`} ref={sceneRef}>
      <div className="sky" />
      <Sky phase={phase} rain={rain} onTap={cycleSky} />
      {strip("cloud", <Clouds />)}
      <Birds />
      {strip("far", <Far />)}
      {strip("mid", <Street />)}
      {strip("ground", <Lawn />)}
      <div className="peds" aria-hidden="true">
        {peds.current.map((p, i) => (
          <div key={i} className="ped" ref={(el) => { p.el = el; }}>
            <div className="ped-in" ref={(el) => { p.inner = el; }}><PedArt i={i} /></div>
            <span className="emote" ref={(el) => { p.emo = el; }} />
          </div>
        ))}
      </div>
      <div className="paws-world" ref={pawsRef} aria-hidden="true" />
      <Critters />
      {rain && <Rain />}

      <a className="topbtn l" href="/" aria-label="ChowChowStory"><img src="/img/logo.png" alt="" /></a>
      <AccountButton className="topbtn r2" />
      <button className="topbtn r" type="button" aria-label="วิธีสะสมกระดูก" onClick={onEarnClick}>
        <span className="bone">🦴</span>{hasMissions && <i className="dot" />}
      </button>

      <div className={`yard${walkers.current.length >= 4 ? " many" : ""}`}>
        {walkers.current.map((d) => (
          <button
            key={d.i}
            type="button"
            className={`dog${d.enter ? " enter" : ""}${DOGS[d.i].walk ? " has-walk" : ""}`}
            aria-label={`${DOGS[d.i].name} แตะเพื่อคุยกับน้อง`}
            ref={(el) => { d.el = el; }}
            onClick={() => talk(d)}
          >
            <i className="shadow" />
            <img className="sit" src={`/img/${DOGS[d.i].img}.png`} alt="" />
            {DOGS[d.i].walk && <img className="go" src={`/img/${DOGS[d.i].walk}.png`} alt="" />}
            <span className="bubble" ref={(el) => { d.bub = el; }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function say(d: Walker, text: string, secs: number, yum = false) {
  if (!d.bub) return;
  d.bub.textContent = text;
  d.bub.classList.add("on");
  d.talk = secs;
  if (yum && d.el) {
    const y = document.createElement("span");
    y.className = "yum";
    y.innerHTML = "<small>อร่อย</small>GOOD!";
    d.el.appendChild(y);
    y.addEventListener("animationend", () => y.remove());
  }
}

function makeFood(layer: HTMLDivElement, x: number, bottom: number, food: number): Item {
  const el = document.createElement("i");
  el.className = "treat";
  el.innerHTML = `<svg viewBox="0 0 40 40">${FOODS[food].svg}</svg>`;
  el.style.left = `${x}px`;
  el.style.bottom = `${bottom}px`;
  layer.appendChild(el);
  return { x, kind: "food", food, el, done: false };
}

function makePoop(layer: HTMLDivElement, x: number, bottom: number, onPick: () => void): Item {
  const el = document.createElement("button");
  el.type = "button";
  el.className = "poop";
  el.setAttribute("aria-label", "เก็บอึ");
  el.innerHTML = POOP;
  el.style.left = `${x}px`;
  el.style.bottom = `${bottom}px`;
  el.addEventListener("click", () => {
    if (el.classList.contains("picked")) return;
    el.classList.add("picked");
    onPick();
    setTimeout(() => el.remove(), 450);
  }, { once: true });
  layer.appendChild(el);
  return { x, kind: "poop", el, done: false };
}

function dropPaw(layer: HTMLDivElement, worldX: number, bottom: number) {
  const p = document.createElement("i");
  p.className = "paw";
  p.innerHTML = PAW;
  p.style.left = `${worldX}px`;
  p.style.bottom = `${bottom}px`;
  layer.appendChild(p);
  while (layer.childElementCount > 80) layer.firstElementChild?.remove();
  p.addEventListener("animationend", () => p.remove());
}

// ---------------------------------------------------------------
// ศิลปะฉาก (SVG หน่วยพิกเซล สูง 330 พื้นอยู่ที่ y=246) แต่ละชิ้นกว้าง TILE และต่อกันได้ไม่มีรอย
// ---------------------------------------------------------------
const INK = "#241C15";
const svgProps = { width: TILE, height: 330, viewBox: `0 0 ${TILE} 330` };

function Clouds() {
  // เมฆมีหน้า: วันฝนตกจะหน้าเศร้า
  const c = (x: number, y: number, sc: number) => (
    <g key={x} transform={`translate(${x} ${y}) scale(${sc})`} className="cloud">
      <path className="cloud-body" d="M-40 8 q-12 0 -12 -10 q0 -11 13 -11 q2 -15 18 -15 q8 -12 22 -8 q12 -10 24 2 q16 -2 18 12 q12 2 11 14 q-1 16 -16 16z" />
      <g className="cloud-face">
        <circle cx="-8" cy="-2" r="2" /><circle cx="10" cy="-2" r="2" />
        <path className="m-happy" d="M-3 4 q4 4 8 0" fill="none" strokeWidth="1.8" strokeLinecap="round" />
        <path className="m-sad" d="M-4 7 q2 -3 4 0 q2 -3 4 0 q2 -3 4 0" fill="none" strokeWidth="1.6" strokeLinecap="round" />
        <circle className="blush" cx="-14" cy="3" r="3" /><circle className="blush" cx="16" cy="3" r="3" />
      </g>
    </g>
  );
  return <svg {...svgProps}>{[c(130, 62, 0.9), c(500, 108, 0.6), c(840, 52, 1.05), c(1190, 96, 0.7), c(1460, 70, 0.85)]}</svg>;
}

function Far() {
  // เส้นขอบฟ้าเมืองไกล ๆ + ยอดเจดีย์
  return (
    <svg {...svgProps}>
      <path className="far" d={`M0 246 V196 h70 v-24 h50 v34 h60 v-50 h40 v50 h90 v-30 h70 v40 h60
        l20 -40 l8 -26 l8 26 l20 40 h70 v-60 h60 v60 h80 v-20 h90 v30 h70 v-44 h50 v44 h100
        v-28 h80 v28 h60 l16 -34 l6 -22 l6 22 l16 34 h70 v-40 h70 v40 h52 V246 Z`} />
    </svg>
  );
}

function Lawn() {
  const tufts = [[14, 300], [62, 282], [118, 318], [176, 292], [236, 312], [286, 286], [338, 304], [378, 322], [96, 270], [214, 274], [356, 268]];
  const flowers = [[40, 312, "#fff"], [150, 300, "#FF6F91"], [262, 322, "#fff"], [318, 292, "#FF6F91"], [392, 300, "#fff"], [88, 326, "#FF6F91"]] as const;
  const reps = [0, 400, 800, 1200];
  return (
    <svg {...svgProps}>
      <rect className="lawn" y="246" width={TILE} height="84" />
      <g className="lawn-stripe">{Array.from({ length: TILE / 100 }, (_, k) => <rect key={k} x={k * 100} y="246" width="50" height="84" />)}</g>
      <g className="tufts" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        {reps.flatMap((o) => tufts.map(([x, y]) => <path key={`${o}-${x}-${y}`} className="tuft" d={`M${x + o} ${y} l2 -7 l2 7 l2 -9 l2 9 l2 -6 l1 6`} />))}
      </g>
      {reps.flatMap((o) => flowers.map(([x, y, c]) => (
        <g key={`${o}-${x}`} className="flower"><circle cx={x + o} cy={y} r="2.6" fill={c} /><circle cx={x + o} cy={y} r="1" fill="#FFD23F" /></g>
      )))}
      <line x1="0" y1="246" x2={TILE} y2="246" stroke={INK} strokeWidth="3" />
      {[[180, 262, "#FF6F91"], [610, 258, "#FFD23F"], [1020, 264, "#fff"], [1390, 259, "#FF6F91"]].map(([x, y, c]) => (
        <FlowerFace key={x as number} x={x as number} y={y as number} s={0.55} c={c as string} />
      ))}
    </svg>
  );
}
