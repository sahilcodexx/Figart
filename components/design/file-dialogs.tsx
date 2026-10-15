"use client";
import { useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download, ArrowLeft, ArrowRight, X } from "lucide-react";
import { descendants, DesignNode, getBounds } from "@/lib/design/document";
import { downloadFile } from "@/lib/design/storage";
import { DocumentGraphics } from "./node-renderer";
import { WorkspaceTheme } from "./workspace-theme";
import type { DesignEditor } from "./use-design-editor";
import { toast } from "sonner";

export function ExportDialog({
  editor: e,
  open,
  onClose,
}: {
  editor: DesignEditor;
  open: boolean;
  onClose: () => void;
}) {
  const [format, setFormat] = useState("svg");
  const [scale, setScale] = useState("1");
  const [busy, setBusy] = useState(false);
  const doExport = async () => {
    setBusy(true);
    try {
      if (format === "figart") {
        downloadFile(JSON.stringify(e.doc, null, 2), `${e.doc.title}.figart`);
        return;
      }
      const ids = e.selected.length
        ? descendants(e.page.nodes, e.selected)
        : e.page.nodes.map((n) => n.id);
      const nodes = e.page.nodes
        .filter((n) => ids.includes(n.id))
        .map((n) => ({
          ...n,
          parentId: ids.includes(n.parentId ?? "") ? n.parentId : null,
        }));
      const b = getBounds(nodes.filter((n) => !n.parentId && n.visible));
      const markup = renderToStaticMarkup(
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={Math.ceil(b.width)}
          height={Math.ceil(b.height)}
          viewBox={`${b.x} ${b.y} ${b.width} ${b.height}`}
        >
          <DocumentGraphics nodes={nodes} />
        </svg>,
      );
      if (format === "svg")
        downloadFile(markup, `${e.doc.title}.svg`, "image/svg+xml");
      else {
        const factor = Number(scale);
        if (
          b.width * factor > 16384 ||
          b.height * factor > 16384 ||
          b.width * b.height * factor * factor > 64000000
        )
          throw new Error(
            "Export is too large. Select a frame or use a smaller scale.",
          );
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(b.width * factor);
        canvas.height = Math.ceil(b.height * factor);
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Canvas export unavailable.");
        const image = new Image();
        const url = URL.createObjectURL(
          new Blob([markup], { type: "image/svg+xml" }),
        );
        try {
          await new Promise<void>((resolve, reject) => {
            image.onload = () => resolve();
            image.onerror = () => reject(new Error("Could not render export."));
            image.src = url;
          });
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
        } finally {
          URL.revokeObjectURL(url);
        }
        const blob = await new Promise<Blob | null>((resolve) =>
          canvas.toBlob(resolve, "image/png"),
        );
        if (!blob) throw new Error("Could not create PNG.");
        downloadFile(blob, `${e.doc.title}.png`);
      }
      toast.success("Export downloaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Export failed");
    } finally {
      setBusy(false);
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent className="max-h-[calc(100dvh-24px)] overflow-y-auto border-0 p-0 sm:max-w-sm">
        <WorkspaceTheme className="p-6">
          <DialogHeader>
            <DialogTitle className="text-sm">
              Export {e.selected.length ? "selection" : e.page.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground text-xs">
              Download your design or a complete editable file.
            </DialogDescription>
          </DialogHeader>
          <div className="my-6 grid grid-cols-2 gap-3">
            <label className="space-y-2">
              Format
              <select
                aria-label="Export format"
                value={format}
                onChange={(event) => setFormat(event.target.value)}
                className="bg-muted h-9 w-full rounded-md px-2"
              >
                <option value="svg">SVG</option>
                <option value="png">PNG</option>
                <option value="figart">Figart file</option>
              </select>
            </label>
            <label className="space-y-2">
              Scale
              <select
                aria-label="Export scale"
                value={scale}
                onChange={(event) => setScale(event.target.value)}
                disabled={format !== "png"}
                className="bg-muted h-9 w-full rounded-md px-2 disabled:opacity-40"
              >
                {[1, 2, 3, 4].map((n) => (
                  <option key={n} value={n}>
                    {n}×
                  </option>
                ))}
              </select>
            </label>
          </div>
          <Button onClick={doExport} disabled={busy} className="w-full text-xs">
            <Download className="size-4" />
            {busy ? "Exporting…" : "Export"}
          </Button>
        </WorkspaceTheme>
      </DialogContent>
    </Dialog>
  );
}
export function PresentDialog({
  editor: e,
  onClose,
}: {
  editor: DesignEditor;
  onClose: () => void;
}) {
  const frames = e.page.nodes.filter(
    (n) => n.type === "frame" && !n.parentId && n.visible,
  );
  const [frameId, setFrameId] = useState(
    e.selectedNodes.find((n) => n.type === "frame")?.id ?? frames[0]?.id,
  );
  const [back, setBack] = useState<string[]>([]);
  const frame = frames.find((f) => f.id === frameId) ?? frames[0];
  const ids = frame
    ? descendants(e.page.nodes, [frame.id])
    : e.page.nodes.map((n) => n.id);
  const nodes = e.page.nodes
    .filter((n) => ids.includes(n.id))
    .map((n) => ({ ...n, parentId: n.id === frame?.id ? null : n.parentId }));
  const bounds = frame ?? getBounds(nodes);
  const navigate = (n: DesignNode) => {
    if (n.prototypeTarget && frames.some((f) => f.id === n.prototypeTarget)) {
      setBack((prev) => [...prev, frameId!]);
      setFrameId(n.prototypeTarget);
    }
  };
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex h-[95dvh] max-w-[96vw]! flex-col gap-0 overflow-hidden border-neutral-700 bg-[#161616] p-0 text-white"
      >
        <DialogHeader className="flex h-14 shrink-0 flex-row items-center justify-between gap-2 border-b border-white/10 px-3 sm:px-5">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              disabled={!back.length}
              aria-label="Go back"
              onClick={() => {
                setFrameId(back.at(-1) ?? frames[0]?.id);
                setBack((prev) => prev.slice(0, -1));
              }}
            >
              <ArrowLeft />
            </Button>
            <DialogTitle className="truncate text-xs">
              {e.doc.title} <span className="mx-2 text-neutral-500">/</span>{" "}
              {frame?.name ?? e.page.name}
            </DialogTitle>
            <DialogDescription className="sr-only">
              Interactive prototype preview
            </DialogDescription>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-[11px] text-neutral-400 md:inline">
              Click connected layers to navigate
            </span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Close preview"
              onClick={onClose}
            >
              <X />
            </Button>
          </div>
        </DialogHeader>
        <div className="flex min-h-0 flex-1 items-center justify-center p-8">
          <svg
            viewBox={`${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`}
            className="h-full max-h-full w-full"
            aria-label="Prototype preview"
          >
            <DocumentGraphics nodes={nodes} onNodeClick={navigate} />
          </svg>
        </div>
        {frames.length > 1 && (
          <div className="flex h-12 shrink-0 items-center justify-center gap-4 border-t border-white/10">
            <button
              aria-label="Previous frame"
              onClick={() =>
                setFrameId(
                  frames[
                    (frames.findIndex((f) => f.id === frameId) -
                      1 +
                      frames.length) %
                      frames.length
                  ].id,
                )
              }
            >
              <ArrowLeft className="size-4" />
            </button>
            <span className="text-[11px]">
              {frames.findIndex((f) => f.id === frameId) + 1} / {frames.length}
            </span>
            <button
              aria-label="Next frame"
              onClick={() =>
                setFrameId(
                  frames[
                    (frames.findIndex((f) => f.id === frameId) + 1) %
                      frames.length
                  ].id,
                )
              }
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
