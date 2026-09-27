import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "light" | "outline-light" | "text";
type Size = "md" | "lg";

const base =
  "group relative inline-flex shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl font-medium whitespace-nowrap " +
  "transition-[background-color,border-color,color,box-shadow,scale] duration-300 ease-[var(--ease-premium)] " +
  "focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-violet-600 active:scale-[0.985] " +
  "disabled:pointer-events-none disabled:opacity-60";

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-[0.9375rem]",
  lg: "h-12 px-6 text-[0.9375rem] sm:h-[3.25rem] sm:px-7",
};

const variants: Record<Variant, string> = {
  primary:
    "bg-ink text-white shadow-[0_1px_2px_rgb(16_21_34/0.2),inset_0_1px_0_rgb(255_255_255/0.08)] hover:shadow-[0_10px_30px_-10px_rgb(124_58_237/0.55)]",
  secondary: "border border-line-strong bg-white/70 text-ink backdrop-blur hover:border-violet/40 hover:bg-violet-50",
  light: "bg-white text-ink hover:bg-violet-50 shadow-[0_1px_2px_rgb(0_0_0/0.2)]",
  "outline-light": "border border-white/20 text-white hover:border-white/40 hover:bg-white/[0.06]",
  text: "h-auto px-0 text-ink hover:text-violet-600 rounded-md",
};

type Common = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

function Inner({ children, arrow, variant }: { children: ReactNode; arrow?: boolean; variant: Variant }) {
  return (
    <>
      {variant === "primary" && (
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(110deg,#1e1640_0%,#6d28d9_55%,#8b5cf6_100%)] opacity-0 transition-opacity duration-500 ease-[var(--ease-premium)] group-hover:opacity-100"
        />
      )}
      <span className="relative">{children}</span>
      {arrow && (
        <Icon
          name="arrow-right"
          size={17}
          className="relative -mr-0.5 transition-transform duration-300 ease-[var(--ease-premium)] group-hover:translate-x-[5px]"
        />
      )}
    </>
  );
}

type ButtonLinkProps = Common & Omit<ComponentProps<typeof Link>, "className" | "children">;

export function ButtonLink({ variant = "primary", size = "md", arrow, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cn(base, variant !== "text" && sizes[size], variants[variant], className)} {...props}>
      <Inner arrow={arrow} variant={variant}>
        {children}
      </Inner>
    </Link>
  );
}

type ButtonProps = Common & Omit<ComponentProps<"button">, "className" | "children">;

export function Button({ variant = "primary", size = "md", arrow, className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(base, variant !== "text" && sizes[size], variants[variant], className)} {...props}>
      <Inner arrow={arrow} variant={variant}>
        {children}
      </Inner>
    </button>
  );
}

/** External / protocol links (mailto:, tel:, wa.me) styled as buttons. */
export function ButtonAnchor({
  variant = "primary",
  size = "md",
  arrow,
  className,
  children,
  ...props
}: Common & Omit<ComponentProps<"a">, "className" | "children">) {
  return (
    <a className={cn(base, variant !== "text" && sizes[size], variants[variant], className)} {...props}>
      <Inner arrow={arrow} variant={variant}>
        {children}
      </Inner>
    </a>
  );
}
