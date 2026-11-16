"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { photoUrl, supabase, type DogPost } from "@/lib/supabase";

// แกลเลอรีจากสมาชิก — แสดงเฉพาะที่อนุมัติแล้ว (RLS กรองให้ที่ฐานข้อมูลอีกชั้น)
export default function Gallery() {
  const [posts, setPosts] = useState<DogPost[] | null>(null);

  useEffect(() => {
    supabase.from("dog_posts").select("id,dog_name,caption,photo_path,status,reject_reason,created_at")
      .eq("status", "approved").order("reviewed_at", { ascending: false }).limit(24)
      .then(({ data }) => setPosts((data as DogPost[]) || []));
  }, []);

  return (
    <section className="stack" aria-labelledby="gal-h">
      <div className="gal-head">
        <h2 id="gal-h" style={{ fontSize: 21 }}>เชาเชาของสมาชิก</h2>
        <Link className="acct-pill" href="/share/">📷 ส่งรูปน้อง</Link>
      </div>
      {posts === null ? <p className="lead">กำลังโหลด…</p>
        : posts.length === 0 ? <p className="lead">ยังไม่มีรูป มาเป็นคนแรกที่แชร์น้องเชาเชาของคุณ</p>
        : (
          <div className="post-grid">
            {posts.map((p) => (
              <figure key={p.id} className="post">
                <img src={photoUrl(p.photo_path)} alt={`${p.dog_name}: ${p.caption}`} loading="lazy" />
                <figcaption><b>{p.dog_name}</b><span>{p.caption}</span></figcaption>
              </figure>
            ))}
          </div>
        )}
    </section>
  );
}
