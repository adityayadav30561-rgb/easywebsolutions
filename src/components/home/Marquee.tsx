const items = ["Custom design", "Responsive layouts", "SEO foundations", "Analytics", "Speed optimisation", "Contact forms", "WhatsApp & click-to-call", "Google Maps", "SSL", "Monthly care", "Backups", "Security monitoring"];

/** An endless, softly faded ribbon of what's included. */
export function Marquee() {
  const row = [...items, ...items];
  return (
    <section aria-label="What we build in" className="relative z-10 -mt-[2svh] py-10">
      <div className="glass glass-thin fade-x mx-3 overflow-hidden py-4 [--radius:999px] sm:mx-auto sm:max-w-[82rem]">
        <ul className="marquee flex w-max gap-3">
          {row.map((t, i) => (
            <li key={i} aria-hidden={i >= items.length || undefined} className="flex items-center gap-3 pr-3 text-[1.05rem] font-medium whitespace-nowrap text-ink-2">
              <span className="size-1.5 rounded-full bg-violet/70" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
