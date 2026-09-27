import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { site, whatsappHref } from "@/config/site";
import { Icon, type IconName } from "@/components/ui/Icon";
import { ContactForm, ContactFormWithParams } from "@/components/contact/ContactForm";

export const metadata = pageMetadata({
  title: "Contact EasyWebSolns | Start Your Website Project",
  description:
    "Tell us about your business and what you need. Get in touch by form, email, phone or WhatsApp to start your website project.",
  path: "/contact",
});

const channels: { label: string; value: string; href: string; icon: IconName; external?: boolean }[] = [
  { label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}`, icon: "mail" },
  { label: "Phone", value: site.contact.phoneDisplay, href: `tel:${site.contact.phoneHref}`, icon: "phone" },
  { label: "WhatsApp", value: "Message us on WhatsApp", href: whatsappHref(), icon: "whatsapp", external: true },
];

function ContactPanel() {
  return (
    <aside className="noise relative isolate overflow-hidden rounded-[24px] bg-ink p-8 text-white sm:p-10" aria-labelledby="idea-heading">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_100%_0%,rgb(139_92_246/0.45),transparent_65%),radial-gradient(ellipse_60%_50%_at_0%_100%,rgb(124_58_237/0.2),transparent_70%)]"
      />
      {/* Brand motif: the open ring and arrow from the "e" mark */}
      <svg aria-hidden="true" viewBox="0 0 200 200" fill="none" className="absolute -right-16 -bottom-16 -z-10 w-72 text-white/[0.06]">
        <path d="M170 100a70 70 0 1 1-19-48" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
        <path d="M34 100h128" stroke="currentColor" strokeWidth="14" strokeLinecap="round" />
        <path d="m136 36 16 16-20 8" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <h2 id="idea-heading" className="text-3xl font-semibold sm:text-4xl">
        Have an idea?
      </h2>
      <p className="mt-4 max-w-sm leading-relaxed text-slate-400">
        Whether you&apos;re starting from scratch or improving an existing website, tell us what you&apos;re working on.
      </p>

      <ul className="mt-10 space-y-3">
        {channels.map((c) => (
          <li key={c.label}>
            <a
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group flex min-h-16 items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 transition-all duration-300 hover:border-white/25 hover:bg-white/[0.08]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-violet-300">
                <Icon name={c.icon} size={19} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase">{c.label}</span>
                <span className="block truncate font-medium text-white">{c.value}</span>
              </span>
              <Icon
                name="arrow-up-right"
                size={18}
                className="shrink-0 text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
              />
            </a>
          </li>
        ))}
      </ul>

      <div className="mt-10 border-t border-white/10 pt-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-slate-400 uppercase">What happens next</p>
        <ol className="mt-4 space-y-3 text-[0.9375rem] text-white/80">
          {["We review your enquiry", "We reply to discuss your goals", "You receive a clear, written quote"].map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-white/15 text-xs font-semibold text-violet-300">
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}

export default function ContactPage() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32">
      <div aria-hidden="true" className="noise absolute inset-x-0 top-0 -z-10 h-[36rem]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_85%_0%,rgb(139_92_246/0.13),transparent_60%),linear-gradient(180deg,#fff,#faf9fe_70%,#fff)]" />
        <div className="fine-grid absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_80%_10%,#000_10%,transparent_70%)]" />
      </div>

      <div className="container-site">
        <div className="max-w-3xl">
          <p className="hero-in eyebrow flex items-center gap-3">
            <span aria-hidden="true" className="h-px w-6 bg-violet-600/50" />
            Contact
          </p>
          <h1
            className="hero-in mt-6 text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-[3.5rem] lg:text-[4.25rem]"
            style={{ ["--hero-delay" as string]: "80ms" }}
          >
            Let&apos;s talk about your website.
          </h1>
          <p
            className="hero-in mt-7 max-w-2xl text-[1.0625rem] leading-relaxed text-slate sm:text-lg"
            style={{ ["--hero-delay" as string]: "160ms" }}
          >
            Tell us about your business, what you&apos;re trying to achieve and what you need help with.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:mt-16 lg:grid-cols-12 lg:gap-8">
          <div className="hero-in card min-w-0 p-6 sm:p-10 lg:col-span-7" style={{ ["--hero-delay" as string]: "220ms" }}>
            <Suspense fallback={<ContactForm />}>
              <ContactFormWithParams />
            </Suspense>
          </div>
          <div className="hero-in lg:col-span-5" style={{ ["--hero-delay" as string]: "300ms" }}>
            <div className="lg:sticky lg:top-28">
              <ContactPanel />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
