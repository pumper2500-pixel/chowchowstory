// ศิลปะฉากถนน (วาดเองทั้งหมด) — SVG หน่วยพิกเซล สูง 330 พื้นอยู่ที่ y=246
import type { ReactNode } from "react";

export const INK = "#241C15";
export const MID_TILE = 2600;
export type Phase = "morning" | "day" | "evening" | "night";
const G = 246;
const F = "Mitr,sans-serif";
const sw = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const };

// ---------------------------------------------------------------
// ชิ้นส่วนพื้นฐาน
// ---------------------------------------------------------------
export function Sign({ x, y, w, text, fill = "#FFF6E5", color = "#B5338A", size = 15 }: { x: number; y: number; w: number; text: string; fill?: string; color?: string; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="30" rx="8" fill={fill} {...sw} />
      <rect x={x + 4} y={y + 4} width={w - 8} height="22" rx="5" fill="none" stroke={color} strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x={x + w / 2} y={y + 21} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize={size} fill={color}>{text}</text>
    </g>
  );
}

function Awning({ x, y, w, a, b, h = 16 }: { x: number; y: number; w: number; a: string; b: string; h?: number }) {
  const n = Math.max(3, Math.round(w / 22));
  const s = w / n;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} fill={i % 2 ? b : a} stroke={INK} strokeWidth="2.2" strokeLinejoin="round"
          d={`M${x + i * s} ${y} h${s} v${h} a${s / 2} ${s / 2.4} 0 0 1 ${-s} 0z`} />
      ))}
      <rect x={x - 3} y={y - 5} width={w + 6} height="7" rx="3" fill={INK} />
    </g>
  );
}

function Win({ x, y, w, h, cols = 2, children, sill = true, arch = false }: { x: number; y: number; w: number; h: number; cols?: number; children?: ReactNode; sill?: boolean; arch?: boolean }) {
  const shape = arch
    ? <path className="win" d={`M${x} ${y + h} V${y + w / 2} a${w / 2} ${w / 2} 0 0 1 ${w} 0 V${y + h}z`} {...sw} />
    : <rect className="win" x={x} y={y} width={w} height={h} rx="3" {...sw} />;
  return (
    <g>
      {shape}
      {children}
      <path className="glare" d={`M${x + 6} ${y + h - 6} L${x + w * 0.45} ${y + (arch ? w * 0.3 : 6)} h${w * 0.14} L${x + 6 + w * 0.14} ${y + h - 6}z`} fill="#fff" opacity=".45" />
      {Array.from({ length: cols - 1 }, (_, i) => <line key={i} x1={x + (w / cols) * (i + 1)} y1={arch ? y + 2 : y} x2={x + (w / cols) * (i + 1)} y2={y + h} stroke={INK} strokeWidth="2.5" />)}
      {sill && <rect x={x - 4} y={y + h - 2} width={w + 8} height="6" rx="2" fill="#fff" stroke={INK} strokeWidth="2" />}
    </g>
  );
}

function FlowerBox({ x, y, w, c = "#FF6F91" }: { x: number; y: number; w: number; c?: string }) {
  const n = Math.max(2, Math.floor(w / 9));
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <g key={i}><circle cx={x + 5 + i * ((w - 10) / (n - 1))} cy={y - 3} r="4.5" className="leaf" stroke={INK} strokeWidth="1.5" />
          {i % 2 === 0 && <circle cx={x + 5 + i * ((w - 10) / (n - 1))} cy={y - 5} r="2.6" fill={c} />}</g>
      ))}
      <rect x={x} y={y} width={w} height="8" rx="2" fill="#C2603A" stroke={INK} strokeWidth="2" />
    </g>
  );
}

function Door({ x, w = 40, h = 62, fill = "#8A5A2B", round = true }: { x: number; w?: number; h?: number; fill?: string; round?: boolean }) {
  return (
    <g>
      <rect x={x} y={G - h} width={w} height={h} rx="3" fill={fill} {...sw} />
      {round
        ? <circle className="win" cx={x + w / 2} cy={G - h + 18} r={w / 4} stroke={INK} strokeWidth="2.5" />
        : <rect className="win" x={x + 6} y={G - h + 8} width={w - 12} height={h * 0.45} rx="2" stroke={INK} strokeWidth="2.5" />}
      <circle cx={x + w - 8} cy={G - h / 2 + 4} r="2.6" fill="#FFD23F" stroke={INK} strokeWidth="1.5" />
      <rect x={x - 4} y={G - 3} width={w + 8} height="4" fill={INK} />
    </g>
  );
}

function Plant({ x, s = 1, flower = "#FF6F91" }: { x: number; s?: number; flower?: string }) {
  return (
    <g transform={`translate(${x} ${G}) scale(${s})`}>
      <ellipse cx="-7" cy="-26" rx="8" ry="11" className="leaf" stroke={INK} strokeWidth="2" transform="rotate(-25 -7 -26)" />
      <ellipse cx="7" cy="-28" rx="8" ry="12" className="leaf" stroke={INK} strokeWidth="2" transform="rotate(20 7 -28)" />
      <ellipse cx="0" cy="-32" rx="7" ry="12" className="leaf" stroke={INK} strokeWidth="2" />
      <circle cx="-4" cy="-38" r="3" fill={flower} /><circle cx="6" cy="-34" r="3" fill={flower} />
      <path d="M-11 -18 h22 l-3 18 h-16z" fill="#D9774A" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
      <rect x="-12" y="-20" width="24" height="5" rx="2" fill="#C2603A" stroke={INK} strokeWidth="2" />
    </g>
  );
}

function Lights({ x1, x2, y, sag = 12 }: { x1: number; x2: number; y: number; sag?: number }) {
  const n = Math.max(3, Math.round((x2 - x1) / 18));
  const cols = ["#FF6F91", "#FFD23F", "#5CC8F5", "#9BE15D"];
  return (
    <g>
      <path d={`M${x1} ${y} Q${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}`} fill="none" stroke={INK} strokeWidth="1.5" />
      {Array.from({ length: n - 1 }, (_, i) => {
        const t = (i + 1) / n;
        return <circle key={i} className="bulb" cx={x1 + (x2 - x1) * t} cy={y + sag * 4 * t * (1 - t) + 4} r="3" fill={cols[i % 4]} stroke={INK} strokeWidth="1" />;
      })}
    </g>
  );
}

function Cornice({ x, w, y, fill }: { x: number; w: number; y: number; fill: string }) {
  return (
    <g>
      <rect x={x - 8} y={y} width={w + 16} height="12" rx="2" fill={fill} {...sw} />
      <g fill={INK} opacity=".3">{Array.from({ length: Math.floor((w + 8) / 14) }, (_, i) => <rect key={i} x={x - 4 + i * 14} y={y + 12} width="7" height="4" />)}</g>
    </g>
  );
}

function Plinth({ x, w, fill = "#C9B9A6" }: { x: number; w: number; fill?: string }) {
  return (
    <g>
      <rect x={x} y={G - 12} width={w} height="12" fill={fill} stroke={INK} strokeWidth="2.5" />
      <g stroke={INK} strokeOpacity=".3" strokeWidth="1.5">{Array.from({ length: Math.floor(w / 20) }, (_, i) => <line key={i} x1={x + 10 + i * 20} y1={G - 12} x2={x + 10 + i * 20} y2={G} />)}</g>
    </g>
  );
}

// หน้าน่ารัก ๆ ใส่ให้ของในเมือง (ตู้ไปรษณีย์ ต้นไม้ ดอกไม้)
function Face({ x, y, s = 1, sleepy = false }: { x: number; y: number; s?: number; sleepy?: boolean }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {sleepy
        ? <path d="M-7 0 q2 2 4 0 M3 0 q2 2 4 0" fill="none" stroke={INK} strokeWidth="1.6" strokeLinecap="round" />
        : <><ellipse cx="-5" cy="0" rx="1.6" ry="2.1" fill={INK} /><ellipse cx="5" cy="0" rx="1.6" ry="2.1" fill={INK} /><circle cx="-4.5" cy="-.8" r=".6" fill="#fff" /><circle cx="5.5" cy="-.8" r=".6" fill="#fff" /></>}
      <path d="M-2.4 3.2 q2.4 2.4 4.8 0" fill="none" stroke={INK} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="-9" cy="3" r="2.4" fill="#FF8FA3" opacity=".65" /><circle cx="9" cy="3" r="2.4" fill="#FF8FA3" opacity=".65" />
    </g>
  );
}

export function FlowerFace({ x, y, s = 1, c = "#FF6F91" }: { x: number; y: number; s?: number; c?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} className="fflower">
      <path d="M0 6 v14" stroke="#3E8E3A" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="5" cy="15" rx="5" ry="2.6" fill="#6CC24A" stroke={INK} strokeWidth="1.3" transform="rotate(-25 5 15)" />
      {[0, 60, 120, 180, 240, 300].map((a) => <circle key={a} cx={Math.cos((a * Math.PI) / 180) * 8} cy={Math.sin((a * Math.PI) / 180) * 8} r="5" fill={c} stroke={INK} strokeWidth="1.4" />)}
      <circle r="6.5" fill="#FFE27A" stroke={INK} strokeWidth="1.4" />
      <Face x={0} y={0} s={0.5} />
    </g>
  );
}

export function Tree({ x, s = 1, face = false }: { x: number; s?: number; face?: boolean }) {
  return (
    <g transform={`translate(${x} ${G}) scale(${s})`}>
      <path d="M-7 0 V-78 h14 V0z" fill="#8A5A2B" {...sw} />
      <path d="M-3 -40 q-4 6 -2 12 M3 -60 q4 6 2 10" fill="none" stroke={INK} strokeWidth="1.5" opacity=".5" />
      <circle cx="-22" cy="-88" r="24" className="leaf" {...sw} />
      <circle cx="22" cy="-90" r="24" className="leaf" {...sw} />
      <circle cx="0" cy="-110" r="30" className="leaf" {...sw} />
      <circle cx="-12" cy="-122" r="10" fill="#fff" opacity=".2" />
      <circle cx="-14" cy="-100" r="4.5" fill="#FF6F91" /><circle cx="22" cy="-80" r="4.5" fill="#FF6F91" /><circle cx="14" cy="-128" r="4.5" fill="#FF6F91" /><circle cx="-30" cy="-82" r="4" fill="#FFD23F" />
      {face && <Face x={2} y={-100} s={1.1} />}
    </g>
  );
}

function ChowFace({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <circle cx="-11" cy="-11" r="5" fill="#E89B4F" stroke={INK} strokeWidth="2" /><circle cx="11" cy="-11" r="5" fill="#E89B4F" stroke={INK} strokeWidth="2" />
      <circle r="14" fill="#F2B163" stroke={INK} strokeWidth="2.2" />
      <ellipse cy="5" rx="7" ry="5" fill="#FCE3BE" />
      <circle cx="-5" cy="-2" r="1.6" fill={INK} /><circle cx="5" cy="-2" r="1.6" fill={INK} />
      <ellipse cy="3" rx="2.4" ry="1.6" fill={INK} /><ellipse cy="8" rx="2" ry="2.4" fill="#7A5AC8" />
      <circle cx="-9" cy="4" r="2" fill="#FF8FA3" opacity=".7" /><circle cx="9" cy="4" r="2" fill="#FF8FA3" opacity=".7" />
    </g>
  );
}

function CatLoaf({ x, y, c = "#FFFFFF", s = 1 }: { x: number; y: number; c?: string; s?: number }) {
  // แมวนอนหมอบ หางกระดิก
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path className="cat-tail" d="M12 -4 q10 -2 8 -12" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path className="cat-tail" d="M12 -4 q10 -2 8 -12" fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" />
      <path d="M-14 0 q0 -14 14 -14 q14 0 14 14z" fill={c} {...sw} strokeWidth={2.2} />
      <path d="M-14 -10 l2 -9 l6 6z M-2 -13 l3 -8 l4 7z" fill={c} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <circle cx="-9" cy="-8" r="8" fill={c} stroke={INK} strokeWidth="2.2" />
      <path d="M-13 -9 q1.5 1.5 3 0 M-7 -9 q1.5 1.5 3 0" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
      <circle cx="-13" cy="-5" r="1.6" fill="#FF8FA3" opacity=".7" />
      <path d="M-9 -5.5 l-1 1 h2z" fill={INK} />
    </g>
  );
}

function Bust({ x, y, skin = "#F5C9A0", shirt = "#fff", animal = "bear", apron, wave = false, coat = false }: { x: number; y: number; skin?: string; shirt?: string; animal?: Animal; apron?: string; wave?: boolean; coat?: boolean }) {
  // คนในร้าน (เห็นครึ่งตัว) โบกมือทักทาย
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d="M-14 22 q0 -16 14 -16 q14 0 14 16z" fill={shirt} stroke={INK} strokeWidth="2" />
      {apron && <path d="M-7 22 v-11 h14 v11z" fill={apron} stroke={INK} strokeWidth="1.5" />}
      {coat && <path d="M-4 8 q-3 8 2 12 M4 8 q3 8 -2 12" fill="none" stroke="#3F4A5A" strokeWidth="1.8" />}
      {wave && <g className="wave"><path d="M10 12 l8 -12" stroke={INK} strokeWidth="5.5" strokeLinecap="round" /><path d="M10 12 l8 -12" stroke={shirt} strokeWidth="3" strokeLinecap="round" /><circle cx="18" cy="-1" r="3" fill={skin} stroke={INK} strokeWidth="1.5" /></g>}
      <g transform="translate(0 -4) scale(.78)"><AnimalHead a={animal} /></g>
    </g>
  );
}

function Clothesline({ x1, x2, y }: { x1: number; x2: number; y: number }) {
  const cols = ["#FF6F91", "#5CC8F5", "#FFD23F", "#9BE15D", "#fff"];
  const n = Math.floor((x2 - x1) / 16);
  return (
    <g>
      <path d={`M${x1} ${y} Q${(x1 + x2) / 2} ${y + 8} ${x2} ${y}`} fill="none" stroke={INK} strokeWidth="1.3" />
      {Array.from({ length: n }, (_, i) => {
        const cx = x1 + 8 + i * 16, cy = y + 3 + 8 * 4 * ((cx - x1) / (x2 - x1)) * (1 - (cx - x1) / (x2 - x1)) / 2;
        return i % 2
          ? <path key={i} className="cloth" d={`M${cx - 6} ${cy} h12 l2 4 h-3 v10 h-10 v-10 h-3z`} fill={cols[i % 5]} stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
          : <rect key={i} className="cloth" x={cx - 5} y={cy} width="10" height="12" rx="1.5" fill={cols[i % 5]} stroke={INK} strokeWidth="1.3" />;
      })}
    </g>
  );
}

function Smoke({ x, y }: { x: number; y: number }) {
  return (
    <g className="smoke">
      <circle cx={x} cy={y} r="5" /><circle cx={x + 4} cy={y - 10} r="6.5" /><circle cx={x - 2} cy={y - 22} r="8" />
    </g>
  );
}


// ---------------------------------------------------------------
// หัวสัตว์ (วาดเอง) ใช้แทนหัวคน: กลางอยู่ที่ (0,0) รัศมีราว 13.5 — dx เลื่อนหน้าไปทางขวาเมื่อหันข้าง
// ---------------------------------------------------------------
export type Animal = "panda" | "penguin" | "cat" | "bear" | "monkey" | "tiger" | "rabbit" | "elephant" | "pig" | "dog";
const ST = { stroke: INK, strokeWidth: 2.4, strokeLinejoin: "round" as const };
function Eyes({ dx, y = -1, white = false }: { dx: number; y?: number; white?: boolean }) {
  return (
    <g>
      <ellipse cx={dx - 4.5} cy={y} rx="1.8" ry="2.4" fill={white ? "#fff" : INK} /><ellipse cx={dx + 4.5} cy={y} rx="1.8" ry="2.4" fill={white ? "#fff" : INK} />
      {!white && <><circle cx={dx - 3.9} cy={y - .9} r=".75" fill="#fff" /><circle cx={dx + 5.1} cy={y - .9} r=".75" fill="#fff" /></>}
    </g>
  );
}
function Cheeks({ dx, y = 4 }: { dx: number; y?: number }) {
  return <><circle cx={dx - 8.5} cy={y} r="2.4" fill="#FF8FA3" opacity=".6" /><circle cx={dx + 8.5} cy={y} r="2.4" fill="#FF8FA3" opacity=".6" /></>;
}
export function AnimalHead({ a, dx = 0 }: { a: Animal; dx?: number }) {
  switch (a) {
    case "panda": return (
      <g>
        <circle cx="-10" cy="-11" r="5" fill={INK} /><circle cx="10" cy="-11" r="5" fill={INK} />
        <circle r="13.5" fill="#fff" {...ST} />
        <ellipse cx={dx - 5} cy="-.5" rx="3.6" ry="4.6" fill={INK} transform={`rotate(20 ${dx - 5} 0)`} /><ellipse cx={dx + 5} cy="-.5" rx="3.6" ry="4.6" fill={INK} transform={`rotate(-20 ${dx + 5} 0)`} />
        <circle cx={dx - 4.6} cy="-1.4" r="1.3" fill="#fff" /><circle cx={dx + 5.4} cy="-1.4" r="1.3" fill="#fff" />
        <ellipse cx={dx} cy="5" rx="2.2" ry="1.5" fill={INK} /><path d={`M${dx - 2} 8 q2 2 4 0`} fill="none" stroke={INK} strokeWidth="1.3" />
        <Cheeks dx={dx} y={6} />
      </g>);
    case "penguin": return (
      <g>
        <circle r="13.5" fill="#2B3A67" {...ST} />
        <path d={`M${dx - 10} 2 q0 -10 10 -9 q10 -1 10 9 q0 10 -10 10 q-10 0 -10 -10z`} fill="#fff" />
        <Eyes dx={dx} y={-1} />
        <path d={`M${dx - 3} 3.5 l3 3.5 l3 -3.5z`} fill="#FFB020" stroke={INK} strokeWidth="1.3" strokeLinejoin="round" />
        <Cheeks dx={dx} y={5} />
      </g>);
    case "cat": return (
      <g>
        <path d="M-12 -4 l1 -13 l9 6z M12 -4 l-1 -13 l-9 6z" fill="#FFE2C4" {...ST} /><path d="M-9.5 -8 l.5 -6 l4 3z M9.5 -8 l-.5 -6 l-4 3z" fill="#FF9FB4" />
        <ellipse rx="14" ry="12.5" fill="#FFE2C4" {...ST} />
        <path d="M-6 -11 q2 4 0 6 M0 -12 v5 M6 -11 q-2 4 0 6" stroke="#F2A65A" strokeWidth="2" fill="none" strokeLinecap="round" />
        <Eyes dx={dx} y={0} />
        <path d={`M${dx - 1.4} 3.5 h2.8 l-1.4 1.6z`} fill="#FF6F91" /><path d={`M${dx - 2.6} 6 q1.3 1.4 2.6 0 q1.3 1.4 2.6 0`} fill="none" stroke={INK} strokeWidth="1.2" />
        <path d={`M${dx + 9} 4 h6 M${dx + 9} 6.5 l5 1.5 M${dx - 9} 4 h-6`} stroke={INK} strokeWidth="1" />
        <Cheeks dx={dx} y={5} />
      </g>);
    case "bear": return (
      <g>
        <circle cx="-10" cy="-10" r="5.5" fill="#B9773E" {...ST} /><circle cx="10" cy="-10" r="5.5" fill="#B9773E" {...ST} />
        <circle cx="-10" cy="-10" r="2.6" fill="#E8B48A" /><circle cx="10" cy="-10" r="2.6" fill="#E8B48A" />
        <circle r="13.5" fill="#B9773E" {...ST} />
        <ellipse cx={dx} cy="5" rx="6.5" ry="5" fill="#F2D2A9" stroke={INK} strokeWidth="1.5" />
        <Eyes dx={dx} y={-2.5} />
        <ellipse cx={dx} cy="3" rx="2.4" ry="1.7" fill={INK} /><path d={`M${dx - 2} 6.5 q2 2 4 0`} fill="none" stroke={INK} strokeWidth="1.2" />
        <Cheeks dx={dx} y={3} />
      </g>);
    case "monkey": return (
      <g>
        <circle cx="-13" cy="0" r="5" fill="#9A5B2E" {...ST} /><circle cx="13" cy="0" r="5" fill="#9A5B2E" {...ST} />
        <circle cx="-13" cy="0" r="2.5" fill="#F2C6A0" /><circle cx="13" cy="0" r="2.5" fill="#F2C6A0" />
        <circle r="13" fill="#9A5B2E" {...ST} />
        <path d={`M${dx} -5 q-4 -5 -8 -1 q-4 5 0 10 q3 5 8 5 q5 0 8 -5 q4 -5 0 -10 q-4 -4 -8 1z`} fill="#F2C6A0" stroke={INK} strokeWidth="1.3" />
        <Eyes dx={dx} y={-1.5} />
        <path d={`M${dx - 3} 5 q3 3 6 0`} fill="none" stroke={INK} strokeWidth="1.4" strokeLinecap="round" />
        <circle cx={dx - 1} cy="2.3" r=".7" fill={INK} /><circle cx={dx + 1} cy="2.3" r=".7" fill={INK} />
      </g>);
    case "tiger": return (
      <g>
        <circle cx="-10" cy="-10" r="5" fill="#F28C28" {...ST} /><circle cx="10" cy="-10" r="5" fill="#F28C28" {...ST} />
        <circle cx="-10" cy="-10" r="2.2" fill="#FFF1D6" /><circle cx="10" cy="-10" r="2.2" fill="#FFF1D6" />
        <circle r="13.5" fill="#F28C28" {...ST} />
        <path d="M-3 -13 l1.5 4 l1.5 -4 M-9 -9 l3 2 M9 -9 l-3 2 M-13 0 l4 1 M13 0 l-4 1" stroke={INK} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <ellipse cx={dx} cy="5.5" rx="7.5" ry="5" fill="#FFF1D6" stroke={INK} strokeWidth="1.3" />
        <Eyes dx={dx} y={-2} />
        <path d={`M${dx - 1.8} 3 h3.6 l-1.8 2z`} fill="#FF6F91" stroke={INK} strokeWidth=".8" /><path d={`M${dx - 3} 7 q1.5 1.5 3 0 q1.5 1.5 3 0`} fill="none" stroke={INK} strokeWidth="1.2" />
      </g>);
    case "rabbit": return (
      <g>
        <ellipse cx="-5" cy="-19" rx="4.5" ry="11" fill="#fff" {...ST} transform="rotate(-10 -5 -19)" /><ellipse cx="6" cy="-19" rx="4.5" ry="11" fill="#fff" {...ST} transform="rotate(12 6 -19)" />
        <ellipse cx="-5" cy="-19" rx="2" ry="7" fill="#FFB3C6" transform="rotate(-10 -5 -19)" /><ellipse cx="6" cy="-19" rx="2" ry="7" fill="#FFB3C6" transform="rotate(12 6 -19)" />
        <circle r="13" fill="#fff" {...ST} />
        <Eyes dx={dx} y={0} />
        <path d={`M${dx - 1.4} 3.5 h2.8 l-1.4 1.6z`} fill="#FF6F91" /><path d={`M${dx} 5 v1.5 M${dx - 2.4} 7 q1.2 1.2 2.4 -.4 q1.2 1.6 2.4 .4`} fill="none" stroke={INK} strokeWidth="1.2" />
        <Cheeks dx={dx} y={5} />
      </g>);
    case "elephant": return (
      <g>
        <ellipse cx="-11" cy="1" rx="8" ry="10" fill="#A9B4C8" {...ST} /><ellipse cx="-11" cy="1" rx="4.5" ry="6.5" fill="#F0B8C8" />
        <circle r="13" fill="#A9B4C8" {...ST} />
        <path d={`M${dx + 2} 2 q10 2 9 12 q-1 2 -3.5 1 q0 -6 -6 -7`} fill="#A9B4C8" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
        <Eyes dx={dx - 1} y={-3} />
        <Cheeks dx={dx - 1} y={2} />
      </g>);
    case "pig": return (
      <g>
        <path d="M-12 -6 l-1 -9 l8 4z M12 -6 l1 -9 l-8 4z" fill="#FFB3C6" {...ST} />
        <circle r="13.5" fill="#FFC7D5" {...ST} />
        <Eyes dx={dx} y={-3} />
        <ellipse cx={dx} cy="4" rx="5" ry="3.6" fill="#FF9FB4" stroke={INK} strokeWidth="1.4" />
        <ellipse cx={dx - 1.6} cy="4" rx=".9" ry="1.3" fill={INK} /><ellipse cx={dx + 1.6} cy="4" rx=".9" ry="1.3" fill={INK} />
      </g>);
    case "dog": return (
      <g>
        <ellipse cx="-11" cy="-1" rx="5" ry="9" fill="#8A5A2B" {...ST} transform="rotate(15 -11 -1)" />
        <circle r="13.5" fill="#F3E3C8" {...ST} />
        <ellipse cx={dx - 5} cy="-2" rx="4.5" ry="5" fill="#C98A4B" opacity=".8" />
        <Eyes dx={dx} y={-2} />
        <ellipse cx={dx} cy="3.5" rx="2.6" ry="1.8" fill={INK} /><path d={`M${dx - 2.4} 6.5 q2.4 2 4.8 0`} fill="none" stroke={INK} strokeWidth="1.3" />
        <Cheeks dx={dx} y={4} />
      </g>);
  }
}

// ---------------------------------------------------------------
// ถนนทั้งเส้น (ชั้นร้านค้า) ยาว MID_TILE แล้ววนซ้ำ
// ---------------------------------------------------------------
export function Street() {
  return (
    <svg width={MID_TILE} height={330} viewBox={`0 0 ${MID_TILE} 330`}>
      {/* 1) ร้านน้องเชา: ตึกสองชั้น หลังคากระเบื้อง ปล่องควัน แมวนอนบนกันสาด */}
      <g>
        <Smoke x={192} y={4} />
        <rect x="182" y="10" width="18" height="30" fill="#B24E3C" {...sw} /><rect x="178" y="6" width="26" height="8" fill="#8A3B2E" {...sw} />
        <path d="M10 48 L124 8 L238 48z" fill="#C2553F" {...sw} />
        <g stroke="#8A3B2E" strokeWidth="2" opacity=".7">{[0, 1, 2].map((k) => <path key={k} d={`M${44 + k * 26} ${38 - k * 9} L${204 - k * 26} ${38 - k * 9}`} />)}</g>
        <circle cx="124" cy="32" r="9" fill="#FFF6E5" {...sw} strokeWidth={2.5} />
        <PawMark x={124} y={33} c="#B5338A" />
        <rect x="26" y="48" width="196" height="48" fill="#FFB35C" {...sw} />
        <Win x={40} y={54} w={40} h={34} arch><path d="M41 88 v-6 h38 v6" fill="#FF8FB8" opacity=".6" /></Win>
        <FlowerBox x={36} y={88} w={48} />
        <Win x={168} y={54} w={40} h={34} arch />
        <FlowerBox x={164} y={88} w={48} c="#FFD23F" />
        <rect x="104" y="58" width="40" height="30" rx="4" fill="#FFF6E5" stroke={INK} strokeWidth="2.5" />
        <ChowFace x={124} y={75} s={0.8} />
        <rect x="18" y="96" width="212" height="150" fill="#F28C28" {...sw} />
        <g stroke="#D9731A" strokeWidth="2">{[44, 70, 96, 122, 148, 174, 200].map((x) => <line key={x} x1={x} y1="140" x2={x} y2="150" />)}</g>
        <Cornice x={18} w={212} y={92} fill="#5A3A1C" />
        <Lights x1={14} x2={234} y={108} sag={4} />
        <Sign x={44} y={112} w={160} text="ร้านน้องเชา" size={16} />
        <Awning x={14} y={152} w={220} a="#fff" b="#B5338A" h={14} />
        <CatLoaf x={206} y={146} c="#fff" s={0.8} />
        <Win x={30} y={182} w={104} h={50} cols={2}>
          <ChowFace x={52} y={212} s={0.9} />
          <Bust x={110} y={206} shirt="#fff" apron="#B5338A" animal="dog" wave />
          <path d="M34 230 h44" stroke="#C98A4B" strokeWidth="4" />
          <ellipse cx="68" cy="226" rx="7" ry="3" fill="#5CC8F5" stroke={INK} strokeWidth="1.3" />
        </Win>
        <Door x={152} w={44} h={64} fill="#B5338A" />
        <g transform="translate(174 196)"><line x1="0" y1="-14" x2="0" y2="-4" stroke={INK} strokeWidth="1.5" /><rect x="-15" y="-4" width="30" height="13" rx="3" fill="#fff" stroke={INK} strokeWidth="1.5" /><text x="0" y="6" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="8.5" fill="#2E8B57">OPEN</text></g>
        <Plinth x={18} w={212} fill="#8A5A2B" />
        <Plant x={12} s={0.85} /><Plant x={214} s={0.7} flower="#FFD23F" />
      </g>
      {/* ป้ายกระดานหน้าร้าน + จักรยาน */}
      <g>
        <path d="M240 246 l10 -40 h26 l10 40" fill="none" stroke={INK} strokeWidth="3" />
        <rect x="244" y="206" width="38" height="30" rx="3" fill="#2F3B2F" {...sw} strokeWidth={2.5} />
        <text x="263" y="219" textAnchor="middle" fontFamily={F} fontSize="8" fill="#fff">ขนมหมา</text>
        <text x="263" y="231" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="9" fill="#FFD23F">ลด 10%</text>
      </g>
      <g>
        <g fill="none" stroke={INK} strokeWidth="2.5"><circle cx="300" cy="232" r="13" /><circle cx="340" cy="232" r="13" /></g>
        <path d="M300 232 l14 -22 h20 l6 22 M314 210 l10 22 l10 -22" fill="none" stroke="#1DA8DA" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M310 204 h10 M334 210 l-3 -10 h8" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        <rect x="294" y="198" width="16" height="10" rx="2" fill="#FFD23F" stroke={INK} strokeWidth="2" />
        <circle cx="300" cy="232" r="2.5" fill={INK} /><circle cx="340" cy="232" r="2.5" fill={INK} />
      </g>
      <Tree x={372} s={0.95} face />

      {/* 2) คลินิกหมอหมา: สองชั้น ป้ายกากบาทบนหลังคา หมอโบกมือ */}
      <g>
        <line x1="476" y1="18" x2="476" y2="44" stroke={INK} strokeWidth="4" />
        <g transform="translate(476 18)" className="clinic-sign">
          <circle r="16" fill="#fff" {...sw} />
          <rect x="-4.5" y="-10" width="9" height="20" rx="1.5" fill="#E2463F" /><rect x="-10" y="-4.5" width="20" height="9" rx="1.5" fill="#E2463F" />
        </g>
        <rect x="414" y="40" width="124" height="8" fill="#EAF7F2" {...sw} strokeWidth={2.5} />
        <g stroke={INK} strokeWidth="2">{[422, 438, 454, 470, 486, 502, 518, 532].map((x) => <line key={x} x1={x} y1="40" x2={x} y2="48" />)}</g>
        <rect x="406" y="48" width="140" height="48" fill="#fff" {...sw} />
        <g fill="#BDE7DA">{[0, 1, 2, 3, 4, 5].map((k) => <rect key={k} x={408 + k * 24} y="50" width="12" height="44" />)}</g>
        <Win x={418} y={56} w={36} h={30}><path d="M419 57 q8 14 0 28 M453 57 q-8 14 0 28" fill="#FF8FB8" stroke={INK} strokeWidth="1.2" /></Win>
        <Win x={498} y={56} w={36} h={30}><path d="M499 57 q8 14 0 28 M533 57 q-8 14 0 28" fill="#FF8FB8" stroke={INK} strokeWidth="1.2" /></Win>
        <PawMark x={476} y={72} c="#1A7FA6" s={1.4} />
        <rect x="390" y="96" width="172" height="150" fill="#EAF7F2" {...sw} />
        <Cornice x={390} w={172} y={92} fill="#1DA8DA" />
        <Sign x={402} y={112} w={148} text="คลินิกหมอหมา" color="#1A7FA6" />
        <Awning x={394} y={152} w={164} a="#fff" b="#5CC8F5" h={12} />
        <Win x={402} y={176} w={52} h={50} cols={1}>
          <Bust x={428} y={206} shirt="#fff" animal="rabbit" coat wave />
        </Win>
        <rect x="462" y="182" width="44" height="64" fill="#BFE9F7" className="win" {...sw} />
        <line x1="484" y1="182" x2="484" y2="246" stroke={INK} strokeWidth="2.5" />
        <path d="M480 210 v8 M488 210 v8" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <Win x={512} y={176} w={40} h={50} cols={1}>
          <path d="M520 196 h24 M520 204 h18 M520 212 h22" stroke="#1A7FA6" strokeWidth="2" strokeLinecap="round" />
        </Win>
        <rect x="546" y="112" width="20" height="16" rx="2" fill="#E9E2D6" stroke={INK} strokeWidth="2" /><circle cx="556" cy="120" r="4.5" fill="none" stroke={INK} strokeWidth="1.5" />
        <Plinth x={390} w={172} />
        <Plant x={392} s={0.75} flower="#fff" />
      </g>

      {/* 3) ไฟถนน + ม้านั่ง + แมวนั่ง */}
      <g>
        <rect x="610" y="118" width="8" height="128" fill="#3F4A5A" stroke={INK} strokeWidth="2" />
        <path d="M604 246 h20 v-10 h-20z" fill="#3F4A5A" stroke={INK} strokeWidth="2" />
        <path d="M614 118 q0 -14 16 -14" fill="none" stroke="#3F4A5A" strokeWidth="5" />
        <path d="M620 104 h22 l-4 14 h-14z" fill="#FFD23F" stroke={INK} strokeWidth="2.5" className="lamp" />
        <path d="M612 150 h-14 v22 h14" fill="#5CC8F5" stroke={INK} strokeWidth="2" />
        <circle cx="605" cy="160" r="4" fill="#fff" />
        <rect x="644" y="188" width="74" height="8" rx="3" fill="#C98A4B" stroke={INK} strokeWidth="2.5" />
        <rect x="644" y="200" width="74" height="8" rx="3" fill="#C98A4B" stroke={INK} strokeWidth="2.5" />
        <rect x="640" y="218" width="82" height="9" rx="3" fill="#C98A4B" stroke={INK} strokeWidth="2.5" />
        <path d="M648 196 v50 M714 196 v50" stroke={INK} strokeWidth="4" />
        <CatLoaf x={690} y={218} c="#F2B163" s={0.9} />
        <FlowerFace x={732} y={226} s={0.8} c="#FFD23F" />
      </g>

      {/* 4) ร้านอาบน้ำตัดขน: ระเบียงตากผ้าเช็ดตัว ฟองสบู่ลอยขึ้น */}
      <g>
        <g className="bub-up"><circle cx="800" cy="120" r="5" /><circle cx="860" cy="130" r="4" /><circle cx="910" cy="118" r="6" /></g>
        <path d="M760 52 q87 -46 174 0z" fill="#FF8FB8" {...sw} />
        <g fill="#fff" stroke={INK} strokeWidth="1.6">{[784, 812, 840, 868, 896, 920].map((x, k) => <circle key={x} cx={x} cy={k % 2 ? 40 : 46} r="3" />)}</g>
        <rect x="764" y="52" width="166" height="44" fill="#FFE6EF" {...sw} />
        <Win x={776} y={58} w={34} h={28} />
        <Win x={884} y={58} w={34} h={28} />
        <rect x="818" y="84" width="58" height="6" fill="#fff" stroke={INK} strokeWidth="2" />
        <g stroke={INK} strokeWidth="1.5">{[824, 834, 844, 854, 864].map((x) => <line key={x} x1={x} y1="72" x2={x} y2="84" />)}</g>
        <line x1="818" y1="72" x2="876" y2="72" stroke={INK} strokeWidth="2" />
        <Clothesline x1={818} x2={876} y={60} />
        <rect x="752" y="96" width="190" height="150" fill="#FFD6E4" {...sw} />
        <Cornice x={752} w={190} y={92} fill="#B5338A" />
        <Sign x={770} y={112} w={154} text="อาบน้ำตัดขน" />
        <Awning x={748} y={150} w={198} a="#fff" b="#FF8FB8" h={12} />
        <g>
          <circle cx="802" cy="206" r="30" className="win" {...sw} />
          <ChowFace x={802} y={204} s={0.85} />
          <path d="M780 212 q22 14 44 0 v6 q-22 12 -44 0z" fill="#fff" stroke={INK} strokeWidth="2" />
          <circle cx="786" cy="196" r="5" fill="#fff" stroke="#5CC8F5" strokeWidth="2" /><circle cx="790" cy="184" r="3.5" fill="#fff" stroke="#5CC8F5" strokeWidth="2" /><circle cx="818" cy="190" r="4" fill="#fff" stroke="#5CC8F5" strokeWidth="2" />
          <circle cx="802" cy="206" r="30" fill="none" stroke="#fff" strokeWidth="4" strokeOpacity=".5" strokeDasharray="20 160" />
        </g>
        <Door x={862} w={44} h={64} fill="#fff" round={false} />
        <g transform="translate(925 186)"><rect x="-8" y="-8" width="16" height="12" rx="4" fill="#5CC8F5" stroke={INK} strokeWidth="2" /><rect x="-3" y="4" width="6" height="10" rx="2" fill="#5CC8F5" stroke={INK} strokeWidth="2" /><path d="M8 -2 h6 M8 -6 l5 -3 M8 2 l5 3" stroke={INK} strokeWidth="1.5" /></g>
        <Plinth x={752} w={190} fill="#E8A6C0" />
        <Plant x={940} s={0.75} flower="#fff" />
      </g>

      {/* 5) รถเข็นน้ำแข็งใส + แม่ค้า */}
      <g>
        <Bust x={1046} y={186} shirt="#FFD23F" animal="pig" apron="#5CC8F5" wave />
        <line x1="1020" y1="150" x2="1020" y2="200" stroke={INK} strokeWidth="3" />
        <path d="M972 156 q48 -50 96 0z" fill="#5CC8F5" {...sw} />
        <path d="M972 156 q12 -40 48 -46 q-16 20 -12 46 M1068 156 q-12 -40 -48 -46 q16 20 12 46" fill="#fff" stroke={INK} strokeWidth="2" />
        <path d="M972 156 q12 -10 24 0 q12 -10 24 0 q12 -10 24 0 q12 -10 24 0" fill="#fff" stroke={INK} strokeWidth="2" />
        <rect x="980" y="198" width="82" height="36" rx="5" fill="#fff" {...sw} />
        <rect x="986" y="186" width="18" height="14" rx="3" fill="#FF6F91" stroke={INK} strokeWidth="2" /><rect x="1008" y="186" width="18" height="14" rx="3" fill="#9BE15D" stroke={INK} strokeWidth="2" />
        <path d="M1032 200 a8 8 0 0 1 16 0z" fill="#fff" stroke={INK} strokeWidth="1.5" /><circle cx="1040" cy="192" r="2.5" fill="#E2463F" />
        <Face x={1021} y={214} s={0.9} />
        <circle cx="994" cy="238" r="8" fill={INK} /><circle cx="994" cy="238" r="3" fill="#ccc" /><circle cx="1048" cy="238" r="8" fill={INK} /><circle cx="1048" cy="238" r="3" fill="#ccc" />
      </g>
      <Tree x={1130} s={0.9} />
      <path d="M1170 240 h36 l-5 10 h-26z" fill="#1DA8DA" {...sw} />
      <FlowerFace x={1222} y={226} s={0.8} />

      {/* 6) ป้ายรถเมล์ มีคนนั่งรอ */}
      <g>
        <path d="M1244 150 h132 l-8 -12 h-116z" fill="#F28C28" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="1256" y="150" width="6" height="96" fill="#5A5148" /><rect x="1358" y="150" width="6" height="96" fill="#5A5148" />
        <rect x="1266" y="160" width="86" height="40" rx="3" fill="#BFE9F7" opacity=".55" stroke={INK} strokeWidth="2" />
        <rect x="1312" y="164" width="34" height="32" rx="2" fill="#FFF6E5" stroke={INK} strokeWidth="1.5" />
        <ChowFace x={1329} y={178} s={0.55} />
        <text x="1329" y="193" textAnchor="middle" fontFamily={F} fontSize="6" fill="#B5338A">ChowChowStory</text>
        <Bust x={1288} y={196} shirt="#9C7BE8" animal="cat" />
        <rect x="1270" y="214" width="80" height="8" rx="3" fill="#F28C28" stroke={INK} strokeWidth="2" />
        <path d="M1281 222 l-2 16 M1294 222 l2 16" stroke="#3F4A5A" strokeWidth="4" strokeLinecap="round" />
        <path d="M1276 222 v14 M1344 222 v14" stroke={INK} strokeWidth="3" />
        <rect x="1380" y="120" width="6" height="126" fill="#5A5148" />
        <rect x="1366" y="104" width="34" height="26" rx="5" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <text x="1383" y="122" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="11" fill="#1A7FA6">BUS</text>
      </g>

      {/* 7) ตู้ไปรษณีย์หน้ายิ้ม + พุ่มไม้ดอก */}
      <g>
        <rect x="1426" y="190" width="38" height="56" rx="12" fill="#D6403A" {...sw} />
        <rect x="1434" y="202" width="22" height="4" rx="2" fill={INK} />
        <Face x={1445} y={220} s={1.1} />
        <ellipse cx="1520" cy="234" rx="48" ry="22" className="leaf" {...sw} />
        <ellipse cx="1500" cy="222" rx="20" ry="14" className="leaf" stroke={INK} strokeWidth="2.5" />
        <FlowerFace x={1510} y={212} s={0.65} c="#fff" /><FlowerFace x={1538} y={222} s={0.55} />
      </g>

      {/* 8) ร้านของชำ: หลังคาสังกะสี แทงก์น้ำ ราวตากผ้า กล้วยห้อย ป้าเจ้าของร้าน */}
      <g>
        <rect x="1780" y="18" width="30" height="26" rx="6" fill="#5CC8F5" {...sw} />
        <path d="M1784 44 v8 M1806 44 v8" stroke={INK} strokeWidth="3" />
        <path d="M1606 56 L1716 24 L1826 56z" fill="#3E9E6A" {...sw} />
        <g stroke="#2E7D52" strokeWidth="2">{[1636, 1656, 1676, 1696, 1716, 1736, 1756, 1776, 1796].map((x) => <line key={x} x1={x} y1="53" x2={x} y2={56 - 32 * (1 - Math.abs(x - 1716) / 110) + 5} />)}</g>
        <rect x="1620" y="56" width="192" height="40" fill="#E9C99A" {...sw} />
        <g stroke="#C9A877" strokeWidth="1.6">{[66, 76, 86].map((y) => <line key={y} x1="1622" y1={y} x2="1810" y2={y} />)}</g>
        <Win x={1632} y={60} w={34} h={28} />
        <Win x={1766} y={60} w={34} h={28} />
        <Clothesline x1={1672} x2={1760} y={62} />
        <rect x="1612" y="96" width="208" height="150" fill="#FFF1C9" {...sw} />
        <Cornice x={1612} w={208} y={92} fill="#2E8B57" />
        <Sign x={1641} y={112} w={150} text="ร้านของชำ" color="#2E7D32" fill="#FFFDF2" />
        <Awning x={1606} y={154} w={220} a="#fff" b="#2E8B57" h={14} />
        <path d="M1700 168 q4 10 -2 18 M1708 168 q2 10 -4 18 M1716 168 q-2 10 -6 16" stroke="#FFD23F" strokeWidth="5" strokeLinecap="round" fill="none" />
        <rect x="1622" y="186" width="98" height="60" fill="#F3EADB" {...sw} />
        <line x1="1622" y1="205" x2="1720" y2="205" stroke={INK} strokeWidth="2.5" /><line x1="1622" y1="225" x2="1720" y2="225" stroke={INK} strokeWidth="2.5" />
        {[1628, 1641, 1654, 1667, 1680, 1693, 1706].map((x, k) => <rect key={x} x={x} y="191" width="9" height="14" rx="2.5" fill={["#D6403A", "#1DA8DA", "#FFD23F", "#2E8B57", "#F28C28", "#B5338A", "#5CC8F5"][k]} stroke={INK} strokeWidth="1.5" />)}
        {[1628, 1648, 1668, 1688].map((x, k) => <rect key={x} x={x} y="211" width="16" height="14" rx="2" fill={["#F28C28", "#fff", "#1DA8DA", "#FFD23F"][k]} stroke={INK} strokeWidth="1.5" />)}
        <g fill="#FFF6E5" stroke={INK} strokeWidth="1.2">{[1632, 1644, 1656].map((x) => <ellipse key={x} cx={x} cy="238" rx="5" ry="6" />)}</g>
        <rect x="1666" y="230" width="48" height="16" fill="#C98A4B" stroke={INK} strokeWidth="2" />
        <rect x="1728" y="182" width="58" height="64" fill="#FFF6E5" {...sw} />
        <Bust x={1757} y={212} shirt="#FF6F91" animal="bear" apron="#2E8B57" wave />
        <rect x="1728" y="226" width="58" height="20" fill="#C98A4B" {...sw} strokeWidth={2.5} />
        <text x="1757" y="240" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="9" fill="#FFF6E5">ยินดีต้อนรับ</text>
        <g>
          <rect x="1790" y="226" width="40" height="20" fill="#C98A4B" stroke={INK} strokeWidth="2.5" />
          <circle cx="1798" cy="223" r="5.5" fill="#F28C28" stroke={INK} strokeWidth="1.5" /><circle cx="1810" cy="222" r="5.5" fill="#9BE15D" stroke={INK} strokeWidth="1.5" /><circle cx="1822" cy="223" r="5.5" fill="#D6403A" stroke={INK} strokeWidth="1.5" />
          <rect x="1800" y="230" width="20" height="10" rx="2" fill="#fff" stroke={INK} strokeWidth="1" /><text x="1810" y="238" textAnchor="middle" fontFamily={F} fontSize="7" fill="#D6403A">฿20</text>
        </g>
        <Plinth x={1612} w={208} fill="#C98A4B" />
      </g>

      {/* 9) Pet Shop: แมวมองหน้าต่างชั้นบน ลูกโป่ง ตู้ปลา */}
      <g>
        <g className="balloons">
          <path d="M2068 96 q-6 -30 -14 -48 M2068 96 q2 -30 8 -52" fill="none" stroke={INK} strokeWidth="1.2" />
          <ellipse cx="2052" cy="40" rx="9" ry="11" fill="#FF6F91" stroke={INK} strokeWidth="2" /><ellipse cx="2077" cy="36" rx="9" ry="11" fill="#5CC8F5" stroke={INK} strokeWidth="2" />
        </g>
        <path d="M1880 56 h196 l-14 -24 h-168z" fill="#7B4FD1" {...sw} />
        <g fill="#fff" opacity=".9">{[1912, 1946, 1980, 2014, 2048].map((x) => <PawDot key={x} x={x} y={44} />)}</g>
        <rect x="1890" y="56" width="176" height="40" fill="#F0E8FF" {...sw} />
        <Win x={1904} y={62} w={40} h={28}><CatFace x={1924} y={82} /></Win>
        <Win x={2012} y={62} w={40} h={28}><path d="M2020 86 q10 -16 24 0" fill="#9BE15D" stroke={INK} strokeWidth="1.5" /></Win>
        <PawMark x={1978} y={76} c="#7B4FD1" s={1.4} />
        <rect x="1880" y="96" width="196" height="150" fill="#E6DBFF" {...sw} />
        <Cornice x={1880} w={196} y={92} fill="#7B4FD1" />
        <Sign x={1908} y={112} w={140} text="PET SHOP" color="#6A3FC0" />
        <Awning x={1876} y={152} w={204} a="#fff" b="#9C7BE8" h={12} />
        <g transform="translate(2096 150)">
          <line x1="-6" y1="-20" x2="-6" y2="-2" stroke={INK} strokeWidth="2" /><line x1="-20" y1="-20" x2="4" y2="-20" stroke={INK} strokeWidth="3" />
          <path d="M-18 4 a6 6 0 1 1 6 -6 h24 a6 6 0 1 1 6 6 a6 6 0 1 1 -6 6 h-24 a6 6 0 1 1 -6 -6z" fill="#fff" stroke={INK} strokeWidth="2.5" />
        </g>
        <Win x={1894} y={178} w={104} h={54} cols={1}>
          <path d="M1902 231 v-22 l5 -5 h14 l5 5 v22z" fill="#F28C28" stroke={INK} strokeWidth="2" />
          <circle cx="1914" cy="218" r="4" fill="#fff" />
          <circle cx="1948" cy="214" r="14" fill="#BFE9F7" stroke={INK} strokeWidth="2" />
          <path className="fish" d="M1941 216 q6 -6 12 0 q-6 6 -12 0z M1953 216 l4 -3 v6z" fill="#F28C28" />
          <circle cx="1980" cy="214" r="12" fill="none" stroke={INK} strokeWidth="2" />
          <g className="wheel"><path d="M1980 202 v24 M1968 214 h24" stroke={INK} strokeWidth="1.2" /></g>
          <ellipse cx="1980" cy="222" rx="5" ry="4" fill="#F2D2A9" stroke={INK} strokeWidth="1.3" />
        </Win>
        <Door x={2014} w={46} h={64} fill="#FFD23F" />
        <Plinth x={1880} w={196} fill="#B9A6E8" />
        <Plant x={2080} s={0.7} />
      </g>

      {/* 10) สวนสาธารณะ: ดอกไม้หน้ายิ้ม ว่าว น้ำพุ */}
      <g>
        <g className="kite">
          <path d="M2232 236 q20 -90 60 -170" fill="none" stroke={INK} strokeWidth="1" />
          <path d="M2292 46 l14 16 l-14 22 l-14 -22z" fill="#FF6F91" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
          <path d="M2278 62 h28 M2292 46 v38" stroke={INK} strokeWidth="1.2" />
          <path d="M2292 84 q-6 8 0 14 q6 6 0 14" fill="none" stroke="#FFD23F" strokeWidth="2.5" />
        </g>
        <rect x="2126" y="150" width="12" height="96" fill="#8A5A2B" stroke={INK} strokeWidth="2.5" />
        <rect x="2268" y="150" width="12" height="96" fill="#8A5A2B" stroke={INK} strokeWidth="2.5" />
        <path d="M2120 156 q83 -46 166 0" fill="none" stroke={INK} strokeWidth="11" />
        <path d="M2120 156 q83 -46 166 0" fill="none" stroke="#6CC24A" strokeWidth="7" />
        {[2140, 2170, 2203, 2236, 2266].map((x, k) => <circle key={x} cx={x} cy={k === 2 ? 122 : k % 4 ? 128 : 146} r="4" fill={k % 2 ? "#FF6F91" : "#FFD23F"} stroke={INK} strokeWidth="1.2" />)}
        <Sign x={2128} y={108} w={150} text="สวนสาธารณะ" color="#2E7D32" />
        <Tree x={2206} s={0.72} face />
        <g fill="#fff" stroke={INK} strokeWidth="2">
          {Array.from({ length: 13 }, (_, k) => <path key={k} d={`M${2290 + k * 22} 246 v-24 l5 -6 l5 6 v24z`} />)}
          <rect x="2286" y="230" width="290" height="5" />
        </g>
        <g transform="translate(2370 246)">
          <ellipse cx="0" cy="-8" rx="46" ry="10" fill="#BFE9F7" {...sw} />
          <rect x="-6" y="-52" width="12" height="44" fill="#E9E2D6" stroke={INK} strokeWidth="2.5" />
          <ellipse cx="0" cy="-52" rx="18" ry="5" fill="#E9E2D6" stroke={INK} strokeWidth="2.5" />
          <path className="spray" d="M-2 -58 q-18 -22 -30 4 M2 -58 q18 -22 30 4 M0 -58 v-16" fill="none" stroke="#1DA8DA" strokeWidth="3" strokeLinecap="round" />
          <Face x={0} y={-8} s={0.8} />
        </g>
        <FlowerFace x={2318} y={224} s={0.8} c="#FFD23F" /><FlowerFace x={2424} y={222} s={0.9} /><FlowerFace x={2492} y={226} s={0.7} c="#fff" />
        <Tree x={2450} s={1.05} />
        <Tree x={2560} s={0.85} face />
        <g transform="translate(2510 246)">
          <rect x="-3" y="-44" width="6" height="44" fill="#5A5148" />
          <rect x="-34" y="-62" width="68" height="22" rx="5" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <text x="0" y="-46" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="11" fill="#2E7D32">ลานน้องหมา</text>
        </g>
      </g>
    </svg>
  );
}

function PawDot({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(.5)`}>
      <ellipse cx="0" cy="4" rx="6" ry="5" /><circle cx="-6" cy="-3" r="2.5" /><circle cx="-2" cy="-7" r="2.5" /><circle cx="2" cy="-7" r="2.5" /><circle cx="6" cy="-3" r="2.5" />
    </g>
  );
}

function PawMark({ x, y, c, s = 1 }: { x: number; y: number; c: string; s?: number }) {
  return <g fill={c} transform={`translate(${x} ${y}) scale(${s * 0.7})`}><ellipse cx="0" cy="3" rx="5" ry="4" /><circle cx="-5" cy="-3" r="2" /><circle cx="-1.8" cy="-6" r="2" /><circle cx="1.8" cy="-6" r="2" /><circle cx="5" cy="-3" r="2" /></g>;
}

function CatFace({ x, y }: { x: number; y: number }) {
  return (
    <g transform={`translate(${x} ${y})`} className="peek">
      <path d="M-12 0 v-14 l4 -8 l5 6 h6 l5 -6 l4 8 v14z" fill="#9A9A9A" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <ellipse cx="-4" cy="-9" rx="1.4" ry="2" fill={INK} /><ellipse cx="4" cy="-9" rx="1.4" ry="2" fill={INK} />
      <path d="M-1.5 -5 h3 l-1.5 1.5z" fill="#FF8FA3" />
      <path d="M-9 -5 h-6 M9 -5 h6" stroke={INK} strokeWidth="1" />
    </g>
  );
}

// ---------------------------------------------------------------
// ท้องฟ้า: ดวงอาทิตย์หน้ายิ้ม / พระจันทร์ง่วง / ดาว (แตะเพื่อเปลี่ยนช่วงเวลา)
// ---------------------------------------------------------------
export function Sky({ phase, rain, onTap }: { phase: Phase; rain: boolean; onTap: () => void }) {
  return (
    <>
      {phase === "night" && (
        <div className="stars" aria-hidden="true">
          {[[8, 22], [22, 54], [34, 16], [58, 30], [70, 12], [84, 48], [46, 60], [92, 20]].map(([l, t], i) => (
            <svg key={i} viewBox="-5 -5 10 10" style={{ left: `${l}%`, top: `${t + 70}px`, animationDelay: `${i * 0.37}s` }}><path d="M0 -5 Q.8 -.8 5 0 Q.8 .8 0 5 Q-.8 .8 -5 0 Q-.8 -.8 0 -5z" /></svg>
          ))}
        </div>
      )}
      <button type="button" className={`sky-body${rain ? " hide" : ""}`} onClick={onTap} aria-label="แตะเพื่อเปลี่ยนเวลาในฉาก">
        {phase === "night" ? (
          <svg viewBox="-50 -50 100 100">
            <path className="moon" d="M14 -30 a32 32 0 1 0 16 44 a26 26 0 1 1 -16 -44z" stroke={INK} strokeWidth="3" />
            <path d="M-14 0 q3 3 6 0 M2 2 q3 3 6 0" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
            <circle cx="-16" cy="8" r="3" fill="#FF8FA3" opacity=".6" />
            <text className="zz" x="20" y="-22" fontFamily={F} fontWeight="700" fontSize="14" fill="#fff">z</text>
          </svg>
        ) : (
          <svg viewBox="-50 -50 100 100">
            <g className="rays2">{Array.from({ length: 10 }, (_, k) => <rect key={k} x="-3" y="-47" width="6" height="12" rx="3" transform={`rotate(${k * 36})`} stroke={INK} strokeWidth="2" />)}</g>
            <circle className="sun-disc" r="29" stroke={INK} strokeWidth="3" />
            <ellipse cx="-9" cy="-4" rx="2.4" ry="3.6" fill={INK} /><ellipse cx="9" cy="-4" rx="2.4" ry="3.6" fill={INK} />
            <circle cx="-8.2" cy="-5.5" r="1" fill="#fff" /><circle cx="9.8" cy="-5.5" r="1" fill="#fff" />
            <path d="M-7 7 q7 7 14 0" fill="none" stroke={INK} strokeWidth="2.6" strokeLinecap="round" />
            <circle cx="-18" cy="5" r="5" fill="#FF8A5B" opacity=".7" /><circle cx="18" cy="5" r="5" fill="#FF8A5B" opacity=".7" />
          </svg>
        )}
      </button>
    </>
  );
}

export function Birds() {
  return (
    <div className="birds" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <svg key={i} viewBox="0 0 24 12" style={{ top: `${92 + i * 26}px`, animationDuration: `${22 + i * 7}s`, animationDelay: `${-i * 9}s` }}>
          <path className="wing" d="M1 6 q5 -6 11 0 q6 -6 11 0" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" />
        </svg>
      ))}
    </div>
  );
}

// ผีเสื้อบินบนสนามตอนกลางวัน หิ่งห้อยตอนกลางคืน
export function Critters() {
  return (
    <div className="critters" aria-hidden="true">
      {[0, 1].map((i) => (
        <svg key={`b${i}`} className="butterfly" viewBox="-10 -8 20 16" style={{ left: `${20 + i * 45}%`, bottom: `${38 + i * 20}px`, animationDelay: `${-i * 3}s` }}>
          <g className="bwing"><ellipse cx="-5" cy="-3" rx="5" ry="4" fill={i ? "#FFD23F" : "#FF8FB8"} stroke={INK} strokeWidth="1.2" /><ellipse cx="-4" cy="3" rx="3.5" ry="3" fill={i ? "#FFD23F" : "#FF8FB8"} stroke={INK} strokeWidth="1.2" /></g>
          <g className="bwing r"><ellipse cx="5" cy="-3" rx="5" ry="4" fill={i ? "#FFD23F" : "#FF8FB8"} stroke={INK} strokeWidth="1.2" /><ellipse cx="4" cy="3" rx="3.5" ry="3" fill={i ? "#FFD23F" : "#FF8FB8"} stroke={INK} strokeWidth="1.2" /></g>
          <rect x="-1" y="-5" width="2" height="10" rx="1" fill={INK} />
        </svg>
      ))}
      {[12, 30, 48, 63, 78, 90].map((l, i) => (
        <i key={`f${i}`} className="firefly" style={{ left: `${l}%`, bottom: `${20 + ((i * 37) % 70)}px`, animationDelay: `${-i * 0.9}s` }} />
      ))}
    </div>
  );
}

export function Rain() {
  return (
    <div className="rain" aria-hidden="true">
      {Array.from({ length: 46 }, (_, i) => (
        <i key={i} style={{ left: `${(i * 37) % 100}%`, animationDelay: `${-((i * 0.137) % 1)}s`, animationDuration: `${0.55 + ((i * 7) % 5) / 20}s` }} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------
// คนเดินบนทางเท้า สัดส่วนหัวโต ตัวเล็ก (หันขวาเป็นค่าเริ่มต้น)
// ---------------------------------------------------------------
type PedLook = {
  skin: string; shirt: string; bottom: "pants" | "shorts" | "skirt" | "long"; bottomColor: string;
  animal: Animal; back?: ReactNode; hat?: ReactNode; front?: ReactNode; s?: number; run?: boolean; speed?: number; custom?: ReactNode;
};

function Leg({ x, color, cls }: { x: number; color: string; cls: string }) {
  return (
    <g className={`lg ${cls}`}>
      <path d={`M${x} 47 V64`} stroke={INK} strokeWidth="7.5" strokeLinecap="round" />
      <path d={`M${x} 47 V64`} stroke={color} strokeWidth="4.5" strokeLinecap="round" />
      <ellipse cx={x + 2} cy="67" rx="5" ry="3" fill={INK} />
    </g>
  );
}

function Arm({ x, color, skin, cls, dir }: { x: number; color: string; skin: string; cls: string; dir: number }) {
  return (
    <g className={`arm ${cls}`}>
      <path d={`M${x} 33 l${dir * 2} 10`} stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d={`M${x} 33 l${dir * 2} 10`} stroke={color} strokeWidth="4" strokeLinecap="round" />
      <circle cx={x + dir * 2} cy="45" r="3" fill={skin} stroke={INK} strokeWidth="1.6" />
    </g>
  );
}

function Head({ animal, hat }: { animal: Animal; hat?: ReactNode }) {
  return <g><g transform="translate(22 17)"><AnimalHead a={animal} dx={3} /></g>{hat}</g>;
}

function Person({ p }: { p: PedLook }) {
  if (p.custom) return <svg viewBox="0 0 44 72" className="custom">{p.custom}</svg>;
  const legC = p.bottom === "pants" ? p.bottomColor : p.skin;
  return (
    <svg viewBox="0 0 44 72" className={p.run ? "run" : ""}>
      <g transform={p.s ? `translate(${22 * (1 - p.s)} ${72 * (1 - p.s)}) scale(${p.s})` : undefined}>
        {p.back}
        <Arm x={17} color={p.shirt} skin={p.skin} cls="b" dir={-1} />
        <Leg x={19} color={legC} cls="l" />
        <Leg x={25} color={legC} cls="r" />
        {p.bottom === "shorts" && <rect x="14.5" y="42" width="15" height="9" rx="3" fill={p.bottomColor} stroke={INK} strokeWidth="2" />}
        {p.bottom === "pants" && <rect x="15" y="42" width="14" height="7" rx="3" fill={p.bottomColor} stroke={INK} strokeWidth="2" />}
        {p.bottom === "skirt" && <path d="M15 41 h14 l4 12 h-22z" fill={p.bottomColor} stroke={INK} strokeWidth="2" strokeLinejoin="round" />}
        {p.bottom === "long" && <path d="M15 41 h14 l3 21 h-20z" fill={p.bottomColor} stroke={INK} strokeWidth="2" strokeLinejoin="round" />}
        <rect x="14.5" y="29" width="15" height="16" rx="6" fill={p.shirt} stroke={INK} strokeWidth="2.2" />
        <Head animal={p.animal} hat={p.hat} />
        <Arm x={27} color={p.shirt} skin={p.skin} cls="f" dir={1} />
        {p.front}
      </g>
    </svg>
  );
}

const SCOOTER = (
  <g className="scooter">
    <path d="M6 58 h26 q8 0 10 -8 l-4 -18" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    <path d="M4 58 q0 -14 14 -14 h10 v14z" fill="#5CC8F5" stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
    <rect x="-2" y="34" width="14" height="12" rx="2" fill="#F28C28" stroke={INK} strokeWidth="2" />
    <path d="M2 40 h6" stroke="#fff" strokeWidth="1.5" />
    <rect x="16" y="26" width="12" height="16" rx="5" fill="#F28C28" stroke={INK} strokeWidth="2" />
    <g transform="translate(23 17) scale(.9)"><AnimalHead a="monkey" dx={3} /></g>
    <path d="M10 13 q0 -14 13 -14 q13 0 13 12 h-5 q-3 -6 -8 -6 q-7 0 -8 9z" fill="#E2463F" stroke={INK} strokeWidth="2" />
    <path d="M27 32 l10 2" stroke={INK} strokeWidth="5" strokeLinecap="round" /><path d="M27 32 l10 2" stroke="#F28C28" strokeWidth="2.6" strokeLinecap="round" />
    <g className="wheel"><circle cx="10" cy="62" r="7" fill={INK} /><circle cx="10" cy="62" r="2.5" fill="#ccc" /></g>
    <g className="wheel"><circle cx="38" cy="62" r="7" fill={INK} /><circle cx="38" cy="62" r="2.5" fill="#ccc" /></g>
  </g>
);

export const PEDS: PedLook[] = [
  { // สาวถือถุงช้อปปิ้ง
    animal: "cat", skin: "#FFE2C4", shirt: "#FF6F91", bottom: "skirt", bottomColor: "#5CC8F5", speed: 18,
    hat: <g transform="translate(30 3)"><path d="M0 0 l-6 -4 v8z M0 0 l6 -4 v8z" fill="#FF6F91" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" /><circle r="2" fill="#FF6F91" stroke={INK} strokeWidth="1.3" /></g>,
    front: <g><path d="M31 41 q3 -5 6 0" fill="none" stroke={INK} strokeWidth="1.5" /><rect x="28" y="41" width="11" height="12" rx="2" fill="#FFD23F" stroke={INK} strokeWidth="2" /><path d="M31 46 l2.5 2.5 l2.5 -2.5" fill="none" stroke="#FF6F91" strokeWidth="1.5" /></g> },
  { // ลุงกางร่มกันแดด
    animal: "bear", skin: "#B9773E", shirt: "#1DA8DA", bottom: "pants", bottomColor: "#3F4A5A", speed: 13,
    front: <g><line x1="30" y1="45" x2="30" y2="-4" stroke={INK} strokeWidth="2" /><path d="M8 -2 q22 -20 44 0 q-5.5 -4 -11 0 q-5.5 -4 -11 0 q-5.5 -4 -11 0 q-5.5 -4 -11 0z" fill="#E2463F" stroke={INK} strokeWidth="2" strokeLinejoin="round" /><path d="M24 -12 q6 -6 12 0" fill="#fff" opacity=".5" /></g> },
  { // เด็กถือลูกโป่ง
    animal: "rabbit", skin: "#fff", shirt: "#FFD23F", bottom: "shorts", bottomColor: "#2E8B57", s: 0.8, speed: 22,
    front: <g className="balloon"><path d="M31 45 q6 -20 4 -36" fill="none" stroke={INK} strokeWidth="1.2" /><ellipse cx="35" cy="0" rx="8.5" ry="10" fill="#E2463F" stroke={INK} strokeWidth="2" /><circle cx="32" cy="-3" r="2" fill="#fff" opacity=".6" /><Face x={35} y={1} s={0.45} /></g> },
  { // นักเรียนสะพายกระเป๋า
    animal: "penguin", skin: "#2B3A67", shirt: "#fff", bottom: "shorts", bottomColor: "#2B3A67", s: 0.9, speed: 20,
    back: <rect x="6" y="29" width="10" height="17" rx="3" fill="#1DA8DA" stroke={INK} strokeWidth="2" /> },
  { // ยายหิ้วตะกร้า
    animal: "elephant", skin: "#A9B4C8", shirt: "#9C7BE8", bottom: "long", bottomColor: "#B5338A", speed: 10,
    hat: <g transform="translate(17 4)"><circle r="3.2" fill="#FFD23F" stroke={INK} strokeWidth="1.2" />{[0, 72, 144, 216, 288].map((a) => <circle key={a} cx={Math.cos(a * Math.PI / 180) * 4.4} cy={Math.sin(a * Math.PI / 180) * 4.4} r="2.4" fill="#FF6F91" stroke={INK} strokeWidth="1" />)}<circle r="2" fill="#FFD23F" /></g>,
    front: <g><path d="M28 42 q5 -8 10 0" fill="none" stroke={INK} strokeWidth="2" /><path d="M26 42 h14 l-2 10 h-10z" fill="#C98A4B" stroke={INK} strokeWidth="2" strokeLinejoin="round" /><circle cx="30" cy="40" r="3" fill="#9BE15D" stroke={INK} strokeWidth="1" /><circle cx="35" cy="40" r="3" fill="#F28C28" stroke={INK} strokeWidth="1" /></g> },
  { // คนวิ่งออกกำลังกาย
    animal: "tiger", skin: "#F28C28", shirt: "#6CC24A", bottom: "shorts", bottomColor: "#241C15", run: true, speed: 34,
    hat: <path d="M9 9 q13 -6 26 0 v4 q-13 -6 -26 0z" fill="#E2463F" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />,
    front: <path d="M12 8 q-4 -2 -2 -6" fill="none" stroke="#5CC8F5" strokeWidth="2" strokeLinecap="round" /> },
  { // ไรเดอร์ส่งของ
    animal: "monkey", skin: "#9A5B2E", shirt: "#F28C28", bottom: "pants", bottomColor: "#333", speed: 52, custom: SCOOTER },
  { // พาน้องหมาขาวตัวเล็กเดินเล่น
    animal: "panda", skin: "#2A2A2A", shirt: "#5CC8F5", bottom: "pants", bottomColor: "#C98A4B", speed: 16,
    front: <g>
      <path d="M31 44 q8 6 14 14" fill="none" stroke="#E2463F" strokeWidth="1.5" />
      <g className="pup">
        <ellipse cx="50" cy="63" rx="8" ry="5.5" fill="#fff" stroke={INK} strokeWidth="1.8" />
        <circle cx="57" cy="57" r="5.5" fill="#fff" stroke={INK} strokeWidth="1.8" />
        <ellipse cx="54" cy="55" rx="2.2" ry="3.4" fill="#F3E3C8" stroke={INK} strokeWidth="1.2" />
        <circle cx="59" cy="56.5" r="1" fill={INK} /><circle cx="61.5" cy="58.5" r="1" fill={INK} />
        <path d="M42 61 q-4 -4 -2 -7" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" className="pup-tail" />
        <path d="M46 67 v3 M54 67 v3" stroke={INK} strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </g> },
];

export function PedArt({ i }: { i: number }) {
  return <Person p={PEDS[i % PEDS.length]} />;
}
