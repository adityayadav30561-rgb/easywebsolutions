import Image from "next/image";
import Link from "next/link";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

/**
 * Renders the official logo asset unmodified. Height is fixed per placement;
 * width follows the asset's intrinsic aspect ratio.
 */
export function Logo({ className, height = 30, priority }: { className?: string; height?: number; priority?: boolean }) {
  const { src, width: w, height: h, alt } = site.logo;
  const width = Math.round((w / h) * height);
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn("inline-flex shrink-0 items-center rounded-md", className)}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        unoptimized={src.endsWith(".svg")}
        quality={90}
        style={{ width, height: "auto" }}
      />
    </Link>
  );
}
