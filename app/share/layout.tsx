import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ส่งรูปน้องเชาเชา",
  description: "แชร์รูปและเรื่องของน้องเชาเชาที่บ้านคุณ ขึ้นแกลเลอรีหลังผ่านการตรวจ",
  alternates: { canonical: "/share/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
