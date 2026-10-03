"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useEffect, useState } from "react";
import { mainNav } from "@/config/site";
import { isActive } from "@/lib/nav";
import { cn } from "@/lib/cn";
import { Logo } from "@/components/layout/Logo";
import { ButtonLink } from "./Button";

const links = mainNav.filter((l) => l.href !== "/" && l.href !== "/contact");
const spring = { type: "spring", stiffness: 420, damping: 36, mass: 0.7 } as const;

/** Floating liquid-glass navigation bar that condenses as you scroll. */
export function Nav() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [compact, setCompact] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState<string | null>(null);

  useMotionValueEvent(scrollY, "change", (y) => setCompact(y > 40));
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  const highlighted = hover ?? links.find((l) => isActive(pathname, l.href))?.href ?? null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <nav
        aria-label="Main"
        className={cn(
          "glass glass-live glass-thin mx-auto flex items-center justify-between gap-4 [--radius:999px]",
          compact ? "h-14 max-w-[54rem] pr-1.5 pl-5" : "h-16 max-w-[70rem] pr-2 pl-6",
        )}
        style={{ transition: "max-width .7s var(--ease-premium), height .7s var(--ease-premium), padding .7s var(--ease-premium)" }}
      >
        <Logo height={compact ? 26 : 30} priority />

        <ul className="hidden items-center md:flex" onMouseLeave={() => setHover(null)}>
          {links.map((l) => {
            const active = isActive(pathname, l.href);
            return (
              <li key={l.href} className="relative">
                <Link
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  onMouseEnter={() => setHover(l.href)}
                  className={cn("relative z-10 block rounded-full px-4 py-2 text-[0.9rem] font-medium tracking-[-0.01em] transition-colors duration-300", active ? "text-ink" : "text-ink-2 hover:text-ink")}
                >
                  {l.label}
                </Link>
                {highlighted === l.href && (
                  <motion.span
                    layoutId="nav-pill"
                    transition={spring}
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-white/70 shadow-[inset_0_1px_0_rgb(255_255_255),0_4px_14px_-6px_rgb(40_26_90/0.35)]"
                  />
                )}
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ButtonLink href="/contact" size="sm" arrow={false} className="hidden sm:inline-flex">
            Start a project
          </ButtonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative grid size-11 place-items-center rounded-full md:hidden"
          >
            <span className={cn("absolute h-[1.5px] w-5 rounded bg-ink transition-transform duration-500 ease-[var(--ease-premium)]", open ? "rotate-45" : "-translate-y-[4px]")} />
            <span className={cn("absolute h-[1.5px] w-5 rounded bg-ink transition-transform duration-500 ease-[var(--ease-premium)]", open ? "-rotate-45" : "translate-y-[4px]")} />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="glass glass-live mx-auto mt-3 max-w-[70rem] origin-top p-3 [--radius:2rem] md:hidden"
          >
            <ul>
              {mainNav.map((l, i) => (
                <motion.li key={l.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(pathname, l.href) ? "page" : undefined}
                    className="flex min-h-14 items-center justify-between rounded-2xl px-4 text-[1.6rem] font-semibold tracking-[-0.03em] text-ink aria-[current=page]:bg-white/60"
                  >
                    {l.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <ButtonLink href="/contact" onClick={() => setOpen(false)} className="mt-3 w-full">
              Start a project
            </ButtonLink>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
