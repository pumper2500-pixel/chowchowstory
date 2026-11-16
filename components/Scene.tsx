"use client";

import { useEffect, useRef, useState } from "react";
import { DOGS, levelOf } from "@/lib/game-core.mjs";
import { TIPS } from "@/lib/content";
import { useGame } from "@/lib/game";
import { AccountButton } from "@/components/Chrome";

// ฉากเดินด้านข้าง: น้องเดินอยู่กับที่ ฉากเลื่อนผ่านเป็นชั้น ๆ (parallax)
// ความเร็วของแต่ละชั้นเทียบกับพื้นหญ้า
const TILE = 1600;          // ความกว้างหนึ่งช่วงฉาก (px) วนซ้ำต่อกันไม่รู้จบ
const GROUND_SPEED = 46;    // px/วินาที ตอนเดิน
const LAYERS = { cloud: 0.12, far: 0.3, mid: 0.65, ground: 1 } as const;
const MID_TILE = 2600;      // ชั้นร้านริมทางยาวกว่า เพราะมีของเยอะ
const TILE_OF: Record<keyof typeof LAYERS, number> = { cloud: TILE, far: TILE, mid: MID_TILE, ground: TILE };
const W_DOG = 80;
const GAP = 62;             // ระยะห่างระหว่างน้องที่เดินเรียงกัน

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

type Walker = { i: number; side: 1 | -1; step: number; talk: number; el: HTMLButtonElement | null; bub: HTMLSpanElement | null; enter: boolean };

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
    for (let i = list.length; i < count; i++) list.push({ i, side: 1, step: Math.random() * 14, talk: 0, el: null, bub: null, enter: entering });
    walkers.current = list;
    lastCount.current = count;
    force((n) => n + 1);
  }, [count, ready, levelUpTick]);

  useEffect(() => {
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    // ตำแหน่งบนจอของน้องตัวที่ i: ตัวแรกนำหน้า ตัวถัดไปเดินตามหลัง เรียงสามแถวลึก
    const anchor = (i: number, W: number) => {
      const n = countRef.current;
      const lead = Math.min(W - W_DOG - 16, W * 0.62);
      const per = Math.max(26, Math.min(GAP, (lead - 2) / Math.max(1, n - 1)));
      return { x: lead - i * per, y: (i % 3) * 11 };
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
              const a = anchor(d.i, W);
              items.current.push(makePoop(pawsRef.current, w.x + a.x + 6, a.y + 2, () => toastRef.current("เก็บอึให้น้องแล้ว เจ้าของดีเด่น ✨")));
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
          const front = w.x + anchor(0, W).x + W_DOG * 0.75;
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
      if (items.current.length) {
        items.current = items.current.filter((it) => {
          const gone = !it.el.isConnected || it.x < w.x - 140;
          if (gone) it.el.remove();
          return !gone;
        });
      }

      const moving = w.speed > 6;
      sceneRef.current?.classList.toggle("resting", !moving);
      for (const d of walkers.current) {
        const a = anchor(d.i, W);
        if (d.el) {
          d.el.style.transform = `translateX(${a.x}px)`;
          d.el.style.bottom = `${a.y}px`;
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
            style={{ zIndex: 10 - (d.i % 3) * 3 }}
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

function Sign({ x, y, w, text, fill = "#FFF6E5", color = "#B5338A" }: { x: number; y: number; w: number; text: string; fill?: string; color?: string }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="28" rx="6" fill={fill} stroke={INK} strokeWidth="3" />
      <text x={x + w / 2} y={y + 20} textAnchor="middle" fontFamily="Mitr,sans-serif" fontWeight="700" fontSize="15" fill={color}>{text}</text>
    </g>
  );
}

function Tree({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} 246) scale(${s})`}>
      <rect x="-7" y="-78" width="14" height="78" fill="#8A5A2B" stroke={INK} strokeWidth="3" />
      <circle cx="0" cy="-96" r="38" className="leaf" stroke={INK} strokeWidth="3" />
      <circle cx="-14" cy="-104" r="4.5" fill="#FF6F91" /><circle cx="14" cy="-88" r="4.5" fill="#FF6F91" /><circle cx="6" cy="-120" r="4.5" fill="#FF6F91" />
    </g>
  );
}

function Street() {
  return (
    <svg width={MID_TILE} height={330} viewBox={`0 0 ${MID_TILE} 330`}>
      {/* 1) ร้านน้องเชา */}
      <g>
        <rect x="18" y="96" width="196" height="150" fill="#F28C28" stroke={INK} strokeWidth="3" />
        <rect x="10" y="86" width="212" height="16" fill={INK} />
        <Sign x={36} y={112} w={160} text="ร้านน้องเชา" />
        <path d="M14 160 h204 v14 h-204z" fill="#fff" stroke={INK} strokeWidth="3" />
        <path d="M14 160 h26 v14 h-26z M66 160 h26 v14 h-26z M118 160 h26 v14 h-26z M170 160 h26 v14 h-26z" fill="#B5338A" />
        <rect className="win" x="36" y="186" width="70" height="60" stroke={INK} strokeWidth="3" />
        <line x1="71" y1="186" x2="71" y2="246" stroke={INK} strokeWidth="3" />
        <rect x="126" y="186" width="70" height="60" fill="#FFD23F" stroke={INK} strokeWidth="3" />
        <rect x="226" y="150" width="50" height="34" rx="4" fill="#E9E2D6" stroke={INK} strokeWidth="3" />
        <circle cx="251" cy="167" r="10" fill="none" stroke={INK} strokeWidth="2.5" />
      </g>
      <Tree x={318} />

      {/* 2) คลินิกหมอหมา */}
      <g>
        <rect x="380" y="110" width="180" height="136" fill="#E8F6F8" stroke={INK} strokeWidth="3" />
        <rect x="372" y="100" width="196" height="14" fill="#1DA8DA" stroke={INK} strokeWidth="3" />
        <Sign x={394} y={122} w={152} text="คลินิกหมอหมา" color="#1A7FA6" />
        <g transform="translate(470 176)"><rect x="-6" y="-16" width="12" height="32" fill="#D6403A" /><rect x="-16" y="-6" width="32" height="12" fill="#D6403A" /></g>
        <rect className="win" x="396" y="196" width="44" height="50" stroke={INK} strokeWidth="3" />
        <rect x="500" y="196" width="44" height="50" fill="#fff" stroke={INK} strokeWidth="3" />
      </g>

      {/* 3) ไฟถนน + ม้านั่ง */}
      <g>
        <rect x="610" y="120" width="8" height="126" fill="#5A5148" stroke={INK} strokeWidth="2" />
        <path d="M600 120 h28 l-6 -14 h-16z" fill="#FFD23F" stroke={INK} strokeWidth="2.5" className="lamp" />
        <rect x="640" y="216" width="70" height="10" rx="3" fill="#8A5A2B" stroke={INK} strokeWidth="2.5" />
        <rect x="646" y="226" width="6" height="20" fill={INK} /><rect x="698" y="226" width="6" height="20" fill={INK} />
        <rect x="640" y="196" width="70" height="8" rx="3" fill="#8A5A2B" stroke={INK} strokeWidth="2.5" />
      </g>

      {/* 4) ร้านอาบน้ำตัดขน */}
      <g>
        <rect x="750" y="104" width="190" height="142" fill="#FFD6E4" stroke={INK} strokeWidth="3" />
        <path d="M742 104 h206 l-10 -18 h-186z" fill="#B5338A" stroke={INK} strokeWidth="3" />
        <Sign x={766} y={116} w={158} text="อาบน้ำตัดขน" />
        <circle cx="790" cy="170" r="8" fill="#fff" stroke="#1DA8DA" strokeWidth="2" /><circle cx="806" cy="160" r="5" fill="#fff" stroke="#1DA8DA" strokeWidth="2" />
        <circle cx="900" cy="166" r="7" fill="#fff" stroke="#1DA8DA" strokeWidth="2" />
        <rect className="win" x="770" y="186" width="74" height="60" stroke={INK} strokeWidth="3" />
        <rect x="860" y="186" width="60" height="60" fill="#FFD23F" stroke={INK} strokeWidth="3" />
      </g>

      {/* 5) รถเข็นน้ำแข็งใส (ธีมคลายร้อน) */}
      <g>
        <line x1="1030" y1="150" x2="1030" y2="200" stroke={INK} strokeWidth="3" />
        <path d="M985 154 q45 -46 90 0z" fill="#1DA8DA" stroke={INK} strokeWidth="3" />
        <path d="M985 154 q11 -12 22 0 q11 -12 23 0 q11 -12 22 0 q12 -12 23 0" fill="#fff" stroke={INK} strokeWidth="2" />
        <rect x="992" y="200" width="78" height="34" rx="4" fill="#fff" stroke={INK} strokeWidth="3" />
        <text x="1031" y="222" textAnchor="middle" fontFamily="Mitr,sans-serif" fontWeight="700" fontSize="12" fill="#1A7FA6">น้ำแข็งใส</text>
        <circle cx="1004" cy="238" r="8" fill={INK} /><circle cx="1058" cy="238" r="8" fill={INK} />
      </g>
      <Tree x={1140} s={0.9} />
      <path d="M1180 240 h36 l-5 10 h-26z" fill="#1DA8DA" stroke={INK} strokeWidth="3" />

      {/* 6) ป้ายรถเมล์ */}
      <g>
        <rect x="1250" y="150" width="120" height="10" fill="#5A5148" stroke={INK} strokeWidth="2.5" />
        <rect x="1256" y="160" width="6" height="86" fill="#5A5148" /><rect x="1358" y="160" width="6" height="86" fill="#5A5148" />
        <rect x="1270" y="210" width="80" height="8" rx="3" fill="#F28C28" stroke={INK} strokeWidth="2" />
        <rect x="1290" y="112" width="40" height="30" rx="4" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <text x="1310" y="132" textAnchor="middle" fontFamily="Mitr,sans-serif" fontWeight="700" fontSize="12" fill="#1A7FA6">BUS</text>
        <rect x="1307" y="142" width="6" height="8" fill="#5A5148" />
      </g>

      {/* 7) ตู้ไปรษณีย์ + พุ่มไม้ */}
      <g>
        <rect x="1430" y="196" width="32" height="50" rx="10" fill="#D6403A" stroke={INK} strokeWidth="3" />
        <rect x="1438" y="210" width="16" height="4" fill={INK} />
        <ellipse cx="1520" cy="236" rx="46" ry="20" className="leaf" stroke={INK} strokeWidth="3" />
        <circle cx="1504" cy="228" r="4" fill="#fff" /><circle cx="1536" cy="232" r="4" fill="#FF6F91" />
      </g>

      {/* 8) ร้านของชำ */}
      <g>
        <rect x="1612" y="108" width="208" height="138" fill="#FFF1C9" stroke={INK} strokeWidth="3" />
        <rect x="1604" y="98" width="224" height="14" fill="#2E8B57" stroke={INK} strokeWidth="3" />
        <Sign x={1641} y={118} w={150} text="ร้านของชำ" color="#2E7D32" />
        <path d="M1606 156 h220 v16 h-220z" fill="#fff" stroke={INK} strokeWidth="3" />
        <path d="M1606 156 h27 v16 h-27z M1660 156 h27 v16 h-27z M1714 156 h27 v16 h-27z M1768 156 h27 v16 h-27z" fill="#2E8B57" />
        <rect x="1626" y="184" width="98" height="62" fill="#E9E2D6" stroke={INK} strokeWidth="3" />
        <line x1="1626" y1="205" x2="1724" y2="205" stroke={INK} strokeWidth="2.5" /><line x1="1626" y1="226" x2="1724" y2="226" stroke={INK} strokeWidth="2.5" />
        {[1634, 1648, 1662, 1676, 1690, 1704].map((x, k) => <rect key={x} x={x} y="191" width="8" height="14" rx="2" fill={["#D6403A", "#1DA8DA", "#FFD23F", "#2E8B57", "#F28C28", "#B5338A"][k]} stroke={INK} strokeWidth="1.5" />)}
        {[1636, 1656, 1676, 1696].map((x, k) => <rect key={x} x={x} y="212" width="14" height="14" rx="2" fill={["#F28C28", "#fff", "#1DA8DA", "#FFD23F"][k]} stroke={INK} strokeWidth="1.5" />)}
        <rect className="win" x="1742" y="184" width="60" height="62" stroke={INK} strokeWidth="3" />
        <rect x="1748" y="226" width="40" height="20" fill="#C98A4B" stroke={INK} strokeWidth="2.5" />
        <circle cx="1756" cy="224" r="5" fill="#F28C28" stroke={INK} strokeWidth="1.5" /><circle cx="1768" cy="223" r="5" fill="#F28C28" stroke={INK} strokeWidth="1.5" /><circle cx="1780" cy="224" r="5" fill="#9ACD32" stroke={INK} strokeWidth="1.5" />
      </g>

      {/* 9) Pet Shop */}
      <g>
        <rect x="1880" y="112" width="196" height="134" fill="#E6DBFF" stroke={INK} strokeWidth="3" />
        <path d="M1872 112 h212 l-12 -22 h-188z" fill="#7B4FD1" stroke={INK} strokeWidth="3" />
        <Sign x={1908} y={122} w={140} text="PET SHOP" color="#6A3FC0" />
        <g transform="translate(2090 150)">
          <line x1="0" y1="-14" x2="0" y2="0" stroke={INK} strokeWidth="2.5" />
          <path d="M-18 4 a6 6 0 1 1 6 -6 h24 a6 6 0 1 1 6 6 a6 6 0 1 1 -6 6 h-24 a6 6 0 1 1 -6 -6z" fill="#fff" stroke={INK} strokeWidth="2.5" />
        </g>
        <rect className="win" x="1898" y="168" width="96" height="78" stroke={INK} strokeWidth="3" />
        <path d="M1906 246 v-30 l6 -6 h16 l6 6 v30z" fill="#F28C28" stroke={INK} strokeWidth="2" />
        <path d="M1940 246 v-24 l5 -5 h14 l5 5 v24z" fill="#1DA8DA" stroke={INK} strokeWidth="2" />
        <circle cx="1920" cy="230" r="5" fill="#fff" /><circle cx="1952" cy="233" r="4" fill="#fff" />
        <circle cx="1978" cy="232" r="9" fill="#FF6F91" stroke={INK} strokeWidth="2" />
        <rect x="2012" y="176" width="46" height="70" fill="#FFD23F" stroke={INK} strokeWidth="3" />
        <circle cx="2050" cy="214" r="3" fill={INK} />
      </g>

      {/* 10) สวนสาธารณะ */}
      <g>
        <rect x="2126" y="150" width="12" height="96" fill="#8A5A2B" stroke={INK} strokeWidth="2.5" />
        <rect x="2268" y="150" width="12" height="96" fill="#8A5A2B" stroke={INK} strokeWidth="2.5" />
        <path d="M2120 156 q83 -46 166 0" fill="none" stroke="#2E8B57" strokeWidth="8" />
        <Sign x={2128} y={112} w={150} text="สวนสาธารณะ" color="#2E7D32" />
        <Tree x={2206} s={0.75} />
        <g fill="#fff" stroke={INK} strokeWidth="2">
          {Array.from({ length: 13 }, (_, k) => <path key={k} d={`M${2290 + k * 22} 246 v-24 l5 -6 l5 6 v24z`} />)}
          <rect x="2286" y="230" width="290" height="5" />
        </g>
        <g transform="translate(2370 246)">
          <ellipse cx="0" cy="-8" rx="46" ry="10" fill="#BFE9F7" stroke={INK} strokeWidth="3" />
          <rect x="-6" y="-52" width="12" height="44" fill="#E9E2D6" stroke={INK} strokeWidth="2.5" />
          <ellipse cx="0" cy="-52" rx="18" ry="5" fill="#E9E2D6" stroke={INK} strokeWidth="2.5" />
          <path className="spray" d="M-2 -58 q-18 -22 -30 4 M2 -58 q18 -22 30 4 M0 -58 v-16" fill="none" stroke="#1DA8DA" strokeWidth="3" strokeLinecap="round" />
        </g>
        <Tree x={2450} s={1.05} />
        <Tree x={2560} s={0.85} />
        <g transform="translate(2510 246)">
          <rect x="-3" y="-44" width="6" height="44" fill="#5A5148" />
          <rect x="-34" y="-62" width="68" height="22" rx="5" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <text x="0" y="-46" textAnchor="middle" fontFamily="Mitr,sans-serif" fontWeight="700" fontSize="11" fill="#2E7D32">ลานน้องหมา</text>
        </g>
      </g>
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
