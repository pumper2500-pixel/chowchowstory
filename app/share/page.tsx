"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { PageHead } from "@/components/Chrome";
import { useGame } from "@/lib/game";
import { prepareImage } from "@/lib/image";
import { photoUrl, supabase, type DogPost } from "@/lib/supabase";

const STATUS: Record<DogPost["status"], string> = {
  pending: "⏳ รออนุมัติ",
  approved: "✅ ขึ้นแกลเลอรีแล้ว",
  rejected: "✖ ไม่ผ่าน",
};

export default function SharePage() {
  const { session, earn } = useGame();
  const [file, setFile] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [caption, setCaption] = useState("");
  const [owns, setOwns] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [mine, setMine] = useState<DogPost[]>([]);

  const load = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase.from("dog_posts")
      .select("id,dog_name,caption,photo_path,status,reject_reason,created_at")
      .eq("user_id", session.user.id).order("created_at", { ascending: false });
    setMine((data as DogPost[]) || []);
  }, [session]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const pick = async (f: File | undefined) => {
    setMsg(null);
    if (!f) return;
    try {
      const blob = await prepareImage(f);
      setFile(blob);
      setPreview(URL.createObjectURL(blob));
    } catch (e) {
      setFile(null); setPreview(null);
      setMsg({ ok: false, text: (e as Error).message });
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !file) return;
    setBusy(true); setMsg(null);
    const path = `${session.user.id}/${crypto.randomUUID()}.jpg`;
    const up = await supabase.storage.from("dog-photos").upload(path, file, { contentType: "image/jpeg", upsert: false });
    if (up.error) {
      setBusy(false);
      setMsg({ ok: false, text: "อัปโหลดรูปไม่สำเร็จ ลองใหม่อีกครั้ง" });
      return;
    }
    const ins = await supabase.from("dog_posts").insert({ dog_name: name.trim(), caption: caption.trim(), photo_path: path, owns_photo: owns });
    if (ins.error) {
      await supabase.storage.from("dog-photos").remove([path]);
      setBusy(false);
      setMsg({ ok: false, text: ins.error.message.includes("pending limit")
        ? "มีโพสต์รออนุมัติครบ 5 โพสต์แล้ว รอให้อนุมัติก่อนนะ"
        : "บันทึกไม่สำเร็จ ลองใหม่อีกครั้ง" });
      return;
    }
    setBusy(false);
    setFile(null); setPreview(null); setName(""); setCaption(""); setOwns(false);
    setMsg({ ok: true, text: "ส่งแล้ว! รูปจะขึ้นแกลเลอรีหลังผ่านการตรวจ" });
    earn("post", 20, "ขอบคุณที่แชร์รูปน้อง");
    load();
  };

  const remove = async (p: DogPost) => {
    await supabase.from("dog_posts").delete().eq("id", p.id);
    await supabase.storage.from("dog-photos").remove([p.photo_path]);
    load();
  };

  return (
    <>
      <PageHead img="s27" eyebrow="ส่งรูปน้อง" title="แชร์เชาเชาของคุณ" />
      <div className="pad stack">
        <p className="lead">ส่งรูปและเรื่องของน้องเชาเชาที่บ้าน ทีมงานจะตรวจก่อนขึ้นแกลเลอรีในหน้าเรื่องเล่า ส่งครั้งแรกได้ 20 กระดูก</p>

        {!session ? (
          <div className="card stack">
            <img className="pic" src="/img/s1.png" alt="" />
            <p>ต้องเข้าสู่ระบบก่อนส่งรูป เพื่อให้แก้ไขหรือลบรูปของตัวเองได้ทีหลัง</p>
            <Link className="btn" href="/account/">สมัคร / เข้าสู่ระบบ</Link>
          </div>
        ) : (
          <form className="card mem-form" onSubmit={submit}>
            <label className="drop" htmlFor="p-file">
              {preview ? <img src={preview} alt="ตัวอย่างรูปที่จะส่ง" /> : <span>📷 แตะเพื่อเลือกรูป<small>JPG / PNG ระบบจะย่อรูปและลบข้อมูลตำแหน่งในรูปให้</small></span>}
            </label>
            <input id="p-file" className="sr-only" type="file" accept="image/*" onChange={(e) => pick(e.target.files?.[0])} />
            <div><label htmlFor="p-name">ชื่อน้อง</label><input id="p-name" maxLength={40} required value={name} onChange={(e) => setName(e.target.value)} /></div>
            <div><label htmlFor="p-cap">เล่าเรื่องสั้น ๆ</label><textarea id="p-cap" maxLength={500} required value={caption} onChange={(e) => setCaption(e.target.value)} placeholder="เช่น ชอบนอนหน้าแอร์ทั้งวัน ตื่นมาแค่ตอนได้ยินเสียงถุงขนม" /><small className="count">{caption.length}/500</small></div>
            <label className="consent">
              <input type="checkbox" checked={owns} onChange={(e) => setOwns(e.target.checked)} required />
              <span>ฉันถ่ายรูปนี้เอง หรือได้รับอนุญาตจากคนถ่ายแล้ว และยินยอมให้ ChowChowStory แสดงรูปนี้บนเว็บและแอป</span>
            </label>
            <button className="btn" type="submit" disabled={busy || !file || !owns}>{busy ? "กำลังส่ง…" : "ส่งรูปน้อง"}</button>
            {msg && <p className={`form-msg ${msg.ok ? "ok" : "bad"}`} role="status">{msg.text}</p>}
          </form>
        )}

        {mine.length > 0 && (
          <section className="stack">
            <h2 style={{ fontSize: 20 }}>รูปที่ฉันส่ง</h2>
            <div className="post-grid">
              {mine.map((p) => (
                <figure key={p.id} className="post">
                  <img src={photoUrl(p.photo_path)} alt={`${p.dog_name}`} loading="lazy" />
                  <figcaption>
                    <b>{p.dog_name}</b>
                    <span className={`st ${p.status}`}>{STATUS[p.status]}</span>
                    {p.status === "rejected" && p.reject_reason && <small>เหตุผล: {p.reject_reason}</small>}
                    <button className="linkbtn" type="button" onClick={() => remove(p)}>ลบ</button>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
