import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "บัญชีของฉัน",
  description: "สมัครสมาชิกเพื่อเก็บกระดูกและความทรงจำไว้ทุกเครื่อง",
  alternates: { canonical: "/account/" },
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
