import { createStarterDocument } from "./starter.ts";
import type { VectorAnchor } from "./vector.ts";
import { validAnchors } from "./vector.ts";
export type NodeKind =
  | "frame"
  | "rectangle"
  | "ellipse"
  | "line"
  | "text"
  | "group"
  | "component"
  | "instance"
  | "path";
export type DesignNode = {
  id: string;
  type: NodeKind;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  fill: string;
  stroke: string;
  strokeWidth: number;
  radius: number;
  opacity: number;
  visible: boolean;
  locked: boolean;
  parentId: string | null;
  text: string;
  fontSize: number;
  fontWeight: number;
  fontFamily: string;
  textAlign: "left" | "center" | "right";
  layout: "none" | "horizontal" | "vertical";
  gap: number;
  padding: number;
  clip: boolean;
  shadow: boolean;
  componentId?: string;
  prototypeTarget?: string;
  image?: string;
  points?: { x: number; y: number }[];
  anchors?: VectorAnchor[];
  closed?: boolean;
};
export type DesignPage = {
  id: string;
  name: string;
  background: string;
  nodes: DesignNode[];
};
export type DesignDocument = {
  format: "repimly-design";
  version: 1;
  title: string;
  pages: DesignPage[];
  colors: { name: string; value: string }[];
};
export type Tool =
  | "move"
  | "frame"
  | "rectangle"
  | "ellipse"
  | "line"
  | "pen"
  | "text"
  | "hand";
export type Bounds = { x: number; y: number; width: number; height: number };
export const uid = () => crypto.randomUUID();
export const containerTypes: NodeKind[] = [
  "frame",
  "group",
  "component",
  "instance",
];
export const isContainer = (node: DesignNode) =>
  containerTypes.includes(node.type);
export function createNode(
  type: NodeKind,
  props: Partial<DesignNode> = {},
): DesignNode {
  return {
    id: props.id ?? uid(),
    type,
    name: type[0].toUpperCase() + type.slice(1),
    x: 0,
    y: 0,
    width: type === "frame" ? 390 : type === "text" ? 240 : 160,
    height:
      type === "frame" ? 844 : type === "text" ? 42 : type === "line" ? 0 : 120,
    rotation: 0,
    fill:
      type === "frame" ? "#ffffff" : type === "text" ? "#1e1e1e" : "#d9d9d9",
    stroke: type === "line" ? "#1e1e1e" : "none",
    strokeWidth: type === "line" ? 2 : 0,
    radius: 0,
    opacity: 1,
    visible: true,
    locked: false,
    parentId: null,
    text: "Your text",
    fontSize: 24,
    fontWeight: 400,
    fontFamily: "Inter",
    textAlign: "left",
    layout: "none",
    gap: 16,
    padding: 24,
    clip: type === "frame",
    shadow: false,
    ...props,
  };
}
export function blankDocument(title = "Untitled"): DesignDocument {
  return {
    format: "repimly-design",
    version: 1,
    title,
    pages: [{ id: uid(), name: "Page 1", background: "#1e1e1e", nodes: [] }],
    colors: [
      { name: "Brand", value: "#0d99ff" },
      { name: "Ink", value: "#1e1e1e" },
      { name: "Surface", value: "#ffffff" },
      { name: "Component", value: "#9747ff" },
    ],
  };
}
export function getBounds(nodes: DesignNode[]): Bounds {
  if (!nodes.length) return { x: 0, y: 0, width: 1000, height: 800 };
  const x = Math.min(...nodes.map((n) => n.x));
  const y = Math.min(...nodes.map((n) => n.y));
  return {
    x,
    y,
    width: Math.max(1, ...nodes.map((n) => n.x + n.width - x)),
    height: Math.max(1, ...nodes.map((n) => n.y + n.height - y)),
  };
}
export function descendants(nodes: DesignNode[], ids: string[]): string[] {
  const result = new Set(ids);
  let size = -1;
  while (size !== result.size) {
    size = result.size;
    for (const node of nodes)
      if (node.parentId && result.has(node.parentId)) result.add(node.id);
  }
  return [...result];
}
export function rootsOf(nodes: DesignNode[], ids: string[]) {
  const selected = new Set(ids);
  const byId = new Map(nodes.map((n) => [n.id, n]));
  return nodes.filter((n) => {
    if (!selected.has(n.id)) return false;
    let parentId = n.parentId;
    const seen = new Set<string>();
    while (parentId && !seen.has(parentId)) {
      if (selected.has(parentId)) return false;
      seen.add(parentId);
      parentId = byId.get(parentId)?.parentId ?? null;
    }
    return true;
  });
}
export function applyLayout(nodes: DesignNode[]): DesignNode[] {
  let next = nodes;
  const depth = (node: DesignNode) => {
    let count = 0;
    let parent = nodes.find((n) => n.id === node.parentId);
    const seen = new Set<string>();
    while (parent && !seen.has(parent.id)) {
      seen.add(parent.id);
      count++;
      parent = nodes.find((n) => n.id === parent!.parentId);
    }
    return count;
  };
  const containers = next
    .filter((n) => isContainer(n) && n.layout !== "none")
    .sort((a, b) => depth(a) - depth(b));
  for (const original of containers) {
    const parent = next.find((n) => n.id === original.id)!;
    let cursor = parent.padding;
    for (const child of next.filter((n) => n.parentId === parent.id)) {
      const x =
        parent.x + (parent.layout === "horizontal" ? cursor : parent.padding);
      const y =
        parent.y + (parent.layout === "vertical" ? cursor : parent.padding);
      const dx = x - child.x,
        dy = y - child.y;
      if (dx || dy) {
        const ids = new Set(descendants(next, [child.id]));
        next = next.map((n) =>
          ids.has(n.id) ? { ...n, x: n.x + dx, y: n.y + dy } : n,
        );
      }
      cursor +=
        (parent.layout === "horizontal" ? child.width : child.height) +
        parent.gap;
    }
  }
  return next;
}
export function cloneNodes(
  nodes: DesignNode[],
  selected: string[],
  offset = 24,
): { nodes: DesignNode[]; selected: string[] } {
  const roots = rootsOf(nodes, selected);
  const allIds = descendants(
    nodes,
    roots.map((n) => n.id),
  );
  const idMap = new Map(allIds.map((id) => [id, uid()]));
  return {
    nodes: nodes
      .filter((n) => allIds.includes(n.id))
      .map((n) => ({
        ...n,
        id: idMap.get(n.id)!,
        name: n.name + " copy",
        x: n.x + offset,
        y: n.y + offset,
        parentId: idMap.get(n.parentId ?? "") ?? n.parentId,
      })),
    selected: roots.map((n) => idMap.get(n.id)!),
  };
}
export function normalizeDocument(value: unknown): DesignDocument {
  if (!value || typeof value !== "object")
    throw new Error("This is not a Figart design file.");
  const doc = value as DesignDocument;
  if (
    doc.format !== "repimly-design" ||
    doc.version !== 1 ||
    !Array.isArray(doc.pages) ||
    !doc.pages.length ||
    doc.pages.length > 100
  )
    throw new Error(
      "Unsupported design file. Import a .figart file exported from this editor.",
    );
  const ids = new Set<string>();
  const kinds: NodeKind[] = [
    ...containerTypes,
    "rectangle",
    "ellipse",
    "line",
    "text",
    "path",
  ];
  const numeric = [
    "x",
    "y",
    "width",
    "height",
    "rotation",
    "strokeWidth",
    "radius",
    "opacity",
    "fontSize",
    "fontWeight",
    "gap",
    "padding",
  ] as const;
  const pages = doc.pages.map((page) => {
    if (
      !page ||
      typeof page.id !== "string" ||
      !Array.isArray(page.nodes) ||
      page.nodes.length > 10000 ||
      ids.has(page.id)
    )
      throw new Error("Invalid page data.");
    ids.add(page.id);
    const nodes = page.nodes.map((raw) => {
      if (
        !raw ||
        typeof raw.id !== "string" ||
        ids.has(raw.id) ||
        !kinds.includes(raw.type)
      )
        throw new Error("Invalid or duplicate layer.");
      ids.add(raw.id);
      const n = createNode(raw.type, raw);
      for (const key of numeric)
        if (!Number.isFinite(n[key]) || Math.abs(n[key]) > 1000000)
          throw new Error("Invalid layer dimensions.");
      if (n.width < 0 || n.height < 0 || n.opacity < 0 || n.opacity > 1)
        throw new Error("Invalid layer size or opacity.");
      for (const key of [
        "name",
        "fill",
        "stroke",
        "text",
        "fontFamily",
      ] as const)
        if (typeof n[key] !== "string")
          throw new Error("Invalid layer properties.");
      for (const key of ["visible", "locked", "clip", "shadow"] as const) {
        if (typeof n[key] !== "boolean")
          throw new Error("Invalid layer flags.");
      }
      if (n.parentId !== null && typeof n.parentId !== "string")
        throw new Error("Invalid layer parent.");
      if (
        !["none", "horizontal", "vertical"].includes(n.layout) ||
        !["left", "center", "right"].includes(n.textAlign)
      )
        throw new Error("Invalid layout properties.");
      if (
        n.strokeWidth < 0 ||
        n.radius < 0 ||
        n.fontSize <= 0 ||
        n.padding < 0 ||
        n.gap < 0
      )
        throw new Error("Invalid layer properties.");
      if (
        ![n.fill, n.stroke].every((paint) =>
          /^(none|#[0-9a-f]{3}|#[0-9a-f]{6}|#[0-9a-f]{8})$/i.test(paint),
        )
      )
        throw new Error("Invalid paint color.");
      if (n.anchors !== undefined && !validAnchors(n.anchors))
        throw new Error("Invalid vector anchors.");
      if (n.closed !== undefined && typeof n.closed !== "boolean")
        throw new Error("Invalid vector closure.");
      if (n.image && !/^data:image\/(png|jpeg|webp|gif);base64,/.test(n.image))
        throw new Error("Only embedded raster images are supported.");
      if (
        n.points &&
        (!Array.isArray(n.points) ||
          n.points.length > 50000 ||
          n.points.some((p) => !Number.isFinite(p.x) || !Number.isFinite(p.y)))
      )
        throw new Error("Invalid vector path.");
      return n;
    });
    const byId = new Map(nodes.map((n) => [n.id, n]));
    for (const n of nodes) {
      const seen = new Set([n.id]);
      let parent = n.parentId;
      while (parent) {
        const p = byId.get(parent);
        if (!p || !isContainer(p) || seen.has(parent))
          throw new Error("Invalid layer hierarchy.");
        seen.add(parent);
        parent = p.parentId;
      }
    }
    return {
      ...page,
      name: String(page.name || "Page"),
      background: /^#[0-9a-f]{6}$/i.test(page.background)
        ? page.background
        : "#1e1e1e",
      nodes,
    };
  });
  const colors = Array.isArray(doc.colors)
    ? doc.colors
        .filter(
          (c) =>
            c && typeof c.name === "string" && /^#[0-9a-f]{6}$/i.test(c.value),
        )
        .slice(0, 100)
    : [];
  return {
    format: "repimly-design",
    version: 1,
    title: String(doc.title || "Untitled").slice(0, 200),
    pages,
    colors,
  };
}

export function starterDocument(): DesignDocument {
  return createStarterDocument();
}
