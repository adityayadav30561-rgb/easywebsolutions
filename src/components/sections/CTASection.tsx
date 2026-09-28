import type { ReactNode } from "react";
import type { PhotoKey } from "@/data/images";
import { Photo } from "@/components/ui/Photo";
import { DisplayLines, Label } from "@/components/ui/Type";
import { ButtonLink } from "@/components/ui/Button";

type Props = {
  lines: ReactNode[];
  description?: string;
  primary: { label: string; href: string };
  secondary?: { label: string; href: string };
  eyebrow?: string;
  photo?: PhotoKey;
};

/** Immersive closing section: architectural photograph, violet light, huge type. */
export function CTASection({ lines, description, primary, secondary, eyebrow = "Start a project", photo = "ctaBuildingsNight" }: Props) {
  return (
    <section aria-labelledby="cta-heading" data-theme="dark" className="grain relative isolate overflow-hidden bg-night text-white">
      <div className="absolute inset-0 -z-10">
        <Photo name={photo} alt="" sizes="100vw" treatment="violet" parallax={0.1} />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-night via-night/75 to-night/20" />
        <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_50%_60%_at_85%_30%,rgb(138_109_188/0.35),transparent_70%)]" />
      </div>
      <div className="container-site relative z-[2] flex min-h-[88svh] flex-col justify-between py-24 sm:py-32">
        <Label tone="dark">{eyebrow}</Label>
        <div>
          <DisplayLines id="cta-heading" className="text-[3.4rem] text-white sm:text-[6.5rem] xl:text-[9.5rem]" lines={lines} />
          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
            {description && (
              <p className="max-w-md text-lg leading-relaxed text-white/70 lg:col-span-5" data-reveal="">
                {description}
              </p>
            )}
            <div className="flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-center min-[480px]:gap-8 lg:col-span-7 lg:justify-end" data-reveal="">
              <ButtonLink href={primary.href} variant="light">
                {primary.label}
              </ButtonLink>
              {secondary && (
                <ButtonLink href={secondary.href} variant="link-light">
                  {secondary.label}
                </ButtonLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
