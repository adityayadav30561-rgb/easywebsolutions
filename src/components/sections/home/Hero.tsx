import { ButtonLink } from "@/components/ui/Button";
import { HeroVisual } from "@/components/visuals/HeroVisual";

const disciplines = ["Web design", "Development", "Optimization", "Ongoing Care"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 lg:pt-40 lg:pb-24" aria-labelledby="hero-heading">
      {/* Background: soft drifting light, fine grid and grain */}
      <div aria-hidden="true" className="noise absolute inset-0 -z-10 bg-[linear-gradient(180deg,#ffffff_0%,#faf9fe_60%,#ffffff_100%)]">
        <div className="fine-grid absolute inset-0 [mask-image:radial-gradient(ellipse_70%_60%_at_60%_30%,#000_20%,transparent_75%)]" />
        <div className="absolute -top-[20%] right-[-10%] h-[70vmax] w-[70vmax] animate-drift rounded-full bg-[radial-gradient(circle,rgb(139_92_246/0.14),transparent_60%)]" />
        <div className="absolute top-[30%] -left-[20%] h-[50vmax] w-[50vmax] animate-drift rounded-full bg-[radial-gradient(circle,rgb(167_139_250/0.1),transparent_60%)] [animation-delay:-11s]" />
      </div>

      <div className="container-site grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-6 xl:col-span-7">
          <p
            className="hero-in inline-flex items-center gap-2.5 rounded-full border border-line bg-white/70 py-1.5 pr-4 pl-2 text-[0.8125rem] font-medium text-ink-700 shadow-[var(--shadow-card)] backdrop-blur"
            style={{ ["--hero-delay" as string]: "0ms" }}
          >
            <span className="relative flex size-5 items-center justify-center rounded-full bg-violet-50">
              <span className="size-1.5 rounded-full bg-violet-600" />
            </span>
            Websites that work for you
          </p>

          <h1
            id="hero-heading"
            className="hero-in mt-7 text-[2.6rem] leading-[1.04] font-semibold tracking-[-0.035em] text-ink min-[400px]:text-[2.9rem] sm:text-[3.75rem] lg:text-[3.6rem] xl:text-[4.25rem]"
            style={{ ["--hero-delay" as string]: "80ms" }}
          >
            Your Website Should <br className="hidden xl:block" />
            <span className="text-gradient">Work For Your Business.</span>
          </h1>

          <p
            className="hero-in mt-7 max-w-[34rem] text-[1.0625rem] leading-relaxed text-slate sm:text-lg"
            style={{ ["--hero-delay" as string]: "160ms" }}
          >
            We design fast, modern websites that build trust, generate enquiries and help businesses grow online.
          </p>

          <div
            className="hero-in mt-10 flex flex-col gap-3 min-[480px]:flex-row"
            style={{ ["--hero-delay" as string]: "240ms" }}
          >
            <ButtonLink href="/contact" size="lg" arrow>
              Build My Website
            </ButtonLink>
            <ButtonLink href="/work" size="lg" variant="secondary">
              Explore Our Work
            </ButtonLink>
          </div>

          <ul
            className="hero-in mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.8125rem] font-medium text-slate"
            style={{ ["--hero-delay" as string]: "320ms" }}
            aria-label="What we do"
          >
            {disciplines.map((d, i) => (
              <li key={d} className="flex items-center gap-3">
                {i > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-violet-300" />}
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="hero-in lg:col-span-6 xl:col-span-5 xl:-mr-10" style={{ ["--hero-delay" as string]: "200ms" }}>
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
