import { valueStrip } from "@/data/services";
import { Icon } from "@/components/ui/Icon";

export function ValueStrip() {
  return (
    <section aria-labelledby="value-heading" className="border-y border-line bg-white">
      <div className="container-site grid items-center gap-8 py-10 lg:grid-cols-12 lg:py-12">
        <h2
          id="value-heading"
          className="max-w-sm font-display text-lg leading-snug font-medium tracking-tight text-ink lg:col-span-4"
          data-reveal=""
        >
          Built for businesses that want more from their website.
        </h2>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 lg:col-span-8">
          {valueStrip.map((item, i) => (
            <li
              key={item.label}
              className="flex items-center gap-3 text-[0.9375rem] font-medium text-ink-800"
              data-reveal=""
              style={{ ["--reveal-delay" as string]: `${i * 70}ms` }}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-mist text-violet-600">
                <Icon name={item.icon} size={19} />
              </span>
              {item.label}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
