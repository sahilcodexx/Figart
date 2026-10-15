"use client";
import {
  AlignCenter,
  AlignHorizontalJustifyCenter,
  AlignHorizontalJustifyEnd,
  AlignHorizontalJustifyStart,
  AlignLeft,
  AlignRight,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  AlignVerticalJustifyStart,
  ArrowDown,
  ArrowRight,
  ChevronDown,
  Component,
  Copy,
  Eye,
  EyeOff,
  Frame,
  Minus,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { ColorField, IconButton, NumberField, PanelSection } from "./controls";
import type { DesignEditor } from "./use-design-editor";
import { isContainer } from "@/lib/design/document";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
const selectClass =
  "h-8 w-full rounded-sm border-0 bg-muted px-2 text-[11px] outline-none focus:ring-1 focus:ring-primary";
export function Inspector({
  editor: e,
  tab,
  setTab,
  onExport,
  onFit,
  onFitSelection,
  onZoom,
}: {
  editor: DesignEditor;
  tab: "design" | "prototype" | "inspect";
  setTab: (tab: "design" | "prototype" | "inspect") => void;
  onExport: () => void;
  onFit: () => void;
  onFitSelection: () => void;
  onZoom: (zoom: number) => void;
}) {
  const n = e.selectedNodes[0];
  const framePresets = [
    { name: "Phone", width: 390, height: 844 },
    { name: "Tablet", width: 834, height: 1194 },
    { name: "Desktop", width: 1440, height: 1024 },
    { name: "Presentation", width: 1920, height: 1080 },
    { name: "Square", width: 1080, height: 1080 },
  ];
  const css = n
    ? `/* ${n.name.replaceAll("*/", "")} */\nwidth: ${Math.round(n.width)}px;\nheight: ${Math.round(n.height)}px;\n${n.fill !== "none" ? `background: ${n.fill};\n` : ""}${n.radius ? `border-radius: ${n.radius}px;\n` : ""}${n.strokeWidth ? `border: ${n.strokeWidth}px solid ${n.stroke};\n` : ""}${n.opacity !== 1 ? `opacity: ${n.opacity};\n` : ""}${n.type === "text" ? `font-family: '${n.fontFamily}';\nfont-size: ${n.fontSize}px;\nfont-weight: ${n.fontWeight};\ncolor: ${n.fill};\n` : ""}${n.layout !== "none" ? `display: flex;\nflex-direction: ${n.layout === "horizontal" ? "row" : "column"};\ngap: ${n.gap}px;\npadding: ${n.padding}px;` : ""}`
    : "";
  return (
    <aside
      aria-label="Properties"
      className="border-border bg-background flex h-full w-[264px] shrink-0 flex-col border-l max-lg:w-60"
    >
      <div className="border-border flex h-10 shrink-0 items-center gap-1 border-b px-3">
        {(
          (tab === "inspect"
            ? ["design", "prototype", "inspect"]
            : ["design", "prototype"]) as ("design" | "prototype" | "inspect")[]
        ).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "text-muted-foreground rounded-sm px-2 py-1.5 text-[11px] capitalize",
              tab === t && "bg-muted text-foreground",
            )}
          >
            {t}
          </button>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label="Zoom menu"
              className="ml-auto flex items-center gap-1 text-[11px]"
            >
              {Math.round(e.view.zoom * 100)}%<ChevronDown className="size-3" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={onFit}>Zoom to fit</DropdownMenuItem>
            <DropdownMenuItem
              onClick={onFitSelection}
              disabled={!e.selected.length}
            >
              Zoom to selection
            </DropdownMenuItem>
            {[0.25, 0.5, 1, 2].map((zoom) => (
              <DropdownMenuItem key={zoom} onClick={() => onZoom(zoom)}>
                {zoom * 100}%
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto pb-12">
        {tab === "inspect" ? (
          <>
            <PanelSection title="Dev mode">
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Select a layer to inspect its dimensions and copy CSS.
              </p>
            </PanelSection>
            {n && (
              <>
                <PanelSection title={n.name}>
                  <div className="text-muted-foreground grid grid-cols-2 gap-2">
                    <span>Width</span>
                    <span className="text-foreground text-right">
                      {n.width}px
                    </span>
                    <span>Height</span>
                    <span className="text-foreground text-right">
                      {n.height}px
                    </span>
                    <span>Layer type</span>
                    <span className="text-foreground text-right capitalize">
                      {n.type}
                    </span>
                  </div>
                </PanelSection>
                <PanelSection
                  title="CSS"
                  action={
                    <IconButton
                      label="Copy CSS"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(css);
                          toast.success("CSS copied");
                        } catch {
                          toast.error("Clipboard access unavailable");
                        }
                      }}
                    >
                      <Copy />
                    </IconButton>
                  }
                >
                  <pre className="bg-muted overflow-x-auto rounded-md p-3 font-mono text-[10px] leading-6">
                    {css}
                  </pre>
                </PanelSection>
              </>
            )}
          </>
        ) : tab === "prototype" ? (
          <>
            <PanelSection title="Prototype">
              <p className="text-muted-foreground text-[11px] leading-relaxed">
                Connect a layer to a frame. Click it in Present mode to
                navigate.
              </p>
            </PanelSection>
            {n ? (
              <PanelSection title="Interactions">
                <label className="block space-y-2 text-[11px]">
                  <span className="text-muted-foreground">
                    On click → Navigate to
                  </span>
                  <select
                    aria-label="Prototype target"
                    value={n.prototypeTarget ?? ""}
                    onChange={(event) =>
                      e.patch({
                        prototypeTarget: event.target.value || undefined,
                      })
                    }
                    className={selectClass}
                  >
                    <option value="">No interaction</option>
                    {e.page.nodes
                      .filter((f) => f.type === "frame" && f.id !== n.id)
                      .map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                  </select>
                </label>
                {n.prototypeTarget && (
                  <div className="bg-primary/10 text-primary flex items-center gap-2 rounded-md p-3">
                    <ArrowRight className="size-4" />
                    Navigate on click
                  </div>
                )}
              </PanelSection>
            ) : (
              <div className="text-muted-foreground p-4 text-[11px]">
                Select a layer to add an interaction.
              </div>
            )}
          </>
        ) : !n ? (
          <>
            <PanelSection title="Page">
              <ColorField
                label="Page background"
                value={e.page.background}
                onChange={(background) =>
                  e.replace({
                    ...e.doc,
                    pages: e.doc.pages.map((p) =>
                      p.id === e.page.id ? { ...p, background } : p,
                    ),
                  })
                }
              />
              <div className="flex items-center justify-between text-[11px]">
                <span>Layout grid</span>
                <Switch
                  checked={e.grid}
                  onCheckedChange={e.setGrid}
                  aria-label="Show layout grid"
                />
              </div>
            </PanelSection>
            {e.tool === "frame" && (
              <PanelSection title="Frame presets">
                <p className="text-muted-foreground text-[11px]">
                  Start with a device or a blank frame.
                </p>
                {framePresets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() =>
                      e.add("frame", {
                        name: preset.name,
                        x: (80 - e.view.x) / e.view.zoom,
                        y: (80 - e.view.y) / e.view.zoom,
                        width: preset.width,
                        height: preset.height,
                      })
                    }
                    className="hover:bg-muted flex w-full items-center gap-2 rounded-sm py-2"
                  >
                    <Frame className="text-muted-foreground size-3.5" />
                    <span>{preset.name}</span>
                    <span className="text-muted-foreground ml-auto text-[10px]">
                      {preset.width} × {preset.height}
                    </span>
                  </button>
                ))}
              </PanelSection>
            )}
            <PanelSection title="Local styles">
              <div className="grid grid-cols-4 gap-2">
                {e.doc.colors.map((c, i) => (
                  <div key={i} title={c.name} className="space-y-1.5">
                    <div
                      className="border-border h-9 rounded-sm border"
                      style={{ backgroundColor: c.value }}
                    />
                    <span className="text-muted-foreground block truncate text-[9px]">
                      {c.name}
                    </span>
                  </div>
                ))}
              </div>
            </PanelSection>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-border px-4 py-4 text-xs font-medium">
              {e.selected.length > 1
                ? `${e.selected.length} layers selected`
                : n.name}
              <IconButton
                label="Create component"
                onClick={() =>
                  n.type === "component"
                    ? e.instantiate(n)
                    : e.patch({ type: "component" })
                }
              >
                <Component />
              </IconButton>
            </div>
            <PanelSection
              title="Position"
              action={
                <IconButton
                  label={n.visible ? "Hide selection" : "Show selection"}
                  onClick={() => e.patch({ visible: !n.visible })}
                >
                  {n.visible ? <Eye /> : <EyeOff />}
                </IconButton>
              }
            >
              <span className="block text-[10px] text-muted-foreground">
                Alignment
              </span>
              <div className="flex items-center justify-between gap-0.5">
                {[
                  ["left", AlignHorizontalJustifyStart, "Align left"],
                  [
                    "center",
                    AlignHorizontalJustifyCenter,
                    "Align horizontal centers",
                  ],
                  ["right", AlignHorizontalJustifyEnd, "Align right"],
                  ["top", AlignVerticalJustifyStart, "Align top"],
                  [
                    "middle",
                    AlignVerticalJustifyCenter,
                    "Align vertical centers",
                  ],
                  ["bottom", AlignVerticalJustifyEnd, "Align bottom"],
                ].map(([direction, Icon, label]) => {
                  const Glyph = Icon as typeof AlignLeft;
                  return (
                    <IconButton
                      key={String(direction)}
                      label={String(label)}
                      className="h-6 w-8 rounded-sm bg-muted text-muted-foreground"
                      onClick={() =>
                        e.align(direction as Parameters<typeof e.align>[0])
                      }
                    >
                      <Glyph />
                    </IconButton>
                  );
                })}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <NumberField
                  label="X"
                  value={n.x}
                  onChange={(x) => e.move(e.selected, x - n.x, 0)}
                />
                <NumberField
                  label="Y"
                  value={n.y}
                  onChange={(y) => e.move(e.selected, 0, y - n.y)}
                />
                <NumberField
                  label="Rotation"
                  displayLabel="↻"
                  value={n.rotation}
                  suffix="°"
                  onChange={(rotation) => e.patch({ rotation })}
                />
              </div>
              {isContainer(n) && (
                <label className="flex items-center justify-between text-[11px]">
                  <span>Clip content</span>
                  <Switch
                    checked={n.clip}
                    onCheckedChange={(clip) => e.patch({ clip })}
                    aria-label="Clip content"
                  />
                </label>
              )}
            </PanelSection>
            <PanelSection title="Layout">
              <span className="block text-[10px] text-muted-foreground">
                Dimensions
              </span>
              <div className="grid grid-cols-2 gap-2">
                <NumberField
                  label="W"
                  value={n.width}
                  min={1}
                  onChange={(width) => e.patch({ width })}
                />
                <NumberField
                  label="H"
                  value={n.height}
                  min={0}
                  onChange={(height) => e.patch({ height })}
                />
              </div>
            </PanelSection>
            {n.type === "text" && (
              <PanelSection title="Typography">
                <select
                  aria-label="Font family"
                  value={n.fontFamily}
                  onChange={(event) =>
                    e.patch({ fontFamily: event.target.value })
                  }
                  className={selectClass}
                >
                  {[
                    "Inter",
                    "Arial",
                    "Georgia",
                    "DM Serif Display",
                    "Courier New",
                    "system-ui",
                  ].map((font) => (
                    <option key={font}>{font}</option>
                  ))}
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    aria-label="Font weight"
                    value={n.fontWeight}
                    onChange={(event) =>
                      e.patch({ fontWeight: Number(event.target.value) })
                    }
                    className={selectClass}
                  >
                    {[
                      [400, "Regular"],
                      [500, "Medium"],
                      [600, "Semibold"],
                      [700, "Bold"],
                    ].map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <NumberField
                    label="Size"
                    min={1}
                    max={1000}
                    value={n.fontSize}
                    onChange={(fontSize) => e.patch({ fontSize })}
                  />
                </div>
                <Input
                  aria-label="Text content"
                  value={n.text}
                  onChange={(event) =>
                    e.patch({ text: event.target.value }, undefined, false)
                  }
                  onBlur={e.commit}
                  className="h-8 text-[11px]"
                />
                <div className="flex gap-1">
                  {(
                    [
                      ["left", AlignLeft],
                      ["center", AlignCenter],
                      ["right", AlignRight],
                    ] as const
                  ).map(([textAlign, Icon]) => (
                    <IconButton
                      key={textAlign}
                      label={`Text align ${textAlign}`}
                      active={n.textAlign === textAlign}
                      onClick={() => e.patch({ textAlign })}
                    >
                      <Icon />
                    </IconButton>
                  ))}
                </div>
              </PanelSection>
            )}
            {isContainer(n) && (
              <PanelSection
                title="Auto layout"
                action={
                  <IconButton
                    label="Add auto layout"
                    onClick={() => {
                      if (isContainer(n))
                        e.patch({
                          layout: n.layout === "none" ? "vertical" : "none",
                        });
                      else e.group("frame");
                    }}
                  >
                    <Plus />
                  </IconButton>
                }
              >
                {isContainer(n) && (
                  <>
                    <div className="flex items-center gap-1">
                      <IconButton
                        label="No auto layout"
                        active={n.layout === "none"}
                        onClick={() => e.patch({ layout: "none" })}
                      >
                        <Minus />
                      </IconButton>
                      <IconButton
                        label="Horizontal auto layout"
                        active={n.layout === "horizontal"}
                        onClick={() => e.patch({ layout: "horizontal" })}
                      >
                        <ArrowRight />
                      </IconButton>
                      <IconButton
                        label="Vertical auto layout"
                        active={n.layout === "vertical"}
                        onClick={() => e.patch({ layout: "vertical" })}
                      >
                        <ArrowDown />
                      </IconButton>
                    </div>
                    {n.layout !== "none" && (
                      <div className="grid grid-cols-2 gap-2">
                        <NumberField
                          label="Gap"
                          min={0}
                          value={n.gap}
                          onChange={(gap) => e.patch({ gap })}
                        />
                        <NumberField
                          label="Padding"
                          min={0}
                          value={n.padding}
                          onChange={(padding) => e.patch({ padding })}
                        />
                      </div>
                    )}
                  </>
                )}
                {!isContainer(n) && (
                  <p className="text-muted-foreground text-[11px]">
                    Wrap your selection in a frame to arrange layers.
                  </p>
                )}
              </PanelSection>
            )}
            <PanelSection title="Appearance">
              <div className="grid grid-cols-2 gap-2">
                <NumberField
                  label="Opacity"
                  displayLabel="◐"
                  min={0}
                  max={100}
                  suffix="%"
                  value={n.opacity * 100}
                  onChange={(opacity) => e.patch({ opacity: opacity / 100 })}
                />

                <NumberField
                  label="Radius"
                  displayLabel="⌜"
                  value={n.radius}
                  min={0}
                  onChange={(radius) => e.patch({ radius })}
                />
              </div>
            </PanelSection>
            <PanelSection
              title="Fill"
              action={
                <IconButton
                  label={n.fill === "none" ? "Add fill" : "Remove fill"}
                  onClick={() =>
                    e.patch({ fill: n.fill === "none" ? "#d9d9d9" : "none" })
                  }
                >
                  {n.fill === "none" ? <Plus /> : <Minus />}
                </IconButton>
              }
            >
              {n.fill !== "none" && (
                <ColorField
                  label="Fill"
                  value={n.fill}
                  onChange={(fill) => e.patch({ fill })}
                />
              )}
            </PanelSection>
            <PanelSection
              title="Stroke"
              action={
                <IconButton
                  label={n.strokeWidth ? "Remove stroke" : "Add stroke"}
                  onClick={() =>
                    e.patch({
                      strokeWidth: n.strokeWidth ? 0 : 1,
                      stroke: n.strokeWidth ? "none" : "#000000",
                    })
                  }
                >
                  {n.strokeWidth ? <Minus /> : <Plus />}
                </IconButton>
              }
            >
              {n.strokeWidth > 0 && (
                <>
                  <ColorField
                    label="Stroke"
                    value={n.stroke}
                    onChange={(stroke) => e.patch({ stroke })}
                  />
                  <NumberField
                    label="Weight"
                    min={0}
                    value={n.strokeWidth}
                    onChange={(strokeWidth) => e.patch({ strokeWidth })}
                  />
                </>
              )}
            </PanelSection>
            <PanelSection
              title="Effects"
              action={
                <IconButton
                  label={n.shadow ? "Remove shadow" : "Add shadow"}
                  onClick={() => e.patch({ shadow: !n.shadow })}
                >
                  {n.shadow ? <Minus /> : <Plus />}
                </IconButton>
              }
            >
              {n.shadow && (
                <div className="flex items-center justify-between text-[11px]">
                  <span>Drop shadow</span>
                  <Switch
                    checked={n.shadow}
                    onCheckedChange={(shadow) => e.patch({ shadow })}
                    aria-label="Drop shadow"
                  />
                </div>
              )}
            </PanelSection>
          </>
        )}
        <PanelSection title="Export">
          <Button
            variant="secondary"
            size="sm"
            className="w-full text-[11px]"
            onClick={onExport}
          >
            Export {e.selected.length ? "selection" : "page"}
            <ChevronDown className="size-3" />
          </Button>
        </PanelSection>
      </div>
    </aside>
  );
}
