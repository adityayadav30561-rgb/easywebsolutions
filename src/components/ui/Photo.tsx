import Image from "next/image";
import type { CSSProperties } from "react";
import { photos, type PhotoKey } from "@/data/images";
import { cn } from "@/lib/cn";

/** Photos are always shown in full colour; "violet" and "dark" add an overlay for text legibility. "mono" is kept as an alias of "none". */
type Treatment = "none" | "mono" | "violet" | "dark";

type Props = {
  name: PhotoKey;
  /** Overrides the registry alt text; pass "" for decorative images */
  alt?: string;
  sizes: string;
  treatment?: Treatment;
  /** Mask reveal on scroll */
  reveal?: boolean;
  /** Parallax factor (e.g. 0.08). The image is over-scaled to hide edges. */
  parallax?: number;
  priority?: boolean;
  className?: string;
  imgClassName?: string;
  position?: string;
  delay?: number;
};

/**
 * Art-directed photograph. Fills its (positioned) parent; the parent decides
 * the crop via its own aspect ratio. Overlays are CSS-only, so the licensed
 * source files remain untouched.
 */
export function Photo({
  name,
  alt,
  sizes,
  treatment = "none",
  reveal,
  parallax,
  priority,
  className,
  imgClassName,
  position = "50% 50%",
  delay = 0,
}: Props) {
  const p = photos[name];
  return (
    <div
      className={cn("absolute inset-0 overflow-hidden bg-ink", treatment === "violet" && "grade-violet", className)}
      {...(reveal ? { "data-reveal": "mask" } : {})}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      <div className="absolute inset-0">
        <div
          className={cn("absolute inset-x-0", parallax ? "-top-[12%] -bottom-[12%]" : "inset-y-0")}
          {...(parallax ? { "data-parallax": String(parallax) } : {})}
        >
          <Image
            src={p.src}
            alt={alt ?? p.alt}
            fill
            sizes={sizes}
            priority={priority}
            placeholder="blur"
            quality={72}
            className={cn("object-cover", imgClassName)}
            style={{ objectPosition: position }}
          />
        </div>
      </div>
      {treatment === "dark" && <div aria-hidden="true" className="absolute inset-0 bg-night/55" />}
    </div>
  );
}
