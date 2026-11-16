import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chow Chow Live Simulator",
  description: "เลี้ยงน้องเชาเชาในเมืองสามมิติ ปลูกผัก ตกปลา เข้าร้านซื้อของ ผูกมิตรชาวเมือง และตามหาเพื่อนเชาเชา",
  alternates: { canonical: "/sim/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
