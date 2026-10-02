import type { Metadata } from "next";
import { ButtonLink } from "@/components/site/Button";
import { Em } from "@/components/blocks/SectionHead";

export const metadata: Metadata = {
  title: { absolute: "Page not found | EasyWebSolns" },
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="pt-44 pb-28">
      <div className="wrap flex flex-col items-center text-center">
        <div className="glass px-8 py-16 sm:px-20 sm:py-24 [--radius:2.75rem]">
          <h1 className="t-display text-[clamp(3.4rem,10vw,8rem)]">
            Lost the <Em>thread.</Em>
          </h1>
          <p className="t-lead mx-auto mt-6 max-w-md">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/">Back to home</ButtonLink>
            <ButtonLink href="/contact" variant="glass">
              Contact us
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
