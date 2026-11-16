"use client";

import { useState } from "react";
import { PageHead } from "@/components/Chrome";
import { supabase } from "@/lib/supabase";
import { useGame } from "@/lib/game";
import { LEVELS, levelOf } from "@/lib/game-core.mjs";

type Mode = "signup" | "signin" | "reset";

const ERR: Record<string, string> = {
  "Invalid login credentials": "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  "Email not confirmed": "ยังไม่ได้ยืนยันอีเมล เปิดลิงก์ในอีเมลที่ส่งไปก่อนนะ",
  "User already registered": "อีเมลนี้สมัครไว้แล้ว ลองเข้าสู่ระบบแทน",
};
const thai = (m: string) => ERR[m] || (m.includes("Password should be") ? "รหัสผ่านต้องยาวอย่างน้อย 6 ตัว" : m);

export default function AccountPage() {
  const { session, state, sync, displayName, setDisplayName, showToast } = useGame();
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [editName, setEditName] = useState<string | null>(null);
  const [newPass, setNewPass] = useState("");

  const redirect = typeof window !== "undefined" ? `${window.location.origin}/account/` : undefined;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email, password, options: { data: { display_name: name.trim() || null }, emailRedirectTo: redirect },
        });
        if (error) throw error;
        if (!data.session) setMsg({ ok: true, text: `ส่งอีเมลยืนยันไปที่ ${email} แล้ว กดลิงก์ในอีเมลแล้วกลับมาเข้าสู่ระบบได้เลย กระดูกที่สะสมไว้จะย้ายเข้าบัญชีให้อัตโนมัติ` });
      } else if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        showToast("เข้าสู่ระบบแล้ว กำลังรวมกระดูก…");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: redirect });
        if (error) throw error;
        setMsg({ ok: true, text: "ถ้าอีเมลนี้มีบัญชีอยู่ จะได้รับลิงก์ตั้งรหัสผ่านใหม่ภายในไม่กี่นาที" });
      }
    } catch (err) {
      setMsg({ ok: false, text: thai((err as Error).message) });
    } finally {
      setBusy(false);
    }
  };

  const saveName = async () => {
    if (editName === null || !session) return;
    const v = editName.trim().slice(0, 40) || null;
    const { error } = await supabase.from("profiles").update({ display_name: v }).eq("id", session.user.id);
    if (error) { setMsg({ ok: false, text: "บันทึกชื่อไม่สำเร็จ ลองใหม่อีกครั้ง" }); return; }
    setDisplayName(v); setEditName(null); showToast("บันทึกชื่อแล้ว");
  };

  if (session) {
    const li = levelOf(state.bones);
    return (
      <>
        <PageHead img="s9" eyebrow="บัญชีของฉัน" title={displayName ? `สวัสดี ${displayName}` : "สวัสดีชาวเชาเชา"} />
        <div className="pad stack">
          <div className="card stack">
            <div className="acct-row"><span>อีเมล</span><b>{session.user.email}</b></div>
            <div className="acct-row"><span>ระดับ</span><b>{LEVELS[li].name} · 🦴 {state.bones}</b></div>
            <div className="acct-row"><span>สถานะ</span>
              <b className={`sync ${sync}`}>{{ synced: "เก็บในบัญชีแล้ว", syncing: "กำลังซิงก์…", error: "ซิงก์ไม่สำเร็จ ลองรีเฟรช", local: "—" }[sync]}</b>
            </div>
            <button className="btn signout" type="button" onClick={async () => { await supabase.auth.signOut(); showToast("ออกจากระบบแล้ว"); }}>ออกจากระบบ</button>
          </div>
          <div className="card mem-form">
            <label htmlFor="dn">ชื่อที่แสดง</label>
            {editName === null ? (
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <b style={{ flex: 1 }}>{displayName || "ยังไม่ได้ตั้ง"}</b>
                <button className="btn ghost" type="button" onClick={() => setEditName(displayName || "")}>แก้ไข</button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 8 }}>
                <input id="dn" maxLength={40} value={editName} onChange={(e) => setEditName(e.target.value)} autoFocus />
                <button className="btn" type="button" onClick={saveName}>บันทึก</button>
              </div>
            )}
          </div>
          <form className="card mem-form" onSubmit={async (e) => {
            e.preventDefault();
            const { error } = await supabase.auth.updateUser({ password: newPass });
            setMsg(error ? { ok: false, text: thai(error.message) } : { ok: true, text: "เปลี่ยนรหัสผ่านแล้ว" });
            if (!error) setNewPass("");
          }}>
            <label htmlFor="np">ตั้งรหัสผ่านใหม่</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input id="np" type="password" minLength={6} required autoComplete="new-password" value={newPass} onChange={(e) => setNewPass(e.target.value)} />
              <button className="btn" type="submit">บันทึก</button>
            </div>
          </form>
          {msg && <p className={`form-msg ${msg.ok ? "ok" : "bad"}`} role="status">{msg.text}</p>}
        </div>
      </>
    );
  }

  return (
    <>
      <PageHead img="s1" eyebrow="บัญชีของฉัน" title="เก็บกระดูกไว้ทุกเครื่อง" />
      <div className="pad stack">
        <p className="lead">สมัครฟรีด้วยอีเมล กระดูก {state.bones > 0 ? `${state.bones} ชิ้นที่สะสมไว้ตอนนี้` : "ที่สะสม"}จะย้ายเข้าบัญชีให้ แล้วเปิดจากมือถือหรือคอมเครื่องไหนก็เห็นน้องชุดเดิม</p>
        <div className="tabs" role="tablist" aria-label="สมัครหรือเข้าสู่ระบบ">
          <button role="tab" aria-selected={mode === "signup"} onClick={() => { setMode("signup"); setMsg(null); }}>สมัครสมาชิก</button>
          <button role="tab" aria-selected={mode === "signin"} onClick={() => { setMode("signin"); setMsg(null); }}>เข้าสู่ระบบ</button>
        </div>
        <form className="card mem-form" onSubmit={submit}>
          {mode === "signup" && (
            <div><label htmlFor="a-name">ชื่อที่แสดง (ไม่บังคับ)</label><input id="a-name" maxLength={40} value={name} onChange={(e) => setName(e.target.value)} placeholder="เช่น แม่ของข้าวต้ม" /></div>
          )}
          <div><label htmlFor="a-email">อีเมล</label><input id="a-email" type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
          {mode !== "reset" && (
            <div><label htmlFor="a-pass">รหัสผ่าน (อย่างน้อย 6 ตัว)</label><input id="a-pass" type="password" required minLength={6} autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          )}
          <button className="btn" type="submit" disabled={busy}>
            {busy ? "รอสักครู่…" : mode === "signup" ? "สมัครสมาชิก" : mode === "signin" ? "เข้าสู่ระบบ" : "ส่งลิงก์ตั้งรหัสใหม่"}
          </button>
          {mode === "signin" && <button className="linkbtn" type="button" onClick={() => { setMode("reset"); setMsg(null); }}>ลืมรหัสผ่าน</button>}
          {mode === "reset" && <button className="linkbtn" type="button" onClick={() => { setMode("signin"); setMsg(null); }}>กลับไปเข้าสู่ระบบ</button>}
          {msg && <p className={`form-msg ${msg.ok ? "ok" : "bad"}`} role="status">{msg.text}</p>}
        </form>
      </div>
    </>
  );
}
