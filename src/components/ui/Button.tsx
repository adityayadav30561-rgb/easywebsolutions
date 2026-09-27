import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "light" | "outline-light" | "link" | "link-light";

const base =
  "group relative inline-flex shrink-0 items-center justify-between gap-5 overflow-hidden whitespace-nowrap " +
  "label !text-[0.75rem] !tracking-[0.14em] transition-[background-color,border-color,color] duration-500 ease-[var(--ease-premium)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-violet disabled:pointer-events-none disabled:opacity-60";

const box = "h-14 rounded-[8px] pl-6 pr-5";

const variants: Record<Variant, string> = {
  solid: `${box} bg-ink text-white hover:bg-night`,
  outline: `${box} border border-ink/25 text-ink hover:border-ink`,
  light: `${box} bg-white text-ink hover:bg-paper`,
  "outline-light": `${box} border border-white/25 text-white hover:border-white`,
  link: "h-11 text-ink",
  "link-light": "h-11 text-white",
};

/** Arrow that slides out and back in on hover — the "forward motion" of the brand. */
function Arrow({ variant }: { variant: Variant }) {
  const onDarkFill = variant === "solid";
  return (
    <span aria-hidden="true" className="relative flex h-4 w-5 items-center overflow-hidden">
      <svg
        viewBox="0 0 20 16"
        className="absolute inset-0 transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-full"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M0 8h18M12 2l6 6-6 6" />
      </svg>
      <svg
        viewBox="0 0 20 16"
        className={cn(
          "absolute inset-0 -translate-x-full transition-transform duration-500 ease-[var(--ease-premium)] group-hover:translate-x-0",
          onDarkFill ? "text-violet-300" : "text-violet-600",
          (variant === "outline-light" || variant === "link-light") && "text-violet-300",
        )}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M0 8h18M12 2l6 6-6 6" />
      </svg>
    </span>
  );
}

function Inner({ children, variant, arrow }: { children: ReactNode; variant: Variant; arrow: boolean }) {
  const isLink = variant === "link" || variant === "link-light";
  return (
    <>
      <span className="relative">
        {children}
        {isLink && (
          <span
            aria-hidden="true"
            className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-100 bg-current opacity-30 transition-transform duration-500 group-hover:scale-x-0"
          />
        )}
      </span>
      {arrow && <Arrow variant={variant} />}
    </>
  );
}

type Common = { variant?: Variant; arrow?: boolean; className?: string; children: ReactNode };

export function ButtonLink({
  variant = "solid",
  arrow = true,
  className,
  children,
  ...props
}: Common & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link className={cn(base, variants[variant], className)} {...props}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </Link>
  );
}

export function Button({
  variant = "solid",
  arrow = true,
  className,
  children,
  ...props
}: Common & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={cn(base, variants[variant], className)} {...props}>
      <Inner variant={variant} arrow={arrow}>
        {children}
      </Inner>
    </button>
  );
}
