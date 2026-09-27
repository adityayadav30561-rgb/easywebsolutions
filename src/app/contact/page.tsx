import { Suspense, type CSSProperties } from "react";
import { pageMetadata } from "@/lib/seo";
import { site, whatsappHref } from "@/config/site";
import { ContactForm, ContactFormWithParams } from "@/components/contact/ContactForm";
import { Photo } from "@/components/ui/Photo";

export const metadata = pageMetadata({
  title: "Contact EasyWebSolns | Start Your Website Project",
  description:
    "Tell us what you're building, what isn't working, or what you'd like to improve. Start your website project by form, email, phone or WhatsApp.",
  path: "/contact",
});

const channels = [
  { label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}`, external: false },
  { label: "Phone", value: site.contact.phoneDisplay, href: `tel:${site.contact.phoneHref}`, external: false },
  { label: "WhatsApp", value: "Message us", href: whatsappHref(), external: true },
];

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function ContactPage() {
  return (
    <>
      <section className="bg-paper pt-36 pb-24 sm:pt-44 sm:pb-36">
        <div className="container-site">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 className="display text-[5.5rem] text-ink sm:text-[10rem] lg:col-span-8 xl:text-[13rem]">
              <span className="ln enter-line" style={{ "--i": 0, "--d": "150ms" } as CSSProperties}>
                <span>Let&apos;s</span>
              </span>
              <span className="ln enter-line" style={{ "--i": 1, "--d": "150ms" } as CSSProperties}>
                <span>
                  talk<span className="text-violet">.</span>
                </span>
              </span>
            </h1>
            <p className="enter max-w-sm pb-6 text-xl leading-snug text-ink lg:col-span-4" style={d(500)}>
              Tell us what you&apos;re building, what isn&apos;t working, or what you&apos;d like to improve.
            </p>
          </div>
        </div>

        <div className="container-site mt-16 grid gap-0 lg:grid-cols-12">
          {/* Form */}
          <div className="enter border-t border-ink bg-white px-5 py-12 sm:px-10 sm:py-14 lg:col-span-7 lg:px-14" style={d(600)}>
            <div className="flex items-baseline justify-between">
              <h2 className="display text-[2.4rem] text-ink sm:text-[3rem]">Start a project</h2>
              <span className="label hidden text-grey sm:block">Form 01</span>
            </div>
            <div className="mt-10">
              <Suspense fallback={<ContactForm />}>
                <ContactFormWithParams />
              </Suspense>
            </div>
          </div>

          {/* Details */}
          <aside data-theme="dark" className="enter grain relative flex flex-col overflow-hidden bg-night text-white lg:col-span-5" style={d(750)} aria-labelledby="details-heading">
            <div className="relative aspect-[16/10] lg:aspect-[4/3]">
              <Photo name="contactReflection" alt="" sizes="(min-width: 1024px) 40vw, 100vw" treatment="violet" />
              <p className="label absolute bottom-4 left-5 z-[2] rounded-[4px] bg-night/60 px-2 py-1 text-white">Fig. — Reflection</p>
            </div>
            <div className="relative z-[2] flex flex-1 flex-col px-5 py-10 sm:px-10">
              <h2 id="details-heading" className="label text-white/50">
                Contact details
              </h2>
              <ul className="mt-6 border-t border-line-dark">
                {channels.map((c) => (
                  <li key={c.label} className="border-b border-line-dark">
                    <a
                      href={c.href}
                      {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group flex min-h-20 items-center justify-between gap-4 py-4"
                    >
                      <span>
                        <span className="label block text-white/50">{c.label}</span>
                        <span className="mt-1 block font-display text-lg font-semibold tracking-[-0.02em] break-all text-white sm:text-xl">{c.value}</span>
                      </span>
                      <svg aria-hidden="true" viewBox="0 0 20 16" className="h-3 w-4 shrink-0 text-violet-300 transition-transform duration-500 group-hover:translate-x-1.5" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M0 8h18M12 2l6 6-6 6" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-12">
                <p className="label text-white/50">What happens next</p>
                <ol className="mt-5 space-y-3 text-[0.9375rem] text-white/80">
                  {["We review your enquiry", "We reply to talk through your goals", "You receive a clear, written quote"].map((s, i) => (
                    <li key={s} className="flex gap-4">
                      <span className="font-display text-sm text-violet-300">{String(i + 1).padStart(2, "0")}</span>
                      {s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
