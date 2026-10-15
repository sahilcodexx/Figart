import test from "node:test";
import assert from "node:assert/strict";
import { pathData, vectorBounds, normalizeVector, offsetAnchors, scaleAnchors, validAnchors } from "../lib/design/vector.ts";
import { blankDocument, createNode, normalizeDocument } from "../lib/design/document.ts";

test("pen corner points make straight segments instead of sampled freehand strokes", () => {
  assert.equal(pathData([{ x: 0, y: 0 }, { x: 80, y: 40 }, { x: 0, y: 80 }]), "M0 0 L80 40 L0 80");
});
test("dragged handles make cubic Bézier segments", () => {
  const anchors = [{ x: 0, y: 0, out: { x: 0, y: 100 } }, { x: 100, y: 0, in: { x: 100, y: 100 } }];
  assert.equal(pathData(anchors), "M0 0 C0 100 100 100 100 0");
  assert.deepEqual(vectorBounds(anchors), { x: 0, y: 0, width: 100, height: 75 });
});
test("closing a path uses the last outgoing and first incoming handles", () => {
  const anchors = [{ x: 0, y: 0, in: { x: -30, y: 20 } }, { x: 100, y: 0, out: { x: 100, y: 40 } }];
  assert.equal(pathData(anchors, true), "M0 0 L100 0 C100 40 -30 20 0 0 Z");
});
test("normalizing a backwards-drawn path preserves its visible world geometry", () => {
  const anchors = [{ x: 0, y: 0 }, { x: -100, y: -50, in: { x: -150, y: 20 } }];
  const node = { x: 400, y: 300, width: 1, height: 1 };
  const normalized = normalizeVector(node, anchors);
  assert.equal(pathData(normalized.anchors, false, normalized), pathData(anchors, false, node));
  assert.ok(normalized.width >= 100);
  assert.ok(normalized.height >= 50);
  assert.equal(node.width, 1);
});
test("resizing a path scales its handles along with the anchors", () => {
  const source = [{ x: 10, y: 20, in: { x: 5, y: 15 }, out: { x: 15, y: 25 } }];
  assert.deepEqual(scaleAnchors(source, 2, 3), [{ x: 20, y: 60, in: { x: 10, y: 45 }, out: { x: 30, y: 75 } }]);
  assert.deepEqual(offsetAnchors(source, -10, 5), [{ x: 0, y: 25, in: { x: -5, y: 20 }, out: { x: 5, y: 30 } }]);
  assert.equal(source[0].x, 10);
});
test("control handles cannot contain invalid coordinates", () => {
  for (const value of [[null], [{ x: 1, y: NaN }], [{ x: 0, y: 0, in: null }], [{ x: 0, y: 0, out: { x: Infinity, y: 1 } }]]) assert.equal(validAnchors(value), false);
  assert.equal(validAnchors([{ x: 0, y: 0, in: { x: -20, y: 10 } }]), true);
});
test("Bézier paths survive database validation and document export/import", () => {
  const doc = blankDocument();
  doc.pages[0].nodes = [createNode("path", { anchors: [{ x: 0, y: 0, out: { x: 50, y: -30 } }, { x: 100, y: 0 }], closed: false })];
  assert.deepEqual(normalizeDocument(JSON.parse(JSON.stringify(doc))), doc);
  doc.pages[0].nodes[0].anchors[0].out.x = Infinity;
  assert.throws(() => normalizeDocument(doc), /vector anchors/);
});
test("existing polyline documents remain compatible", () => {
  const doc = blankDocument();
  doc.pages[0].nodes = [createNode("path", { points: [{ x: 0, y: 0 }, { x: 10, y: 20 }] })];
  assert.deepEqual(normalizeDocument(doc).pages[0].nodes[0].points, doc.pages[0].nodes[0].points);
});
