import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { site, whatsappHref } from "@/config/site";
import { ContactForm, ContactFormWithParams } from "@/components/contact/ContactForm";
import { PageIntro } from "@/components/blocks/PageIntro";
import { Em } from "@/components/blocks/SectionHead";
import { GlassPhoto } from "@/components/blocks/GlassPhoto";
import { Glass } from "@/components/glass/Glass";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow } from "@/components/site/Button";

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

const next = ["We review your enquiry", "We reply to talk through your goals", "You receive a clear, written quote"];

export default function ContactPage() {
  return (
    <>
      <PageIntro lines={["Let's", <Em key="t">talk.</Em>]} lead="Tell us what you're building, what isn't working, or what you'd like to improve." />

      <section aria-label="Contact form and details" className="pb-24 sm:pb-32">
        <div className="wrap grid gap-5 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Glass className="p-6 sm:p-10 [--radius:2.4rem]">
              <h2 className="t-title text-[2.2rem] text-ink">Start a project</h2>
              <div className="mt-8">
                <Suspense fallback={<ContactForm />}>
                  <ContactFormWithParams />
                </Suspense>
              </div>
            </Glass>
          </Reveal>

          <div className="space-y-5 lg:col-span-5">
            <Reveal delay={0.1}>
              <Glass className="p-3 [--radius:2.25rem]">
                <ul>
                  {channels.map((c) => (
                    <li key={c.label}>
                      <a
                        href={c.href}
                        {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex items-center justify-between gap-4 rounded-[1.6rem] px-5 py-5 transition-colors duration-300 hover:bg-white/60"
                      >
                        <span className="min-w-0">
                          <span className="block text-sm text-mute">{c.label}</span>
                          <span className="block truncate text-[1.2rem] font-semibold tracking-[-0.02em] text-ink">{c.value}</span>
                        </span>
                        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-ink text-white">
                          <Arrow />
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </Glass>
            </Reveal>
            <Reveal delay={0.15}>
              <Glass className="p-7 sm:p-8 [--radius:2.25rem]">
                <h2 className="t-head text-[1.5rem] text-ink">What happens next</h2>
                <ol className="mt-5 space-y-4">
                  {next.map((n, i) => (
                    <li key={n} className="flex items-center gap-4 text-ink-2">
                      <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/70 text-sm font-semibold text-ink shadow-[inset_0_1px_0_#fff]">{i + 1}</span>
                      {n}
                    </li>
                  ))}
                </ol>
              </Glass>
            </Reveal>
            <Reveal delay={0.2}>
              <GlassPhoto name="contactConversation" sizes="(min-width: 1024px) 30rem, 90vw" className="aspect-[4/3]" />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
