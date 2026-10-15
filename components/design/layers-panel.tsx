"use client";
import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  ChevronRight,
  Circle,
  Component,
  Diamond,
  Eye,
  EyeOff,
  Frame,
  Group,
  Layers,
  Lock,
  Minus,
  Plus,
  Search,
  Square,
  Type,
  Unlock,
  PenTool,
  PanelLeftClose,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { IconButton } from "./controls";
import type { DesignEditor } from "./use-design-editor";
import type { DesignNode } from "@/lib/design/document";
import { cn } from "@/lib/utils";
export const layerIcons = {
  frame: Frame,
  rectangle: Square,
  ellipse: Circle,
  line: Minus,
  text: Type,
  group: Group,
  component: Component,
  instance: Diamond,
  path: PenTool,
};
export function LayersPanel({
  editor: e,
  tab,
  menu,
  tabs,
  saveStatus,
  onCollapse,
}: {
  editor: DesignEditor;
  tab: "file" | "assets" | "variables";
  menu?: ReactNode;
  tabs?: ReactNode;
  saveStatus?: ReactNode;
  onCollapse?: () => void;
}) {
  const [collapsed, setCollapsed] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [drag, setDrag] = useState<string | null>(null);
  const [renamingPage, setRenamingPage] = useState<string | null>(null);
  const toggle = (id: string) =>
    setCollapsed((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const renderNode = (node: DesignNode, depth = 0): React.ReactNode => {
    const children = e.page.nodes
      .filter((n) => n.parentId === node.id)
      .reverse();
    const Icon = layerIcons[node.type];
    const selected = e.selected.includes(node.id),
      component = node.type === "component" || node.type === "instance";
    const match =
      !query || node.name.toLowerCase().includes(query.toLowerCase());
    if (!match && !children.length) return null;
    return (
      <div key={node.id}>
        <div
          draggable={!renaming}
          onDragStart={(event) => {
            event.dataTransfer.setData("text/plain", node.id);
            setDrag(node.id);
          }}
          onDragEnd={() => setDrag(null)}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            event.stopPropagation();
            const id = event.dataTransfer.getData("text/plain");
            if (id && id !== node.id)
              e.reparent(
                id,
                ["frame", "group", "component"].includes(node.type)
                  ? node.id
                  : node.parentId,
              );
            setDrag(null);
          }}
          onClick={(event) =>
            e.setSelected(
              event.shiftKey
                ? selected
                  ? e.selected.filter((id) => id !== node.id)
                  : [...e.selected, node.id]
                : [node.id],
            )
          }
          onDoubleClick={() => setRenaming(node.id)}
          style={{ paddingLeft: 8 + depth * 14 }}
          className={cn(
            "group hover:bg-muted flex h-8 cursor-default items-center gap-1 pr-2 text-xs",
            selected && "bg-(--selection) hover:bg-(--selection)",
            component && "text-[#b578ff]",
            !node.visible && "opacity-45",
            drag === node.id && "opacity-40",
          )}
        >
          <button
            aria-label={`${collapsed.includes(node.id) ? "Expand" : "Collapse"} ${node.name}`}
            className={cn(
              "flex size-4 shrink-0 items-center justify-center",
              !children.length && "invisible",
            )}
            onClick={(event) => {
              event.stopPropagation();
              toggle(node.id);
            }}
          >
            {collapsed.includes(node.id) ? (
              <ChevronRight className="size-3" />
            ) : (
              <ChevronDown className="size-3" />
            )}
          </button>
          <Icon className="mr-1 size-3 shrink-0" />
          {renaming === node.id ? (
            <Input
              autoFocus
              aria-label="Layer name"
              defaultValue={node.name}
              onClick={(event) => event.stopPropagation()}
              onBlur={(event) => {
                e.patch({ name: event.target.value || node.name }, [node.id]);
                setRenaming(null);
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
                event.stopPropagation();
              }}
              className="h-6 min-w-0 rounded-sm px-1 text-[11px]"
            />
          ) : (
            <span className="min-w-0 flex-1 truncate">{node.name}</span>
          )}
          <button
            aria-label={`${node.locked ? "Unlock" : "Lock"} ${node.name}`}
            className={cn(
              "ml-auto hidden shrink-0 group-hover:block",
              node.locked && "block",
            )}
            onClick={(event) => {
              event.stopPropagation();
              e.patch({ locked: !node.locked }, [node.id]);
            }}
          >
            {node.locked ? (
              <Lock className="size-3" />
            ) : (
              <Unlock className="text-muted-foreground size-3" />
            )}
          </button>
          <button
            aria-label={`${node.visible ? "Hide" : "Show"} ${node.name}`}
            className={cn(
              "ml-1 hidden shrink-0 group-hover:block",
              !node.visible && "block",
            )}
            onClick={(event) => {
              event.stopPropagation();
              e.patch({ visible: !node.visible }, [node.id]);
            }}
          >
            {node.visible ? (
              <Eye className="size-3" />
            ) : (
              <EyeOff className="size-3" />
            )}
          </button>
        </div>
        {!collapsed.includes(node.id) &&
          children.map((child) => renderNode(child, depth + 1))}
      </div>
    );
  };
  return (
    <aside
      aria-label="Layers and assets"
      className="border-border bg-background flex h-full w-[264px] shrink-0 flex-col border-r max-md:w-48"
    >
      {menu}
      <div className="border-border border-b px-4 pt-3 pb-3">
        <div className="flex min-w-0 items-center gap-2">
          <Input
            aria-label="File name"
            value={e.doc.title}
            onChange={(event) =>
              e.replace({ ...e.doc, title: event.target.value }, false)
            }
            onBlur={e.commit}
            onKeyDown={(event) => {
              if (event.key === "Enter") event.currentTarget.blur();
            }}
            className="h-6 rounded-none border-0 bg-transparent! px-0 text-[13px] md:text-[13px] font-semibold shadow-none focus-visible:ring-0"
          />
          {onCollapse && (
            <IconButton label="Hide layers sidebar" onClick={onCollapse}>
              <PanelLeftClose />
            </IconButton>
          )}
        </div>

        <div className="mt-1.5">
          {saveStatus ?? (
            <span className="text-muted-foreground text-[10px]">Drafts</span>
          )}
        </div>
      </div>
      {tabs}
      {tab === "file" && (
        <>
          <div className="border-border border-b p-2">
            <div className="mb-2 flex items-center justify-between px-2">
              <span className="text-[11px] font-semibold">Pages</span>
              <div className="flex items-center gap-1">
                <IconButton
                  label="Search layers"
                  onClick={() => setShowSearch(!showSearch)}
                >
                  <Search />
                </IconButton>
                <IconButton label="Add page" onClick={e.addPage}>
                  <Plus />
                </IconButton>
              </div>
            </div>
            {e.doc.pages.map((p) => (
              <div
                key={p.id}
                className={cn(
                  "group flex h-8 items-center gap-2 rounded-sm px-2",
                  p.id === e.page.id && "bg-muted",
                )}
              >
                {renamingPage === p.id ? (
                  <Input
                    autoFocus
                    aria-label="Page name"
                    defaultValue={p.name}
                    onBlur={(event) => {
                      e.replace({
                        ...e.doc,
                        pages: e.doc.pages.map((page) =>
                          page.id === p.id
                            ? { ...page, name: event.target.value || page.name }
                            : page,
                        ),
                      });
                      setRenamingPage(null);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") event.currentTarget.blur();
                    }}
                    className="h-6 text-[11px]"
                  />
                ) : (
                  <button
                    className="flex-1 truncate text-left text-[11px]"
                    onClick={() => {
                      e.setPageId(p.id);
                      e.setSelected([]);
                    }}
                    onDoubleClick={() => setRenamingPage(p.id)}
                  >
                    {p.name}
                  </button>
                )}
                {e.doc.pages.length > 1 && (
                  <button
                    aria-label={`Delete ${p.name}`}
                    className="text-muted-foreground hidden group-hover:block"
                    onClick={() => {
                      const pages = e.doc.pages.filter(
                        (page) => page.id !== p.id,
                      );
                      e.replace({ ...e.doc, pages });
                      if (e.pageId === p.id) e.setPageId(pages[0].id);
                      e.setSelected([]);
                    }}
                  >
                    <Trash2 className="size-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[11px] font-semibold">Layers</span>
            <Layers className="text-muted-foreground size-3.5" />
          </div>
          {showSearch && (
            <label className="bg-muted mx-3 mb-2 flex items-center gap-2 rounded-sm px-2">
              <Search className="text-muted-foreground size-3" />
              <Input
                aria-label="Search layers"
                placeholder="Search layers"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                className="h-7 border-0 bg-transparent! px-0 text-[11px] shadow-none focus-visible:ring-0"
              />
            </label>
          )}
          <div
            className="min-h-0 flex-1 overflow-y-auto pb-12"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              const id = event.dataTransfer.getData("text/plain");
              if (id) e.reparent(id, null);
            }}
          >
            {e.page.nodes
              .filter((n) => !n.parentId)
              .reverse()
              .map((n) => renderNode(n))}
            {!e.page.nodes.length && (
              <div className="text-muted-foreground px-5 py-8 text-center text-[11px] leading-relaxed">
                Your layers will appear here.
                <br />
                Draw a frame to get started.
              </div>
            )}
          </div>
        </>
      )}
      {tab === "assets" && (
        <div className="space-y-4 overflow-y-auto p-4">
          <h3 className="font-semibold">Local components</h3>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            Click a component to place an instance on this page.
          </p>
          {e.doc.pages
            .flatMap((p) => p.nodes)
            .filter((n) => n.type === "component")
            .map((n) => (
              <button
                key={n.id}
                onClick={() => e.instantiate(n)}
                className="border-border hover:bg-muted flex w-full items-center gap-3 rounded-md border p-3 text-left"
              >
                <Component className="size-5 text-[#9747ff]" />
                <span className="truncate">{n.name}</span>
              </button>
            ))}
          <button
            onClick={() => e.group("component")}
            disabled={!e.selected.length}
            className="border-border text-muted-foreground hover:bg-muted w-full rounded-md border border-dashed p-3 disabled:opacity-40"
          >
            + Create from selection
          </button>
        </div>
      )}
      {tab === "variables" && (
        <div className="space-y-4 overflow-y-auto p-4">
          <h3 className="font-semibold">Local color styles</h3>
          <p className="text-muted-foreground text-[11px] leading-relaxed">
            Apply a style to your selection. Edit a swatch to update the saved
            color.
          </p>
          {e.doc.colors.map((color, i) => (
            <div key={i} className="flex items-center gap-2">
              <input
                aria-label={`Edit ${color.name}`}
                type="color"
                value={color.value}
                className="size-6 rounded-sm border-0 bg-transparent p-0"
                onChange={(event) =>
                  e.replace({
                    ...e.doc,
                    colors: e.doc.colors.map((c, j) =>
                      j === i ? { ...c, value: event.target.value } : c,
                    ),
                  })
                }
              />
              <button
                className="flex-1 text-left"
                onClick={() => e.patch({ fill: color.value })}
              >
                {color.name}
              </button>
              <span className="text-muted-foreground font-mono text-[10px]">
                {color.value}
              </span>
            </div>
          ))}
          <button
            className="text-primary"
            onClick={() =>
              e.replace({
                ...e.doc,
                colors: [
                  ...e.doc.colors,
                  {
                    name: `Color ${e.doc.colors.length + 1}`,
                    value: e.selectedNodes[0]?.fill.startsWith("#")
                      ? e.selectedNodes[0].fill
                      : "#0d99ff",
                  },
                ],
              })
            }
          >
            + Save color style
          </button>
        </div>
      )}
    </aside>
  );
}
