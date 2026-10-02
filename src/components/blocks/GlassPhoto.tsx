import Image from "next/image";
import { photos, type PhotoKey } from "@/data/images";
import { cn } from "@/lib/cn";

/** Colour photograph set inside a glass bezel, like a device or a framed print. */
export function GlassPhoto({
  name,
  sizes,
  className,
  position = "50% 50%",
  priority,
  alt,
}: {
  name: PhotoKey;
  sizes: string;
  className?: string;
  position?: string;
  priority?: boolean;
  alt?: string;
}) {
  const p = photos[name];
  return (
    <div className={cn("glass p-2 [--radius:2.25rem] sm:p-2.5", className)}>
      <div className="relative h-full w-full overflow-hidden rounded-[1.85rem]">
        <Image src={p.src} alt={alt ?? p.alt} fill sizes={sizes} priority={priority} placeholder="blur" quality={75} className="object-cover" style={{ objectPosition: position }} />
      </div>
    </div>
  );
}
