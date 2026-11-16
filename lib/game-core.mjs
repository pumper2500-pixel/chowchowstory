// ตรรกะล้วน (ไม่แตะ DOM / React) — ทดสอบได้ด้วย `npm test`

export const LEVELS = [
  { name: "ลูกเชา", min: 0 },
  { name: "เชาฝึกหัด", min: 30 },
  { name: "เชาเพื่อนซี้", min: 80 },
  { name: "เชาตัวจริง", min: 150 },
  { name: "เชามาสเตอร์", min: 240 },
  { name: "ตำนานลิ้นม่วง", min: 360 },
];

export const DOGS = [
  { name: "ข้าวต้ม", img: "main", walk: "main-walk", speed: 26 },
  { name: "ขนมปัง", img: "s2", speed: 20 },
  { name: "บัวลอย", img: "s9", speed: 34 },
  { name: "ทองหยิบ", img: "s39", speed: 22 },
  { name: "ฟักทอง", img: "s29", speed: 18 },
  { name: "โมจิ", img: "s5", speed: 48 },
];

export function levelOf(bones) {
  let i = 0;
  LEVELS.forEach((l, k) => { if (bones >= l.min) i = k; });
  return i;
}

// ความคืบหน้าไปเลเวลถัดไป 0..1
export function progress(bones) {
  const li = levelOf(bones);
  const next = LEVELS[li + 1];
  if (!next) return 1;
  const p = (bones - LEVELS[li].min) / (next.min - LEVELS[li].min);
  return Math.max(0, Math.min(1, p));
}

// ให้แต้มครั้งเดียวต่อ key — คืน state ใหม่ (ไม่แก้ของเดิม)
export function earn(state, key, pts) {
  if (state.done[key]) return { state, gained: 0, levelUp: false };
  const before = levelOf(state.bones);
  const next = { bones: state.bones + pts, done: { ...state.done, [key]: true } };
  return { state: next, gained: pts, levelUp: levelOf(next.bones) > before };
}

// เกณฑ์คร่าว ๆ สำหรับหมาขนสองชั้น: ความชื้นเกิน 60% ทำให้ระบายความร้อนด้วยการหอบได้แย่ลง
export function heatVerdict(tempC, humidity) {
  const s = tempC + Math.max(0, humidity - 60) * 0.1;
  if (s < 25) return { level: "ok", img: "s9", title: "เดินได้ตามปกติ", detail: "พกน้ำไปด้วย และพักเมื่อน้องเริ่มหอบ" };
  if (s < 29) return { level: "warn", img: "s5", title: "เดินสั้น ๆ ไม่เกิน 15 นาที", detail: "เลือกเช้ามืดหรือหลังพระอาทิตย์ตก เดินในร่มเงา" };
  return { level: "bad", img: "s6", title: "วันนี้เล่นในบ้านดีกว่า", detail: "ร้อนเกินไปสำหรับหมาขนสองชั้น ให้อยู่ห้องแอร์หรือหน้าพัดลม" };
}

export function todayKey(d = new Date()) {
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}
