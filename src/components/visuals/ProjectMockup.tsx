import type { Project } from "@/data/projects";
import { cn } from "@/lib/cn";
import { BrowserFrame, Line } from "./BrowserFrame";

type Theme = Project["mockup"]["theme"];

/** Generic brand mark for concept sites (no invented company names). */
function Mark({ t }: { t: Theme }) {
  return (
    <div className="flex items-center gap-[0.9cqw]">
      <span className="size-[2.2cqw] rounded-full" style={{ background: t.accent }} />
      <Line w="7cqw" c={t.text} h={1} />
    </div>
  );
}

function Nav({ t, cta = true }: { t: Theme; cta?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <Mark t={t} />
      <div className="flex items-center gap-[2cqw]">
        <Line w="4.5cqw" c={t.muted} h={0.7} className="opacity-60" />
        <Line w="4.5cqw" c={t.muted} h={0.7} className="opacity-60" />
        <Line w="4.5cqw" c={t.muted} h={0.7} className="hidden opacity-60 @[380px]:block" />
        {cta && (
          <span className="rounded-[0.7cqw] px-[1.6cqw] py-[0.9cqw]" style={{ background: t.accent }}>
            <Line w="4.5cqw" c={t.bg} h={0.6} />
          </span>
        )}
      </div>
    </div>
  );
}

function Headline({ t, children, className }: { t: Theme; children: string; className?: string }) {
  return (
    <p
      className={cn("font-display leading-[1.06] font-semibold tracking-[-0.03em]", className)}
      style={{ color: t.text }}
    >
      {children}
    </p>
  );
}

function Corporate({ t, headline }: { t: Theme; headline: string }) {
  return (
    <div className="p-[3cqw]" style={{ background: t.bg }}>
      <Nav t={t} />
      <div className="mt-[5cqw] grid grid-cols-[1.1fr_1fr] items-center gap-[4cqw]">
        <div>
          <Line w="12cqw" c={t.accentSoft} h={1.8} />
          <Headline t={t} className="mt-[1.6cqw] text-[4.6cqw]">
            {headline}
          </Headline>
          <div className="mt-[2cqw] space-y-[0.9cqw]">
            <Line w="95%" c={t.surface} h={0.9} />
            <Line w="75%" c={t.surface} h={0.9} />
          </div>
          <div className="mt-[2.6cqw] flex gap-[1.2cqw]">
            <span className="h-[4cqw] w-[13cqw] rounded-[0.8cqw]" style={{ background: t.text }} />
            <span className="h-[4cqw] w-[11cqw] rounded-[0.8cqw] border" style={{ borderColor: t.muted }} />
          </div>
        </div>
        <div
          className="relative aspect-square overflow-hidden rounded-[1.6cqw]"
          style={{ background: `linear-gradient(150deg, ${t.text} 0%, ${t.accent} 70%, #c4b5fd 100%)` }}
        >
          <div className="absolute -right-[15%] -bottom-[15%] size-[75%] rounded-full border-[1.6cqw] border-white/15" />
          <div className="absolute top-[12%] left-[10%] w-[55%] rounded-[1cqw] bg-white/95 p-[1.4cqw] shadow-lg">
            <Line w="50%" c={t.accent} h={0.7} />
            <Line w="90%" c={t.surface} h={0.6} className="mt-[0.8cqw]" />
            <Line w="70%" c={t.surface} h={0.6} className="mt-[0.5cqw]" />
          </div>
        </div>
      </div>
      <div className="mt-[4cqw] grid grid-cols-4 gap-[1.6cqw] border-t pt-[3cqw]" style={{ borderColor: t.surface }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <span className="block size-[2.6cqw] rounded-[0.7cqw]" style={{ background: t.accentSoft }} />
            <Line w="70%" c={t.text} h={0.7} className="mt-[1.2cqw]" />
            <Line w="90%" c={t.surface} h={0.6} className="mt-[0.7cqw]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Local({ t, headline }: { t: Theme; headline: string }) {
  return (
    <div className="p-[3cqw]" style={{ background: t.bg }}>
      <Nav t={t} />
      <div className="mt-[4cqw] rounded-[1.8cqw] p-[3.4cqw]" style={{ background: t.accent }}>
        <div className="grid grid-cols-[1.3fr_1fr] items-end gap-[3cqw]">
          <div>
            <p className="font-display text-[4.2cqw] leading-[1.06] font-semibold tracking-[-0.03em]" style={{ color: t.bg }}>
              {headline}
            </p>
            <div className="mt-[2.4cqw] flex gap-[1.2cqw]">
              <span
                className="flex h-[4.2cqw] items-center rounded-[0.8cqw] px-[1.8cqw] text-[1.4cqw] font-semibold"
                style={{ background: t.bg, color: t.accent }}
              >
                Call now
              </span>
              <span
                className="flex h-[4.2cqw] items-center rounded-[0.8cqw] border px-[1.8cqw] text-[1.4cqw] font-medium"
                style={{ borderColor: "rgb(255 255 255 / 0.4)", color: t.bg }}
              >
                Get a quote
              </span>
            </div>
          </div>
          <div className="rounded-[1.2cqw] p-[1.8cqw]" style={{ background: t.bg }}>
            {["Repairs", "Installations", "Maintenance"].map((s) => (
              <div key={s} className="flex items-center justify-between border-b py-[1cqw] last:border-0" style={{ borderColor: t.surface }}>
                <span className="text-[1.35cqw] font-medium" style={{ color: t.text }}>
                  {s}
                </span>
                <span className="size-[1.4cqw] rounded-full" style={{ background: t.accentSoft }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-[3cqw] grid grid-cols-3 gap-[1.6cqw]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-[1.2cqw] p-[1.8cqw]" style={{ background: t.surface }}>
            <Line w="40%" c={t.accent} h={0.7} />
            <Line w="85%" c={t.muted} h={0.6} className="mt-[1cqw] opacity-50" />
            <Line w="60%" c={t.muted} h={0.6} className="mt-[0.6cqw] opacity-50" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Practice({ t, headline }: { t: Theme; headline: string }) {
  return (
    <div className="p-[3cqw]" style={{ background: t.bg }}>
      <Nav t={t} />
      <div className="mt-[5cqw] grid grid-cols-12 gap-[2cqw]">
        <div className="col-span-7">
          <Line w="10cqw" c={t.accent} h={0.7} />
          <Headline t={t} className="mt-[2cqw] text-[4.8cqw] font-medium">
            {headline}
          </Headline>
        </div>
        <div className="col-span-4 col-start-9 self-end">
          <div className="space-y-[0.9cqw]">
            <Line w="100%" c={t.surface} h={0.8} />
            <Line w="85%" c={t.surface} h={0.8} />
            <Line w="60%" c={t.surface} h={0.8} />
          </div>
          <span className="mt-[2cqw] block h-[4cqw] w-[70%] rounded-[0.8cqw]" style={{ background: t.accent }} />
        </div>
      </div>
      <div className="mt-[4cqw] grid grid-cols-3 gap-[1.6cqw]">
        {[0.9, 0.7, 0.5].map((o, i) => (
          <div key={i}>
            <div
              className="aspect-[4/3] rounded-[1.2cqw]"
              style={{ background: `linear-gradient(160deg, ${t.surface}, ${t.accentSoft})`, opacity: 0.5 + o / 2 }}
            />
            <Line w="60%" c={t.text} h={0.7} className="mt-[1.2cqw]" />
            <Line w="80%" c={t.muted} h={0.55} className="mt-[0.7cqw] opacity-50" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Store({ t, headline }: { t: Theme; headline: string }) {
  const tiles = ["#e9e2d6", "#dcd6ea", "#e5ddd1", "#d9e1dc"];
  return (
    <div className="p-[3cqw]" style={{ background: t.bg }}>
      <Nav t={t} cta={false} />
      <div className="mt-[3.6cqw] grid grid-cols-[1fr_1.2fr] items-center gap-[3cqw] rounded-[1.8cqw] p-[3cqw]" style={{ background: t.surface }}>
        <div>
          <Headline t={t} className="text-[4cqw]">
            {headline}
          </Headline>
          <span
            className="mt-[2.4cqw] inline-flex h-[4cqw] items-center rounded-full px-[2.2cqw] text-[1.35cqw] font-medium"
            style={{ background: t.accent, color: t.bg }}
          >
            Shop the collection
          </span>
        </div>
        <div className="relative aspect-[5/4] rounded-[1.4cqw] bg-[#e7ddcd]">
          <div className="absolute top-1/2 left-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cdbfa8]" />
          <div className="absolute bottom-[14%] left-1/2 h-[10%] w-[36%] -translate-x-1/2 rounded-[50%] bg-black/10 blur-[1cqw]" />
        </div>
      </div>
      <div className="mt-[3cqw] grid grid-cols-4 gap-[1.6cqw]">
        {tiles.map((c, i) => (
          <div key={i}>
            <div className="aspect-[4/5] rounded-[1.2cqw]" style={{ background: c }} />
            <Line w="70%" c={t.text} h={0.65} className="mt-[1.1cqw]" />
            <Line w="30%" c={t.muted} h={0.6} className="mt-[0.7cqw]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Venue({ t, headline }: { t: Theme; headline: string }) {
  return (
    <div className="relative p-[3cqw]" style={{ background: t.bg }}>
      <Nav t={t} />
      <div className="relative mt-[3.6cqw] overflow-hidden rounded-[1.6cqw] p-[4cqw]" style={{ background: `radial-gradient(circle at 75% 30%, #5b3a1e, ${t.surface} 60%)` }}>
        <div className="absolute top-[18%] right-[12%] size-[18cqw] rounded-full bg-[#d8a15b]/25 blur-[3cqw]" />
        <p className="text-[1.2cqw] font-semibold tracking-[0.2em] uppercase" style={{ color: t.accent }}>
          Dinner · Drinks · Events
        </p>
        <p className="relative mt-[1.6cqw] max-w-[70%] font-display text-[4.8cqw] leading-[1.05] font-medium tracking-[-0.02em]" style={{ color: t.text }}>
          {headline}
        </p>
        <div className="relative mt-[2.6cqw] flex gap-[1.2cqw]">
          <span className="flex h-[4cqw] items-center rounded-full px-[2.2cqw] text-[1.35cqw] font-semibold" style={{ background: t.accent, color: t.bg }}>
            Book a table
          </span>
          <span className="flex h-[4cqw] items-center rounded-full border px-[2.2cqw] text-[1.35cqw]" style={{ borderColor: t.muted, color: t.text }}>
            View menu
          </span>
        </div>
      </div>
      <div className="mt-[3cqw] grid grid-cols-3 gap-[1.6cqw]">
        {["Opening hours", "Find us", "Private events"].map((s) => (
          <div key={s} className="rounded-[1.2cqw] border p-[1.8cqw]" style={{ borderColor: t.accentSoft }}>
            <p className="text-[1.3cqw] font-medium" style={{ color: t.text }}>
              {s}
            </p>
            <Line w="70%" c={t.muted} h={0.55} className="mt-[1cqw] opacity-60" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Community({ t, headline }: { t: Theme; headline: string }) {
  return (
    <div className="p-[3cqw]" style={{ background: t.bg }}>
      <Nav t={t} />
      <div className="mx-auto mt-[5cqw] max-w-[78%] text-center">
        <span className="inline-block rounded-full px-[1.6cqw] py-[0.6cqw] text-[1.2cqw] font-semibold" style={{ background: t.accentSoft, color: t.accent }}>
          Get involved
        </span>
        <Headline t={t} className="mt-[1.8cqw] text-[4.6cqw]">
          {headline}
        </Headline>
        <div className="mt-[2.4cqw] flex justify-center gap-[1.2cqw]">
          <span className="h-[4cqw] w-[13cqw] rounded-full" style={{ background: t.accent }} />
          <span className="h-[4cqw] w-[11cqw] rounded-full border" style={{ borderColor: t.muted }} />
        </div>
      </div>
      <div className="mt-[4cqw] grid grid-cols-3 gap-[1.6cqw]">
        {[t.accentSoft, t.surface, t.accentSoft].map((c, i) => (
          <div key={i} className="rounded-[1.6cqw] p-[2cqw]" style={{ background: c }}>
            <span className="block size-[3cqw] rounded-full" style={{ background: i === 1 ? t.accent : "#fff" }} />
            <Line w="60%" c={t.text} h={0.7} className="mt-[1.6cqw]" />
            <Line w="90%" c={t.muted} h={0.55} className="mt-[0.8cqw] opacity-60" />
          </div>
        ))}
      </div>
    </div>
  );
}

const variants = {
  corporate: Corporate,
  local: Local,
  practice: Practice,
  store: Store,
  venue: Venue,
  community: Community,
};

/**
 * Generated website mockup for concept projects: a browser window on a
 * coloured stage. `aspect` controls the stage proportion per placement.
 */
export function ProjectMockup({
  project,
  className,
  wide,
}: {
  project: Project;
  className?: string;
  /** Wider stage: frame the window narrower so it stays in proportion. */
  wide?: boolean;
}) {
  const { variant, headline, theme } = project.mockup;
  const View = variants[variant];
  return (
    <div
      aria-hidden="true"
      className={cn("@container relative h-full w-full overflow-hidden", className)}
      style={{ background: theme.stage }}
    >
      <div
        className={cn(
          "absolute transition-transform duration-700 ease-[var(--ease-premium)] group-hover:-translate-y-[1.5%]",
          wide ? "inset-x-[8%] top-[9%] lg:inset-x-[17%]" : "inset-x-[8%] top-[10%]",
        )}
      >
        <BrowserFrame dark={variant === "venue"} url={`${project.slug.split("-")[0]}.example`}>
          <View t={theme} headline={headline} />
        </BrowserFrame>
      </div>
    </div>
  );
}
