"use client";
import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { FilePreview } from "./file-preview";
import { useState } from "react";
import {
  blankDocument,
  createNode,
  DesignDocument,
  starterDocument,
} from "@/lib/design/document";

type Resource = "presentation" | "mobile" | "system" | "handoff";
function resourceDocument(kind: Resource): DesignDocument {
  if (kind === "mobile") return starterDocument();
  const title = {
    presentation: "Design presentation",
    system: "Design foundations",
    handoff: "Developer handoff",
  }[kind];
  const doc = blankDocument(title);
  const frame = createNode("frame", {
    name: title,
    width: 1200,
    height: 720,
    fill:
      kind === "presentation"
        ? "#2563eb"
        : kind === "handoff"
          ? "#111111"
          : "#eee8fa",
  });
  const text = (
    content: string,
    x: number,
    y: number,
    size: number,
    color: string,
  ) =>
    createNode("text", {
      name: content,
      text: content,
      x,
      y,
      width: 1000,
      height: size * 1.5,
      fontSize: size,
      fontWeight: 600,
      fill: color,
      parentId: frame.id,
    });
  doc.pages[0].nodes = [
    frame,
    text(
      "FIGART / STARTER",
      64,
      56,
      16,
      kind === "system" ? "#67527d" : "#b9cdfa",
    ),
    text(title, 64, 170, 64, kind === "system" ? "#30223f" : "#ffffff"),
    text(
      "Make your next idea a little more tangible.",
      64,
      264,
      26,
      kind === "system" ? "#67527d" : "#b9cdfa",
    ),
  ];
  ["#2563eb", "#9747ff", "#14ae5c", "#ffcd29"].forEach((fill, i) => {
    doc.pages[0].nodes.push(
      createNode("rectangle", {
        name: `Color ${i + 1}`,
        x: 64 + i * 270,
        y: 400,
        width: 240,
        height: 180,
        radius: 20,
        fill,
        parentId: frame.id,
      }),
    );
  });
  return doc;
}
function ResourceArtwork({
  kind,
  mobile,
}: {
  kind: Resource;
  mobile: DesignDocument;
}) {
  if (kind === "mobile")
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#dfe7df] px-8 py-3">
        <div className="absolute -top-16 -right-8 size-48 rounded-full bg-[#c7d6c4]" />
        <div className="relative h-full w-full transition-transform duration-300 group-hover:scale-105">
          <FilePreview document={mobile} />
        </div>
        <span className="absolute bottom-3 left-3 rounded-full border border-black/5 bg-white/85 px-2 py-1 text-[8px] font-medium text-[#355248]">
          LIGHT + DARK
        </span>
      </div>
    );
  if (kind === "presentation")
    return (
      <div className="relative h-full overflow-hidden bg-[#2258df] px-6 py-4 text-white">
        <div className="absolute -top-10 -right-8 size-44 rounded-full border-[24px] border-[#4c79ee]" />
        <div className="absolute -right-7 bottom-[-84px] size-44 rotate-45 rounded-[36px] bg-[#c9e780]" />
        <div className="relative">
          <span className="text-[8px] font-medium tracking-[0.18em] text-[#c4d5ff]">
            THE NEXT CHAPTER
          </span>
          <p className="mt-3 text-[28px] leading-[0.98] font-semibold tracking-[-0.055em]">
            Good ideas.
            <br />
            Great stories.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <span className="h-px w-7 bg-white/50" />
            <span className="text-[8px] text-[#d2dfff]">
              A canvas for your next pitch
            </span>
          </div>
        </div>
      </div>
    );
  if (kind === "system")
    return (
      <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#eae2f4] px-6 py-4">
        <div className="absolute -bottom-14 -left-6 size-40 rounded-full bg-[#d8c9ea]" />
        <div className="relative grid w-full max-w-60 grid-cols-[1fr_0.8fr] gap-2 rounded-lg border border-white/70 bg-[#fcf9ff] p-3 shadow-[0_8px_24px_#5a3d7b15]">
          <div className="flex flex-col justify-between">
            <span className="text-[7px] font-medium tracking-wider text-[#8c789f] uppercase">
              Foundations / 01
            </span>
            <span className="text-[44px] leading-none tracking-[-0.08em] text-[#433157]">
              Aa
            </span>
            <span className="text-[7px] text-[#8c789f]">
              A little consistency goes a long way.
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {["#482e68", "#9674c0", "#c8b2e0", "#dce7b6"].map((color) => (
              <div
                key={color}
                style={{ backgroundColor: color }}
                className="min-h-10 rounded-sm"
              />
            ))}
          </div>
        </div>
      </div>
    );
  return (
    <div className="relative flex h-full items-center justify-center overflow-hidden bg-[#17231f] px-5 py-4">
      <div className="absolute top-[-60px] right-[-40px] size-52 rounded-full bg-[#223e30]" />
      <div className="relative w-full max-w-64 overflow-hidden rounded-lg border border-[#476455] bg-[#17241d] shadow-lg">
        <div className="flex h-6 items-center gap-1 border-b border-[#334b3e] px-3">
          <span className="size-1.5 rounded-full bg-[#6b8274]" />
          <span className="size-1.5 rounded-full bg-[#6b8274]" />
          <span className="size-1.5 rounded-full bg-[#6b8274]" />
          <span className="ml-auto text-[7px] text-[#99ad9f]">design.css</span>
        </div>
        <div className="space-y-1 px-4 py-3 font-mono text-[9px] leading-4">
          <p className="text-[#c1d99c]">.next-big-idea {"{"}</p>
          <p className="pl-3 text-[#9aafa2]">
            display: <span className="text-[#ead9a2]">flex;</span>
          </p>
          <p className="pl-3 text-[#9aafa2]">
            gap: <span className="text-[#ead9a2]">16px;</span>
          </p>
          <p className="text-[#c1d99c]">{"}"}</p>
        </div>
      </div>
      <span className="absolute right-4 bottom-3 flex items-center gap-1 rounded-full border border-[#547248] bg-[#c7e8a8] px-2 py-1 text-[8px] font-medium text-[#243d24]">
        <Check className="size-2.5" />
        Ready to build
      </span>
    </div>
  );
}

export function ResourcesPanel({
  onCreate,
  onBrowse,
}: {
  onCreate: (doc: DesignDocument) => void;
  onBrowse: () => void;
}) {
  const [hidden, setHidden] = useState(false);
  const [mobile] = useState(starterDocument);
  if (hidden) return null;
  const items: {
    kind: Resource;
    title: string;
    detail: string;
    category: string;
  }[] = [
    {
      kind: "presentation",
      title: "Pitch & present",
      detail: "Give your next big idea a starting point.",
      category: "Presentation",
    },
    {
      kind: "mobile",
      title: "Elsewhere stay experience",
      detail: "Three screens, ready to make your own.",
      category: "Mobile app",
    },
    {
      kind: "system",
      title: "Design foundations",
      detail: "A considered starting point for color & type.",
      category: "Design system",
    },
    {
      kind: "handoff",
      title: "From design to code",
      detail: "Explore the details behind a good interface.",
      category: "Handoff",
    },
  ];
  return (
    <section
      aria-label="Recommended resources"
      className="border-border/50 bg-muted/60 mb-8 min-w-0 rounded-xl border p-4 sm:p-5"
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xs font-medium">A place to start</h2>
          <p className="text-muted-foreground mt-1 text-[11px]">
            A few good foundations for whatever comes next.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-4">
          <button
            onClick={onBrowse}
            className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-[11px] transition-colors"
          >
            Browse templates
            <ArrowRight className="size-3" />
          </button>
          <button
            aria-label="Hide recommendations"
            onClick={() => setHidden(true)}
            className="text-muted-foreground hover:bg-background/60 hover:text-foreground rounded-sm p-1"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
      <div className="grid snap-x snap-mandatory auto-cols-[minmax(220px,80%)] grid-flow-col gap-4 overflow-x-auto overscroll-x-contain pb-2 sm:auto-cols-[minmax(220px,1fr)]">
        {items.map((item) => (
          <button
            key={item.kind}
            onClick={() => onCreate(resourceDocument(item.kind))}
            className="group border-border bg-background hover:border-muted-foreground/50 focus-visible:outline-primary min-w-0 snap-start overflow-hidden rounded-lg border text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <div className="border-border/50 h-40 overflow-hidden border-b">
              <ResourceArtwork kind={item.kind} mobile={mobile} />
            </div>
            <div className="px-3.5 py-3">
              <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-muted-foreground text-[9px]">
                  {item.category}
                </span>
                <ArrowUpRight className="text-muted-foreground/50 group-hover:text-foreground size-3 transition-colors" />
              </div>
              <h3 className="truncate text-xs font-medium">{item.title}</h3>
              <p className="text-muted-foreground mt-1 truncate text-[10px]">
                {item.detail}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
