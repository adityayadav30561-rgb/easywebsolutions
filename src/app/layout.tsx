import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { ViewTransition } from "react";
import { site } from "@/config/site";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollEffects } from "@/components/ui/ScrollEffects";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "EasyWebSolns — Websites That Work For You",
    template: "%s | EasyWebSolns",
  },
  description: site.description,
  applicationName: site.name,
  openGraph: { siteName: site.name, type: "website", locale: "en_US" },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#f7f7f5",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-lg bg-ink px-4 py-3 text-sm font-medium text-white transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <Navbar />
        <ViewTransition>
          <main id="main" className="flex-1">
            {children}
          </main>
        </ViewTransition>
        <Footer />
        <ScrollEffects />
      </body>
    </html>
  );
}
