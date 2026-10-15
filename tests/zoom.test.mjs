import test from "node:test";
import assert from "node:assert/strict";
import {
  wheelPixels,
  wheelZoomAt,
  zoomAt,
} from "../lib/design/interactions.ts";
const view = { x: 80, y: -120, zoom: 1 };
const pointer = { x: 500, y: 300 };

test("one wheel notch cannot multiply the canvas scale", () => {
  const next = wheelZoomAt(view, -120, 0, pointer);
  assert.ok(next.zoom > 1);
  assert.ok(next.zoom < 1.1);
  assert.equal(view.zoom, 1);
});

test("large wheel bursts and page-mode scrolls remain bounded", () => {
  for (const mode of [0, 1, 2]) {
    const up = wheelZoomAt(view, -10000, mode, pointer);
    const down = wheelZoomAt(view, 10000, mode, pointer);
    assert.ok(up.zoom < 1.1);
    assert.ok(down.zoom > 0.9);
  }
});

test("line, pixel, and page wheel units produce equivalent zoom", () => {
  assert.equal(wheelPixels(3, 1), 48);
  assert.equal(wheelPixels(0.06, 2, 800), 48);
  assert.deepEqual(
    wheelZoomAt(view, 48, 0, pointer),
    wheelZoomAt(view, 3, 1, pointer),
  );
  assert.deepEqual(
    wheelZoomAt(view, 48, 0, pointer),
    wheelZoomAt(view, 0.06, 2, pointer, 800),
  );
});

test("wheel zoom preserves the exact world point below the cursor", () => {
  const next = wheelZoomAt(view, -45, 0, pointer);
  assert.ok(
    Math.abs(
      (pointer.x - next.x) / next.zoom - (pointer.x - view.x) / view.zoom,
    ) < 1e-8,
  );
  assert.ok(
    Math.abs(
      (pointer.y - next.y) / next.zoom - (pointer.y - view.y) / view.zoom,
    ) < 1e-8,
  );
});

test("zooming in then out does not drift across the canvas", () => {
  const out = wheelZoomAt(wheelZoomAt(view, -45, 0, pointer), 45, 0, pointer);
  assert.ok(Math.abs(out.x - view.x) < 1e-8);
  assert.ok(Math.abs(out.y - view.y) < 1e-8);
  assert.ok(Math.abs(out.zoom - view.zoom) < 1e-8);
});

test("zoom menu and keyboard changes can preserve the viewport center", () => {
  const center = { x: 600, y: 450 };
  const next = zoomAt(view, 2, center);
  assert.equal(next.zoom, 2);
  assert.equal(
    (center.x - next.x) / next.zoom,
    (center.x - view.x) / view.zoom,
  );
  assert.equal(
    (center.y - next.y) / next.zoom,
    (center.y - view.y) / view.zoom,
  );
});

test("zoom limits and invalid input never move the view unexpectedly", () => {
  assert.strictEqual(zoomAt({ ...view, zoom: 8 }, 20, pointer).zoom, 8);
  assert.equal(zoomAt(view, 0.0001, pointer).zoom, 0.05);
  assert.strictEqual(zoomAt(view, NaN, pointer), view);
  assert.strictEqual(wheelZoomAt(view, Infinity, 0, pointer), view);
});
