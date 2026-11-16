"use client";

import { useEffect, useRef, useState } from "react";
import { DOGS, levelOf } from "@/lib/game-core.mjs";
import { TIPS } from "@/lib/content";
import { useGame } from "@/lib/game";

type Actor = {
  i: number; x: number; y: number; w: number; dir: 1 | -1; speed: number;
  state: "walk" | "rest"; t: number; talk: number; enter: boolean;
  el: HTMLButtonElement | null; bub: HTMLSpanElement | null;
};

const W_DOG = 84;

export default function Scene({ onEarnClick, hasMissions }: { onEarnClick: () => void; hasMissions: boolean }) {
  const { shownBones, ready, levelUpTick } = useGame();
  const count = levelOf(shownBones) + 1;
  const yardRef = useRef<HTMLDivElement>(null);
  const actors = useRef<Actor[]>([]);
  const [night, setNight] = useState(false);
  const [, force] = useState(0);
  const lastCount = useRef(0);

  useEffect(() => {
    const h = new Date().getHours();
    setNight(h >= 19 || h < 6);
  }, []);

  // จัดจำนวนน้องในฉากให้ตรงเลเวล
  useEffect(() => {
    if (!ready) return;
    const W = yardRef.current?.clientWidth || 360;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const entering = lastCount.current > 0 && count > lastCount.current;
    const list = actors.current.slice(0, count);
    for (let i = list.length; i < count; i++) {
      const depth = (i % 3) * 12;
      list.push({
        i, w: W_DOG, y: depth, enter: entering, speed: DOGS[i].speed, state: "walk", t: 1 + Math.random() * 3, talk: 0,
        x: entering ? -80 : reduced ? (W - W_DOG) * (i / 5) : Math.random() * (W - W_DOG),
        dir: entering ? 1 : Math.random() < 0.5 ? -1 : 1, el: null, bub: null,
      });
    }
    actors.current = list;
    lastCount.current = count;
    force((n) => n + 1);
  }, [count, ready, levelUpTick]);

  // วนลูปเดิน
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0, last = 0;
    const tick = (ts: number) => {
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      const W = yardRef.current?.clientWidth || 360;
      for (const a of actors.current) {
        a.t -= dt;
        if (a.talk > 0) { a.talk -= dt; if (a.talk <= 0) a.bub?.classList.remove("on"); }
        if (a.state === "walk") {
          a.x += a.dir * a.speed * dt;
          if (a.x < -10) { a.x = -10; a.dir = 1; }
          if (a.x > W - a.w + 10) { a.x = W - a.w + 10; a.dir = -1; }
          if (a.t <= 0) { a.state = "rest"; a.t = 1 + Math.random() * 2.5; }
        } else if (a.t <= 0) {
          a.state = "walk"; a.t = 2 + Math.random() * 4; if (Math.random() < 0.5) a.dir = (a.dir * -1) as 1 | -1;
        }
        if (a.el) {
          a.el.style.transform = `translateX(${a.x}px)`;
          a.el.classList.toggle("walk", a.state === "walk");
          a.el.classList.toggle("flip", a.dir < 0);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const talk = (a: Actor) => {
    if (!a.bub) return;
    a.bub.textContent = `${DOGS[a.i].name}: ${TIPS[Math.floor(Math.random() * TIPS.length)]}`;
    a.bub.classList.add("on");
    a.talk = 3.2; a.state = "rest"; a.t = 3.2;
  };

  return (
    <div className={`scene${night ? " night" : ""}`}>
      <SceneArt />
      <a className="topbtn l" href="/" aria-label="ChowChowStory"><img src="/img/logo.png" alt="" /></a>
      <button className="topbtn r" type="button" aria-label="วิธีสะสมกระดูก" onClick={onEarnClick}>
        <span className="bone">🦴</span>{hasMissions && <i className="dot" />}
      </button>
      <div className="yard" ref={yardRef}>
        {actors.current.map((a) => (
          <button
            key={a.i}
            type="button"
            className={`dog${a.enter ? " enter" : ""}${DOGS[a.i].walk ? " has-walk" : ""}`}
            aria-label={`${DOGS[a.i].name} แตะเพื่อคุยกับน้อง`}
            style={{ bottom: a.y, zIndex: 10 - a.y, transform: `translateX(${a.x}px)` }}
            ref={(el) => { a.el = el; }}
            onClick={() => talk(a)}
          >
            <i className="shadow" />
            <img className="sit" src={`/img/${DOGS[a.i].img}.png`} alt="" />
            {DOGS[a.i].walk && <img className="go" src={`/img/${DOGS[a.i].walk}.png`} alt="" />}
            <span className="bubble" ref={(el) => { a.bub = el; }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function SceneArt() {
  return (
    <svg className="bg" viewBox="0 0 400 330" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="sky1" /><stop offset="1" className="sky2" />
        </linearGradient>
      </defs>
      <rect width="400" height="330" fill="url(#sky)" />
      <g className="rays" strokeWidth="5" strokeLinecap="round">
        <line x1="330" y1="14" x2="330" y2="2" /><line x1="330" y1="126" x2="330" y2="138" />
        <line x1="274" y1="70" x2="262" y2="70" /><line x1="386" y1="70" x2="398" y2="70" />
        <line x1="290" y1="30" x2="282" y2="22" /><line x1="370" y1="110" x2="378" y2="118" />
        <line x1="370" y1="30" x2="378" y2="22" /><line x1="290" y1="110" x2="282" y2="118" />
      </g>
      <circle className="sun" cx="330" cy="70" r="40" />
      <g className="cloud"><ellipse cx="60" cy="60" rx="34" ry="14" fill="#fff" opacity=".85" /><ellipse cx="84" cy="52" rx="22" ry="14" fill="#fff" opacity=".85" /></g>
      <g className="cloud c2"><ellipse cx="40" cy="104" rx="26" ry="10" fill="#fff" opacity=".7" /><ellipse cx="58" cy="98" rx="16" ry="10" fill="#fff" opacity=".7" /></g>
      <rect x="18" y="96" width="196" height="150" fill="#F28C28" stroke="#241C15" strokeWidth="3" />
      <rect x="10" y="86" width="212" height="16" fill="#241C15" />
      <rect x="36" y="112" width="160" height="34" rx="6" fill="#FFF6E5" stroke="#241C15" strokeWidth="3" />
      <text x="116" y="136" textAnchor="middle" fontFamily="Mitr,sans-serif" fontWeight="700" fontSize="17" fill="#B5338A">ร้านน้องเชา</text>
      <g stroke="#241C15" strokeWidth="3">
        <path d="M14 160 h204 v14 h-204z" fill="#fff" />
        <path d="M14 160 h26 v14 h-26z M66 160 h26 v14 h-26z M118 160 h26 v14 h-26z M170 160 h26 v14 h-26z" fill="#B5338A" />
      </g>
      <rect className="win" x="36" y="186" width="70" height="60" stroke="#241C15" strokeWidth="3" />
      <line x1="71" y1="186" x2="71" y2="246" stroke="#241C15" strokeWidth="3" />
      <rect x="126" y="186" width="70" height="60" fill="#FFD23F" stroke="#241C15" strokeWidth="3" />
      <circle cx="186" cy="218" r="3" fill="#241C15" />
      <rect x="226" y="150" width="54" height="36" rx="4" fill="#E9E2D6" stroke="#241C15" strokeWidth="3" />
      <circle cx="253" cy="168" r="11" fill="none" stroke="#241C15" strokeWidth="2.5" />
      <path d="M253 158 v20 M243 168 h20" stroke="#241C15" strokeWidth="2" />
      <rect x="338" y="168" width="16" height="78" fill="#8A5A2B" stroke="#241C15" strokeWidth="3" />
      <circle cx="346" cy="150" r="42" fill="#6CC24A" stroke="#241C15" strokeWidth="3" />
      <circle cx="330" cy="140" r="5" fill="#FF6F91" /><circle cx="360" cy="158" r="5" fill="#FF6F91" /><circle cx="352" cy="126" r="5" fill="#FF6F91" />
      <path d="M292 240 h40 l-6 12 h-28z" fill="#1DA8DA" stroke="#241C15" strokeWidth="3" />
      <rect y="246" width="400" height="84" fill="#FFF6E5" />
      <line x1="0" y1="246" x2="400" y2="246" stroke="#241C15" strokeWidth="3" />
      <line x1="0" y1="262" x2="400" y2="262" stroke="#241C15" strokeWidth="2" strokeDasharray="6 6" opacity=".35" />
    </svg>
  );
}
