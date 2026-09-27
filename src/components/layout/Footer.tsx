import Link from "next/link";
import type { ReactNode } from "react";
import { footerServices, legalNav, mainNav, site, whatsappHref } from "@/config/site";
import { Logo } from "./Logo";

const link = "inline-flex min-h-9 items-center text-[0.9375rem] text-ink-700 transition-colors duration-300 hover:text-violet-700";

function Column({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="label mb-5 text-grey">{title}</h2>
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-paper">
      <div className="container-site pt-24 sm:pt-32">
        {/* Final visual statement */}
        <p className="display max-w-[15ch] text-[2.6rem] text-ink sm:text-[4.5rem] lg:text-[6.5rem]" data-reveal="">
          Good websites don&apos;t just look good.{" "}
          <span className="relative inline-block text-grey">
            They do something.
            <span aria-hidden="true" className="signal absolute -bottom-1 left-0 h-[3px] w-full sm:h-1" data-reveal="rule" />
          </span>
        </p>

        <div className="mt-24 grid gap-14 border-t border-line pt-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo height={32} />
            <p className="label mt-6 text-ink">Websites that work for you.</p>
            <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed text-grey">
              Design, development, optimization and ongoing care for businesses that take their website seriously.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            <Column title="Navigation">
              {mainNav.map((i) => (
                <li key={i.href}>
                  <Link href={i.href} className={link}>
                    {i.label}
                  </Link>
                </li>
              ))}
            </Column>
            <Column title="Services">
              {footerServices.map((i) => (
                <li key={i.label}>
                  <Link href={i.href} className={link}>
                    {i.label}
                  </Link>
                </li>
              ))}
            </Column>
            <Column title="Contact">
              <li>
                <a href={`mailto:${site.contact.email}`} className={link}>
                  Email
                </a>
              </li>
              <li>
                <a href={`tel:${site.contact.phoneHref}`} className={link}>
                  Phone
                </a>
              </li>
              <li>
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={link}>
                  WhatsApp
                </a>
              </li>
            </Column>
            <Column title="Social">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                    {s.label}
                  </a>
                </li>
              ))}
            </Column>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line py-8 text-sm text-grey sm:flex-row sm:items-center sm:justify-between">
          <p>© {site.copyrightYear} EasyWebSolns. All rights reserved.</p>
          <ul className="flex gap-6">
            {legalNav.map((i) => (
              <li key={i.href}>
                <Link href={i.href} className="inline-flex min-h-11 items-center hover:text-ink">
                  {i.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/credits" className="inline-flex min-h-11 items-center hover:text-ink">
                Image credits
              </Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Oversized wordmark-scale domain as a closing texture (type, not the logo) */}
      <p
        aria-hidden="true"
        data-text="easywebsolns"
        className="display pointer-events-none -mb-[0.18em] px-2 text-center text-[11vw] leading-none text-ink/[0.05] select-none after:content-[attr(data-text)]"
      />
    </footer>
  );
}
