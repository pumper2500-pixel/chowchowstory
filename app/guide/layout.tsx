import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "คู่มือเลี้ยงเชาเชาตามช่วงวัย",
  description: "ดูแลเชาเชาตั้งแต่ลูกหมาถึงวัยชรา เรื่องความร้อน ขน ข้อ และสุขภาพ สำหรับเจ้าของในเมืองร้อน",
  alternates: { canonical: "/guide/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
