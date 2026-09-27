import { pageMetadata } from "@/lib/seo";
import { photos } from "@/data/images";
import { LegalPage } from "@/components/legal/LegalPage";

export const metadata = pageMetadata({
  title: "Image Credits | EasyWebSolns",
  description: "Credits for the photography used on the EasyWebSolns website.",
  path: "/credits",
});

export default function CreditsPage() {
  const list = Object.values(photos);
  return (
    <LegalPage title="Image credits" updated="September 2026">
      <section>
        <p>
          Photography on this website is used under the{" "}
          <a href="https://unsplash.com/license" className="font-medium text-violet-700 underline underline-offset-2" target="_blank" rel="noopener noreferrer">
            Unsplash License
          </a>
          . Attribution isn&apos;t required, but we&apos;d like to thank the photographers whose work appears here.
        </p>
      </section>
      <section>
        <ul className="!list-none !pl-0">
          {list.map((p) => (
            <li key={p.url} className="flex flex-col justify-between gap-1 border-b border-line py-3 sm:flex-row">
              <span className="text-ink">{p.alt}</span>
              <a href={p.url} target="_blank" rel="noopener noreferrer" className="shrink-0 text-grey underline-offset-2 hover:text-violet-700 hover:underline">
                {p.credit} / Unsplash
              </a>
            </li>
          ))}
        </ul>
      </section>
    </LegalPage>
  );
}
