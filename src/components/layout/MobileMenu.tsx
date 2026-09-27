"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { mainNav, site, whatsappHref } from "@/config/site";
import { cn } from "@/lib/cn";
import { isActive } from "@/lib/nav";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      // Keep keyboard focus inside the open menu (and its toggle button).
      if (e.key === "Tab" && panelRef.current) {
        const toggle = document.querySelector<HTMLElement>('[aria-controls="mobile-menu"]');
        const items = [
          ...(toggle ? [toggle] : []),
          ...panelRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
        ];
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
    const t = window.setTimeout(() => panelRef.current?.querySelector<HTMLElement>("a")?.focus(), 60);
    const mq = window.matchMedia("(min-width: 1024px)");
    const onResize = () => mq.matches && onClose();
    mq.addEventListener("change", onResize);

    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onResize);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      aria-label="Mobile navigation"
      role="dialog"
      aria-modal={open || undefined}
      hidden={!open}
      className={cn(
        "fixed inset-x-0 top-0 -z-10 h-dvh overflow-y-auto bg-white lg:hidden",
        open && "animate-[menu-in_450ms_var(--ease-premium)_both]",
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,rgb(139_92_246/0.12),transparent_50%)]"
      />
      <div className="container-site relative flex min-h-full flex-col pt-24 pb-8">
        <nav aria-label="Mobile">
          <ul className="border-t border-line">
            {mainNav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li
                  key={item.href}
                  className="border-b border-line motion-safe:animate-[menu-item_500ms_var(--ease-premium)_both]"
                  style={{ animationDelay: `${80 + i * 45}ms` }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    aria-current={active ? "page" : undefined}
                    className="group flex min-h-16 items-center justify-between py-3 font-display text-[1.75rem] font-semibold tracking-tight text-ink"
                  >
                    <span className={cn(active && "text-gradient")}>{item.label}</span>
                    <Icon
                      name="arrow-right"
                      size={22}
                      className={cn(
                        "transition-transform duration-300 group-hover:translate-x-1",
                        active ? "text-violet-600" : "text-slate-400",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-auto pt-10">
          <ButtonLink href="/contact" arrow size="lg" className="w-full" onClick={onClose}>
            Get a Quote
          </ButtonLink>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-slate">
            <a href={`mailto:${site.contact.email}`} className="inline-flex min-h-11 items-center gap-2 hover:text-ink">
              <Icon name="mail" size={17} /> Email
            </a>
            <a href={`tel:${site.contact.phoneHref}`} className="inline-flex min-h-11 items-center gap-2 hover:text-ink">
              <Icon name="phone" size={17} /> Call
            </a>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 hover:text-ink"
            >
              <Icon name="whatsapp" size={17} /> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
