"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useUser } from "@clerk/nextjs";
import {
  Check,
  ChevronDown,
  CloudOff,
  Download,
  File,
  Shapes,
  SlidersHorizontal,
  BriefcaseBusiness,
  FolderOpen,
  Home,
  Loader2,
  Moon,
  Play,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  PanelsTopLeft,
  Maximize2,
  Focus,
  Save,
  Sun,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "@/components/ui/context-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DesignDocument, normalizeDocument, Tool } from "@/lib/design/document";
import {
  type ZoomChange,
  defaultPanels,
  togglePanels,
} from "@/lib/design/interactions";
import { downloadFile, writeFile } from "@/lib/design/storage";
import { WorkspaceTheme } from "./workspace-theme";
import { useDesignEditor } from "./use-design-editor";
import { DesignCanvas } from "./canvas";
import { LayersPanel } from "./layers-panel";
import { Inspector } from "./inspector";
import { DesignToolbar } from "./toolbar";
import { IconButton } from "./controls";
import { ExportDialog, PresentDialog } from "./file-dialogs";
import { ResponsivePanel, useCompactWorkspace } from "./responsive-panel";

export function DesignWorkspace({
  initial,
  id,
  onCloudSave,
  savedDocument,
  initialRevision = 0,
}: {
  initial: DesignDocument;
  id: string;
  onCloudSave?: (
    doc: DesignDocument,
    expectedRevision: number,
  ) => Promise<number>;
  savedDocument?: DesignDocument;
  initialRevision?: number;
}) {
  const e = useDesignEditor(initial);
  const { user } = useUser();
  const [leftTab, setLeftTab] = useState<"file" | "assets" | "variables">(
    "file",
  );
  const [rightTab, setRightTab] = useState<"design" | "prototype" | "inspect">(
    "design",
  );
  const [exportOpen, setExportOpen] = useState(false);
  const [present, setPresent] = useState(false);
  const [status, setStatus] = useState<
    "saved" | "saving" | "error" | "unsaved"
  >("saved");
  const compact = useCompactWorkspace();
  const [desktopPanels, setDesktopPanels] = useState(defaultPanels);
  const [mobilePanels, setMobilePanels] = useState({
    left: false,
    right: false,
  });
  const panels = compact ? mobilePanels : desktopPanels;
  const setPanels = compact ? setMobilePanels : setDesktopPanels;
  const openExport = () => {
    if (compact) setMobilePanels({ left: false, right: false });
    setExportOpen(true);
  };
  const openPresentation = () => {
    if (compact) setMobilePanels({ left: false, right: false });
    setPresent(true);
  };
  const [showHelp, setShowHelp] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);
  const fitRef = useRef<() => void>(() => {});
  const fitSelectionRef = useRef<() => void>(() => {});
  const zoomRef = useRef<(change: ZoomChange) => void>(() => {});
  const setFit = useCallback(
    (
      fit: () => void,
      fitSelection: () => void,
      zoom: (change: ZoomChange) => void,
    ) => {
      fitRef.current = fit;
      fitSelectionRef.current = fitSelection;
      zoomRef.current = zoom;
    },
    [],
  );
  const saved = useRef(savedDocument ?? initial);
  const revision = useRef(initialRevision);
  const saving = useRef(false);
  const { resolvedTheme, setTheme } = useTheme();
  const persist = useCallback(async () => {
    if (saving.current) return;
    saving.current = true;
    setStatus("saving");
    const snapshot = e.docRef.current;
    try {
      const backup = {
        id,
        title: snapshot.title,
        updatedAt: Date.now(),
        document: snapshot,
        pending: !!onCloudSave,
        revision: revision.current,
      };
      if (onCloudSave) {
        try {
          writeFile(backup);
        } catch {
          toast.warning(
            "Browser backup is unavailable. Saving to your account.",
          );
        }
        revision.current = await onCloudSave(snapshot, revision.current);
        try {
          writeFile({ ...backup, pending: false, revision: revision.current });
        } catch {
          /* The database save has succeeded. */
        }
      } else writeFile(backup);
      saved.current = snapshot;
      setStatus(e.docRef.current === saved.current ? "saved" : "unsaved");
    } catch (error) {
      setStatus("error");
      toast.error(
        error instanceof Error
          ? error.message
          : "Could not save. Download a backup from the file menu.",
      );
    } finally {
      saving.current = false;
    }
  }, [e.docRef, id, onCloudSave]);
  useEffect(() => {
    if (e.doc === saved.current || status === "error") return;
    const timer = setTimeout(() => {
      void persist();
    }, 900);
    return () => clearTimeout(timer);
  }, [e.doc, persist, status]);
  useEffect(() => {
    const backup = () => {
      try {
        const current = e.docRef.current;
        writeFile({
          id,
          title: current.title,
          document: current,
          updatedAt: Date.now(),
          pending: !!onCloudSave && saved.current !== current,
          revision: revision.current,
        });
      } catch {
        /* Browser storage may be full; export remains available. */
      }
    };
    const beforeUnload = (event: BeforeUnloadEvent) => {
      backup();
      if (onCloudSave && saved.current !== e.docRef.current) {
        event.preventDefault();
      }
    };
    window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("pagehide", backup);
    return () => {
      backup();
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("pagehide", backup);
    };
  }, [e.docRef, id, onCloudSave]);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target instanceof HTMLElement &&
          event.target.isContentEditable) ||
        (event.target instanceof HTMLElement &&
          !!event.target.closest('[role="menu"], [role="dialog"]')) ||
        present ||
        exportOpen
      )
        return;
      const mod = event.metaKey || event.ctrlKey,
        key = event.key.toLowerCase();
      if (key === "tab") {
        event.preventDefault();
        if (compact) setMobilePanels((p) => ({ left: !p.left, right: false }));
        else if (event.shiftKey) setPanels((p) => ({ ...p, left: !p.left }));
        else setPanels(togglePanels);
        return;
      }
      if (mod && key === "\\") {
        event.preventDefault();
        if (compact)
          setMobilePanels((p) =>
            event.shiftKey
              ? { left: false, right: !p.right }
              : { left: !p.left, right: false },
          );
        else if (event.shiftKey) setPanels((p) => ({ ...p, right: !p.right }));
        else setPanels(togglePanels);
        return;
      }
      if (event.shiftKey && (event.code === "Digit2" || key === "@")) {
        event.preventDefault();
        fitSelectionRef.current();
        return;
      }
      if (mod) {
        if (["z", "y", "s", "a", "d", "c", "v", "g", "[", "]"].includes(key))
          event.preventDefault();
        if (key === "z") {
          if (event.shiftKey) e.redo();
          else e.undo();
        } else if (key === "y") e.redo();
        else if (key === "s") void persist();
        else if (key === "a")
          e.setSelected(
            e.page.nodes
              .filter((n) => !n.parentId && !n.locked && n.visible)
              .map((n) => n.id),
          );
        else if (key === "d") e.duplicate();
        else if (key === "c") e.copy();
        else if (key === "v") e.paste();
        else if (key === "g") {
          if (event.shiftKey) e.ungroup();
          else e.group();
        } else if (key === "]") e.reorder(event.shiftKey ? "front" : "forward");
        else if (key === "[") e.reorder(event.shiftKey ? "back" : "backward");
        return;
      }
      if (key === "delete" || key === "backspace") {
        event.preventDefault();
        e.remove();
      } else if (key === "escape") {
        e.setSelected([]);
        e.setTool("move");
      } else if (key === "1" && event.shiftKey) {
        event.preventDefault();
        fitRef.current();
      } else if (key === "!" || key === "1") fitRef.current();
      else if (key === "0") zoomRef.current(1);
      else if (key === "+" || key === "=")
        zoomRef.current((zoom) => zoom * 1.1);
      else if (key === "-") zoomRef.current((zoom) => zoom / 1.1);
      else if (key === "g" && event.shiftKey) e.setGrid(!e.grid);
      else if (key.startsWith("arrow")) {
        event.preventDefault();
        const step = event.shiftKey ? 10 : 1;
        e.move(
          e.selected,
          key === "arrowleft" ? -step : key === "arrowright" ? step : 0,
          key === "arrowup" ? -step : key === "arrowdown" ? step : 0,
        );
      } else {
        const map: Record<string, Tool> = {
          v: "move",
          f: "frame",
          r: "rectangle",
          o: "ellipse",
          l: "line",
          p: "pen",
          t: "text",
          h: "hand",
        };
        if (map[key]) e.setTool(map[key]);
      }
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [e, persist, present, exportOpen, setPanels, compact]);
  const placeImage = async (file?: File) => {
    if (!file) return;
    if (
      !/^image\/(png|jpeg|webp|gif)$/.test(file.type) ||
      file.size > (onCloudSave ? 350000 : 4 * 1024 * 1024)
    ) {
      toast.error(
        onCloudSave
          ? "Use a PNG, JPG, GIF, or WebP under 350 KB for database files."
          : "Use a PNG, JPG, GIF, or WebP under 4 MB.",
      );
      return;
    }
    try {
      const data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = reject;
        image.src = data;
      });
      const scale = Math.min(1, 800 / image.width);
      e.add("rectangle", {
        name: file.name,
        image: data,
        width: image.width * scale,
        height: image.height * scale,
        x: (80 - e.view.x) / e.view.zoom,
        y: (80 - e.view.y) / e.view.zoom,
      });
    } catch {
      toast.error("Could not read that image.");
    }
  };
  return (
    <WorkspaceTheme className="fixed inset-0 z-50 flex min-w-0 flex-col overflow-hidden">
      <TooltipProvider delayDuration={250}>
        {compact && (
          <header className="border-border bg-background flex h-12 shrink-0 items-center gap-1 border-b px-2">
            <IconButton label="Back to files" asChild>
              <Link href="/dashboard">
                <Home />
              </Link>
            </IconButton>
            <IconButton
              label="Open layers and file menu"
              onClick={() => setPanels({ left: true, right: false })}
            >
              <PanelLeftOpen />
            </IconButton>
            <span className="min-w-0 flex-1 truncate px-1 font-medium">
              {e.doc.title}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2 text-[11px]"
                  aria-label="Canvas zoom"
                >
                  {Math.round(e.view.zoom * 100)}%
                  <ChevronDown className="size-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => fitRef.current()}>
                  Zoom to fit
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!e.selected.length}
                  onClick={() => fitSelectionRef.current()}
                >
                  Zoom to selection
                </DropdownMenuItem>
                {[0.25, 0.5, 1, 2].map((zoom) => (
                  <DropdownMenuItem
                    key={zoom}
                    onClick={() => zoomRef.current(zoom)}
                  >
                    {zoom * 100}%
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <IconButton
              label="Open design properties"
              onClick={() => setPanels({ left: false, right: true })}
            >
              <PanelRightOpen />
            </IconButton>
          </header>
        )}
        <div className="flex min-h-0 flex-1">
          <ResponsivePanel
            compact={compact}
            open={panels.left}
            onClose={() => setPanels((p) => ({ ...p, left: false }))}
            title="Layers and file menu"
            className="contents"
          >
            <nav
              aria-label="Workspace navigation"
              className={
                panels.left
                  ? "border-border bg-background flex w-16 shrink-0 flex-col items-center gap-5 border-r py-4"
                  : "hidden"
              }
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    aria-label="File menu"
                    className="font-semibold"
                  >
                    Fg
                    <ChevronDown className="size-2!" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">
                      <Home className="size-4" />
                      Back to files
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => void persist()}>
                    <Save className="size-4" />
                    Save<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => importRef.current?.click()}>
                    <FolderOpen className="size-4" />
                    Import design file
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      downloadFile(
                        JSON.stringify(e.doc, null, 2),
                        `${e.doc.title}.figart`,
                      )
                    }
                  >
                    <Download className="size-4" />
                    Download editable file
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={e.undo} disabled={!e.canUndo}>
                    Undo<DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={e.redo} disabled={!e.canRedo}>
                    Redo<DropdownMenuShortcut>⌘⇧Z</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => e.group()}
                    disabled={!e.selected.length}
                  >
                    Group selection
                    <DropdownMenuShortcut>⌘G</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e.ungroup}
                    disabled={!e.selected.length}
                  >
                    Ungroup<DropdownMenuShortcut>⌘⇧G</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={e.duplicate}
                    disabled={!e.selected.length}
                  >
                    Duplicate<DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => e.reorder("front")}
                    disabled={!e.selected.length}
                  >
                    Bring to front
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => e.reorder("back")}
                    disabled={!e.selected.length}
                  >
                    Send to back
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={openExport}>
                    Export…
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowHelp(!showHelp)}>
                    Keyboard shortcuts
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {(
                [
                  { id: "file", label: "File", icon: File },
                  { id: "assets", label: "Assets", icon: Shapes },
                  { id: "variables", label: "Styles", icon: SlidersHorizontal },
                ] as const
              ).map(({ id: tab, label, icon: Icon }) => (
                <button
                  key={tab}
                  onClick={() => setLeftTab(tab)}
                  className="flex w-full flex-col items-center gap-1.5 text-[9px]"
                >
                  <span
                    className={`flex size-8 items-center justify-center rounded-md ${leftTab === tab ? "text-primary bg-(--selection) dark:text-[#9dccff]" : "text-foreground hover:bg-muted"}`}
                  >
                    <Icon className="size-4" />
                  </span>
                  {label}
                </button>
              ))}
              <button
                onClick={() => {
                  e.setTool("frame");
                  setRightTab("design");
                }}
                className="flex flex-col items-center gap-1.5 text-[9px]"
              >
                <BriefcaseBusiness className="mb-1 size-4" />
                Tools
              </button>
              <div className="mt-auto flex flex-col gap-3">
                <IconButton
                  label="Toggle theme"
                  onClick={() =>
                    setTheme(resolvedTheme === "dark" ? "light" : "dark")
                  }
                >
                  {resolvedTheme === "dark" ? <Sun /> : <Moon />}
                </IconButton>
                <IconButton
                  label="Keyboard shortcuts"
                  onClick={() => setShowHelp(!showHelp)}
                >
                  <span className="border-border flex size-5 items-center justify-center rounded-full border text-xs">
                    ?
                  </span>
                </IconButton>
              </div>
            </nav>
            <LayersPanel
              editor={e}
              tab={leftTab}
              onCollapse={() => setPanels((p) => ({ ...p, left: false }))}
              saveStatus={
                <button
                  onClick={() => void persist()}
                  className="text-muted-foreground flex items-center gap-1.5 text-[10px]"
                  title="Save file"
                >
                  {status === "saving" ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : status === "error" ? (
                    <CloudOff className="text-destructive size-3" />
                  ) : (
                    <Check className="size-3" />
                  )}
                  {status === "saving"
                    ? "Saving…"
                    : status === "error"
                      ? "Couldn't save · Retry"
                      : e.doc !== saved.current
                        ? "Unsaved changes"
                        : onCloudSave
                          ? "All changes saved"
                          : "Demo · Saved in this browser"}
                </button>
              }
            />
          </ResponsivePanel>
          <main className="relative flex min-w-0 flex-1 flex-col">
            {!compact && !panels.left && (
              <div className="border-border bg-background absolute top-3 left-3 z-30 flex rounded-md border p-1 shadow-sm">
                <IconButton
                  label="Show layers sidebar"
                  onClick={() => setPanels((p) => ({ ...p, left: true }))}
                >
                  <PanelLeftOpen />
                </IconButton>
                <IconButton label="Back to files" asChild>
                  <Link href="/dashboard">
                    <Home />
                  </Link>
                </IconButton>
              </div>
            )}
            <div className="border-border bg-background absolute top-3 right-3 z-30 hidden items-center gap-1 rounded-md border p-1 shadow-sm lg:flex">
              <IconButton
                label="Zoom to fit (Shift+1)"
                onClick={() => fitRef.current()}
              >
                <Maximize2 />
              </IconButton>
              <IconButton
                label="Zoom to selection (Shift+2)"
                disabled={!e.selected.length}
                onClick={() => fitSelectionRef.current()}
              >
                <Focus />
              </IconButton>
              <IconButton
                label={
                  panels.left || panels.right
                    ? "Hide both sidebars (Tab)"
                    : "Show sidebars (Tab)"
                }
                onClick={() => setPanels(togglePanels)}
              >
                <PanelsTopLeft />
              </IconButton>
              {!panels.right && (
                <IconButton
                  label="Show properties sidebar"
                  onClick={() => setPanels((p) => ({ ...p, right: true }))}
                >
                  <PanelRightOpen />
                </IconButton>
              )}
            </div>
            <ContextMenu>
              <ContextMenuTrigger asChild>
                <div className="min-h-0 flex-1">
                  <DesignCanvas editor={e} onReady={setFit} />
                </div>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onSelect={e.copy}
                  disabled={!e.selected.length}
                >
                  Copy<span className="ml-auto opacity-50">⌘C</span>
                </ContextMenuItem>
                <ContextMenuItem onSelect={e.paste}>
                  Paste<span className="ml-auto opacity-50">⌘V</span>
                </ContextMenuItem>
                <ContextMenuItem
                  onSelect={e.duplicate}
                  disabled={!e.selected.length}
                >
                  Duplicate<span className="ml-auto opacity-50">⌘D</span>
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem
                  onSelect={() => e.group()}
                  disabled={!e.selected.length}
                >
                  Group selection
                </ContextMenuItem>
                <ContextMenuItem
                  onSelect={e.ungroup}
                  disabled={!e.selected.length}
                >
                  Ungroup
                </ContextMenuItem>
                <ContextMenuItem
                  onSelect={() => e.reorder("front")}
                  disabled={!e.selected.length}
                >
                  Bring to front
                </ContextMenuItem>
                <ContextMenuItem
                  onSelect={() => e.reorder("back")}
                  disabled={!e.selected.length}
                >
                  Send to back
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onSelect={openExport}>Export…</ContextMenuItem>
                <ContextMenuItem
                  onSelect={e.remove}
                  disabled={!e.selected.length}
                >
                  Delete<span className="ml-auto opacity-50">⌫</span>
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
            <DesignToolbar
              editor={e}
              onImage={() => imageRef.current?.click()}
              onInspect={() => {
                setRightTab("inspect");
                setPanels((p) => ({
                  ...p,
                  right: true,
                  ...(compact ? { left: false } : {}),
                }));
              }}
            />

            {showHelp && (
              <div className="border-border bg-background absolute bottom-32 left-3 z-30 max-h-[calc(100%-150px)] w-64 max-w-[calc(100%-24px)] overflow-y-auto rounded-xl border p-4 shadow-xl sm:bottom-24">
                <div className="mb-3 flex items-center justify-between font-semibold">
                  Keyboard shortcuts
                  <button
                    onClick={() => setShowHelp(false)}
                    aria-label="Close shortcuts"
                  >
                    <X className="size-3" />
                  </button>
                </div>
                {[
                  ["Select / Frame / Text", "V / F / T"],
                  ["Rectangle / Ellipse", "R / O"],
                  ["Pen / Hand", "P / H"],
                  ["Pan / Zoom", "Space / ⌘ + scroll"],
                  ["Undo / Redo", "⌘Z / ⌘⇧Z"],
                  ["Group / Ungroup", "⌘G / ⌘⇧G"],
                  ["Duplicate", "⌘D"],
                  ["Copy / Paste", "⌘C / ⌘V"],
                  ["Fit / Selection / 100%", "⇧1 / ⇧2 / 0"],
                  ["Hide / Show sidebars", "Tab / ⌘\\"],
                  ["Toggle layers sidebar", "⇧Tab"],
                  ["Toggle properties sidebar", "⌘⇧\\"],
                  ["Duplicate while dragging", "Alt + drag"],
                  ["Constrain drag to an axis", "⇧ + drag"],
                  ["Cancel current drag", "Esc"],
                  ["Nudge / Large nudge", "Arrows / ⇧Arrows"],
                  ["Deep select", "⌘ + click"],
                ].map(([label, keys]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-2 py-1.5 text-[10px]"
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <kbd>{keys}</kbd>
                  </div>
                ))}
                <p className="text-muted-foreground mt-3 text-[9px]">
                  Use Ctrl on Windows and Linux.
                </p>
              </div>
            )}
          </main>
          <ResponsivePanel
            compact={compact}
            open={panels.right}
            onClose={() => setPanels((p) => ({ ...p, right: false }))}
            title="Design properties"
            side="right"
            className="flex shrink-0 flex-col"
          >
            <div className="flex h-full min-h-0 flex-1 flex-col">
              <div className="border-border flex h-12 shrink-0 items-center gap-2 border-b border-l px-3">
                <IconButton
                  label="Hide properties sidebar"
                  onClick={() => setPanels((p) => ({ ...p, right: false }))}
                >
                  <PanelRightClose />
                </IconButton>
                <span className="mr-auto flex size-6 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-semibold text-white">
                  {user?.firstName?.slice(0, 2).toUpperCase() || "F"}
                </span>
                <IconButton
                  label="Present prototype"
                  onClick={openPresentation}
                >
                  <Play />
                </IconButton>
                <Button
                  size="sm"
                  className="h-8 text-[11px]"
                  onClick={openExport}
                >
                  Export
                </Button>
              </div>
              <div className="min-h-0 flex-1">
                <Inspector
                  editor={e}
                  tab={rightTab}
                  setTab={setRightTab}
                  onExport={openExport}
                  onFit={() => fitRef.current()}
                  onFitSelection={() => fitSelectionRef.current()}
                  onZoom={(zoom) => zoomRef.current(zoom)}
                />
              </div>
            </div>
          </ResponsivePanel>
        </div>
        <input
          ref={imageRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={(event) => {
            void placeImage(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
        <input
          ref={importRef}
          type="file"
          accept=".figart,.repimly,application/json"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            try {
              if (file.size > 20 * 1024 * 1024)
                throw new Error("File exceeds 20 MB.");
              const doc = normalizeDocument(JSON.parse(await file.text()));
              e.replace(doc);
              e.setPageId(doc.pages[0].id);
              e.setSelected([]);
              toast.success("Design imported");
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Invalid file",
              );
            }
          }}
        />
        <ExportDialog
          editor={e}
          open={exportOpen}
          onClose={() => setExportOpen(false)}
        />
        {present && (
          <PresentDialog editor={e} onClose={() => setPresent(false)} />
        )}
      </TooltipProvider>
    </WorkspaceTheme>
  );
}
