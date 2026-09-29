import { Photo } from "@/components/ui/Photo";
import { DisplayLines, Label } from "@/components/ui/Type";
import { ButtonLink } from "@/components/ui/Button";

export function AboutSplit() {
  return (
    <section aria-labelledby="about-heading" className="bg-paper">
      <div className="grid lg:grid-cols-2">
        <div className="relative aspect-[4/5] lg:aspect-auto lg:min-h-[52rem]">
          <Photo name="aboutCollaboration" alt="" sizes="(min-width: 1024px) 50vw, 100vw" reveal parallax={0.08} />
          <p className="label absolute bottom-6 left-6 rounded-[4px] bg-night/60 px-2 py-1 text-white">Fig. 03 — Collaboration</p>
        </div>
        <div className="flex flex-col justify-center px-5 py-24 sm:px-12 lg:px-16 xl:px-24">
          <Label index="08">About</Label>
          <DisplayLines
            id="about-heading"
            className="mt-8 text-[2.8rem] text-ink sm:text-[4.25rem] lg:text-[3.6rem] xl:text-[4.4rem]"
            lines={["We make the web", "work harder", "for businesses."]}
          />
          <div className="mt-10 max-w-lg space-y-5 text-[1.0625rem] leading-relaxed text-ink-700" data-reveal="">
            <p>
              EasyWebSolns is a web design and development studio for businesses that have outgrown a basic website — or
              never had a good one to begin with.
            </p>
            <p className="text-grey">
              We care about the parts most people never notice: the spacing, the loading speed, the wording on a
              button. Those details are what make a website feel trustworthy, and trust is what makes people get in
              touch.
            </p>
          </div>
          <div className="mt-10" data-reveal="">
            <ButtonLink href="/about" variant="link">
              More About Us
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
