"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav } from "@/config/site";
import { cn } from "@/lib/cn";
import { isActive } from "@/lib/nav";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

/**
 * The navigation is a floating object. At the top of a light page it dissolves
 * into the page; once scrolled — or whenever it sits over a dark section or
 * photography — it becomes a frosted white bar so the logo is always legible.
 */
export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const check = () => {
      frame = 0;
      setScrolled(window.scrollY > 24);
      // Sample across the bar: if any part sits over a dark section or photograph, float.
      const w = window.innerWidth;
      const hit = [0.15, 0.5, 0.85].some((f) =>
        document
          .elementsFromPoint(w * f, 44)
          .some((el) => !el.closest("header") && el.closest("[data-theme='dark']")),
      );
      setOverDark(hit);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(check);
    };
    // Defer the first check so it doesn't add layout work to hydration.
    const idle = window.setTimeout(onScroll, 200);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
      window.clearTimeout(idle);
    };
  }, [pathname]);

  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const floating = scrolled || overDark || open;

  return (
    <header className="enter fixed inset-x-0 top-0 z-50" style={{ ["--d" as string]: "100ms" }}>
      <div
        className={cn(
          "mx-auto transition-[max-width,margin,padding] duration-700 ease-[var(--ease-premium)]",
          floating ? "mt-2 max-w-[1400px] px-2 sm:mt-3 sm:px-4" : "mt-0 max-w-[1440px] px-0",
        )}
      >
        <div
          className={cn(
            "flex items-center justify-between gap-6 border transition-[background-color,border-color,box-shadow,height,border-radius,padding] duration-700 ease-[var(--ease-premium)]",
            floating
              ? "h-16 rounded-[12px] border-line bg-white/95 pr-2 pl-4 shadow-[0_18px_40px_-24px_rgb(11_13_20/0.45)] backdrop-blur-xl backdrop-saturate-150 sm:pl-5"
              : "h-20 rounded-none border-transparent bg-transparent px-5 sm:px-8 lg:h-24 lg:px-12",
          )}
        >
          <Logo priority height={floating ? 38 : 46} className="-my-1" />

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "group relative flex h-11 items-center gap-2 px-3.5 text-[0.8125rem] font-medium transition-colors duration-300 xl:px-4",
                        active ? "text-ink" : "text-grey hover:text-ink",
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "size-1.5 rounded-full bg-violet transition-transform duration-500 ease-[var(--ease-premium)]",
                          active ? "scale-100" : "scale-0 group-hover:scale-75",
                        )}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/contact"
              className="group label hidden h-12 items-center gap-3 rounded-[8px] bg-ink px-5 !text-[0.6875rem] !tracking-[0.16em] text-white transition-colors duration-500 hover:bg-night sm:flex"
            >
              Get a Quote
              <svg aria-hidden="true" viewBox="0 0 20 16" className="h-3 w-4 text-violet-300 transition-transform duration-500 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M0 8h18M12 2l6 6-6 6" />
              </svg>
            </Link>
            <button
              type="button"
              className="relative inline-flex h-12 w-12 items-center justify-center rounded-[8px] text-ink transition-colors hover:bg-paper lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden="true" className="relative block h-3 w-6">
                <span className={cn("absolute left-0 block h-[1.5px] w-6 bg-current transition-transform duration-500 ease-[var(--ease-premium)]", open ? "top-[5px] rotate-45" : "top-0")} />
                <span className={cn("absolute right-0 block h-[1.5px] bg-current transition-all duration-500 ease-[var(--ease-premium)]", open ? "top-[5px] w-6 -rotate-45" : "top-[10px] w-4")} />
              </span>
            </button>
          </div>
        </div>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </header>
  );
}
