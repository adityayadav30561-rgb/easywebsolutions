import { readFile } from "node:fs/promises";
import { extname, join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const alt = "EasyWebSolns — Websites that work for you";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card for every page (uses the official logo asset). */
export default async function OpengraphImage() {
  const [font, logo] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/sora-600.woff")),
    readFile(join(process.cwd(), "public", site.logo.src)),
  ]);
  const mime = extname(site.logo.src) === ".svg" ? "image/svg+xml" : `image/${extname(site.logo.src).slice(1)}`;
  const logoSrc = `data:${mime};base64,${logo.toString("base64")}`;
  const logoHeight = 84;
  const logoWidth = Math.round((site.logo.width / site.logo.height) * logoHeight);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "linear-gradient(160deg, #ffffff 0%, #f7f7f5 55%, #efe9f7 100%)",
          fontFamily: "Sora",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -160,
            top: -160,
            width: 620,
            height: 620,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(138,109,188,0.28), rgba(138,109,188,0) 65%)",
          }}
        />
        <img src={logoSrc} width={logoWidth} height={logoHeight} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -3, color: "#121621", display: "flex", flexWrap: "wrap" }}>
            Websites that work
          </div>
          <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -3, color: "#6f55a3", display: "flex" }}>
            for your business.
          </div>
          <div style={{ marginTop: 28, fontSize: 26, color: "#575b62", letterSpacing: -0.5, display: "flex" }}>
            Web design · Development · Optimization · Ongoing care
          </div>
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Sora", data: font, weight: 600, style: "normal" }] },
  );
}
