import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Caveat } from "next/font/google";
import { PageTransition } from "@/components/ui/PageTransition";
import { BottomNav } from "@/components/ui/BottomNav";
import { AppShell } from "@/components/ui/AppShell";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yarim'in Bahçesi",
  description: "özel bir hatıra uygulaması",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#5A8B7E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" data-theme="">
      <body
        className={`${cormorant.variable} ${inter.variable} ${caveat.variable}`}
      >
        <AppShell>
          <PageTransition>{children}</PageTransition>
          {/* Persistent across page navigation — sits in root layout */}
          <BottomNav />
        </AppShell>
      </body>
    </html>
  );
}
