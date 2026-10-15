import test from "node:test";
import assert from "node:assert/strict";
import {
  applyLayout,
  blankDocument,
  cloneNodes,
  createNode,
  descendants,
  normalizeDocument,
  rootsOf,
  starterDocument,
} from "../lib/design/document.ts";

function fileWith(nodes) {
  const doc = blankDocument();
  doc.pages[0].nodes = nodes;
  return doc;
}

test("the starter survives JSON export/import without losing editable layers", () => {
  const original = starterDocument();
  const doc = normalizeDocument(JSON.parse(JSON.stringify(original)));
  assert.deepEqual(doc, original);
  assert.equal(
    doc.pages[0].nodes.filter((n) => n.type === "frame" && !n.parentId).length,
    3,
  );
});

test("duplicating a hierarchy remaps parents without mutating the source", () => {
  const root = createNode("frame", { x: 100, y: 100 });
  const group = createNode("group", { parentId: root.id });
  const text = createNode("text", { parentId: group.id, x: 20 });
  const nodes = [text, root, group];
  const copy = cloneNodes(nodes, [root.id, text.id]);
  assert.equal(copy.nodes.length, 3);
  assert.equal(new Set(copy.nodes.map((n) => n.id)).size, 3);
  const copiedRoot = copy.nodes.find((n) => n.type === "frame");
  const copiedGroup = copy.nodes.find((n) => n.type === "group");
  assert.equal(copiedGroup.parentId, copiedRoot.id);
  assert.equal(
    copy.nodes.find((n) => n.type === "text").parentId,
    copiedGroup.id,
  );
  assert.equal(text.x, 20);
  assert.equal(copiedRoot.x, 124);
  assert.deepEqual(copy.selected, [copiedRoot.id]);
});

test("selected roots exclude all descendants of a selected ancestor", () => {
  const root = createNode("frame");
  const group = createNode("group", { parentId: root.id });
  const text = createNode("text", { parentId: group.id });
  const roots = rootsOf([root, group, text], [root.id, text.id]);
  assert.deepEqual(
    roots.map((n) => n.id),
    [root.id],
  );
});

test("nested layout works independently of storage order and moves descendants", () => {
  const outer = createNode("frame", {
    x: 100,
    y: 200,
    layout: "vertical",
    padding: 20,
  });
  const inner = createNode("frame", {
    x: 0,
    y: 0,
    width: 150,
    height: 60,
    parentId: outer.id,
    layout: "horizontal",
    padding: 10,
    gap: 8,
  });
  const a = createNode("rectangle", {
    parentId: inner.id,
    width: 30,
    height: 20,
  });
  const b = createNode("rectangle", {
    parentId: inner.id,
    width: 40,
    height: 20,
  });
  const nodes = applyLayout([a, inner, b, outer]);
  assert.deepEqual(
    [
      nodes.find((n) => n.id === inner.id).x,
      nodes.find((n) => n.id === inner.id).y,
    ],
    [120, 220],
  );
  assert.deepEqual(
    [nodes.find((n) => n.id === a.id).x, nodes.find((n) => n.id === a.id).y],
    [130, 230],
  );
  assert.equal(nodes.find((n) => n.id === b.id).x, 168);
  assert.equal(inner.x, 0);
  assert.deepEqual(applyLayout(nodes), nodes);
});

test("delete expansion includes arbitrarily nested descendants", () => {
  const frame = createNode("frame");
  const group = createNode("group", { parentId: frame.id });
  const child = createNode("rectangle", { parentId: group.id });
  const other = createNode("ellipse");
  assert.deepEqual(
    new Set(descendants([child, other, group, frame], [frame.id])),
    new Set([frame.id, group.id, child.id]),
  );
});

test("imports reject hierarchy cycles, missing parents, and duplicate ids", () => {
  const a = createNode("frame"),
    b = createNode("group", { parentId: a.id });
  assert.throws(
    () => normalizeDocument(fileWith([{ ...a, parentId: b.id }, b])),
    /hierarchy/,
  );
  assert.throws(
    () => normalizeDocument(fileWith([{ ...a, parentId: "missing" }])),
    /hierarchy/,
  );
  assert.throws(() => normalizeDocument(fileWith([a, a])), /duplicate/);
});

test("imports reject corrupt geometry, executable images, and invalid flags", () => {
  const n = createNode("rectangle");
  for (const props of [
    { width: -1 },
    { x: Infinity },
    { opacity: 2 },
    { locked: "false" },
    { fill: "url(https://invalid.test)" },
    { image: "data:image/svg+xml,<svg onload='bad()' />" },
  ]) {
    assert.throws(() => normalizeDocument(fileWith([{ ...n, ...props }])));
  }
  assert.throws(() => normalizeDocument({ ...blankDocument(), pages: [] }));
});

test("layout keeps unchanged objects intact and does not mutate moved descendants", () => {
  const unrelated = createNode("rectangle", { x: 900, y: 900 });
  const frame = createNode("frame", {
    x: 100,
    y: 200,
    layout: "horizontal",
    padding: 16,
    gap: 8,
  });
  const child = createNode("rectangle", { parentId: frame.id, x: 0, y: 0 });
  const nested = createNode("text", { parentId: child.id, x: 4, y: 6 });
  const arranged = applyLayout([frame, child, nested, unrelated]);
  assert.equal(arranged[0], frame);
  assert.equal(arranged[3], unrelated);
  assert.equal(arranged[1].x, 116);
  assert.equal(arranged[1].y, 216);
  assert.equal(arranged[2].x, 120);
  assert.equal(arranged[2].y, 222);
  assert.equal(child.x, 0);
  assert.equal(nested.x, 4);
  assert.equal(applyLayout(arranged), arranged);
});

test("the showcase remains portable, editable, and small enough for a cloud file", () => {
  const doc = starterDocument();
  const nodes = doc.pages[0].nodes;
  const images = nodes.filter(node => node.image);
  assert.ok(images.length >= 3);
  assert.ok(images.every(node => node.image.startsWith("data:image/jpeg;base64,")));
  assert.ok(Buffer.byteLength(JSON.stringify(doc), "utf8") < 900000);
  const discover = nodes.find(node => node.id === "elsewhere-discover");
  const detail = nodes.find(node => node.id === "elsewhere-stay");
  const booking = nodes.find(node => node.id === "elsewhere-booking");
  assert.ok(discover && detail && booking);
  assert.ok(nodes.some(node => node.prototypeTarget === detail.id && node.parentId === discover.id));
  assert.ok(nodes.some(node => node.prototypeTarget === booking.id && node.parentId === detail.id));
  assert.ok(nodes.some(node => node.type === "text" && node.text === "$320"));
});
