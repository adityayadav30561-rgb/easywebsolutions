import { Glass } from "@/components/glass/Glass";
import { ScrollWords } from "@/components/motion/ScrollWords";
import { Reveal } from "@/components/motion/Reveal";

const questions = [
  { q: "Is this business credible?", a: "Design, detail and clarity answer before a single word is read." },
  { q: "Is this for me?", a: "Clear structure shows the right visitor they're in the right place." },
  { q: "What do I do next?", a: "An obvious next step turns interest into an enquiry." },
];

export function Statement() {
  return (
    <section aria-label="Why your website matters" className="py-24 sm:py-40">
      <div className="wrap">
        <ScrollWords
          className="t-title max-w-[22ch] text-[clamp(2.1rem,5.2vw,4.6rem)] text-ink"
          text="Your website is often the *first* *sale.* Before anyone calls, visits or enquires, they've already judged your business online. We make that moment *count.*"
        />
        <ul className="mt-20 grid gap-4 md:grid-cols-3">
          {questions.map((x, i) => (
            <Reveal as="li" key={x.q} delay={i * 0.1}>
              <Glass interactive className="h-full p-7 sm:p-8 [--radius:2rem]">
                <h3 className="t-head text-[1.45rem] text-ink">{x.q}</h3>
                <p className="mt-3 text-ink-2">{x.a}</p>
              </Glass>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
