import { ChevronRight, Layers, Send, Users } from "lucide-react";
import Link from "next/link";
import { LandingButton } from "./shared";
import { EditorPreview } from "./product-preview";

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="grid gap-10 pt-8 lg:pt-15 pb-20 md:gap-12 md:pb-24 lg:grid-cols-[0.81fr_1fr] lg:gap-12 lg:pb-[110px] "
    >
      <div className="flex flex-col items-start pt-5 lg:min-h-[640px] lg:pt-14">
        <Link
          href="/editor/demo"
          className="inline-flex items-center gap-2 rounded-lg border border-[#e7e9e5] px-2 py-1.5 text-xs text-[#797979] transition-colors hover:bg-[#f1f5f7]"
        >
          <span className="rounded bg-[#f0f1ef] px-1.5 py-0.5 text-[10px] text-[#666666]">
            NEW
          </span>{" "}
          Your browser. Your design studio. <ChevronRight className="size-3" />
        </Link>
        <h1
          id="hero-title"
          className="mt-6 max-w-[580px] text-[40px] leading-[1] font-normal tracking-[-0.45px] sm:text-[48px] lg:text-[clamp(42px,3.75vw,54px)] lg:leading-[1]"
        >
          One Design Platform
          <br />
          for Every Big Idea.
        </h1>
        <p className="mt-6 max-w-[560px] text-[17px] leading-[1.45] tracking-[-0.1px] text-[#777777] lg:text-[20px]">
          Create interfaces, vector artwork, and design systems with an open
          canvas, familiar tools, and a workspace built for your ideas.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LandingButton href="/editor/demo">Explore the editor</LandingButton>
          <LandingButton href="/dashboard" secondary arrow={false}>
            Start for free
          </LandingButton>
        </div>
        <div className="mt-10 w-full border-t border-[#ececea] pt-5">
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-3 sm:gap-x-5">
            <li className="w-full text-[11px] font-medium tracking-[0.14em] text-[#8a8a8a] uppercase sm:w-auto">
              Built for
            </li>
            <li
              aria-hidden="true"
              className="hidden h-5 w-px bg-[#e4e7e0] sm:block"
            />
            <li className="flex items-center gap-1.5 text-[13px] font-semibold tracking-[-0.1px] text-[#3d3d3d] sm:text-[14px]">
              <Layers className="size-4 text-[#737373]" />
              Designers
            </li>
            <li className="flex items-center gap-1.5 text-[13px] font-semibold tracking-[-0.1px] text-[#3d3d3d] sm:text-[14px]">
              <Send className="size-4 text-[#737373]" />
              Makers
            </li>
            <li className="flex items-center gap-1.5 text-[13px] font-semibold tracking-[-0.1px] text-[#3d3d3d] sm:text-[14px]">
              <Users className="size-4 text-[#737373]" />
              Teams
            </li>
          </ul>
        </div>
      </div>
      <Link
        href="/editor/demo"
        aria-label="Explore the Figart editor demo"
        className="group relative block h-[380px] overflow-hidden rounded-[12px] bg-[#b5e7f8] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#147bd0] sm:h-[480px] lg:h-[640px]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff45_1px,transparent_1px),linear-gradient(to_bottom,#ffffff45_1px,transparent_1px)] bg-size-[36px_36px]"
        />
        <div className="absolute inset-0 bg-linear-to-br from-transparent via-transparent to-white/35" />
        <EditorPreview className="absolute top-10 left-8 origin-top-left scale-[0.78] sm:top-14 sm:left-12 sm:scale-100 lg:top-[60px] lg:left-[58px] lg:h-[640px] [&>div:nth-child(2)]:h-[592px]" />
      </Link>
    </section>
  );
}
