import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: { absolute: "Page not found | EasyWebSolns" },
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden pt-32 pb-24">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgb(139_92_246/0.12),transparent_70%)]"
      />
      <div className="container-site text-center">
        <p className="font-display text-[7rem] leading-none font-semibold tracking-tighter text-transparent [-webkit-text-stroke:1.5px_rgb(124_58_237/0.4)] sm:text-[10rem]">
          404
        </p>
        <h1 className="mt-6 text-3xl font-semibold sm:text-4xl">This page doesn&apos;t exist.</h1>
        <p className="mx-auto mt-4 max-w-md text-slate">
          The page you&apos;re looking for may have moved. Let&apos;s get you back on track.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" arrow>
            Back to Home
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            Contact Us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
