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
const W_DOG = 80;
const GAP = 62;             // ระยะห่างระหว่างน้องที่เดินเรียงกัน

const PAW = '<svg viewBox="0 0 20 20"><ellipse cx="10" cy="13.2" rx="5.2" ry="4.4"/><ellipse cx="4.2" cy="8" rx="1.9" ry="2.4"/><ellipse cx="8" cy="5.2" rx="1.9" ry="2.5"/><ellipse cx="12" cy="5.2" rx="1.9" ry="2.5"/><ellipse cx="15.8" cy="8" rx="1.9" ry="2.4"/></svg>';

type Walker = { i: number; side: 1 | -1; step: number; talk: number; el: HTMLButtonElement | null; bub: HTMLSpanElement | null; enter: boolean };

export default function Scene({ onEarnClick, hasMissions }: { onEarnClick: () => void; hasMissions: boolean }) {
  const { shownBones, ready, levelUpTick } = useGame();
  const count = levelOf(shownBones) + 1;
  const [night, setNight] = useState(false);
  const [, force] = useState(0);

  const sceneRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const pawsRef = useRef<HTMLDivElement>(null);
  const walkers = useRef<Walker[]>([]);
  const lastCount = useRef(0);
  const countRef = useRef(count);
  const world = useRef({ x: 0, walking: true, t: 6 + Math.random() * 6, speed: 0 });
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
        if (w.t <= 0) { w.walking = !w.walking; w.t = w.walking ? 7 + Math.random() * 7 : 2 + Math.random() * 2.5; }
        const target = w.walking ? GROUND_SPEED : 0;
        w.speed += (target - w.speed) * Math.min(1, dt * 3);
        w.x += w.speed * dt;
      }
      for (const [k, f] of Object.entries(LAYERS)) {
        const el = layerRefs.current[k];
        if (el) el.style.transform = `translateX(${-((w.x * f) % TILE)}px)`;
      }
      if (pawsRef.current) pawsRef.current.style.transform = `translateX(${-w.x}px)`;

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

  const talk = (d: Walker) => {
    if (!d.bub) return;
    d.bub.textContent = `${DOGS[d.i].name}: ${TIPS[Math.floor(Math.random() * TIPS.length)]}`;
    d.bub.classList.add("on");
    d.talk = 3.2;
  };

  const strip = (k: keyof typeof LAYERS, art: React.ReactNode) => (
    <div className={`layer layer-${k}`} ref={(el) => { layerRefs.current[k] = el; }} aria-hidden="true">
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
    <svg {...svgProps}>
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
