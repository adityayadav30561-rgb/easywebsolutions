import { cn } from "@/lib/cn";

export function Check({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={cn("size-4 shrink-0", className)}>
      <path d="M3.5 8.4l2.9 2.9 6.1-6.6" />
    </svg>
  );
}
