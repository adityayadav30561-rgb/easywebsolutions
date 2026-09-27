"use client";

import Link from "next/link";
import { useEffect, useRef, type CSSProperties } from "react";
import { mainNav, site, whatsappHref } from "@/config/site";
import { cn } from "@/lib/cn";
import { isActive } from "@/lib/nav";

export function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const toggle = document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]');
        const items = [...(toggle ? [toggle] : []), ...panelRef.current.querySelectorAll<HTMLElement>("a[href]")];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("a")?.focus(), 80);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onMq = () => mq.matches && onClose();
    mq.addEventListener("change", onMq);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      role="dialog"
      aria-modal={open || undefined}
      aria-label="Menu"
      hidden={!open}
      data-theme="dark"
      className={cn(
        "fixed inset-0 -z-10 h-dvh overflow-y-auto bg-night text-white lg:hidden",
        open && "motion-safe:animate-[menu-in_700ms_var(--ease-cinema)_both]",
      )}
    >
      <div aria-hidden="true" className="absolute top-0 right-0 h-px w-2/3 signal" />
      <div className="container-site flex min-h-full flex-col pt-28 pb-8">
        <p className="label text-white/40">Menu</p>
        <nav aria-label="Mobile" className="mt-6">
          <ul>
            {mainNav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-line-dark">
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="group flex min-h-16 items-baseline gap-4 py-3"
                  >
                    <span className="label w-8 text-white/35">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={cn(
                        "display text-[2.6rem] leading-none motion-safe:animate-[enter_900ms_var(--ease-premium)_both]",
                        active ? "text-violet-300" : "text-white",
                      )}
                      style={{ animationDelay: `${150 + i * 50}ms` } as CSSProperties}
                    >
                      {item.label}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-auto pt-12">
          <Link
            href="/contact"
            onClick={onClose}
            className="label flex h-16 w-full items-center justify-between rounded-[8px] bg-white px-6 !text-[0.75rem] text-ink"
          >
            Get a Quote
            <svg aria-hidden="true" viewBox="0 0 20 16" className="h-4 w-5 text-violet-600" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M0 8h18M12 2l6 6-6 6" />
            </svg>
          </Link>
          <div className="mt-6 grid grid-cols-3 border-t border-line-dark pt-4 text-center">
            <a href={`mailto:${site.contact.email}`} className="label flex min-h-12 items-center justify-center text-white/60 hover:text-white">
              Email
            </a>
            <a href={`tel:${site.contact.phoneHref}`} className="label flex min-h-12 items-center justify-center text-white/60 hover:text-white">
              Call
            </a>
            <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className="label flex min-h-12 items-center justify-center text-white/60 hover:text-white">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
