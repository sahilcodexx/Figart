"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eyebrow, LandingButton } from "./shared";
import { FeatureArtwork } from "./product-preview";

const features = [
  {
    id: "canvas",
    tab: "Design Canvas",
    title: "Design Canvas",
    description:
      "Go from a rough idea to a considered interface. Bring frames, shapes, text, and vector paths together on one open canvas.",
    bullets: [
      "An infinite canvas with smooth pan and zoom",
      "Editable Bézier paths and drawing tools",
      "Frames, layers, and flexible auto layout",
      "Familiar shortcuts that keep you in flow",
    ],
    action: "Explore the editor",
    href: "/editor/demo",
  },
  {
    id: "components",
    tab: "Design Foundations",
    title: "Design Foundations",
    description:
      "Give your next project a consistent visual language. Build with reusable components, considered color, and typography that fits.",
    bullets: [
      "Create components from your own designs",
      "Add instances from your assets panel",
      "Fine-tune fills, strokes, and typography",
      "Keep related layers organized in frames",
    ],
    action: "Build something new",
    href: "/dashboard",
  },
  {
    id: "files",
    tab: "Personal Workspace",
    title: "Your ideas, in one place",
    description:
      "A workspace that makes it easy to pick up where you left off. Keep your explorations organized and your next project close.",
    bullets: [
      "Save designs to your account",
      "Start locally without signing in",
      "Star, rename, and organize your files",
      "Keep browser backups as you work",
    ],
    action: "Open your workspace",
    href: "/dashboard",
  },
  {
    id: "export",
    tab: "Export & Handoff",
    title: "Ready for what comes next",
    description:
      "Take your work beyond the canvas. Export the assets you need, inspect your design, or keep an editable copy for later.",
    bullets: [
      "Export sharp, scalable SVG artwork",
      "Download PNGs for presentations",
      "Save and import editable design files",
      "Inspect properties right in the editor",
    ],
    action: "Try it for yourself",
    href: "/editor/demo",
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="scroll-mt-28"
    >
      <Eyebrow>Use cases</Eyebrow>
      <h2
        id="features-title"
        className="text-[34px] leading-[1.08] font-normal tracking-[-0.25px] md:text-[40px]"
      >
        One canvas.
        <br />
        Endless possibilities.
      </h2>
      <Tabs
        defaultValue="components"
        className="mt-9 gap-0 rounded-[18px] bg-[#f1f1f1] p-1"
      >
        <TabsList
          aria-label="Explore Figart features"
          className="grid h-auto w-full grid-cols-2 gap-1 rounded-t-[15px] rounded-b-none bg-transparent p-2 md:h-[64px] md:grid-cols-4 md:gap-4 md:px-5"
        >
          {features.map((feature) => (
            <TabsTrigger
              key={feature.id}
              value={feature.id}
              className="h-11 rounded-[8px] border-0 px-2 text-xs font-normal text-[#777777] shadow-none data-[state=active]:bg-[#fdfdfd] data-[state=active]:text-[#555555] data-[state=active]:shadow-none sm:text-sm md:h-12 md:text-[18px] dark:text-[#777777] dark:data-[state=active]:bg-[#fdfdfd] dark:data-[state=active]:text-[#555555]"
            >
              {feature.tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {features.map((feature) => (
          <TabsContent
            key={feature.id}
            value={feature.id}
            className="rounded-[15px] border border-[#e6e8e4] bg-white p-2 shadow-[0_1px_3px_#00000008]"
          >
            <div className="grid lg:grid-cols-[0.86fr_1fr]">
              <div className="flex flex-col px-5 py-8 sm:px-8 lg:px-8 lg:pt-12 lg:pb-7">
                <h3 className="text-[27px] font-normal tracking-[-0.4px]">
                  {feature.title}
                </h3>
                <p className="mt-3 max-w-[480px] text-[18px] leading-[1.35] tracking-[-0.15px] text-[#777777]">
                  {feature.description}
                </p>
                <ul className="mt-3 mb-6 divide-y divide-[#e4e7e0] text-sm leading-[22px] text-[#777777] lg:text-[17px]">
                  {feature.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-2.5 py-3">
                      <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-[#147bd0]" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <LandingButton
                  href={feature.href}
                  className="mt-auto w-full text-[16px]"
                >
                  {feature.action}
                </LandingButton>
              </div>
              <FeatureArtwork kind={feature.id} />
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}
