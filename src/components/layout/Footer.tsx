import Link from "next/link";
import { footerServices, legalNav, mainNav, site, whatsappHref } from "@/config/site";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Logo } from "./Logo";

const linkClass =
  "inline-flex min-h-9 items-center text-[0.9375rem] text-slate transition-colors duration-300 hover:text-ink";

function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 font-sans text-xs font-semibold tracking-[0.16em] text-ink uppercase">{title}</h2>
      <ul className="space-y-1">{children}</ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-paper">
      <div className="container-site pt-16 pb-10 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo height={30} />
            <p className="mt-5 max-w-xs font-display text-xl leading-snug font-medium tracking-tight text-ink">
              Websites that work for you.
            </p>
            <p className="mt-3 max-w-xs text-[0.9375rem] leading-relaxed text-slate">
              Design, development, optimization and ongoing care for growing businesses.
            </p>
            <ul className="mt-6 flex gap-2" aria-label="Social media">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.name} on ${s.label}`}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-white text-slate transition-all duration-300 hover:-translate-y-0.5 hover:border-violet/30 hover:text-violet-600"
                  >
                    <Icon name={s.icon as IconName} size={19} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 lg:col-span-8">
            <Column title="Navigation">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </Column>
            <Column title="Services">
              {footerServices.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={linkClass}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </Column>
            <Column title="Contact">
              <li>
                <a href={`mailto:${site.contact.email}`} className={linkClass}>
                  Email
                </a>
              </li>
              <li>
                <a href={`tel:${site.contact.phoneHref}`} className={linkClass}>
                  Phone
                </a>
              </li>
              <li>
                <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp
                </a>
              </li>
            </Column>
            <Column title="Social">
              {site.social.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    {s.label}
                  </a>
                </li>
              ))}
            </Column>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-8 text-sm text-slate sm:flex-row sm:items-center sm:justify-between">
          <p>© {site.copyrightYear} EasyWebSolns. All rights reserved.</p>
          <ul className="flex gap-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
