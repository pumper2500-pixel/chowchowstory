"use client";

import { useEffect, useRef, useState } from "react";
import { DOGS, levelOf } from "@/lib/game-core.mjs";
import { TIPS } from "@/lib/content";
import { useGame } from "@/lib/game";
import { AccountButton } from "@/components/Chrome";
import { Street, MID_TILE, PedArt, PEDS } from "@/components/StreetArt";

// ฉากเดินด้านข้าง: น้องเดินอยู่กับที่ ฉากเลื่อนผ่านเป็นชั้น ๆ (parallax)
// ความเร็วของแต่ละชั้นเทียบกับพื้นหญ้า
const TILE = 1600;          // ความกว้างหนึ่งช่วงฉาก (px) วนซ้ำต่อกันไม่รู้จบ
const GROUND_SPEED = 46;    // px/วินาที ตอนเดิน
const LAYERS = { cloud: 0.12, far: 0.3, mid: 0.65, ground: 1 } as const;
const TILE_OF: Record<keyof typeof LAYERS, number> = { cloud: TILE, far: TILE, mid: MID_TILE, ground: TILE };
const W_DOG = 80;
const GAP = 150;            // ระยะห่างมากสุดระหว่างน้องแต่ละตัว
const LANES = [8, 44, 24, 58, 14, 50]; // ความสูงจากขอบล่าง: ยิ่งสูง = ยิ่งอยู่ไกล (ตัวเล็กลง)

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
  px: number; py: number; ox: number; oy: number; tx: number; ty: number; wt: number;
};

export default function Scene({ onEarnClick, hasMissions }: { onEarnClick: () => void; hasMissions: boolean }) {
  const { shownBones, ready, levelUpTick, showToast } = useGame();
  const count = levelOf(shownBones) + 1;
  const [night, setNight] = useState(false);
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
  const peds = useRef(PEDS.map((_, i) => ({
    x: i * 92 + Math.random() * 30, dir: (i % 2 ? -1 : 1) as 1 | -1, speed: 14 + Math.random() * 14, el: null as HTMLDivElement | null,
  })));
  const toastRef = useRef(showToast);
  toastRef.current = showToast;
  countRef.current = count;

  useEffect(() => {
    const h = new Date().getHours();
    setNight(h >= 19 || h < 6);
  }, []);

  // จำนวนน้องในขบวน = เลเวล
  useEffect(() => {
    if (!ready) return;
    const entering = lastCount.current > 0 && count > lastCount.current;
    const list = walkers.current.slice(0, count);
    for (let i = list.length; i < count; i++) list.push({ i, side: 1, step: Math.random() * 14, talk: 0, el: null, bub: null, enter: entering,
      px: entering ? -90 : NaN, py: LANES[i % LANES.length], ox: 0, oy: 0, tx: 0, ty: 0, wt: Math.random() * 2 });
    walkers.current = list;
    lastCount.current = count;
    force((n) => n + 1);
  }, [count, ready, levelUpTick]);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // จัดตำแหน่งน้อง: กระจายเต็มสนาม คนละระดับความลึก แต่ละตัวเดินส่ายซ้าย-ขวา ขึ้น-ลงเองช้า ๆ
    // แล้วดันออกจากกันถ้าเข้าใกล้เกินไป จะได้ไม่ซ้อนกัน
    const layout = (W: number, dt: number, moving: boolean) => {
      const list = walkers.current;
      const n = list.length;
      const right = W - W_DOG - 14, left = 6;
      const per = n > 1 ? Math.min(GAP, (right - left) / (n - 1)) : 0;
      const pos = list.map((d) => {
        d.wt -= dt;
        if (d.wt <= 0) {
          d.wt = 2.5 + Math.random() * 3;
          d.tx = (Math.random() * 2 - 1) * Math.min(28, per * 0.3 + 6);
          d.ty = (Math.random() * 2 - 1) * 10;
        }
        const k = Math.min(1, dt * (moving ? 0.7 : 0.25));
        d.ox += (d.tx - d.ox) * k; d.oy += (d.ty - d.oy) * k;
        const y = Math.max(0, Math.min(64, LANES[d.i % LANES.length] + d.oy));
        return { d, x: Math.max(left, Math.min(right, right - d.i * per + d.ox)), y };
      });
      for (let pass = 0; pass < 3; pass++) {
        for (let a = 0; a < pos.length; a++) for (let b = a + 1; b < pos.length; b++) {
          const A = pos[a], B = pos[b];
          const dx = B.x - A.x, dy = Math.abs(B.y - A.y);
          if (dy > 30) continue;
          const need = 64 - dy * 0.9;
          if (Math.abs(dx) >= need) continue;
          const push = (need - Math.abs(dx)) / 2, sgn = dx >= 0 ? 1 : -1;
          A.x -= push * sgn; B.x += push * sgn;
        }
      }
      for (const p of pos) {
        const d = p.d;
        if (Number.isNaN(d.px)) { d.px = p.x; d.py = p.y; }
        const k = Math.min(1, dt * 2.2);
        d.px += (p.x - d.px) * k; d.py += (p.y - d.py) * k;
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
        const lead = walkers.current[0];
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
        if (p.el) p.el.style.transform = `translateX(${sx.toFixed(1)}px) scaleX(${p.dir})`;
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
          d.el.classList.toggle("walk", moving);
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
    <div className={`scene${night ? " night" : ""}`} ref={sceneRef}>
      <div className="sky" />
      <div className="sun" aria-hidden="true"><i className="rays" /></div>
      {strip("cloud", <Clouds />)}
      {strip("far", <Far />)}
      {strip("mid", <Street />)}
      {strip("ground", <Lawn />)}
      <div className="peds" aria-hidden="true">
        {peds.current.map((p, i) => (
          <div key={i} className="ped" ref={(el) => { p.el = el; }}><PedArt i={i} /></div>
        ))}
      </div>
      <div className="paws-world" ref={pawsRef} aria-hidden="true" />

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
  const c = (x: number, y: number, s: number) => (
    <g key={x} transform={`translate(${x} ${y}) scale(${s})`} className="cloud">
      <ellipse cx="0" cy="0" rx="34" ry="13" /><ellipse cx="24" cy="-8" rx="22" ry="14" /><ellipse cx="-20" cy="-4" rx="16" ry="10" />
    </g>
  );
  return <svg {...svgProps}>{[c(120, 60, 1), c(480, 104, 0.7), c(820, 48, 1.2), c(1180, 92, 0.8), c(1450, 64, 1)]}</svg>;
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
    </svg>
  );
}
