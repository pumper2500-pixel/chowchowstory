import type { Metadata, Viewport } from "next";
import "./globals.css";
import { GameProvider } from "@/lib/game";
import { BottomNav, ToastHost } from "@/components/Chrome";

export const metadata: Metadata = {
  title: { default: "ChowChowStory", template: "%s · ChowChowStory" },
  description: "เรื่องเล่าและคู่มือเลี้ยงเชาเชาในเมืองร้อน พร้อมน้องเชาเชาที่เดินเล่นอยู่ในแอป",
  icons: { icon: "/icon-512.png", apple: "/icon-512.png" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFD23F",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Mitr:wght@500;600;700&family=IBM+Plex+Sans+Thai+Looped:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <GameProvider>
          <div className="app"><main>{children}</main></div>
          <BottomNav />
          <ToastHost />
        </GameProvider>
      </body>
    </html>
  );
}
