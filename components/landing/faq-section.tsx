import { Plus, X } from "lucide-react";
import { Eyebrow, LandingButton } from "./shared";

const faqs = [
  {
    question: "What is Figart?",
    answer:
      "Figart is a browser-based design workspace for interfaces, vector artwork, and visual ideas. It brings an open canvas, layers, drawing tools, and reusable design elements together in one place.",
  },
  {
    question: "Can I use Figart if I am a complete beginner?",
    answer:
      "Yes. Open the demo to explore an editable starter design, or create a blank file in your workspace. Familiar tools for frames, shapes, and text make it easy to get started.",
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No installation is needed. Open Figart in your browser and start designing. A desktop or laptop with a mouse or trackpad gives you the best editing experience.",
  },
  {
    question: "Can I start designing without an account?",
    answer:
      "Yes. The demo and local workspace work without signing in. Local files stay in this browser, so download an editable backup before switching devices or clearing browser data.",
  },
  {
    question: "Where are my designs saved?",
    answer:
      "When you are signed in, account files save to the database automatically as you work. Figart also keeps browser backups for recovery. Files created in local mode are saved only in that browser.",
  },
  {
    question: "Which formats can I export?",
    answer:
      "You can export designs as SVG or PNG, and download an editable Figart JSON file. Native Figma .fig import is not supported yet.",
  },
];

export function FaqSection() {
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="grid scroll-mt-28 gap-10 pt-24 md:grid-cols-[0.63fr_1fr] md:gap-20 md:pt-[124px]"
    >
      <div>
        <Eyebrow>FAQ</Eyebrow>
        <h2
          id="faq-title"
          className="text-[34px] leading-[1.08] font-normal tracking-[-0.25px] md:text-[40px]"
        >
          Frequently Asked
          <br />
          questions
        </h2>
        <p className="mt-5 max-w-[460px] text-[20px] leading-[1.4] tracking-[-0.2px] text-[#777777]">
          Find your starting point and learn how to make the most of Figart.
        </p>
        <LandingButton
          href="/about"
          className="mt-4 h-10 px-3 text-sm"
          arrow={false}
        >
          Meet the maker
        </LandingButton>
      </div>
      <div className="self-start rounded-[13px] border border-[#efefed] bg-white px-8 py-1.5">
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            name="landing-faq"
            open={index === 0}
            className="group border-b border-[#e6e8e3] last:border-0"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-5 py-6 text-[18px] leading-snug text-[#555555] outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#147bd0] [&::-webkit-details-marker]:hidden">
              {faq.question}
              <Plus className="size-3.5 shrink-0 text-[#808080] group-open:hidden" />
              <X className="hidden size-3.5 shrink-0 text-[#808080] group-open:block" />
            </summary>
            <p className="max-w-[650px] pb-6 text-[16px] leading-[1.5] text-[#808080]">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
