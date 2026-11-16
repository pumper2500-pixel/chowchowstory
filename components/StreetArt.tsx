// ศิลปะฉากถนน (วาดเองทั้งหมด) — SVG หน่วยพิกเซล สูง 330 พื้นอยู่ที่ y=246
import type { ReactNode } from "react";

export const INK = "#241C15";
export const MID_TILE = 2600;
const G = 246;
const F = "Mitr,sans-serif";

export function Sign({ x, y, w, text, fill = "#FFF6E5", color = "#B5338A", size = 15 }: { x: number; y: number; w: number; text: string; fill?: string; color?: string; size?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height="30" rx="8" fill={fill} stroke={INK} strokeWidth="3" />
      <rect x={x + 4} y={y + 4} width={w - 8} height="22" rx="5" fill="none" stroke={color} strokeOpacity=".35" strokeWidth="1.5" strokeDasharray="3 3" />
      <text x={x + w / 2} y={y + 21} textAnchor="middle" fontFamily={F} fontWeight="700" fontSize={size} fill={color}>{text}</text>
    </g>
  );
}

// กันสาดลายทาง ขอบหยักโค้ง
function Awning({ x, y, w, a, b, h = 16 }: { x: number; y: number; w: number; a: string; b: string; h?: number }) {
  const n = Math.max(3, Math.round(w / 22));
  const sw = w / n;
  return (
    <g>
      {Array.from({ length: n }, (_, i) => (
        <path key={i} fill={i % 2 ? b : a} stroke={INK} strokeWidth="2.2" strokeLinejoin="round"
          d={`M${x + i * sw} ${y} h${sw} v${h} a${sw / 2} ${sw / 2.4} 0 0 1 ${-sw} 0z`} />
      ))}
      <rect x={x - 3} y={y - 5} width={w + 6} height="7" rx="3" fill={INK} />
    </g>
  );
}

// หน้าต่าง: กรอบ + ช่องกระจก + แสงสะท้อน + ขอบหน้าต่าง
function Win({ x, y, w, h, cols = 2, children, sill = true }: { x: number; y: number; w: number; h: number; cols?: number; children?: ReactNode; sill?: boolean }) {
  return (
    <g>
      <rect className="win" x={x} y={y} width={w} height={h} rx="3" stroke={INK} strokeWidth="3" />
      {children}
      <path d={`M${x + 6} ${y + h - 8} L${x + w * 0.45} ${y + 6} h${w * 0.14} L${x + 6 + w * 0.14} ${y + h - 8}z`} fill="#fff" opacity=".45" className="glare" />
      {Array.from({ length: cols - 1 }, (_, i) => <line key={i} x1={x + (w / cols) * (i + 1)} y1={y} x2={x + (w / cols) * (i + 1)} y2={y + h} stroke={INK} strokeWidth="2.5" />)}
      {sill && <rect x={x - 4} y={y + h - 2} width={w + 8} height="6" rx="2" fill="#fff" stroke={INK} strokeWidth="2" />}
    </g>
  );
}

function Door({ x, w = 40, h = 62, fill = "#8A5A2B", round = true }: { x: number; w?: number; h?: number; fill?: string; round?: boolean }) {
  return (
    <g>
      <rect x={x} y={G - h} width={w} height={h} rx="3" fill={fill} stroke={INK} strokeWidth="3" />
      {round
        ? <circle className="win" cx={x + w / 2} cy={G - h + 18} r={w / 4} stroke={INK} strokeWidth="2.5" />
        : <rect className="win" x={x + 6} y={G - h + 8} width={w - 12} height={h * 0.45} rx="2" stroke={INK} strokeWidth="2.5" />}
      <circle cx={x + w - 8} cy={G - h / 2 + 4} r="2.6" fill="#FFD23F" stroke={INK} strokeWidth="1.5" />
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

// ไฟประดับห้อยเป็นสาย (กลางคืนจะสว่าง)
function Lights({ x1, x2, y, sag = 12 }: { x1: number; x2: number; y: number; sag?: number }) {
  const n = Math.max(3, Math.round((x2 - x1) / 18));
  const cols = ["#FF6F91", "#FFD23F", "#5CC8F5", "#9BE15D"];
  return (
    <g>
      <path d={`M${x1} ${y} Q${(x1 + x2) / 2} ${y + sag * 2} ${x2} ${y}`} fill="none" stroke={INK} strokeWidth="1.5" />
      {Array.from({ length: n - 1 }, (_, i) => {
        const t = (i + 1) / n;
        const bx = x1 + (x2 - x1) * t;
        const by = y + sag * 2 * 2 * t * (1 - t) + 4;
        return <circle key={i} className="bulb" cx={bx} cy={by} r="3" fill={cols[i % 4]} stroke={INK} strokeWidth="1" />;
      })}
    </g>
  );
}

function Cornice({ x, w, y, fill }: { x: number; w: number; y: number; fill: string }) {
  return (
    <g>
      <rect x={x - 8} y={y} width={w + 16} height="14" rx="2" fill={fill} stroke={INK} strokeWidth="3" />
      <g fill={INK} opacity=".35">{Array.from({ length: Math.floor((w + 8) / 14) }, (_, i) => <rect key={i} x={x - 4 + i * 14} y={y + 14} width="7" height="4" />)}</g>
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

export function Tree({ x, s = 1 }: { x: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${G}) scale(${s})`}>
      <path d="M-7 0 v-60 q0 -10 -12 -18 M7 0 v-64 q2 -8 12 -14" fill="none" stroke={INK} strokeWidth="3" />
      <path d="M-7 0 V-78 h14 V0z" fill="#8A5A2B" stroke={INK} strokeWidth="3" />
      <circle cx="-22" cy="-88" r="24" className="leaf" stroke={INK} strokeWidth="3" />
      <circle cx="22" cy="-90" r="24" className="leaf" stroke={INK} strokeWidth="3" />
      <circle cx="0" cy="-110" r="30" className="leaf" stroke={INK} strokeWidth="3" />
      <circle cx="-14" cy="-118" r="9" fill="#fff" opacity=".18" />
      <circle cx="-14" cy="-98" r="4.5" fill="#FF6F91" /><circle cx="16" cy="-92" r="4.5" fill="#FF6F91" /><circle cx="6" cy="-124" r="4.5" fill="#FF6F91" /><circle cx="-28" cy="-84" r="4" fill="#FF6F91" />
    </g>
  );
}

function ChowFace({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  // หน้าน้องหมาขนฟูกลม ๆ (ตุ๊กตาโชว์หน้าร้าน)
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

export function Street() {
  return (
    <svg width={MID_TILE} height={330} viewBox={`0 0 ${MID_TILE} 330`}>
      {/* 1) ร้านน้องเชา */}
      <g>
        <rect x="18" y="98" width="212" height="148" fill="#F28C28" stroke={INK} strokeWidth="3" />
        <g stroke="#D9731A" strokeWidth="2">{[44, 70, 96, 122, 148, 174, 200].map((x) => <line key={x} x1={x} y1="112" x2={x} y2="150" />)}</g>
        <Cornice x={18} w={212} y={86} fill="#5A3A1C" />
        <Lights x1={14} x2={234} y={104} sag={4} />
        <Sign x={44} y={110} w={160} text="ร้านน้องเชา" size={16} />
        <Awning x={14} y={152} w={220} a="#fff" b="#B5338A" h={14} />
        <Win x={32} y={182} w={96} h={50} cols={2}>
          <ChowFace x={56} y={212} s={0.9} />
          <rect x="88" y="206" width="26" height="22" rx="3" fill="#FFD23F" stroke={INK} strokeWidth="2" />
          <path d="M92 213 h18 M92 219 h12" stroke={INK} strokeWidth="1.5" />
        </Win>
        <Door x={150} w={44} h={64} fill="#B5338A" />
        <g transform="translate(172 196)"><line x1="0" y1="-14" x2="0" y2="-4" stroke={INK} strokeWidth="1.5" /><rect x="-15" y="-4" width="30" height="13" rx="3" fill="#fff" stroke={INK} strokeWidth="1.5" /><text x="0" y="6" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="8.5" fill="#2E8B57">OPEN</text></g>
        <Plinth x={18} w={212} fill="#8A5A2B" />
        <Plant x={12} s={0.85} /><Plant x={214} s={0.75} flower="#FFD23F" />
      </g>
      {/* จักรยานจอดหน้าร้าน */}
      <g fill="none" stroke={INK} strokeWidth="2.5">
        <circle cx="252" cy="232" r="13" /><circle cx="292" cy="232" r="13" />
        <path d="M252 232 l14 -22 h20 l6 22 M266 210 l10 22 l10 -22 M262 204 h10 M286 210 l-3 -10 h8" stroke="#1DA8DA" strokeWidth="3.5" />
        <path d="M252 232 l14 -22 h20 l6 22 M266 210 l10 22 l10 -22" />
        <path d="M282 196 h16 v10 h-16z" fill="#FFD23F" />
      </g>
      <Tree x={330} />

      {/* 2) คลินิกหมอหมา */}
      <g>
        <rect x="384" y="108" width="184" height="138" fill="#EAF7F2" stroke={INK} strokeWidth="3" />
        <Cornice x={384} w={184} y={96} fill="#1DA8DA" />
        <Sign x={402} y={118} w={148} text="คลินิกหมอหมา" color="#1A7FA6" />
        <g transform="translate(476 170)">
          <circle r="15" fill="#fff" stroke={INK} strokeWidth="2.5" />
          <rect x="-4.5" y="-10" width="9" height="20" rx="1.5" fill="#E2463F" /><rect x="-10" y="-4.5" width="20" height="9" rx="1.5" fill="#E2463F" />
        </g>
        <Win x={398} y={160} w={56} h={52} cols={1}>
          <g stroke={INK} strokeOpacity=".35" strokeWidth="2">{[168, 176, 184].map((y) => <line key={y} x1="400" y1={y} x2="452" y2={y} />)}</g>
        </Win>
        <rect x="454" y="188" width="44" height="58" fill="#BFE9F7" className="win" stroke={INK} strokeWidth="3" />
        <line x1="476" y1="188" x2="476" y2="246" stroke={INK} strokeWidth="2.5" />
        <path d="M472 214 v8 M480 214 v8" stroke={INK} strokeWidth="2.5" strokeLinecap="round" />
        <Win x={508} y={160} w={48} h={52} cols={2} />
        <Plinth x={384} w={184} />
        <Plant x={378} s={0.8} flower="#fff" /><Plant x={530} s={0.9} />
      </g>

      {/* 3) ไฟถนน + ม้านั่ง */}
      <g>
        <rect x="610" y="118" width="8" height="128" fill="#3F4A5A" stroke={INK} strokeWidth="2" />
        <path d="M604 246 h20 v-10 h-20z" fill="#3F4A5A" stroke={INK} strokeWidth="2" />
        <path d="M614 118 q0 -14 16 -14" fill="none" stroke="#3F4A5A" strokeWidth="5" />
        <path d="M620 104 h22 l-4 14 h-14z" fill="#FFD23F" stroke={INK} strokeWidth="2.5" className="lamp" />
        <g>
          <rect x="644" y="188" width="74" height="8" rx="3" fill="#C98A4B" stroke={INK} strokeWidth="2.5" />
          <rect x="644" y="200" width="74" height="8" rx="3" fill="#C98A4B" stroke={INK} strokeWidth="2.5" />
          <rect x="640" y="218" width="82" height="9" rx="3" fill="#C98A4B" stroke={INK} strokeWidth="2.5" />
          <path d="M648 196 v50 M714 196 v50" stroke={INK} strokeWidth="4" />
        </g>
      </g>

      {/* 4) ร้านอาบน้ำตัดขน */}
      <g>
        <rect x="752" y="104" width="190" height="142" fill="#FFD6E4" stroke={INK} strokeWidth="3" />
        <path d="M744 104 h206 l-14 -22 h-178z" fill="#B5338A" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <circle cx="847" cy="94" r="6" fill="#FFD23F" stroke={INK} strokeWidth="2" />
        <Sign x={770} y={112} w={154} text="อาบน้ำตัดขน" />
        <Awning x={748} y={148} w={198} a="#fff" b="#FF8FB8" h={12} />
        <g>
          <circle cx="802" cy="204" r="30" className="win" stroke={INK} strokeWidth="3" />
          <path d="M780 212 q22 14 44 0 v6 q-22 12 -44 0z" fill="#fff" stroke={INK} strokeWidth="2" />
          <circle cx="792" cy="196" r="5" fill="#fff" stroke="#5CC8F5" strokeWidth="2" /><circle cx="806" cy="186" r="3.5" fill="#fff" stroke="#5CC8F5" strokeWidth="2" /><circle cx="814" cy="198" r="4" fill="#fff" stroke="#5CC8F5" strokeWidth="2" />
          <path d="M792 210 a10 6 0 0 1 20 0" fill="#F2B163" stroke={INK} strokeWidth="1.5" />
          <circle cx="802" cy="204" r="30" fill="none" stroke="#fff" strokeWidth="4" strokeOpacity=".5" strokeDasharray="20 160" />
        </g>
        <Door x={864} w={44} h={64} fill="#fff" round={false} />
        <g transform="translate(925 190)"><circle r="5" fill="#fff" stroke="#5CC8F5" strokeWidth="2" /><circle cx="4" cy="-12" r="3.5" fill="#fff" stroke="#5CC8F5" strokeWidth="2" /></g>
        <Plinth x={752} w={190} fill="#E8A6C0" />
        <Plant x={938} s={0.8} flower="#fff" />
      </g>

      {/* 5) รถเข็นน้ำแข็งใส */}
      <g>
        <line x1="1030" y1="150" x2="1030" y2="200" stroke={INK} strokeWidth="3" />
        <path d="M982 156 q48 -50 96 0z" fill="#5CC8F5" stroke={INK} strokeWidth="3" />
        <path d="M982 156 q12 -40 48 -46 q-16 20 -12 46 M1078 156 q-12 -40 -48 -46 q16 20 12 46" fill="#fff" stroke={INK} strokeWidth="2" />
        <path d="M982 156 q12 -10 24 0 q12 -10 24 0 q12 -10 24 0 q12 -10 24 0" fill="#fff" stroke={INK} strokeWidth="2" />
        <rect x="990" y="198" width="82" height="36" rx="5" fill="#fff" stroke={INK} strokeWidth="3" />
        <rect x="996" y="186" width="18" height="14" rx="3" fill="#FF6F91" stroke={INK} strokeWidth="2" /><rect x="1018" y="186" width="18" height="14" rx="3" fill="#9BE15D" stroke={INK} strokeWidth="2" /><rect x="1040" y="186" width="18" height="14" rx="3" fill="#FFD23F" stroke={INK} strokeWidth="2" />
        <text x="1031" y="221" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="12" fill="#1A7FA6">น้ำแข็งใส</text>
        <circle cx="1004" cy="238" r="8" fill={INK} /><circle cx="1004" cy="238" r="3" fill="#ccc" /><circle cx="1058" cy="238" r="8" fill={INK} /><circle cx="1058" cy="238" r="3" fill="#ccc" />
      </g>
      <Tree x={1140} s={0.9} />
      <path d="M1180 240 h36 l-5 10 h-26z" fill="#1DA8DA" stroke={INK} strokeWidth="3" />

      {/* 6) ป้ายรถเมล์ */}
      <g>
        <path d="M1244 150 h132 l-8 -12 h-116z" fill="#F28C28" stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
        <rect x="1256" y="150" width="6" height="96" fill="#5A5148" /><rect x="1358" y="150" width="6" height="96" fill="#5A5148" />
        <rect x="1266" y="160" width="86" height="40" rx="3" fill="#BFE9F7" opacity=".55" stroke={INK} strokeWidth="2" />
        <rect x="1300" y="164" width="30" height="32" rx="2" fill="#FFF6E5" stroke={INK} strokeWidth="1.5" />
        <circle cx="1315" cy="176" r="6" fill="#F2B163" /><path d="M1305 190 h20" stroke="#B5338A" strokeWidth="2" />
        <rect x="1270" y="214" width="80" height="8" rx="3" fill="#F28C28" stroke={INK} strokeWidth="2" />
        <path d="M1276 222 v14 M1344 222 v14" stroke={INK} strokeWidth="3" />
        <rect x="1380" y="120" width="6" height="126" fill="#5A5148" />
        <rect x="1366" y="104" width="34" height="26" rx="5" fill="#fff" stroke={INK} strokeWidth="2.5" />
        <text x="1383" y="122" textAnchor="middle" fontFamily={F} fontWeight="700" fontSize="11" fill="#1A7FA6">BUS</text>
      </g>

      {/* 7) ตู้ไปรษณีย์ + พุ่มไม้ */}
      <g>
        <rect x="1430" y="196" width="32" height="50" rx="10" fill="#D6403A" stroke={INK} strokeWidth="3" />
        <rect x="1438" y="210" width="16" height="4" fill={INK} />
        <path d="M1440 226 h12" stroke="#fff" strokeWidth="2" />
        <ellipse cx="1520" cy="234" rx="48" ry="22" className="leaf" stroke={INK} strokeWidth="3" />
        <ellipse cx="1500" cy="222" rx="20" ry="14" className="leaf" stroke={INK} strokeWidth="2.5" />
        <circle cx="1504" cy="228" r="4" fill="#fff" /><circle cx="1536" cy="232" r="4" fill="#FF6F91" /><circle cx="1522" cy="222" r="4" fill="#FFD23F" />
      </g>

      {/* 8) ร้านของชำ */}
      <g>
        <rect x="1612" y="108" width="208" height="138" fill="#FFF1C9" stroke={INK} strokeWidth="3" />
        <g stroke="#E8D3A0" strokeWidth="2">{[122, 136].map((y) => <line key={y} x1="1614" y1={y} x2="1818" y2={y} />)}</g>
        <Cornice x={1612} w={208} y={96} fill="#2E8B57" />
        <Sign x={1641} y={114} w={150} text="ร้านของชำ" color="#2E7D32" fill="#FFFDF2" />
        <Awning x={1606} y={154} w={220} a="#fff" b="#2E8B57" h={14} />
        <rect x="1626" y="186" width="98" height="60" fill="#F3EADB" stroke={INK} strokeWidth="3" />
        <line x1="1626" y1="205" x2="1724" y2="205" stroke={INK} strokeWidth="2.5" /><line x1="1626" y1="225" x2="1724" y2="225" stroke={INK} strokeWidth="2.5" />
        {[1632, 1645, 1658, 1671, 1684, 1697, 1710].map((x, k) => <rect key={x} x={x} y="191" width="9" height="14" rx="2.5" fill={["#D6403A", "#1DA8DA", "#FFD23F", "#2E8B57", "#F28C28", "#B5338A", "#5CC8F5"][k]} stroke={INK} strokeWidth="1.5" />)}
        {[1632, 1652, 1672, 1692].map((x, k) => <rect key={x} x={x} y="211" width="16" height="14" rx="2" fill={["#F28C28", "#fff", "#1DA8DA", "#FFD23F"][k]} stroke={INK} strokeWidth="1.5" />)}
        <path d="M1632 245 v-12 h84 v12" fill="#C98A4B" stroke={INK} strokeWidth="1.5" />
        <Door x={1742} w={44} h={62} fill="#2E8B57" round={false} />
        <path d="M1700 168 q4 10 -2 18 M1708 168 q2 10 -4 18" stroke="#FFD23F" strokeWidth="5" strokeLinecap="round" fill="none" />
        {/* ลังผลไม้ + กระดานชอล์ก */}
        <g>
          <rect x="1790" y="226" width="40" height="20" fill="#C98A4B" stroke={INK} strokeWidth="2.5" />
          <path d="M1790 236 h40" stroke={INK} strokeWidth="1.5" />
          <circle cx="1798" cy="223" r="5.5" fill="#F28C28" stroke={INK} strokeWidth="1.5" /><circle cx="1810" cy="222" r="5.5" fill="#9BE15D" stroke={INK} strokeWidth="1.5" /><circle cx="1822" cy="223" r="5.5" fill="#D6403A" stroke={INK} strokeWidth="1.5" />
        </g>
        <Plinth x={1612} w={208} fill="#C98A4B" />
      </g>

      {/* 9) Pet Shop */}
      <g>
        <rect x="1880" y="112" width="196" height="134" fill="#E6DBFF" stroke={INK} strokeWidth="3" />
        <path d="M1872 112 h212 l-12 -24 h-188z" fill="#7B4FD1" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
        <g fill="#fff" opacity=".9">{[1904, 1940, 1976, 2012, 2048].map((x) => <PawDot key={x} x={x} y={100} />)}</g>
        <Sign x={1908} y={120} w={140} text="PET SHOP" color="#6A3FC0" />
        <Awning x={1876} y={158} w={204} a="#fff" b="#9C7BE8" h={12} />
        <g transform="translate(2092 150)">
          <line x1="-6" y1="-20" x2="-6" y2="-2" stroke={INK} strokeWidth="2" /><line x1="-20" y1="-20" x2="4" y2="-20" stroke={INK} strokeWidth="3" />
          <path d="M-18 4 a6 6 0 1 1 6 -6 h24 a6 6 0 1 1 6 6 a6 6 0 1 1 -6 6 h-24 a6 6 0 1 1 -6 -6z" fill="#fff" stroke={INK} strokeWidth="2.5" />
        </g>
        <Win x={1896} y={184} w={100} h={50} cols={1}>
          <path d="M1904 233 v-22 l5 -5 h14 l5 5 v22z" fill="#F28C28" stroke={INK} strokeWidth="2" />
          <circle cx="1916" cy="220" r="4" fill="#fff" />
          <circle cx="1950" cy="218" r="13" fill="#BFE9F7" stroke={INK} strokeWidth="2" opacity=".9" />
          <path d="M1944 220 q6 -6 12 0 q-6 6 -12 0z M1956 220 l4 -3 v6z" fill="#F28C28" />
          <circle cx="1980" cy="226" r="7" fill="#FF6F91" stroke={INK} strokeWidth="2" />
        </Win>
        <Door x={2014} w={46} h={64} fill="#FFD23F" />
        <Plinth x={1880} w={196} fill="#B9A6E8" />
        <Plant x={2078} s={0.75} />
      </g>

      {/* 10) สวนสาธารณะ */}
      <g>
        <rect x="2126" y="150" width="12" height="96" fill="#8A5A2B" stroke={INK} strokeWidth="2.5" />
        <rect x="2268" y="150" width="12" height="96" fill="#8A5A2B" stroke={INK} strokeWidth="2.5" />
        <path d="M2120 156 q83 -46 166 0" fill="none" stroke={INK} strokeWidth="11" />
        <path d="M2120 156 q83 -46 166 0" fill="none" stroke="#6CC24A" strokeWidth="7" />
        {[2140, 2170, 2203, 2236, 2266].map((x, k) => <circle key={x} cx={x} cy={k === 2 ? 122 : k % 4 ? 128 : 146} r="4" fill={k % 2 ? "#FF6F91" : "#FFD23F"} stroke={INK} strokeWidth="1.2" />)}
        <Sign x={2128} y={108} w={150} text="สวนสาธารณะ" color="#2E7D32" />
        <Tree x={2206} s={0.72} />
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

// ---------------------------------------------------------------
// คนเดินไปมาบนทางเท้า (หันขวาเป็นค่าเริ่มต้น)
// ---------------------------------------------------------------
type PedLook = {
  skin: string; shirt: string; bottom: "pants" | "shorts" | "skirt" | "long"; bottomColor: string;
  back?: ReactNode; hair: ReactNode; front?: ReactNode; s?: number; run?: boolean;
};

function Leg({ x, color, cls }: { x: number; color: string; cls: string }) {
  return (
    <g className={`lg ${cls}`}>
      <path d={`M${x} 48 V66`} stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d={`M${x} 48 V66`} stroke={color} strokeWidth="4" strokeLinecap="round" />
      <ellipse cx={x + 2} cy="68.5" rx="4.5" ry="2.6" fill={INK} />
    </g>
  );
}

function Arm({ x, color, skin, cls, dir }: { x: number; color: string; skin: string; cls: string; dir: number }) {
  return (
    <g className={`arm ${cls}`}>
      <path d={`M${x} 31 l${dir * 2} 12`} stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d={`M${x} 31 l${dir * 2} 12`} stroke={color} strokeWidth="4" strokeLinecap="round" />
      <circle cx={x + dir * 2} cy="45" r="2.6" fill={skin} stroke={INK} strokeWidth="1.5" />
    </g>
  );
}

function Person({ p }: { p: PedLook }) {
  const legC = p.bottom === "pants" ? p.bottomColor : p.skin;
  return (
    <svg viewBox="0 0 44 72" className={p.run ? "run" : ""}>
      <g transform={p.s ? `translate(${22 * (1 - p.s)} ${72 * (1 - p.s)}) scale(${p.s})` : undefined}>
        {p.back}
        <Arm x={17} color={p.shirt} skin={p.skin} cls="b" dir={-1} />
        <Leg x={19} color={legC} cls="l" />
        <Leg x={25} color={legC} cls="r" />
        {p.bottom === "shorts" && <rect x="14.5" y="43" width="15" height="10" rx="3" fill={p.bottomColor} stroke={INK} strokeWidth="2" />}
        {p.bottom === "pants" && <rect x="15" y="43" width="14" height="8" rx="3" fill={p.bottomColor} stroke={INK} strokeWidth="2" />}
        {p.bottom === "skirt" && <path d="M15 42 h14 l4 13 h-22z" fill={p.bottomColor} stroke={INK} strokeWidth="2" strokeLinejoin="round" />}
        {p.bottom === "long" && <path d="M15 42 h14 l3 22 h-20z" fill={p.bottomColor} stroke={INK} strokeWidth="2" strokeLinejoin="round" />}
        <rect x="14" y="27" width="16" height="19" rx="6" fill={p.shirt} stroke={INK} strokeWidth="2.2" />
        <circle cx="22" cy="16" r="10" fill={p.skin} stroke={INK} strokeWidth="2.2" />
        {p.hair}
        <circle cx="26.5" cy="16" r="1.4" fill={INK} />
        <circle cx="27.5" cy="20.5" r="1.9" fill="#FF8FA3" opacity=".6" />
        <path d="M24 21 q2 1.8 4 0" fill="none" stroke={INK} strokeWidth="1.3" strokeLinecap="round" />
        <Arm x={27} color={p.shirt} skin={p.skin} cls="f" dir={1} />
        {p.front}
      </g>
    </svg>
  );
}

export const PEDS: PedLook[] = [
  // สาวถือถุงช้อปปิ้ง
  { skin: "#F5C9A0", shirt: "#FF6F91", bottom: "skirt", bottomColor: "#5CC8F5",
    back: <><circle cx="21" cy="15" r="11.5" fill="#3A2A20" /><ellipse cx="10" cy="20" rx="4" ry="8" fill="#3A2A20" stroke={INK} strokeWidth="1.5" /></>,
    hair: <path d="M12 14 q9 -12 20 -1 q-9 -4 -20 1z" fill="#3A2A20" />,
    front: <g><path d="M30 41 q3 -5 6 0" fill="none" stroke={INK} strokeWidth="1.5" /><rect x="28" y="41" width="10" height="11" rx="2" fill="#FFD23F" stroke={INK} strokeWidth="2" /></g> },
  // ลุงกางร่มกันแดด
  { skin: "#E0A97A", shirt: "#1DA8DA", bottom: "pants", bottomColor: "#3F4A5A",
    hair: <path d="M12 14 q10 -14 20 0 q-10 -6 -20 0z" fill="#9A9A9A" stroke={INK} strokeWidth="1.5" />,
    front: <g><line x1="30" y1="44" x2="30" y2="-2" stroke={INK} strokeWidth="2" /><path d="M10 0 q20 -18 40 0 q-5 -4 -10 0 q-5 -4 -10 0 q-5 -4 -10 0 q-5 -4 -10 0z" fill="#E2463F" stroke={INK} strokeWidth="2" strokeLinejoin="round" /><path d="M25 -9 q5 -6 10 0" fill="#fff" opacity=".5" /></g> },
  // เด็กถือลูกโป่ง
  { skin: "#F5C9A0", shirt: "#FFD23F", bottom: "shorts", bottomColor: "#2E8B57", s: 0.78,
    hair: <path d="M12 13 q10 -14 20 0 l-3 -2 l-3 3 l-3 -3 l-3 3 l-3 -3z" fill="#5A3A1C" />,
    front: <g><path d="M30 45 q6 -20 4 -36" fill="none" stroke={INK} strokeWidth="1.2" /><ellipse cx="35" cy="0" rx="8" ry="9.5" fill="#E2463F" stroke={INK} strokeWidth="2" /><circle cx="32" cy="-3" r="2" fill="#fff" opacity=".6" /></g> },
  // นักเรียนสะพายกระเป๋า
  { skin: "#C98E5E", shirt: "#fff", bottom: "shorts", bottomColor: "#2B3A67", s: 0.9,
    back: <rect x="7" y="28" width="9" height="16" rx="3" fill="#1DA8DA" stroke={INK} strokeWidth="2" />,
    hair: <path d="M12 14 q10 -13 20 -1 q-10 -5 -20 1z" fill="#1E1A17" stroke={INK} strokeWidth="1" /> },
  // ยายหิ้วตะกร้า
  { skin: "#E8B48A", shirt: "#9C7BE8", bottom: "long", bottomColor: "#B5338A",
    back: <circle cx="14" cy="8" r="4.5" fill="#D9D9D9" stroke={INK} strokeWidth="1.5" />,
    hair: <path d="M12 15 q10 -14 20 -2 q-10 -5 -20 2z" fill="#D9D9D9" stroke={INK} strokeWidth="1.5" />,
    front: <g><path d="M28 42 q5 -8 10 0" fill="none" stroke={INK} strokeWidth="2" /><path d="M26 42 h14 l-2 10 h-10z" fill="#C98A4B" stroke={INK} strokeWidth="2" strokeLinejoin="round" /><circle cx="30" cy="40" r="3" fill="#9BE15D" stroke={INK} strokeWidth="1" /><circle cx="35" cy="40" r="3" fill="#F28C28" stroke={INK} strokeWidth="1" /></g> },
  // คนวิ่งออกกำลังกาย
  { skin: "#F0BE93", shirt: "#6CC24A", bottom: "shorts", bottomColor: "#241C15", run: true,
    hair: <path d="M11 12 q11 -14 22 0 h7 v3 h-29z" fill="#F28C28" stroke={INK} strokeWidth="1.5" strokeLinejoin="round" /> },
];

export function PedArt({ i }: { i: number }) {
  return <Person p={PEDS[i % PEDS.length]} />;
}
