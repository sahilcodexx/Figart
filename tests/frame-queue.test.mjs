import test from "node:test";
import assert from "node:assert/strict";
import { createFrameQueue } from "../lib/design/frame-queue.ts";

function harness() {
  let next = 0;
  const scheduled = new Map();
  const applied = [];
  const queue = createFrameQueue(
    (value) => applied.push(value),
    (callback) => {
      scheduled.set(++next, callback);
      return next;
    },
    (id) => scheduled.delete(id),
  );
  const tick = () => {
    const jobs = [...scheduled.values()];
    scheduled.clear();
    jobs.forEach((callback) => callback(0));
  };
  return { queue, applied, scheduled, tick };
}

test("high-frequency pointer input applies only the newest position per frame", () => {
  const h = harness();
  for (let x = 0; x < 1000; x++) h.queue.push({ x, y: x * 2 });
  assert.equal(h.scheduled.size, 1);
  assert.equal(h.applied.length, 0);
  h.tick();
  assert.deepEqual(h.applied, [{ x: 999, y: 1998 }]);
  h.queue.push({ x: 1000, y: 2000 });
  h.tick();
  assert.equal(h.applied.length, 2);
});

test("releasing before a frame applies the final drop once without a late update", () => {
  const h = harness();
  h.queue.push({ x: 10, y: 20 });
  h.queue.push({ x: 37, y: 44 });
  h.queue.flush();
  assert.deepEqual(h.applied, [{ x: 37, y: 44 }]);
  h.tick();
  h.queue.flush();
  assert.equal(h.applied.length, 1);
});

test("Escape or unmount discards pending input so a cancelled gesture cannot move again", () => {
  const h = harness();
  h.queue.push({ x: 80, y: 100 });
  h.queue.cancel();
  h.tick();
  h.queue.flush();
  assert.equal(h.applied.length, 0);
  h.queue.push({ x: 3, y: 4 });
  h.tick();
  assert.deepEqual(h.applied, [{ x: 3, y: 4 }]);
});
