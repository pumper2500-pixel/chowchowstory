import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ความทรงจำถึงน้องเชาเชาที่จากไป",
  description: "ที่เขียนถึงน้องเชาเชาที่เคยอยู่ด้วยกัน และกำแพงความทรงจำของชาวเชาเชา",
  alternates: { canonical: "/memorial/" },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
