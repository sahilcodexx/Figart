import { Box, Monitor, Sparkles } from "lucide-react";
import { Eyebrow, LandingButton } from "./shared";
import { cn } from "@/lib/utils";

const workflows = [
  {
    icon: Monitor,
    title: "For the interface thinkers",
    description:
      "Explore a layout, find the right rhythm, and turn your next product idea into something you can see.",
    label: "Product & UI design",
    detail: "From first frame to final details",
    color: "bg-[#dce9d7] text-[#536c45]",
  },
  {
    icon: Sparkles,
    title: "For the visual explorers",
    description:
      "Try a new direction. Play with color, type, and composition. Give your ideas a little space to surprise you.",
    label: "Brand & visual design",
    detail: "A canvas for your creative direction",
    color: "bg-[#e7def2] text-[#7a6295]",
  },
  {
    icon: Box,
    title: "For the independent makers",
    description:
      "A landing page, a side project, a fresh beginning. Start with a blank canvas and make something your own.",
    label: "Personal projects",
    detail: "Small experiments. Big possibilities.",
    color: "bg-[#f3e3d1] text-[#9d7751]",
  },
];

export function WorkflowsSection() {
  return (
    <section
      id="workflows"
      aria-labelledby="workflows-title"
      className="scroll-mt-28 pt-24 md:pt-[124px]"
    >
      <Eyebrow>Workflows</Eyebrow>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <h2
          id="workflows-title"
          className="text-[34px] leading-[1.08] font-normal tracking-[-0.25px] md:text-[40px]"
        >
          Built for Creative Minds
          <br />
          of Every Kind.
        </h2>
        <div className="flex flex-col items-start gap-4 sm:items-end">
          <p className="text-[16px] text-[#777777]">
            For the things you can’t wait to make.
          </p>
          <LandingButton href="/use-cases" className="h-9 px-3 text-xs">
            View all
          </LandingButton>
        </div>
      </div>
      <div className="mt-9 grid gap-6 md:grid-cols-3 md:gap-10">
        {workflows.map((workflow) => (
          <article
            key={workflow.title}
            className="flex flex-col rounded-[11px] border border-[#e9eae7] bg-[#f2f2f2] px-7 py-8 sm:min-h-[230px] lg:px-8"
          >
            <h3 className="sr-only">{workflow.title}</h3>
            <p className="max-w-[330px] text-[16px] leading-[1.45] text-[#777777]">
              {workflow.description}
            </p>
            <div className="mt-8 flex items-center gap-3 md:mt-auto md:pt-8">
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full",
                  workflow.color,
                )}
              >
                <workflow.icon className="size-3.5" />
              </span>
              <div>
                <p className="text-[11px] text-[#666666]">{workflow.label}</p>
                <p className="mt-1 text-[10px] text-[#898989]">
                  {workflow.detail}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
