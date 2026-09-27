import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = pageMetadata({
  title: "Terms & Conditions | EasyWebSolns",
  description: "Terms and conditions for using the EasyWebSolns website and engaging our website design and care services.",
  path: "/terms",
});

/* Template terms — have them reviewed for your jurisdiction before launch. */
export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="September 2026">
      <section>
        <h2>About these terms</h2>
        <p>
          These terms apply to your use of {site.domain}. Specific project work is governed by the written proposal
          or agreement we provide before the project begins, which takes precedence over these terms.
        </p>
      </section>
      <section>
        <h2>Pricing and quotes</h2>
        <p>
          Prices shown on this website apply to the scope described in each package. Prices marked with “+” vary with
          project requirements. Your final price and scope are confirmed in writing before work starts. Domain names,
          hosting and third-party services are not included unless stated.
        </p>
      </section>
      <section>
        <h2>Care plans</h2>
        <p>
          Care plans are billed monthly. Included update time applies to minor changes to existing content. The
          details of your plan, including cancellation terms, are set out in your care plan agreement.
        </p>
      </section>
      <section>
        <h2>Content and materials</h2>
        <p>
          You are responsible for ensuring that the content, images and materials you provide are accurate and that
          you have the right to use them.
        </p>
      </section>
      <section>
        <h2>Website content</h2>
        <p>
          The content of this website is provided for general information. Portfolio items marked as concepts are
          design concepts and do not represent specific clients.
        </p>
      </section>
      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms? Email{" "}
          <a href={`mailto:${site.contact.email}`} className="font-medium text-violet-700 underline underline-offset-2">
            {site.contact.email}
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
