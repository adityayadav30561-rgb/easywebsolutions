import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { site } from "@/config/site";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Aurora } from "@/components/site/Aurora";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

// Inter with its optical-size axis: tight, SF-like letterforms at display sizes, open and legible at text sizes.
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

// A single expressive accent: Instrument Serif italic for emphasised words.
const serif = Instrument_Serif({
  variable: "--font-serif-accent",
  subsets: ["latin"],
  weight: "400",
  style: ["italic"],
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
  themeColor: "#f5f5f7",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable}`}>
      <body className="relative flex min-h-dvh flex-col">
        <a
          href="#main"
          className="fixed top-3 left-3 z-[100] -translate-y-24 rounded-full bg-ink px-5 py-3 text-sm font-medium text-white transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        {/* Site-wide colour field the glass refracts */}
        <div aria-hidden="true" className="fixed inset-0 -z-10">
          <Aurora intensity={0.55} still />
        </div>
        <Nav />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
        <SmoothScroll />
      </body>
    </html>
  );
}
