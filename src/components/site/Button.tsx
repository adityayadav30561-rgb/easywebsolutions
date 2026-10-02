import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "ink" | "glass" | "light" | "glass-dark";

const variants: Record<Variant, string> = {
  ink: "btn-ink",
  light: "btn-light",
  glass: "btn-glass glass glass-thin [--radius:999px]",
  "glass-dark": "glass glass-dark glass-thin text-white [--radius:999px]",
};

export function Arrow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cn("size-4 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:translate-x-0.5", className)}>
      <path d="M3 8h9.5M8.5 4l4 4-4 4" />
    </svg>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "ink",
  arrow = true,
  size,
  className,
  ...rest
}: { href: string; children: ReactNode; variant?: Variant; arrow?: boolean; size?: "sm"; className?: string } & Omit<ComponentProps<typeof Link>, "href" | "className">) {
  return (
    <Link href={href} className={cn("btn group", variants[variant], size === "sm" && "btn-sm", className)} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({ children, variant = "ink", className, ...rest }: { children: ReactNode; variant?: Variant } & ComponentProps<"button">) {
  return (
    <button className={cn("btn group disabled:pointer-events-none disabled:opacity-60", variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}
