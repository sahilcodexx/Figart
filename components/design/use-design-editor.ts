"use client";
import { scaleAnchors } from "@/lib/design/vector";
import { useCallback, useRef, useState } from "react";
import {
  applyLayout,
  cloneNodes,
  createNode,
  descendants,
  DesignDocument,
  DesignNode,
  getBounds,
  isContainer,
  NodeKind,
  rootsOf,
  Tool,
  uid,
} from "@/lib/design/document";

export function useDesignEditor(initial: DesignDocument) {
  const [doc, setDoc] = useState(initial);
  const docRef = useRef(doc);
  const [pageId, setPageId] = useState(initial.pages[0].id);
  const [selected, setSelected] = useState<string[]>([]);
  const [tool, setTool] = useState<Tool>("move");
  const [view, setView] = useState({ x: 90, y: 100, zoom: 0.6 });
  const [grid, setGrid] = useState(false);
  const history = useRef<DesignDocument[]>([initial]);
  const index = useRef(0);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [historyLength, setHistoryLength] = useState(1);
  const clipboard = useRef<DesignNode[]>([]);
  const page = doc.pages.find((p) => p.id === pageId) ?? doc.pages[0];
  const selectedNodes = page.nodes.filter((n) => selected.includes(n.id));
  const replace = useCallback((next: DesignDocument, commit = true) => {
    docRef.current = next;
    setDoc(next);
    if (
      commit &&
      JSON.stringify(history.current[index.current]) !== JSON.stringify(next)
    ) {
      history.current = [
        ...history.current.slice(0, index.current + 1),
        next,
      ].slice(-100);
      index.current = history.current.length - 1;
      setHistoryIndex(index.current);
      setHistoryLength(history.current.length);
    }
  }, []);
  const commit = useCallback(() => replace(docRef.current), [replace]);
  const updateNodes = useCallback(
    (fn: (nodes: DesignNode[]) => DesignNode[], commit = true) => {
      const current = docRef.current;
      replace(
        {
          ...current,
          pages: current.pages.map((p) =>
            p.id ===
            (current.pages.some((page) => page.id === pageId)
              ? pageId
              : current.pages[0].id)
              ? { ...p, nodes: applyLayout(fn(p.nodes)) }
              : p,
          ),
        },
        commit,
      );
    },
    [pageId, replace],
  );
  const patch = useCallback(
    (props: Partial<DesignNode>, ids = selected, commit = true) => {
      updateNodes(
        (nodes) =>
          nodes.map((n) => {
            if (!ids.includes(n.id)) return n;
            const resized =
              props.width !== undefined || props.height !== undefined;
            const sx = (props.width ?? n.width) / Math.max(1, n.width),
              sy = (props.height ?? n.height) / Math.max(1, n.height);
            return {
              ...n,
              ...props,
              ...(resized && n.anchors
                ? { anchors: scaleAnchors(n.anchors, sx, sy) }
                : {}),
              ...(resized && n.points
                ? {
                    points: n.points.map((p) => ({ x: p.x * sx, y: p.y * sy })),
                  }
                : {}),
            };
          }),
        commit,
      );
    },
    [selected, updateNodes],
  );
  const move = useCallback(
    (ids: string[], dx: number, dy: number, commit = true) => {
      updateNodes((nodes) => {
        const all = descendants(
          nodes,
          rootsOf(nodes, ids)
            .filter((n) => !n.locked)
            .map((n) => n.id),
        );
        return nodes.map((n) =>
          all.includes(n.id) ? { ...n, x: n.x + dx, y: n.y + dy } : n,
        );
      }, commit);
    },
    [updateNodes],
  );
  const undo = useCallback(() => {
    if (index.current < 1) return;
    index.current--;
    replace(history.current[index.current], false);
    setHistoryIndex(index.current);
    setSelected([]);
  }, [replace]);
  const redo = useCallback(() => {
    if (index.current >= history.current.length - 1) return;
    index.current++;
    replace(history.current[index.current], false);
    setHistoryIndex(index.current);
    setSelected([]);
  }, [replace]);
  const add = useCallback(
    (type: NodeKind, props: Partial<DesignNode> = {}) => {
      const node = createNode(type, props);
      updateNodes((nodes) => [...nodes, node]);
      setSelected([node.id]);
      setTool("move");
      return node;
    },
    [updateNodes],
  );
  const remove = useCallback(() => {
    updateNodes((nodes) => {
      const ids = descendants(
        nodes,
        selected.filter((id) => !nodes.find((n) => n.id === id)?.locked),
      );
      return nodes.filter((n) => !ids.includes(n.id));
    });
    setSelected([]);
  }, [selected, updateNodes]);
  const duplicate = useCallback(() => {
    const copy = cloneNodes(page.nodes, selected);
    updateNodes((nodes) => [...nodes, ...copy.nodes]);
    setSelected(copy.selected);
  }, [page.nodes, selected, updateNodes]);
  const duplicateForDrag = useCallback(
    (ids: string[]) => {
      const current =
        docRef.current.pages.find((p) => p.id === page.id)?.nodes ?? [];
      const editable = rootsOf(current, ids)
        .filter((n) => !n.locked)
        .map((n) => n.id);
      const copied = cloneNodes(current, editable, 0);
      if (!copied.selected.length) return [];
      updateNodes((nodes) => [...nodes, ...copied.nodes], false);
      setSelected(copied.selected);
      return copied.selected;
    },
    [page.id, updateNodes],
  );
  const copy = useCallback(() => {
    const ids = descendants(page.nodes, selected);
    clipboard.current = page.nodes.filter((n) => ids.includes(n.id));
  }, [page.nodes, selected]);
  const paste = useCallback(() => {
    if (!clipboard.current.length) return;
    const ids = clipboard.current
      .filter((n) => !clipboard.current.some((p) => p.id === n.parentId))
      .map((n) => n.id);
    const copied = cloneNodes(clipboard.current, ids);
    updateNodes((nodes) => [
      ...nodes,
      ...copied.nodes.map((n) => ({
        ...n,
        parentId: copied.nodes.some((p) => p.id === n.parentId)
          ? n.parentId
          : null,
      })),
    ]);
    setSelected(copied.selected);
  }, [updateNodes]);
  const group = useCallback(
    (type: NodeKind = "group") => {
      if (!selected.length) return;
      const roots = rootsOf(page.nodes, selected);
      const parentId = roots.every((n) => n.parentId === roots[0].parentId)
        ? roots[0].parentId
        : null;
      const node = createNode(type, {
        ...getBounds(roots),
        fill: "none",
        parentId,
      });
      updateNodes((nodes) => [
        ...nodes.map((n) =>
          roots.some((r) => r.id === n.id) ? { ...n, parentId: node.id } : n,
        ),
        node,
      ]);
      setSelected([node.id]);
    },
    [page.nodes, selected, updateNodes],
  );
  const ungroup = useCallback(() => {
    updateNodes((nodes) =>
      nodes
        .filter((n) => !(selected.includes(n.id) && isContainer(n)))
        .map((n) => {
          const parent = nodes.find(
            (p) =>
              p.id === n.parentId && selected.includes(p.id) && isContainer(p),
          );
          return parent ? { ...n, parentId: parent.parentId } : n;
        }),
    );
    setSelected([]);
  }, [selected, updateNodes]);
  const reparent = useCallback(
    (id: string, parentId: string | null) => {
      if (parentId && descendants(page.nodes, [id]).includes(parentId)) return;
      patch({ parentId }, [id]);
    },
    [page.nodes, patch],
  );
  const reorder = useCallback(
    (direction: "front" | "back" | "forward" | "backward") => {
      updateNodes((nodes) => {
        const next = [...nodes];
        const order =
          direction === "back" || direction === "backward"
            ? selected
            : [...selected].reverse();
        for (const id of order) {
          const i = next.findIndex((n) => n.id === id);
          if (i < 0) continue;
          const target =
            direction === "front"
              ? next.length - 1
              : direction === "back"
                ? 0
                : Math.min(
                    next.length - 1,
                    Math.max(0, i + (direction === "forward" ? 1 : -1)),
                  );
          const [node] = next.splice(i, 1);
          next.splice(target, 0, node);
        }
        return next;
      });
    },
    [selected, updateNodes],
  );
  const align = useCallback(
    (direction: "left" | "center" | "right" | "top" | "middle" | "bottom") => {
      const b = getBounds(selectedNodes);
      updateNodes((nodes) => {
        let next = nodes;
        for (const n of rootsOf(nodes, selected)) {
          const dx =
            direction === "left"
              ? b.x - n.x
              : direction === "center"
                ? b.x + (b.width - n.width) / 2 - n.x
                : direction === "right"
                  ? b.x + b.width - n.x - n.width
                  : 0;
          const dy =
            direction === "top"
              ? b.y - n.y
              : direction === "middle"
                ? b.y + (b.height - n.height) / 2 - n.y
                : direction === "bottom"
                  ? b.y + b.height - n.y - n.height
                  : 0;
          const ids = descendants(next, [n.id]);
          next = next.map((c) =>
            ids.includes(c.id) ? { ...c, x: c.x + dx, y: c.y + dy } : c,
          );
        }
        return next;
      });
    },
    [selected, selectedNodes, updateNodes],
  );
  const addPage = () => {
    const id = uid();
    replace({
      ...docRef.current,
      pages: [
        ...docRef.current.pages,
        {
          id,
          name: `Page ${doc.pages.length + 1}`,
          background: "#1e1e1e",
          nodes: [],
        },
      ],
    });
    setPageId(id);
    setSelected([]);
  };
  const instantiate = (component: DesignNode) => {
    const all = doc.pages.flatMap((p) => p.nodes);
    const copy = cloneNodes(all, [component.id], 40);
    updateNodes((nodes) => [
      ...nodes,
      ...copy.nodes.map((n) =>
        copy.selected.includes(n.id)
          ? {
              ...n,
              type: "instance" as const,
              parentId: null,
              name: component.name,
              componentId: component.id,
            }
          : n,
      ),
    ]);
    setSelected(copy.selected);
  };
  return {
    doc,
    docRef,
    page,
    pageId: page.id,
    setPageId,
    selected,
    setSelected,
    selectedNodes,
    tool,
    setTool,
    view,
    setView,
    grid,
    setGrid,
    replace,
    commit,
    updateNodes,
    patch,
    move,
    undo,
    redo,
    add,
    remove,
    duplicate,
    duplicateForDrag,
    copy,
    paste,
    group,
    ungroup,
    reparent,
    reorder,
    align,
    addPage,
    instantiate,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < historyLength - 1,
  };
}
export type DesignEditor = ReturnType<typeof useDesignEditor>;
