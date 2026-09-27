import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A minimal browser window. Sizes are in container-query units (cqw) so the
 * whole composition scales crisply with its container.
 */
export function BrowserFrame({
  url,
  dark,
  className,
  style,
  children,
}: {
  url?: string;
  dark?: boolean;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.6cqw] border",
        dark
          ? "border-white/10 bg-[#141a2b] shadow-[0_30px_80px_-30px_rgb(16_21_34/0.7)]"
          : "border-[rgb(15_23_42/0.08)] bg-white shadow-[var(--shadow-float)]",
        className,
      )}
      style={style}
    >
      <div
        className={cn(
          "flex items-center gap-[0.7cqw] border-b px-[1.6cqw] py-[1.2cqw]",
          dark ? "border-white/[0.06] bg-white/[0.02]" : "border-[rgb(15_23_42/0.06)] bg-[#fbfbfd]",
        )}
      >
        <span className="size-[0.95cqw] rounded-full bg-[#ff5f57]/80" />
        <span className="size-[0.95cqw] rounded-full bg-[#febc2e]/80" />
        <span className="size-[0.95cqw] rounded-full bg-[#28c840]/80" />
        {url && (
          <span
            className={cn(
              "mx-auto truncate rounded-[0.6cqw] px-[2.4cqw] py-[0.35cqw] text-[1.1cqw] font-medium",
              dark ? "bg-white/[0.05] text-white/70" : "bg-[rgb(15_23_42/0.04)] text-[#556072]",
            )}
          >
            {url}
          </span>
        )}
        {url && <span className="w-[3.3cqw]" />}
      </div>
      {children}
    </div>
  );
}

/** Placeholder text line used inside mockups. */
export function Line({ w, c, h = 0.8, className }: { w: string; c: string; h?: number; className?: string }) {
  return <span className={cn("block rounded-full", className)} style={{ width: w, height: `${h}cqw`, background: c }} />;
}
