import test from "node:test";
import assert from "node:assert/strict";
import {
  defaultPanels,
  togglePanels,
  dragDelta,
  fitViewport,
} from "../lib/design/interactions.ts";
import { createNode, cloneNodes, descendants } from "../lib/design/document.ts";

test("hiding both sidebars keeps a recoverable previous layout", () => {
  const hidden = togglePanels(defaultPanels);
  assert.equal(hidden.left, false);
  assert.equal(hidden.right, false);
  assert.deepEqual(togglePanels(hidden), defaultPanels);
  assert.equal(defaultPanels.left, true);
});

test("restoring sidebars preserves a previously hidden individual panel", () => {
  const layout = {
    left: true,
    right: false,
    restore: { left: true, right: true },
  };
  const restored = togglePanels(togglePanels(layout));
  assert.equal(restored.left, true);
  assert.equal(restored.right, false);
});

test("a fully hidden layout always has a route back to visible controls", () => {
  const restored = togglePanels({
    left: false,
    right: false,
    restore: { left: false, right: false },
  });
  assert.equal(restored.left, true);
  assert.equal(restored.right, true);
});

test("Shift-drag locks movement to the dominant axis", () => {
  const start = { x: 100, y: 100 };
  assert.deepEqual(dragDelta(start, { x: 137, y: 108 }, false, true), {
    x: 37,
    y: 0,
  });
  assert.deepEqual(dragDelta(start, { x: 108, y: 42 }, false, true), {
    x: 0,
    y: -58,
  });
  assert.deepEqual(dragDelta(start, { x: 137, y: 108 }, false, false), {
    x: 37,
    y: 8,
  });
});

test("grid snapping and axis locking compose without diagonal drift", () => {
  assert.deepEqual(dragDelta({ x: 0, y: 0 }, { x: 37, y: 8 }, true, true), {
    x: 40,
    y: 0,
  });
  assert.deepEqual(dragDelta({ x: 0, y: 0 }, { x: 37, y: 28 }, true, false), {
    x: 40,
    y: 20,
  });
});

test("fit selection centers distant objects and leaves room around them", () => {
  const bounds = { x: -6700, y: -4900, width: 3480, height: 2200 };
  const viewport = { width: 1200, height: 900 };
  const view = fitViewport(bounds, viewport, 8);
  assert.ok(view.zoom > 0.05);
  assert.ok(
    Math.abs(
      view.x + (bounds.x + bounds.width / 2) * view.zoom - viewport.width / 2,
    ) < 1e-8,
  );
  assert.ok(
    Math.abs(
      view.y + (bounds.y + bounds.height / 2) * view.zoom - viewport.height / 2,
    ) < 1e-8,
  );
  assert.ok(bounds.width * view.zoom <= viewport.width - 120);
  assert.ok(bounds.height * view.zoom <= viewport.height - 160);
});

test("Alt-drag can copy nested selections in place without changing the original", () => {
  const frame = createNode("frame", { x: 200, y: 100 });
  const child = createNode("rectangle", { x: 230, y: 140, parentId: frame.id });
  const source = [frame, child];
  const copy = cloneNodes(source, [frame.id, child.id], 0);
  assert.equal(copy.selected.length, 1);
  const root = copy.nodes.find((n) => n.id === copy.selected[0]);
  assert.equal(root.x, frame.x);
  assert.equal(root.y, frame.y);
  assert.notEqual(root.id, frame.id);
  const movedIds = descendants(copy.nodes, copy.selected);
  const placed = copy.nodes.map((n) =>
    movedIds.includes(n.id) ? { ...n, x: n.x + 80, y: n.y + 40 } : n,
  );
  assert.equal(placed.find((n) => n.type === "rectangle").x, 310);
  assert.equal(frame.x, 200);
  assert.equal(child.x, 230);
});
