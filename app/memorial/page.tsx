"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PageHead } from "@/components/Chrome";
import { useGame } from "@/lib/game";
import { supabase, type Memorial } from "@/lib/supabase";

type LocalMem = { name: string; yrs: string; text: string };
const KEY = "ccs-memorial";
const EMPTY = { name: "", yrs: "", text: "" };

export default function MemorialPage() {
  const { earn, session } = useGame();
  const [local, setLocal] = useState<LocalMem | null>(null);
  const [mine, setMine] = useState<Memorial[]>([]);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [wall, setWall] = useState<Memorial[] | null>(null);

  const load = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase.from("memorials").select("id,dog_name,years,message,status,created_at")
      .eq("user_id", session.user.id).order("created_at", { ascending: false });
    setMine((data as Memorial[]) || []);
  }, [session]);

  useEffect(() => { try { setLocal(JSON.parse(localStorage.getItem(KEY) || "null")); } catch {} }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    supabase.from("memorials").select("id,dog_name,years,message,status,created_at").eq("status", "approved")
      .order("reviewed_at", { ascending: false }).limit(30)
      .then(({ data }) => setWall((data as Memorial[]) || []));
  }, []);

  const setStatus = async (id: string, status: "private" | "pending") => {
    await supabase.from("memorials").update({ status }).eq("id", id);
    load();
  };

  // ล็อกอินแล้วมีข้อความที่เคยเขียนไว้ในเครื่อง → ย้ายเข้าบัญชีให้
  useEffect(() => {
    if (!session || !local) return;
    supabase.from("memorials").insert({ dog_name: local.name, years: local.yrs || null, message: local.text })
      .then(({ error }) => {
        if (error) return;
        try { localStorage.removeItem(KEY); } catch {}
        setLocal(null); load();
      });
  }, [session, local, load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const m = { name: form.name.trim(), yrs: form.yrs.trim(), text: form.text.trim() };
    if (!m.name || !m.text) return;
    setErr("");
    if (session) {
      setBusy(true);
      const { error } = await supabase.from("memorials").insert({ dog_name: m.name, years: m.yrs || null, message: m.text });
      setBusy(false);
      if (error) { setErr("บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง"); return; }
      load();
    } else {
      setLocal(m);
      try { localStorage.setItem(KEY, JSON.stringify(m)); } catch {}
    }
    setForm(EMPTY);
    earn("memorial", 20, "ขอบคุณที่เล่าถึงน้อง");
  };

  const removeServer = async (id: string) => {
    await supabase.from("memorials").delete().eq("id", id);
    load();
  };
  const removeLocal = () => { setLocal(null); try { localStorage.removeItem(KEY); } catch {} };

  return (
    <>
      <PageHead img="s15" eyebrow="ความทรงจำ" title="ถึงน้องที่จากไป" />
      <div className="pad stack">
        <p className="lead">เชาเชาอยู่กับเราได้ราวสิบปี สั้นกว่าที่ใจอยากให้เป็นเสมอ ตรงนี้เป็นที่เขียนถึงน้อง</p>

        <div className="mem-list">
          {mine.map((m) => (
            <Card key={m.id} name={m.dog_name} yrs={m.years} text={m.message}
              status={m.status === "approved" ? "ขึ้นกำแพงความทรงจำแล้ว" : m.status === "pending" ? "รออนุมัติขึ้นกำแพง" : "ส่วนตัว เห็นเฉพาะคุณ"}
              onDelete={() => removeServer(m.id)}
              action={m.status === "private"
                ? { label: "ขอขึ้นกำแพงความทรงจำ", run: () => setStatus(m.id, "pending") }
                : { label: m.status === "pending" ? "ยกเลิกคำขอ" : "เอาออกจากกำแพง", run: () => setStatus(m.id, "private") }} />
          ))}
          {!session && local && (
            <Card name={local.name} yrs={local.yrs} text={local.text} status="เก็บในเครื่องนี้" onDelete={removeLocal} />
          )}
        </div>

        {wall && wall.length > 0 && (
          <section className="stack" aria-labelledby="wall-h">
            <h2 id="wall-h" style={{ fontSize: 21 }}>กำแพงความทรงจำ</h2>
            <div className="wall">
              {wall.map((m) => (
                <figure key={m.id} className="wall-card">
                  <b>{m.dog_name}</b>{m.years && <small>{m.years}</small>}
                  <p>{m.message}</p>
                </figure>
              ))}
            </div>
          </section>
        )}

        <form className="card mem-form" onSubmit={submit}>
          <div><label htmlFor="m-name">ชื่อน้อง</label><input id="m-name" maxLength={40} required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><label htmlFor="m-yrs">ช่วงปีที่อยู่ด้วยกัน</label><input id="m-yrs" maxLength={30} placeholder="เช่น 2555–2566" value={form.yrs} onChange={(e) => setForm({ ...form, yrs: e.target.value })} /></div>
          <div><label htmlFor="m-text">อยากบอกอะไรกับน้อง</label><textarea id="m-text" maxLength={600} required value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} /></div>
          <button className="btn" type="submit" disabled={busy}>{busy ? "กำลังบันทึก…" : "บันทึกความทรงจำ"}</button>
          {err && <p className="form-msg bad" role="status">{err}</p>}
          <p className="lead" style={{ fontSize: 13 }}>
            {session ? "เก็บในบัญชีของคุณ เป็นส่วนตัวจนกว่าจะกดขอขึ้นกำแพง (ทีมงานจะอ่านก่อนเผยแพร่)"
              : <>ตอนนี้เก็บในเครื่องนี้เท่านั้น <Link href="/account/">สมัครสมาชิก</Link> เพื่อเก็บไว้ในบัญชี</>}
          </p>
        </form>
      </div>
    </>
  );
}

function Card({ name, yrs, text, status, onDelete, action }: { name: string; yrs: string | null; text: string; status: string; onDelete: () => void; action?: { label: string; run: () => void } }) {
  return (
    <div className="card mem-card stack">
      <img className="pic" src="/img/s35.png" alt="" />
      <h3>{name}</h3>
      {yrs && <div className="yrs">{yrs}</div>}
      <p>{text}</p>
      <div className="mem-status">{status}</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {action && <button className="btn" type="button" onClick={action.run}>{action.label}</button>}
        <button className="btn ghost" type="button" onClick={onDelete}>ลบข้อความนี้</button>
      </div>
    </div>
  );
}
