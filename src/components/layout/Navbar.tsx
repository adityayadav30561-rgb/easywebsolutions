"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav } from "@/config/site";
import { cn } from "@/lib/cn";
import { isActive } from "@/lib/nav";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color,backdrop-filter] duration-500 ease-[var(--ease-premium)]",
        "border-b",
        open
          ? "border-transparent bg-white"
          : scrolled
            ? "border-line bg-white/80 shadow-[0_8px_30px_-18px_rgb(16_21_34/0.25)] backdrop-blur-xl backdrop-saturate-150"
            : "border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "container-site flex items-center justify-between gap-6 transition-[height] duration-500 ease-[var(--ease-premium)]",
          scrolled ? "h-16" : "h-[4.5rem] lg:h-20",
        )}
      >
        <Logo priority height={28} className="relative z-10" />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-lg px-3.5 py-2 text-[0.9rem] font-medium transition-colors duration-300",
                      active ? "text-ink" : "text-slate hover:text-ink",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-3.5 -bottom-px h-px origin-left bg-gradient-to-r from-violet-600 to-violet-300 transition-transform duration-500 ease-[var(--ease-premium)]",
                        active ? "scale-x-100" : "scale-x-0",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/contact" arrow className="max-sm:hidden" size="md">
            Get a Quote
          </ButtonLink>
          <button
            type="button"
            className="relative z-10 -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-xl text-ink transition-colors hover:bg-violet-50 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="relative block h-3.5 w-5">
              <span
                className={cn(
                  "absolute left-0 block h-[1.5px] w-5 rounded-full bg-current transition-transform duration-300 ease-[var(--ease-premium)]",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-[1.5px] rounded-full bg-current transition-all duration-300 ease-[var(--ease-premium)]",
                  open ? "top-1.5 w-5 -rotate-45" : "top-3 w-3.5",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <MobileMenu open={open} onClose={() => setOpen(false)} pathname={pathname} />
    </header>
  );
}
