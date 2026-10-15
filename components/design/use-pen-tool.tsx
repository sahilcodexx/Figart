"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createNode, type DesignNode } from "@/lib/design/document";
import {
  normalizeVector,
  offsetAnchors,
  type VectorAnchor,
  type VectorPoint,
} from "@/lib/design/vector";
import type { DesignEditor } from "./use-design-editor";

type Session = {
  id: string;
  pageId: string;
  mode: "draw" | "edit";
  selected: number;
};
type Drag = { index: number; type: "curve" | "anchor" | "in" | "out" };
export function usePenTool(editor: DesignEditor) {
  const { docRef, replace, commit, setTool, setSelected } = editor;
  const session = useRef<Session | null>(null);
  const drag = useRef<Drag | null>(null);
  const [mode, setMode] = useState<"draw" | "edit" | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hover, setHover] = useState<VectorPoint | null>(null);
  const node = editor.page.nodes.find((n) => n.id === activeId);
  const getNode = useCallback(
    () =>
      docRef.current.pages
        .flatMap((p) => p.nodes)
        .find((n) => n.id === session.current?.id),
    [docRef],
  );
  const update = useCallback(
    (fn: (node: DesignNode) => DesignNode | null) => {
      const id = session.current?.id;
      if (!id) return;
      const current = docRef.current;
      replace(
        {
          ...current,
          pages: current.pages.map((page) => ({
            ...page,
            nodes: page.nodes.flatMap((n) => {
              if (n.id !== id) return [n];
              const next = fn(n);
              return next ? [next] : [];
            }),
          })),
        },
        false,
      );
    },
    [docRef, replace],
  );
  const finish = useCallback(
    (closed?: boolean, changeTool = true) => {
      const n = getNode();
      if (n) {
        const valid = (n.anchors?.length ?? 0) >= 2;
        update((node) =>
          valid
            ? normalizeVector(node, node.anchors!, closed ?? node.closed)
            : null,
        );
        if (!valid) setSelected([]);
      }
      if (session.current) commit();
      session.current = null;
      drag.current = null;
      setActiveId(null);
      setMode(null);
      setHover(null);
      if (changeTool) setTool("move");
    },
    [getNode, update, commit, setTool, setSelected],
  );
  useEffect(() => {
    if (
      session.current &&
      (editor.tool !== "pen" || editor.page.id !== session.current.pageId)
    ) {
      queueMicrotask(() => finish(undefined, false));
    }
  }, [editor.tool, editor.page.id, finish]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        !session.current ||
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        event.target instanceof HTMLSelectElement ||
        (event.target instanceof HTMLElement &&
          event.target.closest('[role="menu"], [role="dialog"]'))
      )
        return;
      const mod = event.ctrlKey || event.metaKey;
      if (mod && event.key.toLowerCase() === "z") {
        finish();
        return;
      }
      if (event.key === "Enter" || event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        finish();
      } else if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
        event.stopImmediatePropagation();
        const selected = session.current.selected;
        update((n) => {
          const anchors = (n.anchors ?? []).filter((_, i) => i !== selected);
          if (!anchors.length) return null;
          session.current!.selected = Math.min(selected, anchors.length - 1);
          return normalizeVector(n, anchors, n.closed && anchors.length > 2);
        });
        if (!getNode()) finish();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [finish, update, getNode]);
  const local = (point: VectorPoint, n: DesignNode) => {
    const angle = (-n.rotation * Math.PI) / 180,
      cx = n.x + n.width / 2,
      cy = n.y + n.height / 2;
    const dx = point.x - cx,
      dy = point.y - cy;
    return {
      x: dx * Math.cos(angle) - dy * Math.sin(angle) + cx - n.x,
      y: dx * Math.sin(angle) + dy * Math.cos(angle) + cy - n.y,
    };
  };
  const down = (point: VectorPoint, target: Element, zoom: number) => {
    if (editor.tool !== "pen") return false;
    const existing = getNode();
    const anchorIndex = target.getAttribute("data-vector-anchor");
    const handle = target.getAttribute("data-vector-handle");
    if (existing?.anchors && anchorIndex !== null) {
      const index = Number(anchorIndex);
      if (!existing.anchors[index]) return true;
      if (
        session.current?.mode === "draw" &&
        index === 0 &&
        existing.anchors.length >= 2 &&
        !handle
      ) {
        finish(true);
        return true;
      }
      session.current!.selected = index;
      drag.current = {
        index,
        type: handle === "in" || handle === "out" ? handle : "anchor",
      };
      return true;
    }
    if (existing?.anchors && session.current?.mode === "edit") return true;
    if (existing?.anchors) {
      const p = local(point, existing),
        first = existing.anchors[0],
        last = existing.anchors.at(-1)!;
      if (
        existing.anchors.length >= 2 &&
        Math.hypot(p.x - first.x, p.y - first.y) * zoom < 8
      ) {
        finish(true);
        return true;
      }
      if (Math.hypot(p.x - last.x, p.y - last.y) * zoom < 3) return true;
      const index = existing.anchors.length;
      update((n) => normalizeVector(n, [...n.anchors!, p], false));
      session.current!.selected = index;
      drag.current = { index, type: "curve" };
      return true;
    }
    const parent = [...editor.page.nodes]
      .reverse()
      .find(
        (n) =>
          n.type === "frame" &&
          n.visible &&
          !n.locked &&
          point.x >= n.x &&
          point.x <= n.x + n.width &&
          point.y >= n.y &&
          point.y <= n.y + n.height,
      );
    const n = createNode("path", {
      name: "Vector",
      x: point.x,
      y: point.y,
      width: 1,
      height: 1,
      fill: "none",
      stroke: "#7c7c7c",
      strokeWidth: 2,
      parentId: parent?.id ?? null,
      anchors: [{ x: 0, y: 0 }],
      closed: false,
    });
    session.current = {
      id: n.id,
      pageId: editor.page.id,
      mode: "draw",
      selected: 0,
    };
    drag.current = { index: 0, type: "curve" };
    setActiveId(n.id);
    setMode("draw");
    setHover(null);
    setSelected([n.id]);
    const current = docRef.current;
    replace(
      {
        ...current,
        pages: current.pages.map((p) =>
          p.id === editor.page.id ? { ...p, nodes: [...p.nodes, n] } : p,
        ),
      },
      false,
    );
    return true;
  };
  const move = (point: VectorPoint, altKey: boolean) => {
    if (!session.current || editor.tool !== "pen") return false;
    const n = getNode();
    if (!n?.anchors) return true;
    if (!drag.current) {
      setHover(local(point, n));
      return true;
    }
    const { index, type } = drag.current;
    const p = local(point, n),
      a = n.anchors[index];
    if (!a) return true;
    let anchor: VectorAnchor;
    if (type === "anchor") anchor = offsetAnchors([a], p.x - a.x, p.y - a.y)[0];
    else if (type === "curve") {
      anchor = {
        ...a,
        out: p,
        ...(altKey ? {} : { in: { x: 2 * a.x - p.x, y: 2 * a.y - p.y } }),
      };
    } else
      anchor = {
        ...a,
        [type]: p,
        ...(altKey
          ? {}
          : {
              [type === "in" ? "out" : "in"]: {
                x: 2 * a.x - p.x,
                y: 2 * a.y - p.y,
              },
            }),
      };
    update((node) =>
      normalizeVector(
        node,
        node.anchors!.map((a, i) => (i === index ? anchor : a)),
        node.closed,
      ),
    );
    setHover(null);
    return true;
  };
  const up = () => {
    if (!drag.current) return false;
    drag.current = null;
    return true;
  };
  const edit = (n: DesignNode) => {
    if (n.type !== "path" || !n.anchors || n.locked) return false;
    session.current = {
      id: n.id,
      pageId: editor.page.id,
      mode: "edit",
      selected: 0,
    };
    setActiveId(n.id);
    setMode("edit");
    setSelected([n.id]);
    setTool("pen");
    setHover(null);
    return true;
  };
  return {
    down,
    move,
    up,
    edit,
    finish,
    node,
    hover,
    drawing: mode === "draw",
  };
}

export function VectorOverlay({
  node,
  hover,
  drawing,
  zoom,
}: {
  node: DesignNode;
  hover: VectorPoint | null;
  drawing: boolean;
  zoom: number;
}) {
  const anchors = node.anchors ?? [],
    last = anchors.at(-1);
  return (
    <g
      transform={
        node.rotation
          ? `rotate(${node.rotation} ${node.x + node.width / 2} ${node.y + node.height / 2})`
          : undefined
      }
    >
      {drawing && hover && last && (
        <path
          d={`M${node.x + last.x} ${node.y + last.y} C${node.x + (last.out ?? last).x} ${node.y + (last.out ?? last).y} ${node.x + hover.x} ${node.y + hover.y} ${node.x + hover.x} ${node.y + hover.y}`}
          fill="none"
          stroke="#0d99ff"
          strokeWidth={1 / zoom}
          strokeDasharray={`${4 / zoom} ${3 / zoom}`}
          pointerEvents="none"
        />
      )}
      {anchors.map((anchor, index) => (
        <g key={index}>
          {(["in", "out"] as const).map((side) => {
            const handle = anchor[side];
            return handle ? (
              <g key={side}>
                <line
                  x1={node.x + anchor.x}
                  y1={node.y + anchor.y}
                  x2={node.x + handle.x}
                  y2={node.y + handle.y}
                  stroke="#0d99ff"
                  strokeWidth={1 / zoom}
                  pointerEvents="none"
                />
                <circle
                  data-vector-anchor={index}
                  data-vector-handle={side}
                  cx={node.x + handle.x}
                  cy={node.y + handle.y}
                  r={4 / zoom}
                  fill="white"
                  stroke="#0d99ff"
                  strokeWidth={1 / zoom}
                  className="cursor-move"
                />
              </g>
            ) : null;
          })}
          <rect
            data-vector-anchor={index}
            x={node.x + anchor.x - 4 / zoom}
            y={node.y + anchor.y - 4 / zoom}
            width={8 / zoom}
            height={8 / zoom}
            rx={index === 0 && drawing ? 4 / zoom : 1 / zoom}
            fill="white"
            stroke="#0d99ff"
            strokeWidth={1.5 / zoom}
            className="cursor-move"
          />
        </g>
      ))}
    </g>
  );
}
