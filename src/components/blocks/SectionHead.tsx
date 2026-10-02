import type { ReactNode } from "react";
import { Reveal, RevealLines } from "@/components/motion/Reveal";
import { cn } from "@/lib/cn";

/** Section heading: a display headline and an optional lead. No eyebrow labels. */
export function SectionHead({
  id,
  lines,
  lead,
  align = "split",
  dark,
  className,
  children,
}: {
  id?: string;
  lines: ReactNode[];
  lead?: ReactNode;
  align?: "split" | "center" | "left";
  dark?: boolean;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "grid gap-6",
        align === "split" && "lg:grid-cols-12 lg:items-end",
        align === "center" && "justify-items-center text-center",
        className,
      )}
    >
      <RevealLines
        id={id}
        lines={lines}
        className={cn(
          "t-display text-[clamp(2.6rem,6.4vw,5.6rem)]",
          dark && "!text-white",
          align === "split" && "lg:col-span-8",
          align === "center" && "max-w-[16ch]",
        )}
      />
      {(lead || children) && (
        <Reveal delay={0.15} className={cn(align === "split" && "lg:col-span-4 lg:pb-3", align === "center" && "max-w-xl")}>
          {lead && <p className={cn("t-lead", dark && "!text-white/65")}>{lead}</p>}
          {children && <div className={cn(Boolean(lead) && "mt-6", "flex flex-wrap gap-3", align === "center" && "justify-center")}>{children}</div>}
        </Reveal>
      )}
    </div>
  );
}

/** Emphasised word(s) in the serif accent with the brand gradient. */
export function Em({ children, plain }: { children: ReactNode; plain?: boolean }) {
  return <span className={cn("t-serif font-normal", !plain && "t-gradient")}>{children}</span>;
}
