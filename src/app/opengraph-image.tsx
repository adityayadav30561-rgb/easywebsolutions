import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = "EasyWebSolns — Websites that work for you";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card: the logo and headline on a frosted panel over the brand aurora. */
export default async function OpengraphImage() {
  const [font, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/inter-600.ttf")),
    readFile(join(process.cwd(), "public", site.logo.src)),
  ]);
  const mime = extname(site.logo.src) === ".svg" ? "image/svg+xml" : `image/${extname(site.logo.src).slice(1)}`;
  const logoSrc = `data:${mime};base64,${logo.toString("base64")}`;
  const logoHeight = 72;
  const logoWidth = Math.round((site.logo.width / site.logo.height) * logoHeight);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 48,
          fontFamily: "Inter",
          background:
            "radial-gradient(circle at 12% 10%, rgba(138,109,188,0.75), transparent 45%), radial-gradient(circle at 92% 18%, rgba(108,124,255,0.6), transparent 45%), radial-gradient(circle at 30% 100%, rgba(255,158,199,0.55), transparent 50%), radial-gradient(circle at 95% 95%, rgba(124,200,255,0.6), transparent 45%), #f5f5f7",
        }}
      >
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 64px",
            borderRadius: 44,
            background: "linear-gradient(150deg, rgba(255,255,255,0.78), rgba(255,255,255,0.5))",
            border: "1.5px solid rgba(255,255,255,0.9)",
            boxShadow: "0 30px 60px -30px rgba(40,26,90,0.45)",
          }}
        >
          <img src={logoSrc} width={logoWidth} height={logoHeight} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 88, lineHeight: 1, letterSpacing: -4, color: "#1d1d1f", display: "flex" }}>Websites that</div>
            <div style={{ fontSize: 88, lineHeight: 1.05, letterSpacing: -4, color: "#6f55a3", display: "flex" }}>work for you.</div>
            <div style={{ marginTop: 26, fontSize: 26, color: "#6e6e73", letterSpacing: -0.5, display: "flex" }}>
              Web design · Development · Optimization · Ongoing care
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Inter", data: font, weight: 600, style: "normal" }] },
  );
}
