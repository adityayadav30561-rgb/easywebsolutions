import Link from "next/link";
import { footerServices, legalNav, mainNav, site, whatsappHref } from "@/config/site";
import { Logo } from "@/components/layout/Logo";

const linkClass = "text-[0.95rem] text-ink-2 transition-colors duration-300 hover:text-violet-600";

export function Footer() {
  return (
    <footer className="relative overflow-hidden pt-10 pb-8">
      <div className="wrap">
        <div className="glass p-8 sm:p-12 [--radius:2.25rem]">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <Logo height={36} />
              <p className="mt-6 max-w-sm text-mute">Design, development, optimization and ongoing care for businesses that take their website seriously.</p>
              <a href={`mailto:${site.contact.email}`} className="mt-8 inline-block text-[1.4rem] font-semibold tracking-[-0.03em] text-ink hover:text-violet-600 sm:text-[1.75rem]">
                {site.contact.email}
              </a>
            </div>
            <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
              <div>
                <h2 className="text-sm font-semibold text-ink">Explore</h2>
                <ul className="mt-4 space-y-2.5">
                  {mainNav.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-ink">Services</h2>
                <ul className="mt-4 space-y-2.5">
                  {footerServices.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className={linkClass}>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-sm font-semibold text-ink">Connect</h2>
                <ul className="mt-4 space-y-2.5">
                  <li>
                    <a href={`tel:${site.contact.phoneHref}`} className={linkClass}>
                      Call us
                    </a>
                  </li>
                  <li>
                    <a href={whatsappHref()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      WhatsApp
                    </a>
                  </li>
                  {site.social.map((s) => (
                    <li key={s.label}>
                      <a href={s.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                        {s.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
          <div className="mt-14 flex flex-col gap-4 border-t border-hairline pt-6 text-sm text-mute sm:flex-row sm:items-center sm:justify-between">
            <p>© {site.copyrightYear} EasyWebSolns. All rights reserved.</p>
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {legalNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-ink">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/credits" className="hover:text-ink">
                  Image credits
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p aria-hidden="true" className="t-display pointer-events-none mt-6 text-center text-[17vw] leading-[0.8] text-ink/[0.045] select-none">
        easywebsolns
      </p>
    </footer>
  );
}
