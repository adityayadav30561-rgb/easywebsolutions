import type { Metadata } from "next";
import { site } from "@/config/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
};

const ogImage = { url: "/opengraph-image", width: 1200, height: 630, alt: "EasyWebSolns — Websites that work for you" };

/** Builds consistent per-page metadata: title, description, canonical, OG and X cards. */
export function pageMetadata({ title, description, path }: PageMetaInput): Metadata {
  const url = path === "/" ? "/" : path;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: site.name,
      locale: "en_US",
      url,
      title,
      description,
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage.url],
    },
  };
}
