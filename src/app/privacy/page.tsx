import { pageMetadata } from "@/lib/seo";
import { site } from "@/config/site";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = pageMetadata({
  title: "Privacy Policy | EasyWebSolns",
  description: "How EasyWebSolns collects, uses and protects personal information submitted through this website.",
  path: "/privacy",
});

/* Template policy — have it reviewed for your jurisdiction before launch. */
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="September 2026">
      <section>
        <h2>Who we are</h2>
        <p>
          This website is operated by {site.name} ({site.domain}). This policy explains what personal information we
          collect through this website and how we use it.
        </p>
      </section>
      <section>
        <h2>Information we collect</h2>
        <p>When you submit an enquiry, we collect the details you choose to provide, which may include:</p>
        <ul>
          <li>Your name and business name</li>
          <li>Your email address and phone number</li>
          <li>Your website address</li>
          <li>Information about your project, budget and requirements</li>
        </ul>
        <p>
          If you contact us by email, phone or WhatsApp, we receive the information you share through that channel.
        </p>
      </section>
      <section>
        <h2>How we use your information</h2>
        <p>
          We use your information to respond to your enquiry, prepare quotes, deliver the services you request and
          communicate with you about your project. We do not sell your personal information.
        </p>
      </section>
      <section>
        <h2>Analytics and cookies</h2>
        <p>
          We may use privacy-respecting analytics to understand how visitors use this website. Where analytics or
          cookies require your consent, we will ask for it before they are used.
        </p>
      </section>
      <section>
        <h2>Sharing</h2>
        <p>
          We use trusted service providers (for example, hosting and email delivery) to operate this website and
          handle enquiries. They process information only on our behalf and for these purposes.
        </p>
      </section>
      <section>
        <h2>Retention</h2>
        <p>
          We keep enquiry information only for as long as needed to respond, provide our services and meet any legal
          obligations.
        </p>
      </section>
      <section>
        <h2>Your rights</h2>
        <p>
          You can ask us to access, correct or delete the personal information we hold about you. Contact us at{" "}
          <a href={`mailto:${site.contact.email}`} className="font-medium text-violet-700 underline underline-offset-2">
            {site.contact.email}
          </a>
          .
        </p>
      </section>
      <section>
        <h2>Changes to this policy</h2>
        <p>We may update this policy from time to time. The latest version will always be available on this page.</p>
      </section>
    </LegalPage>
  );
}
