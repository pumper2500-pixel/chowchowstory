import type { Metadata } from "next";
import { PageHead } from "@/components/Chrome";
import Gallery from "@/components/Gallery";
import StoryList from "@/components/StoryList";
import { excerpt, getArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "เรื่องเล่าเชาเชา",
  description: "ตำนานลิ้นสีน้ำเงิน ประวัติหมาสิงโตขนฟู และนิสัยของเชาเชา อ่านสั้น ๆ จบในสองนาที",
  alternates: { canonical: "/stories/" },
};

export default async function StoriesPage() {
  const articles = await getArticles();
  const items = articles.map((a) => ({ slug: a.slug, title: a.title, kind: a.kind, minutes: a.minutes, excerpt: excerpt(a), text: a.body.join(" ") }));
  return (
    <>
      <PageHead img="s39" eyebrow="เรื่องเล่า" title="เรื่องของหมาหน้าสิงโต" />
      <div className="pad stack">
        <StoryList items={items} />
        <Gallery />
        <div className="slot stack">
          <img className="pic" src="/img/s27.png" alt="" />
          <h3>เรื่องของน้องของเรา</h3>
          <p>เรื่องที่ทำให้เว็บนี้ไม่เหมือนใครคือเรื่องจริงของน้องที่เคยอยู่ด้วยกัน ลองเขียนตามหัวข้อนี้</p>
          <ul><li>วันแรกที่น้องมาถึงบ้าน</li><li>นิสัยที่มีแต่น้องตัวนี้ทำ</li><li>สิ่งที่อยากรู้ตั้งแต่วันแรก แต่มารู้ทีหลัง</li></ul>
        </div>
      </div>
    </>
  );
}
