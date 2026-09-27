import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  /** e.g. "01 — Services" */
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2";
  id?: string;
  className?: string;
  children?: ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  as: Tag = "h2",
  id,
  className,
  children,
}: Props) {
  const dark = tone === "dark";
  return (
    <div
      className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}
      data-reveal=""
    >
      {eyebrow && (
        <p className={cn("eyebrow mb-5 flex items-center gap-3", align === "center" && "justify-center", dark && "!text-violet-300")}>
          <span aria-hidden="true" className={cn("h-px w-6", dark ? "bg-violet-300/60" : "bg-violet-600/50")} />
          {eyebrow}
        </p>
      )}
      <Tag
        id={id}
        className={cn(
          "text-[2rem] leading-[1.1] font-semibold sm:text-[2.5rem] lg:text-[3rem]",
          dark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </Tag>
      {description && (
        <p
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            align === "center" && "mx-auto max-w-2xl",
            dark ? "text-slate-400" : "text-slate",
          )}
        >
          {description}
        </p>
      )}
      {children}
    </div>
  );
}
