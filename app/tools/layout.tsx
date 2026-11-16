import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "เครื่องมือคนเลี้ยงเชาเชา",
  description: "เช็กว่าวันนี้ร้อนเกินไปสำหรับพาน้องเดินไหม คิดค่าใช้จ่ายต่อเดือน และเช็กความพร้อมก่อนรับเลี้ยง",
  alternates: { canonical: "/tools/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
