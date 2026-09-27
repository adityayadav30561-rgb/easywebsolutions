import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: { absolute: "Page not found | EasyWebSolns" },
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="bg-paper pt-40 pb-28">
      <div className="container-site">
        <p className="label text-grey">Error 404</p>
        <h1 className="display mt-8 text-[4rem] text-ink sm:text-[8rem] xl:text-[11rem]">
          Lost the
          <br />
          <span className="text-[#868c97]">thread.</span>
        </h1>
        <p className="mt-10 max-w-md text-lg text-ink-700">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-10 flex flex-col gap-4 min-[480px]:flex-row min-[480px]:items-center min-[480px]:gap-8">
          <ButtonLink href="/">Back to Home</ButtonLink>
          <ButtonLink href="/contact" variant="link">
            Contact Us
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
