import { cn } from "@/lib/cn";

/**
 * Living colour field behind the glass. Pure CSS radial gradients drifting
 * on the compositor — no blur filters, so it stays cheap to animate.
 */
export function Aurora({ className, intensity = 1, still }: { className?: string; intensity?: number; /** No drift (for the always-on page background) */ still?: boolean }) {
  const a = still ? "" : "aurora-a";
  const b = still ? "" : "aurora-b";
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} style={{ opacity: intensity }}>
      <div className={`${a} absolute -top-[30%] -left-[20%] h-[90%] w-[75%] rounded-full bg-[radial-gradient(closest-side,rgb(138_109_188/0.55),transparent)]`} />
      <div className={`${b} absolute -top-[10%] right-[-25%] h-[85%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(108_124_255/0.42),transparent)]`} />
      <div className={`${b} absolute bottom-[-35%] left-[10%] h-[80%] w-[70%] rounded-full bg-[radial-gradient(closest-side,rgb(255_158_199/0.38),transparent)]`} />
      <div className={`${a} absolute right-[5%] bottom-[-20%] h-[60%] w-[50%] rounded-full bg-[radial-gradient(closest-side,rgb(124_200_255/0.4),transparent)]`} />
    </div>
  );
}
