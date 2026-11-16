import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "คิวรออนุมัติ",
  description: "หลังบ้าน",
  alternates: { canonical: "/review/" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
