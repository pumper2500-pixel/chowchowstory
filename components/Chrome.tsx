"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGame } from "@/lib/game";

const NAV = [
  { href: "/", label: "หน้าแรก", icon: <><circle cx="12" cy="13" r="8" /><path d="M6 7 4.5 3.5 9 5.5M18 7l1.5-3.5L15 5.5" /><circle cx="9.5" cy="12" r=".6" /><circle cx="14.5" cy="12" r=".6" /><path d="M11 15.5h2" /></> },
  { href: "/stories/", label: "เรื่องเล่า", icon: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5" /></> },
  { href: "/guide/", label: "คู่มือ", icon: <><rect x="5" y="3" width="14" height="18" rx="2" /><path d="M9 3v3h6V3M8.5 11h7M8.5 15h5" /></> },
  { href: "/tools/", label: "เครื่องมือ", icon: <><path d="M12 3v10.5" /><circle cx="12" cy="17" r="4" /><path d="M15 6h3M15 9h2" /></> },
  { href: "/memorial/", label: "ความทรงจำ", icon: <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /> },
];

export function BottomNav() {
  const path = usePathname() || "/";
  const norm = (p: string) => (p.endsWith("/") ? p : p + "/");
  return (
    <nav className="nav" aria-label="เมนูหลัก">
      <div>
        {NAV.map((n) => {
          const on = n.href === "/" ? path === "/" : norm(path).startsWith(n.href);
          return (
            <Link key={n.href} href={n.href} className={on ? "on" : ""} aria-current={on ? "page" : undefined}>
              <svg viewBox="0 0 24 24">{n.icon}</svg>
              <span>{n.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function ToastHost() {
  const { toast } = useGame();
  return (
    <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite"
      dangerouslySetInnerHTML={{ __html: toast?.html ?? "" }} />
  );
}

export function PageHead({ img, eyebrow, title }: { img: string; eyebrow: string; title: string }) {
  return (
    <header className="phead">
      <img src={`/img/${img}.png`} alt="" />
      <div><p className="eb">{eyebrow}</p><h1>{title}</h1></div>
    </header>
  );
}
