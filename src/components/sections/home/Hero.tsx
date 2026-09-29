import type { CSSProperties } from "react";
import Image from "next/image";
import { photos } from "@/data/images";
import { ButtonLink } from "@/components/ui/Button";
import { Photo } from "@/components/ui/Photo";
import { BrowserFrame, Line } from "@/components/visuals/BrowserFrame";

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

/** The site shown in the hero window: a real website layout with real photography. */
function HeroSite() {
  return (
    <div className="bg-white p-[3.2cqw]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[1cqw]">
          <span className="size-[2.4cqw] rounded-full bg-ink" />
          <Line w="8cqw" c="#121621" h={1} />
        </div>
        <div className="flex items-center gap-[2.4cqw] text-[1.35cqw] font-medium text-[#556072]">
          <span>Services</span>
          <span>Work</span>
          <span>About</span>
          <span className="rounded-[0.6cqw] bg-ink px-[1.8cqw] py-[0.9cqw] text-white">Enquire</span>
        </div>
      </div>
      <div className="mt-[4.5cqw] grid grid-cols-[1.05fr_1fr] gap-[3.2cqw]">
        <div className="flex flex-col justify-between">
          <div>
            <p className="text-[1.15cqw] font-semibold tracking-[0.2em] text-[#6f55a3] uppercase">Business consulting</p>
            <p className="mt-[1.6cqw] font-display text-[5.4cqw] leading-[0.95] font-semibold tracking-[-0.04em] text-ink uppercase">
              Advice,
              <br />
              made
              <br />
              simple.
            </p>
          </div>
          <div>
            <p className="max-w-[90%] text-[1.35cqw] leading-[1.55] text-[#556072]">
              Practical support for growing businesses, from first plan to steady growth.
            </p>
            <div className="mt-[2.4cqw] flex items-center gap-[1.6cqw]">
              <span className="rounded-[0.6cqw] bg-ink px-[2cqw] py-[1.1cqw] text-[1.2cqw] font-semibold tracking-[0.1em] text-white uppercase">
                View projects →
              </span>
              <span className="text-[1.2cqw] font-semibold tracking-[0.1em] text-ink uppercase underline decoration-[#b797cd] underline-offset-[0.6cqw]">
                Book a call
              </span>
            </div>
          </div>
        </div>
        <div className="relative aspect-[4/4.2] overflow-hidden">
          <Image
            src={photos.careSupport.src}
            alt=""
            fill
            sizes="(min-width: 1024px) 22vw, 40vw"
            className="object-cover"
            placeholder="blur"
          />
        </div>
      </div>
      <div className="mt-[3.2cqw] grid grid-cols-3 border-t border-[#e5e7eb] pt-[2.2cqw]">
        {["Planning", "Bookings", "Support"].map((s, i) => (
          <div key={s} className={i ? "border-l border-[#e5e7eb] pl-[2cqw]" : ""}>
            <p className="text-[1.05cqw] text-[#6b7280]">0{i + 1}</p>
            <p className="mt-[0.4cqw] text-[1.45cqw] font-semibold text-ink">{s}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Second, darker window — cropped behind the first. */
function HeroSiteDark() {
  return (
    <div className="bg-[#141824] p-[3.2cqw]">
      <p className="text-[1.15cqw] font-semibold tracking-[0.2em] text-[#b797cd] uppercase">Selected services</p>
      {["Consulting", "Strategy", "Delivery", "Support"].map((s, i) => (
        <div key={s} className="flex items-baseline justify-between border-b border-white/10 py-[1.6cqw]">
          <span className="font-display text-[3.2cqw] font-semibold tracking-[-0.03em] text-white uppercase">{s}</span>
          <span className="text-[1.1cqw] text-white/70">0{i + 1}</span>
        </div>
      ))}
    </div>
  );
}

/** Layered browser windows + designer annotation. */
function Composition() {
  return (
    <div aria-hidden="true" className="@container relative">
      <div className="absolute -top-[10%] -right-[16%] w-[70%] opacity-90" data-parallax="-0.05">
        <div className="settle" style={d(650)}>
          <BrowserFrame dark url="services.example">
            <HeroSiteDark />
          </BrowserFrame>
        </div>
      </div>
      <div className="relative" data-parallax="0.03">
        <div className="settle" style={d(450)}>
          <BrowserFrame url="yourbusiness.com">
            <HeroSite />
          </BrowserFrame>
        </div>
      </div>
      <div className="enter absolute -bottom-[7%] -left-[4%] hidden items-center gap-3 rounded-[6px] border border-white/40 bg-white/75 px-3 py-2 backdrop-blur-md sm:flex" style={d(1400)}>
        <span className="size-1.5 rounded-full bg-violet" />
        <span className="label !text-[0.625rem] text-ink">12-col grid · 1440 · Sora / Inter</span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section aria-labelledby="hero-heading" className="relative isolate flex flex-col overflow-hidden bg-paper pb-24 lg:block lg:pb-0">
      {/* Photographic field — full-height on desktop, a framed panel on mobile */}
      <div data-theme="dark" className="relative order-2 aspect-[4/5] w-full sm:aspect-[16/11] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[46%]">
        <div className="settle absolute inset-0" style={d(0)}>
          <Photo
            name="heroDesignStudio"
            alt=""
            sizes="(min-width: 1024px) 46vw, 100vw"
           
            priority
            parallax={0.06}
            position="50% 35%"
          />
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_100%,rgb(138_109_188/0.3),transparent_70%)]" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-night/60 via-transparent to-transparent" />
        </div>
        {/* Signal line on the photo's edge */}
        <span aria-hidden="true" className="signal draw absolute top-0 bottom-0 left-0 hidden w-[3px] lg:block" style={{ ...d(900), transformOrigin: "top" }} />
        <p className="label enter absolute top-5 right-5 rounded-[4px] bg-night/60 px-2 py-1 text-white sm:right-8 lg:top-auto lg:bottom-8" style={d(1200)}>
          Fig. 01 — Design
        </p>
        {/* Mobile/tablet composition sits over the lower edge of the photograph */}
        <div className="pointer-events-none absolute -bottom-16 left-4 z-10 w-[88%] sm:left-8 sm:w-[70%] lg:hidden">
          <Composition />
        </div>
      </div>

      <div className="container-site relative order-1 lg:min-h-[100svh]">
        {/* Typography */}
        <div className="relative z-10 pt-32 pb-14 sm:pt-40 lg:max-w-[52%] lg:pt-44 lg:pb-24 xl:pt-48">
          <div className="enter flex items-center gap-4" style={d(200)}>
            <span aria-hidden="true" className="h-px w-10 bg-ink" />
            <p className="label leading-relaxed text-ink">
              EasyWebSolns
              <br />
              <span className="text-grey">Digital experiences</span>
            </p>
          </div>

          <h1 id="hero-heading" className="display mt-10 text-[clamp(3.4rem,13vw,5.5rem)] text-ink sm:text-[6.5rem] lg:text-[clamp(4.5rem,7.2vw,8.25rem)]">
            <span className="ln enter-line" style={{ "--i": 0, "--d": "250ms" } as CSSProperties}>
              <span>Websites</span>
            </span>
            <span className="ln enter-line" style={{ "--i": 1, "--d": "250ms" } as CSSProperties}>
              <span>
                That{" "}
                <span className="relative inline-block">
                  Work
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 400 24"
                    preserveAspectRatio="none"
                    className="draw absolute -bottom-[0.02em] left-0 h-[0.14em] w-[108%] text-violet"
                    style={d(1100)}
                  >
                    <path d="M0 12h384" stroke="currentColor" strokeWidth="6" />
                    <path d="M372 2l16 10-16 10" fill="none" stroke="currentColor" strokeWidth="5" />
                  </svg>
                </span>
              </span>
            </span>
            <span className="ln enter-line" style={{ "--i": 2, "--d": "250ms" } as CSSProperties}>
              <span>For you.</span>
            </span>
          </h1>

          <div className="mt-12 grid gap-10 sm:grid-cols-[minmax(0,22rem)_auto] sm:items-end lg:mt-14 lg:grid-cols-1 xl:grid-cols-[minmax(0,22rem)_auto]">
            <p className="enter text-[1.0625rem] leading-relaxed text-ink-700" style={d(700)}>
              We design and build modern websites that make businesses easier to trust, easier to understand and easier
              to choose.
            </p>
            <div className="enter flex flex-col gap-3 min-[480px]:flex-row min-[480px]:items-center min-[480px]:gap-8" style={d(820)}>
              <ButtonLink href="/contact" variant="solid">
                Start a Project
              </ButtonLink>
              <ButtonLink href="/work" variant="link">
                View Our Work
              </ButtonLink>
            </div>
          </div>
        </div>

        {/* Browser composition — overlaps the photograph on desktop */}
        <div className="pointer-events-none absolute top-[22%] left-[46%] z-10 hidden w-[44%] lg:block xl:w-[40%]">
          <Composition />
        </div>
      </div>

      {/* Bottom rail */}
      <div className="container-site relative z-10 hidden lg:block">
        <div className="enter absolute bottom-8 left-12 flex items-center gap-6" style={d(1300)}>
          <span className="label text-grey">Scroll</span>
          <span aria-hidden="true" className="relative h-px w-16 overflow-hidden bg-line-strong">
            <span className="signal absolute inset-y-0 left-0 w-1/2 motion-safe:animate-[scroll-cue_2.4s_var(--ease-cinema)_infinite]" />
          </span>
          <span className="label text-grey">Design · Development · Optimization · Care</span>
        </div>
      </div>
    </section>
  );
}
