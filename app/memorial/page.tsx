"use client";

import { useEffect, useState } from "react";
import { PageHead } from "@/components/Chrome";
import { useGame } from "@/lib/game";

type Mem = { name: string; yrs: string; text: string };
const KEY = "ccs-memorial";

export default function MemorialPage() {
  const { earn } = useGame();
  const [mem, setMem] = useState<Mem | null>(null);
  const [form, setForm] = useState<Mem>({ name: "", yrs: "", text: "" });

  useEffect(() => {
    try { setMem(JSON.parse(localStorage.getItem(KEY) || "null")); } catch {}
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const m = { name: form.name.trim(), yrs: form.yrs.trim(), text: form.text.trim() };
    if (!m.name || !m.text) return;
    setMem(m);
    try { localStorage.setItem(KEY, JSON.stringify(m)); } catch {}
    setForm({ name: "", yrs: "", text: "" });
    earn("memorial", 20, "ขอบคุณที่เล่าถึงน้อง");
  };

  const remove = () => { setMem(null); try { localStorage.removeItem(KEY); } catch {} };

  return (
    <>
      <PageHead img="s15" eyebrow="ความทรงจำ" title="ถึงน้องที่จากไป" />
      <div className="pad stack">
        <p className="lead">เชาเชาอยู่กับเราได้ราวสิบปี สั้นกว่าที่ใจอยากให้เป็นเสมอ ตรงนี้เป็นที่เขียนถึงน้อง</p>
        {mem && (
          <div className="card mem-card stack">
            <img className="pic" src="/img/s35.png" alt="" />
            <h3>{mem.name}</h3>
            {mem.yrs && <div className="yrs">{mem.yrs}</div>}
            <p>{mem.text}</p>
            <button className="btn ghost" type="button" onClick={remove}>ลบข้อความนี้</button>
          </div>
        )}
        <form className="card mem-form" onSubmit={submit}>
          <div><label htmlFor="m-name">ชื่อน้อง</label><input id="m-name" maxLength={40} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label htmlFor="m-yrs">ช่วงปีที่อยู่ด้วยกัน</label><input id="m-yrs" maxLength={30} placeholder="เช่น 2555–2566" value={form.yrs} onChange={(e) => setForm({ ...form, yrs: e.target.value })} /></div>
          <div><label htmlFor="m-text">อยากบอกอะไรกับน้อง</label><textarea id="m-text" maxLength={600} required value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} /></div>
          <button className="btn" type="submit">บันทึกความทรงจำ</button>
          <p className="lead" style={{ fontSize: 13 }}>ตอนนี้เก็บข้อความไว้ในเครื่องของคุณเท่านั้น กำแพงความทรงจำที่ทุกคนเห็นจะมาใน Milestone 04</p>
        </form>
      </div>
    </>
  );
}
