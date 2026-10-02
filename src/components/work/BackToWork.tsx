import Link from "next/link";

export function BackToWork() {
  return (
    <Link href="/work" className="glass glass-thin group inline-flex min-h-10 items-center gap-2 px-4 text-sm font-medium text-ink-2 hover:text-ink [--radius:999px]">
      <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 transition-transform duration-500 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 8H3.5M7.5 4l-4 4 4 4" />
      </svg>
      All work
    </Link>
  );
}
