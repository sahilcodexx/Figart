import {
  ChevronDown,
  ChevronRight,
  Copy,
  CodeXml,
  Frame,
  Hand,
  Hash,
  ImageIcon,
  Layers,
  MousePointer2,
  PenTool,
  Plus,
  Square,
  Type,
} from "lucide-react";
import { useId } from "react";
import { cn } from "@/lib/utils";
import { StarterPreview } from "./starter-preview";

export function Landscape({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 270" aria-hidden="true" className={className}>
      <image
        href="/demo/forest-cabin.jpg"
        width="300"
        height="270"
        preserveAspectRatio="xMidYMid slice"
      />
    </svg>
  );
}

function MiniToolbar() {
  return (
    <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-4 rounded-lg border border-[#dedfdf] bg-white p-2 text-[#636962] shadow-[0_4px_12px_#0000000c]">
      <span className="rounded-md bg-[#1687d6] p-1.5 text-white">
        <MousePointer2 className="size-3.5" />
      </span>
      {[Hash, Square, PenTool, Type, ImageIcon, Hand].map((Icon, i) => (
        <Icon key={i} className="size-3.5" />
      ))}
    </div>
  );
}

export function EditorPreview({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Figart editor showing the editable Elsewhere stay-booking app with real photography and three distinct screens"
      className={cn(
        "relative h-[680px] w-[940px] overflow-hidden rounded-t-xl border border-[#e2e7ea] bg-white text-[10px] text-[#686e67] shadow-[0_8px_36px_#276e8e12]",
        className,
      )}
    >
      <div className="flex h-12 items-center justify-between border-b border-[#e9ece9] px-4">
        <div className="flex items-center gap-4">
          <span className="text-base font-bold text-[#147bd0]">Fg</span>
          <span className="font-medium text-[#343c33]">
            Elsewhere — Stay experience
          </span>
          <ChevronDown className="size-3" />
          <span className="ml-3 text-[#9ba097]">Drafts</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="size-5 rounded-full bg-[#ece6d9] pt-0.5 text-center text-[9px]">
            S
          </span>
          <span className="rounded-md bg-[#1485d4] px-3 py-1.5 text-white">
            Export
          </span>
        </div>
      </div>
      <div className="flex h-[632px]">
        <div className="w-[158px] shrink-0 border-r border-[#e5e8e3] bg-[#fcfcfb]">
          <div className="flex items-center gap-4 border-b border-[#e8eae5] px-3 py-3">
            <span className="text-[#313b30]">File</span>
            <span>Assets</span>
            <span>Styles</span>
          </div>
          <div className="flex justify-between px-3 py-4 text-[#394136]">
            <span>Pages</span>
            <Plus className="size-3" />
          </div>
          <div className="mx-2 rounded bg-[#ecefea] px-2 py-2 text-[#3d473b]">
            Stay experience
          </div>
          <div className="mt-4 flex justify-between border-t border-[#e8eae5] px-3 py-4">
            <span>Layers</span>
            <Layers className="size-3" />
          </div>
          {[
            "Discover",
            "Wordmark",
            "Editorial headline",
            "Featured stay",
            "Photograph",
            "Stay details",
            "Booking review",
          ].map((name, i) => (
            <div
              key={name}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5",
                i === 0 && "bg-[#e0edfb] text-[#2585cc]",
                i > 0 && i < 5 && "pl-6",
              )}
            >
              <ChevronRight className="size-2.5" />
              {i === 4 ? (
                <ImageIcon className="size-3" />
              ) : (
                <Frame className="size-3" />
              )}
              {name}
            </div>
          ))}
        </div>
        <div className="relative flex flex-1 gap-8 overflow-hidden bg-[#eceee9] px-8 pt-10">
          {[0, 1].map((screen) => (
            <div key={screen} className="w-[235px] shrink-0">
              <p className="mb-3 text-[8px] text-[#8c9388]">
                {screen === 0
                  ? "01 · Discover a slower stay"
                  : "02 · The Willow House"}
              </p>
              <div
                className={cn(
                  "rounded-[16px] shadow-[0_6px_16px_#2532270a]",
                  screen === 0 && "outline outline-[#1687d6]",
                )}
              >
                <StarterPreview screen={screen} />
              </div>
            </div>
          ))}
          <MiniToolbar />
        </div>
        <div className="w-[150px] shrink-0 border-l border-[#e5e8e3] px-3">
          <div className="flex justify-between border-b border-[#e7e9e4] py-3 text-[9px]">
            <span className="font-semibold text-[#36412f]">Design</span>
            <span>Prototype</span>
            <span>60%</span>
          </div>
          <p className="py-4 font-medium text-[#36412f]">Discover</p>
          {[
            { title: "Position", values: ["X 0", "Y 0"] },
            { title: "Layout", values: ["W 430", "H 932"] },
            { title: "Appearance", values: ["100%", "Radius 28"] },
          ].map((section) => (
            <div key={section.title} className="border-t border-[#e8eae5] py-4">
              <p className="mb-3 text-[9px] text-[#36412f]">{section.title}</p>
              <div className="flex gap-1.5">
                {section.values.map((value) => (
                  <span
                    key={value}
                    className="flex-1 rounded bg-[#f2f3ef] px-2 py-1.5 text-[8px]"
                  >
                    {value}
                  </span>
                ))}
              </div>
            </div>
          ))}
          <div className="border-t border-[#e8eae5] py-4">
            <p className="mb-3 text-[#36412f]">Fill</p>
            <div className="flex items-center gap-2 rounded bg-[#f2f3ef] p-2">
              <span className="size-3 border border-[#dedfd9] bg-[#faf9f5]" />
              FAF9F5
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CloudBackdrop() {
  const id = useId();
  return (
    <svg
      viewBox="0 0 700 540"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id={`${id}-sky`} x2="0" y2="1">
          <stop stopColor="#9ddffa" />
          <stop offset=".55" stopColor="#bfeefe" />
          <stop offset="1" stopColor="#8ed7f3" />
        </linearGradient>
        <filter id={`${id}-cloud`} x="-20%" y="-40%" width="140%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <path fill={`url(#${id}-sky)`} d="M0 0h700v540H0z" />
      <g fill="white" filter={`url(#${id}-cloud)`}>
        <path
          opacity=".95"
          d="M480 65c-11-23 11-45 34-36 1-22 26-35 45-22 17-25 55-16 59 12 25-3 47 19 42 43 29-3 45 14 47 36-79 14-141 16-227-1-20-2-20-27 0-32Z"
        />
        <path
          opacity=".85"
          d="M-48 278c-9-21 13-44 35-32-2-34 42-49 62-21 22-17 51-7 57 18 24-8 53 10 50 35 22-4 42 6 49 23-69 17-159 23-253 8v-31Z"
        />
        <path
          opacity=".8"
          d="M-15 449c-9-24 15-40 36-31 7-36 52-41 71-11 30-16 61 3 60 31 23-8 46 6 50 28-65 22-135 23-217 10v-27Z"
        />
        <path
          opacity=".7"
          d="M430 418c-11-20 12-46 35-35 6-24 36-30 53-11 28-28 74-9 75 23 25-7 59 8 58 37 36-2 56 18 57 40-106 24-203 17-292-2-12-16-5-40 14-52Z"
        />
      </g>
      <path
        d="M-70 520c210-70 434 42 840-33"
        stroke="white"
        strokeWidth="18"
        opacity=".3"
        filter={`url(#${id}-cloud)`}
      />
    </svg>
  );
}

function FoundationPreview() {
  const lines = [
    { text: "/* Elsewhere · Design foundations */", color: "text-[#9aa2af]" },
    { text: ":root {", color: "text-[#9469b8]" },
    { text: "  --color-forest: #314f3b;", color: "text-[#438b72]" },
    { text: "  --color-sage:   #e8ecd7;", color: "text-[#438b72]" },
    { text: "  --color-paper:  #faf9f5;", color: "text-[#438b72]" },
    { text: "  --color-sunset: #edab74;", color: "text-[#438b72]" },
    { text: "}", color: "text-[#9469b8]" },
    { text: "", color: "" },
    { text: ".trail-card {", color: "text-[#5889c8]" },
    { text: "  display: flex;", color: "text-[#74849a]" },
    { text: "  gap: 16px;", color: "text-[#74849a]" },
    { text: "  padding: 24px;", color: "text-[#74849a]" },
    { text: "  border-radius: 12px;", color: "text-[#74849a]" },
    { text: "  background: var(--color-paper);", color: "text-[#74849a]" },
    { text: "}", color: "text-[#5889c8]" },
  ];
  return (
    <div
      role="img"
      aria-label="Design foundations preview with CSS color tokens and component spacing"
      className="relative w-full max-w-[540px] rounded-[18px] border-[6px] border-white/55 bg-white/30 p-1 shadow-[0_10px_0_-4px_#ffffff65,0_20px_24px_#4195b736]"
    >
      <div className="overflow-hidden rounded-[11px] border border-[#dce7ed] bg-white">
        <div className="flex h-10 items-center gap-1 border-b border-[#e5ecf2] bg-[#f5f9fc] px-2.5 text-[10px] text-[#858f9c] sm:text-xs">
          <span className="flex h-7 items-center gap-1.5 rounded border border-[#dce7ef] bg-white px-2 text-[#338acb]">
            <span className="size-2.5 rounded-full bg-[#42a7df]" />
            Colors
          </span>
          <span className="flex items-center gap-1.5 px-2">
            <Type className="size-3 text-[#be9f3d]" />
            Type
          </span>
          <span className="flex items-center gap-1.5 px-2">
            <CodeXml className="size-3" />
            CSS
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <Copy className="size-3" />
            Copy
          </span>
        </div>
        <div className="px-4 py-4 font-mono text-[10px] leading-[19px] sm:text-xs sm:leading-[21px]">
          {lines.map((line, index) => (
            <div key={index} className="flex whitespace-pre">
              <span className="mr-4 w-3 shrink-0 text-right text-[#c8ced5]">
                {index + 1}
              </span>
              <span className={line.color}>{line.text || " "}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FeatureArtwork({ kind }: { kind: string }) {
  return (
    <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-[11px] bg-[#afe4fa] px-6 py-10 sm:px-10 sm:min-h-[450px] lg:min-h-[530px]">
      <CloudBackdrop />
      {kind === "canvas" && (
        <div className="relative w-full max-w-[450px] overflow-hidden rounded-xl border-[5px] border-white/65 bg-white shadow-[0_12px_30px_#3680a22b]">
          <div className="flex items-center justify-between border-b border-[#eee] px-4 py-3 text-[10px] text-[#777]">
            <span className="flex items-center gap-2">
              <PenTool className="size-3 text-[#147bd0]" /> Untitled design
            </span>
            <span className="text-[#147bd0]">Editing</span>
          </div>
          <div className="relative bg-[#eceee9] p-5">
            <StarterPreview className="mx-auto w-[190px] rounded-[13px] shadow-sm" />
          </div>
        </div>
      )}
      {kind === "components" && <FoundationPreview />}
      {kind === "files" && (
        <div className="relative w-full max-w-[450px] rounded-xl border-[5px] border-white/65 bg-white p-6 shadow-[0_12px_30px_#3680a22b]">
          <div className="mb-5 flex items-center justify-between text-xs text-[#45543f]">
            <span>Your workspace</span>
            <Plus className="size-3.5" />
          </div>
          <h3 className="mb-6 text-xl tracking-tight text-[#344237]">
            Good ideas. All together.
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              "Elsewhere stays",
              "Brand foundations",
              "Next big idea",
              "Website concepts",
            ].map((title, i) => (
              <div
                key={title}
                className="overflow-hidden rounded-lg border border-[#e8eae5]"
              >
                <div
                  className={cn(
                    "flex h-24 items-center justify-center",
                    i % 2 ? "bg-[#eee7de]" : "bg-[#e5ecdf]",
                  )}
                >
                  {i % 2 ? (
                    <span className="font-serif text-[28px] italic text-[#9f6647]">
                      Aa.
                    </span>
                  ) : (
                    <Landscape className="h-20 w-16 rounded-t-full" />
                  )}
                </div>
                <p className="truncate px-2 py-3 text-[9px] text-[#60665a]">
                  {title}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {kind === "export" && (
        <div className="relative w-full max-w-[400px] rounded-xl border-[5px] border-white/65 bg-white p-7 shadow-[0_12px_30px_#3680a22b]">
          <div className="mb-6 flex items-center justify-between text-xs text-[#45543f]">
            <span>Export your design</span>
            <ImageIcon className="size-4" />
          </div>
          <div className="flex h-40 items-center justify-center rounded-md bg-[#f1f3ed]">
            <Landscape className="h-28 w-28 rounded-t-full" />
          </div>
          <div className="mt-5 flex gap-2">
            {["SVG", "PNG", "JSON"].map((format, i) => (
              <span
                key={format}
                className={cn(
                  "flex-1 rounded-md border py-2 text-center text-[10px]",
                  i === 0
                    ? "border-[#147bd0] bg-[#edf6fd] text-[#147bd0]"
                    : "border-[#e5e8e0] text-[#818779]",
                )}
              >
                {format}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-md bg-[#147bd0] py-3 text-center text-xs text-white">
            Export selection ↗
          </div>
        </div>
      )}
    </div>
  );
}
