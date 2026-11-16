"use client";

import { useCallback, useEffect, useState } from "react";
import { PageHead } from "@/components/Chrome";
import { useGame } from "@/lib/game";
import { photoUrl, supabase, type DogPost } from "@/lib/supabase";

// คิวอนุมัติ — ฐานข้อมูลตรวจสิทธิ์แอดมินอีกชั้น (RLS) หน้านี้แค่ซ่อนจากคนทั่วไป
export default function ReviewPage() {
  const { session, showToast } = useGame();
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [queue, setQueue] = useState<DogPost[]>([]);
  const [reason, setReason] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    const { data } = await supabase.from("dog_posts")
      .select("id,dog_name,caption,photo_path,status,reject_reason,created_at,user_id")
      .eq("status", "pending").order("created_at");
    setQueue((data as DogPost[]) || []);
  }, []);

  useEffect(() => {
    if (!session) { setAdmin(false); return; }
    supabase.rpc("is_admin").then(({ data }) => { setAdmin(!!data); if (data) load(); });
  }, [session, load]);

  const decide = async (p: DogPost, status: "approved" | "rejected") => {
    const { error } = await supabase.from("dog_posts").update({
      status, reviewed_at: new Date().toISOString(), reviewed_by: session!.user.id,
      reject_reason: status === "rejected" ? (reason[p.id] || "").trim().slice(0, 200) || null : null,
    }).eq("id", p.id);
    if (error) { showToast("บันทึกไม่สำเร็จ"); return; }
    showToast(status === "approved" ? `อนุมัติ ${p.dog_name} แล้ว` : `ไม่ผ่าน ${p.dog_name}`);
    load();
  };

  return (
    <>
      <PageHead img="s10" eyebrow="หลังบ้าน" title="คิวรออนุมัติ" />
      <div className="pad stack">
        {admin === null && <p className="lead">กำลังตรวจสิทธิ์…</p>}
        {admin === false && <p className="lead">หน้านี้สำหรับแอดมินเท่านั้น</p>}
        {admin && queue.length === 0 && (
          <div className="card stack"><img className="pic" src="/img/s23.png" alt="" /><p>ไม่มีรูปค้างในคิว</p></div>
        )}
        {admin && queue.map((p) => (
          <article key={p.id} className="card stack review">
            <img className="review-img" src={photoUrl(p.photo_path)} alt={p.dog_name} />
            <h3>{p.dog_name}</h3>
            <p>{p.caption}</p>
            <small className="lead">ส่งเมื่อ {new Date(p.created_at).toLocaleString("th-TH")}</small>
            <div className="review-checks">
              <span>ตรวจก่อนอนุมัติ: เป็นเชาเชาจริง · ไม่มีหน้าคน/เลขบ้าน/ทะเบียนรถชัด ๆ · ไม่ใช่รูปที่ดูเหมือนก๊อปจากเน็ต</span>
            </div>
            <input aria-label="เหตุผลถ้าไม่ผ่าน" placeholder="เหตุผลถ้าไม่ผ่าน (ผู้ส่งจะเห็น)" maxLength={200}
              value={reason[p.id] || ""} onChange={(e) => setReason({ ...reason, [p.id]: e.target.value })} />
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn" type="button" onClick={() => decide(p, "approved")}>อนุมัติ</button>
              <button className="btn ghost" type="button" onClick={() => decide(p, "rejected")}>ไม่ผ่าน</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
