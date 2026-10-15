import {
  ChevronDown,
  Circle,
  Component,
  Undo2,
  Redo2,
  Code2,
  Frame,
  Grid2X2,
  Hand,
  ImagePlus,
  Minus,
  MousePointer2,
  PenTool,
  Square,
  Type,
} from "lucide-react";
import { IconButton } from "./controls";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DesignEditor } from "./use-design-editor";
import type { Tool } from "@/lib/design/document";
import { cn } from "@/lib/utils";

type ToolOption = {
  tool: Tool;
  label: string;
  icon: typeof Square;
  shortcut: string;
};
const moveTools: ToolOption[] = [
  { tool: "move", label: "Move", icon: MousePointer2, shortcut: "V" },
  { tool: "hand", label: "Hand", icon: Hand, shortcut: "H" },
];
const shapeTools: ToolOption[] = [
  { tool: "rectangle", label: "Rectangle", icon: Square, shortcut: "R" },
  { tool: "ellipse", label: "Ellipse", icon: Circle, shortcut: "O" },
  { tool: "line", label: "Line", icon: Minus, shortcut: "L" },
];
function ToolGroup({
  editor: e,
  options,
  label,
}: {
  editor: DesignEditor;
  options: ToolOption[];
  label: string;
}) {
  const current = options.find((t) => t.tool === e.tool) ?? options[0];
  const active = options.some((t) => t.tool === e.tool);
  const Icon = current.icon;
  return (
    <div
      className={cn(
        "flex shrink-0 items-center rounded-md",
        active && "bg-primary",
      )}
    >
      <IconButton
        label={`${current.label} (${current.shortcut})`}
        onClick={() => e.setTool(current.tool)}
        className={cn(
          "size-9 [&_svg]:size-[17px]",
          active && "text-white hover:bg-white/10 hover:text-white",
        )}
      >
        <Icon />
      </IconButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label={label}
            className={cn(
              "text-muted-foreground hover:bg-muted flex h-9 w-4 items-center justify-center rounded-r-md",
              active && "text-white hover:bg-white/10",
            )}
          >
            <ChevronDown className="size-2.5" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-48">
          {options.map(({ tool, label: name, icon: Glyph, shortcut }) => (
            <DropdownMenuItem key={tool} onClick={() => e.setTool(tool)}>
              <Glyph className="size-3.5" />
              {name}
              <span className="ml-auto text-[10px] opacity-50">{shortcut}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
export function DesignToolbar({
  editor: e,
  onImage,
  onInspect,
}: {
  editor: DesignEditor;
  onImage: () => void;
  onInspect: () => void;
}) {
  const single = (tool: Tool, label: string, Icon: typeof Square) => (
    <IconButton
      key={tool}
      label={label}
      onClick={() => e.setTool(tool)}
      className={cn(
        "size-9 [&_svg]:size-[17px]",
        e.tool === tool &&
          "bg-primary hover:bg-primary/90 text-white hover:text-white",
      )}
    >
      <Icon />
    </IconButton>
  );
  return (
    <div
      role="toolbar"
      aria-label="Design tools"
      className="border-border bg-background absolute bottom-[max(12px,env(safe-area-inset-bottom))] left-1/2 z-20 flex w-max max-w-[calc(100%-16px)] -translate-x-1/2 flex-wrap items-center justify-center gap-1 rounded-xl border p-1.5 shadow-lg ring-1 ring-black/5 sm:bottom-5 sm:gap-1.5 sm:p-2.5"
    >
      <ToolGroup editor={e} options={moveTools} label="Move tools" />
      {single("frame", "Frame (F)", Frame)}
      <ToolGroup editor={e} options={shapeTools} label="Shape tools" />
      {single("pen", "Pen (P)", PenTool)}
      {single("text", "Text (T)", Type)}
      <IconButton
        label="Place image"
        onClick={onImage}
        className="size-9 [&_svg]:size-[17px]"
      >
        <ImagePlus />
      </IconButton>
      <span className="border-border mx-1 h-5 border-l" />
      <IconButton
        label="Layout grid (Shift+G)"
        active={e.grid}
        onClick={() => e.setGrid(!e.grid)}
        className="size-8"
      >
        <Grid2X2 />
      </IconButton>
      <IconButton
        label="Create component"
        disabled={!e.selected.length}
        onClick={() => e.group("component")}
        className="size-9"
      >
        <Component />
      </IconButton>
      <span className="border-border mx-1 h-5 border-l" />
      <IconButton
        label="Undo (⌘Z)"
        disabled={!e.canUndo}
        onClick={e.undo}
        className="size-9"
      >
        <Undo2 />
      </IconButton>
      <IconButton
        label="Redo (⌘⇧Z)"
        disabled={!e.canRedo}
        onClick={e.redo}
        className="size-9"
      >
        <Redo2 />
      </IconButton>
      <IconButton label="Inspect code" onClick={onInspect} className="size-8">
        <Code2 />
      </IconButton>
    </div>
  );
}
