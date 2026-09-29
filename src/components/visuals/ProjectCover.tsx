import Image from "next/image";
import type { Project } from "@/data/projects";
import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/cn";
import { MockupWindow } from "./ProjectMockup";

type Frame = "right" | "left" | "center" | "low" | "wide-right";

const frames: Record<Frame, string> = {
  right: "right-[6%] top-[12%] w-[62%]",
  left: "left-[6%] top-[14%] w-[62%]",
  center: "left-1/2 top-[14%] w-[58%] -translate-x-1/2",
  low: "left-[8%] top-[22%] w-[70%]",
  "wide-right": "right-[5%] top-[10%] w-[50%] lg:w-[44%]",
};

/**
 * Project cover: a licensed photograph as the art-directed backdrop with the
 * concept website floating over it. A real screenshot (project.image) replaces
 * the drawn window when available.
 */
export function ProjectCover({
  project,
  sizes,
  frame = "right",
  priority,
  reveal = true,
  className,
}: {
  project: Project;
  sizes: string;
  frame?: Frame;
  priority?: boolean;
  reveal?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("@container absolute inset-0 overflow-hidden", className)}>
      <div className="absolute inset-0 transition-transform duration-[1400ms] ease-[var(--ease-premium)] group-hover:scale-[1.04]">
        <Photo
          name={project.cover}
          alt=""
          sizes={sizes}
         
          reveal={reveal}
          priority={priority}
          position={project.coverPosition}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-night/30" />
      </div>
      <div
        className={cn(
          "absolute transition-transform duration-[1200ms] ease-[var(--ease-premium)] group-hover:-translate-y-[3%]",
          frames[frame],
        )}
        aria-hidden="true"
      >
        {project.image ? (
          <div className="relative aspect-[16/10] overflow-hidden rounded-[1.1cqw] shadow-[var(--shadow-window-dark)]">
            <Image src={project.image} alt="" fill sizes={sizes} className="object-cover object-top" />
          </div>
        ) : (
          <MockupWindow project={project} />
        )}
      </div>
    </div>
  );
}
