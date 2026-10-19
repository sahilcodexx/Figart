import { Eyebrow } from "./shared";

const steps = [
  {
    title: "Find the layout.",
    description:
      "Start with frames, place your content, and give each part of the interface its space.",
  },
  {
    title: "Work through the details.",
    description:
      "Adjust the type, refine a path, and bring repeated elements together with components.",
  },
  {
    title: "Take it off the canvas.",
    description:
      "Export an SVG or PNG, or download an editable file to return to later.",
  },
];

export function CanvasIntroSection() {
  return (
    <section
      id="from-idea-to-interface"
      aria-labelledby="canvas-intro-title"
      className="scroll-mt-28 border-b border-[#e6e8e4] pt-24 pb-20 md:pt-[124px] md:pb-24"
    >
      <Eyebrow>From idea to interface</Eyebrow>
      <div className="grid items-end gap-6 lg:grid-cols-2 lg:gap-16">
        <h2
          id="canvas-intro-title"
          className="text-[34px] leading-[1.08] font-normal tracking-[-0.25px] text-balance md:text-[40px]"
        >
          Start with a frame.
          <br />
          Make it your own.
        </h2>
        <p className="max-w-[500px] text-[20px] leading-[1.45] tracking-[-0.2px] text-pretty text-[#777777]">
          Lay out an interface, explore a visual direction, or draw something
          from scratch. Figart brings the tools together in your browser.
        </p>
      </div>
      <ol className="mt-12 grid gap-8 md:mt-16 md:grid-cols-3 md:gap-10">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t border-[#e6e8e4] pt-5">
            <span className="text-[13px] text-[#898989]">0{index + 1}</span>
            <h3 className="mt-5 text-[22px] leading-[1.2] font-normal tracking-[-0.25px]">
              {step.title}
            </h3>
            <p className="mt-3 max-w-[340px] text-[16px] leading-[1.5] text-pretty text-[#777777]">
              {step.description}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
