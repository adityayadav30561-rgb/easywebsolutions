import type { ReactNode } from "react";
import type { PhotoKey } from "@/data/images";
import type { Project } from "@/data/projects";
import { Photo } from "@/components/ui/Photo";
import { MockupWindow } from "./ProjectMockup";

/** Mobile view of a concept site, drawn in cqw units. */
function PhoneScreen({ project }: { project: Project }) {
  const t = project.mockup.theme;
  return (
    <div className="@container">
    <div className="overflow-hidden rounded-[12cqw] border-[3cqw] border-[#0b0f18] bg-[#0b0f18] shadow-[var(--shadow-window-dark)]">
      <div className="overflow-hidden rounded-[9.0cqw]" style={{ background: t.bg }}>
        <div className="mx-auto mt-[4.0cqw] h-[5.0cqw] w-[30.0cqw] rounded-full bg-black" />
        <div className="p-[8.0cqw]">
          <div className="flex items-center justify-between">
            <span className="size-[8.0cqw] rounded-full" style={{ background: t.accent }} />
            <span className="h-[1.5cqw] w-[12.0cqw] rounded-full" style={{ background: t.text }} />
          </div>
          <p className="mt-[10.0cqw] font-display text-[11.0cqw] leading-[1.02] font-semibold tracking-[-0.03em]" style={{ color: t.text }}>
            {project.mockup.headline}
          </p>
          <div className="mt-[7.0cqw] space-y-[3.0cqw]">
            <span className="block h-[2.5cqw] w-[90%] rounded-full" style={{ background: t.surface }} />
            <span className="block h-[2.5cqw] w-[70%] rounded-full" style={{ background: t.surface }} />
          </div>
          <div className="mt-[9.0cqw] rounded-[4.0cqw] py-[5.5cqw] text-center text-[5.5cqw] font-semibold" style={{ background: t.accent, color: t.bg }}>
            Book a consultation
          </div>
          <div className="mt-[4.0cqw] rounded-[4.0cqw] border py-[5.0cqw] text-center text-[5.5cqw] font-medium" style={{ borderColor: t.muted, color: t.text }}>
            Call now
          </div>
          <div className="mt-[9.0cqw] aspect-[4/3] rounded-[4.0cqw]" style={{ background: t.accentSoft }} />
        </div>
      </div>
    </div>
    </div>
  );
}

/**
 * Full-bleed photographic band with a browser window and a phone —
 * the "we build websites" statement for inner pages.
 */
export function DeviceShowcase({ photo, project, caption, children }: { photo: PhotoKey; project: Project; caption?: string; children?: ReactNode }) {
  return (
    <div data-theme="dark" className="@container relative aspect-[4/5] overflow-hidden bg-night sm:aspect-[16/10] lg:aspect-[16/7]">
      <Photo name={photo} alt="" sizes="100vw" treatment="violet" parallax={0.08} priority />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-night/10" />
      <div aria-hidden="true" className="absolute top-[12%] left-[6%] w-[80%] sm:left-[10%] sm:w-[62%] lg:top-[14%] lg:left-[18%] lg:w-[48%]" data-parallax="-0.04">
        <MockupWindow project={project} />
      </div>
      <div aria-hidden="true" className="absolute right-[6%] bottom-[8%] w-[34%] sm:right-[10%] sm:w-[22%] lg:right-[20%] lg:bottom-[-6%] lg:w-[14%]" data-parallax="0.06">
        <PhoneScreen project={project} />
      </div>
      {caption && <p className="label absolute bottom-5 left-5 rounded-[4px] bg-night/60 px-2 py-1 text-white sm:bottom-8 sm:left-8">{caption}</p>}
      {children}
    </div>
  );
}
