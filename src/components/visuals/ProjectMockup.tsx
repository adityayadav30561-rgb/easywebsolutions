import type { Project } from "@/data/projects";
import { cn } from "@/lib/cn";
import { BrowserFrame, Line } from "./BrowserFrame";

type Theme = Project["mockup"]["theme"];

/** Generic brand mark for concept sites (no invented company names). */
function Mark({ t }: { t: Theme }) {
  return (
    <div className="flex items-center gap-[1.07cqw]">
      <span className="size-[2.62cqw] rounded-full" style={{ background: t.accent }} />
      <Line w="8.33cqw" c={t.text} h={1.19} />
    </div>
  );
}

function Nav({ t, cta = true }: { t: Theme; cta?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <Mark t={t} />
      <div className="flex items-center gap-[2.38cqw]">
        <Line w="5.36cqw" c={t.muted} h={0.83} className="opacity-60" />
        <Line w="5.36cqw" c={t.muted} h={0.83} className="opacity-60" />
        <Line w="5.36cqw" c={t.muted} h={0.83} className="hidden opacity-60 @[380px]:block" />
        {cta && (
          <span className="rounded-[0.83cqw] px-[1.9cqw] py-[1.07cqw]" style={{ background: t.accent }}>
            <Line w="5.36cqw" c={t.bg} h={0.71} />
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
    <div className="p-[3.57cqw]" style={{ background: t.bg }}>
      <Nav t={t} />
      <div className="mt-[5.95cqw] grid grid-cols-[1.1fr_1fr] items-center gap-[4.76cqw]">
        <div>
          <Line w="14.29cqw" c={t.accentSoft} h={2.14} />
          <Headline t={t} className="mt-[1.9cqw] text-[5.48cqw]">
            {headline}
          </Headline>
          <div className="mt-[2.38cqw] space-y-[1.07cqw]">
            <Line w="95%" c={t.surface} h={1.07} />
            <Line w="75%" c={t.surface} h={1.07} />
          </div>
          <div className="mt-[3.1cqw] flex gap-[1.43cqw]">
            <span className="h-[4.76cqw] w-[15.48cqw] rounded-[0.95cqw]" style={{ background: t.text }} />
            <span className="h-[4.76cqw] w-[13.1cqw] rounded-[0.95cqw] border" style={{ borderColor: t.muted }} />
          </div>
        </div>
        <div
          className="relative aspect-square overflow-hidden rounded-[1.9cqw]"
          style={{ background: `linear-gradient(150deg, ${t.text} 0%, ${t.accent} 70%, #b797cd 100%)` }}
        >
          <div className="absolute -right-[15%] -bottom-[15%] size-[75%] rounded-full border-[1.9cqw] border-white/15" />
          <div className="absolute top-[12%] left-[10%] w-[55%] rounded-[1.19cqw] bg-white/95 p-[1.67cqw] shadow-lg">
            <Line w="50%" c={t.accent} h={0.83} />
            <Line w="90%" c={t.surface} h={0.71} className="mt-[0.95cqw]" />
            <Line w="70%" c={t.surface} h={0.71} className="mt-[0.6cqw]" />
          </div>
        </div>
      </div>
      <div className="mt-[4.76cqw] grid grid-cols-4 gap-[1.9cqw] border-t pt-[3.57cqw]" style={{ borderColor: t.surface }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i}>
            <span className="block size-[3.1cqw] rounded-[0.83cqw]" style={{ background: t.accentSoft }} />
            <Line w="70%" c={t.text} h={0.83} className="mt-[1.43cqw]" />
            <Line w="90%" c={t.surface} h={0.71} className="mt-[0.83cqw]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Local({ t, headline }: { t: Theme; headline: string }) {
  return (
    <div className="p-[3.57cqw]" style={{ background: t.bg }}>
      <Nav t={t} />
      <div className="mt-[4.76cqw] rounded-[2.14cqw] p-[4.05cqw]" style={{ background: t.accent }}>
        <div className="grid grid-cols-[1.3fr_1fr] items-end gap-[3.57cqw]">
          <div>
            <p className="font-display text-[5cqw] leading-[1.06] font-semibold tracking-[-0.03em]" style={{ color: t.bg }}>
              {headline}
            </p>
            <div className="mt-[2.86cqw] flex gap-[1.43cqw]">
              <span
                className="flex h-[5cqw] items-center rounded-[0.95cqw] px-[2.14cqw] text-[1.67cqw] font-semibold"
                style={{ background: t.bg, color: t.accent }}
              >
                Call now
              </span>
              <span
                className="flex h-[5cqw] items-center rounded-[0.95cqw] border px-[2.14cqw] text-[1.67cqw] font-medium"
                style={{ borderColor: "rgb(255 255 255 / 0.4)", color: t.bg }}
              >
                Get a quote
              </span>
            </div>
          </div>
          <div className="rounded-[1.43cqw] p-[2.14cqw]" style={{ background: t.bg }}>
            {["Repairs", "Installations", "Maintenance"].map((s) => (
              <div key={s} className="flex items-center justify-between border-b py-[1.19cqw] last:border-0" style={{ borderColor: t.surface }}>
                <span className="text-[1.61cqw] font-medium" style={{ color: t.text }}>
                  {s}
                </span>
                <span className="size-[1.67cqw] rounded-full" style={{ background: t.accentSoft }} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-[3.57cqw] grid grid-cols-3 gap-[1.9cqw]">
        {[0, 1, 2].map((i) => (
          <div key={i} className="rounded-[1.43cqw] p-[2.14cqw]" style={{ background: t.surface }}>
            <Line w="40%" c={t.accent} h={0.83} />
            <Line w="85%" c={t.muted} h={0.71} className="mt-[1.19cqw] opacity-50" />
            <Line w="60%" c={t.muted} h={0.71} className="mt-[0.71cqw] opacity-50" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Practice({ t, headline }: { t: Theme; headline: string }) {
  return (
    <div className="p-[3.57cqw]" style={{ background: t.bg }}>
      <Nav t={t} />
      <div className="mt-[5.95cqw] grid grid-cols-12 gap-[2.38cqw]">
        <div className="col-span-7">
          <Line w="11.9cqw" c={t.accent} h={0.83} />
          <Headline t={t} className="mt-[2.38cqw] text-[5.71cqw] font-medium">
            {headline}
          </Headline>
        </div>
        <div className="col-span-4 col-start-9 self-end">
          <div className="space-y-[1.07cqw]">
            <Line w="100%" c={t.surface} h={0.95} />
            <Line w="85%" c={t.surface} h={0.95} />
            <Line w="60%" c={t.surface} h={0.95} />
          </div>
          <span className="mt-[2.38cqw] block h-[4.76cqw] w-[70%] rounded-[0.95cqw]" style={{ background: t.accent }} />
        </div>
      </div>
      <div className="mt-[4.76cqw] grid grid-cols-3 gap-[1.9cqw]">
        {[0.9, 0.7, 0.5].map((o, i) => (
          <div key={i}>
            <div
              className="aspect-[4/3] rounded-[1.43cqw]"
              style={{ background: `linear-gradient(160deg, ${t.surface}, ${t.accentSoft})`, opacity: 0.5 + o / 2 }}
            />
            <Line w="60%" c={t.text} h={0.83} className="mt-[1.43cqw]" />
            <Line w="80%" c={t.muted} h={0.65} className="mt-[0.83cqw] opacity-50" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Store({ t, headline }: { t: Theme; headline: string }) {
  const tiles = ["#e9e2d6", "#dcd6ea", "#e5ddd1", "#d9e1dc"];
  return (
    <div className="p-[3.57cqw]" style={{ background: t.bg }}>
      <Nav t={t} cta={false} />
      <div className="mt-[4.29cqw] grid grid-cols-[1fr_1.2fr] items-center gap-[3.57cqw] rounded-[2.14cqw] p-[3.57cqw]" style={{ background: t.surface }}>
        <div>
          <Headline t={t} className="text-[4.76cqw]">
            {headline}
          </Headline>
          <span
            className="mt-[2.86cqw] inline-flex h-[4.76cqw] items-center rounded-full px-[2.62cqw] text-[1.61cqw] font-medium"
            style={{ background: t.accent, color: t.bg }}
          >
            Shop the collection
          </span>
        </div>
        <div className="relative aspect-[5/4] rounded-[1.67cqw] bg-[#e7ddcd]">
          <div className="absolute top-1/2 left-1/2 size-[46%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#cdbfa8]" />
          <div className="absolute bottom-[14%] left-1/2 h-[10%] w-[36%] -translate-x-1/2 rounded-[50%] bg-black/10 blur-[1.19cqw]" />
        </div>
      </div>
      <div className="mt-[3.57cqw] grid grid-cols-4 gap-[1.9cqw]">
        {tiles.map((c, i) => (
          <div key={i}>
            <div className="aspect-[4/5] rounded-[1.43cqw]" style={{ background: c }} />
            <Line w="70%" c={t.text} h={0.77} className="mt-[1.31cqw]" />
            <Line w="30%" c={t.muted} h={0.71} className="mt-[0.83cqw]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Venue({ t, headline }: { t: Theme; headline: string }) {
  return (
    <div className="relative p-[3.57cqw]" style={{ background: t.bg }}>
      <Nav t={t} />
      <div className="relative mt-[4.29cqw] overflow-hidden rounded-[1.9cqw] p-[4.76cqw]" style={{ background: `radial-gradient(circle at 75% 30%, #5b3a1e, ${t.surface} 60%)` }}>
        <div className="absolute top-[18%] right-[12%] size-[21.43cqw] rounded-full bg-[#d8a15b]/25 blur-[3.57cqw]" />
        <p className="text-[1.43cqw] font-semibold tracking-[0.2em] uppercase" style={{ color: t.accent }}>
          Dinner · Drinks · Events
        </p>
        <p className="relative mt-[1.9cqw] max-w-[70%] font-display text-[5.71cqw] leading-[1.05] font-medium tracking-[-0.02em]" style={{ color: t.text }}>
          {headline}
        </p>
        <div className="relative mt-[3.1cqw] flex gap-[1.43cqw]">
          <span className="flex h-[4.76cqw] items-center rounded-full px-[2.62cqw] text-[1.61cqw] font-semibold" style={{ background: t.accent, color: t.bg }}>
            Book a table
          </span>
          <span className="flex h-[4.76cqw] items-center rounded-full border px-[2.62cqw] text-[1.61cqw]" style={{ borderColor: t.muted, color: t.text }}>
            View menu
          </span>
        </div>
      </div>
      <div className="mt-[3.57cqw] grid grid-cols-3 gap-[1.9cqw]">
        {["Opening hours", "Find us", "Private events"].map((s) => (
          <div key={s} className="rounded-[1.43cqw] border p-[2.14cqw]" style={{ borderColor: t.accentSoft }}>
            <p className="text-[1.55cqw] font-medium" style={{ color: t.text }}>
              {s}
            </p>
            <Line w="70%" c={t.muted} h={0.65} className="mt-[1.19cqw] opacity-60" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Community({ t, headline }: { t: Theme; headline: string }) {
  return (
    <div className="p-[3.57cqw]" style={{ background: t.bg }}>
      <Nav t={t} />
      <div className="mx-auto mt-[5.95cqw] max-w-[78%] text-center">
        <span className="inline-block rounded-full px-[1.9cqw] py-[0.71cqw] text-[1.43cqw] font-semibold" style={{ background: t.accentSoft, color: t.accent }}>
          Get involved
        </span>
        <Headline t={t} className="mt-[2.14cqw] text-[5.48cqw]">
          {headline}
        </Headline>
        <div className="mt-[2.86cqw] flex justify-center gap-[1.43cqw]">
          <span className="h-[4.76cqw] w-[15.48cqw] rounded-full" style={{ background: t.accent }} />
          <span className="h-[4.76cqw] w-[13.1cqw] rounded-full border" style={{ borderColor: t.muted }} />
        </div>
      </div>
      <div className="mt-[4.76cqw] grid grid-cols-3 gap-[1.9cqw]">
        {[t.accentSoft, t.surface, t.accentSoft].map((c, i) => (
          <div key={i} className="rounded-[1.9cqw] p-[2.38cqw]" style={{ background: c }}>
            <span className="block size-[3.57cqw] rounded-full" style={{ background: i === 1 ? t.accent : "#fff" }} />
            <Line w="60%" c={t.text} h={0.83} className="mt-[1.9cqw]" />
            <Line w="90%" c={t.muted} h={0.65} className="mt-[0.95cqw] opacity-60" />
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

/** The concept website for a project, drawn inside a browser window (sizes in cqw). */
export function MockupWindow({ project, className }: { project: Project; className?: string }) {
  const { variant, headline, theme } = project.mockup;
  const View = variants[variant];
  return (
    <div className={cn("@container", className)}>
      <BrowserFrame dark={variant === "venue"} url={`${project.slug.split("-")[0]}.example`}>
        <View t={theme} headline={headline} />
      </BrowserFrame>
    </div>
  );
}
