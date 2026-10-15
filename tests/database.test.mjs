import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";
import * as documentModel from "../lib/design/document.ts";

const require = createRequire(import.meta.url);
const source = ts.transpileModule(readFileSync(new URL("../convex/designs.ts", import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const api = {};
new Function("require", "exports", source)((specifier) => {
  if (specifier === "../lib/design/document") return documentModel;
  if (specifier === "./_generated/server") return require("../convex/_generated/server.js");
  return require(specifier);
}, api);

function database() {
  const rows = new Map();
  const context = (owner) => ({
    auth: { getUserIdentity: async () => owner ? { subject: owner } : null },
    db: {
      get: async (id) => rows.get(id) ?? null,
      insert: async (_table, row) => { const id = crypto.randomUUID(); rows.set(id, { ...row, _id: id }); return id; },
      patch: async (id, changes) => rows.set(id, { ...rows.get(id), ...changes }),
      delete: async (id) => rows.delete(id),
      query: () => ({ withIndex: (_name, callback) => {
        let owner;
        callback({ eq: (_key, value) => { owner = value; } });
        return { order: () => ({ collect: async () => [...rows.values()].filter(row => row.owner === owner) }) };
      } }),
    },
  });
  return { rows, context };
}

test("creating and saving a design persist the complete editable document", async () => {
  const { rows, context } = database();
  const ctx = context("alice");
  const original = documentModel.starterDocument();
  const id = await api.create._handler(ctx, { document: original });
  assert.deepEqual(rows.get(id).document, original);
  const edited = { ...original, title: "A saved design" };
  const revision = await api.save._handler(ctx, { id, document: edited, expectedRevision: 0 });
  assert.equal(revision, 1);
  assert.equal(rows.get(id).revision, 1);
  assert.equal(rows.get(id).title, "A saved design");
  assert.deepEqual((await api.get._handler(ctx, { id })).document, edited);
});

test("authentication and ownership protect every database operation", async () => {
  const { rows, context } = database();
  const id = await api.create._handler(context("alice"), { document: documentModel.blankDocument() });
  assert.equal(await api.get._handler(context("bob"), { id }), null);
  assert.equal(await api.get._handler(context(null), { id }), null);
  assert.deepEqual(await api.list._handler(context("bob")), []);
  assert.equal((await api.list._handler(context("alice"))).length, 1);
  await assert.rejects(api.create._handler(context(null), { document: documentModel.blankDocument() }));
  await assert.rejects(api.save._handler(context("bob"), { id, document: documentModel.blankDocument(), expectedRevision: 0 }));
  await assert.rejects(api.updateMetadata._handler(context("bob"), { id, starred: true }));
  await assert.rejects(api.remove._handler(context("bob"), { id }));
  assert.equal(rows.get(id).owner, "alice");
});

test("an older tab cannot overwrite a newer revision", async () => {
  const { rows, context } = database();
  const ctx = context("alice"), document = documentModel.blankDocument("Original");
  const id = await api.create._handler(ctx, { document });
  await api.save._handler(ctx, { id, document: { ...document, title: "Newer version" }, expectedRevision: 0 });
  await assert.rejects(api.save._handler(ctx, { id, document: { ...document, title: "Stale version" }, expectedRevision: 0 }), /another tab/);
  assert.equal(rows.get(id).title, "Newer version");
});

test("stars, rename, trash, restore, and permanent deletion persist in the database", async () => {
  const { rows, context } = database();
  const ctx = context("alice");
  const id = await api.create._handler(ctx, { document: documentModel.blankDocument() });
  await api.updateMetadata._handler(ctx, { id, starred: true, title: "Renamed" });
  assert.equal(rows.get(id).starred, true);
  assert.equal(rows.get(id).document.title, "Renamed");
  await assert.rejects(api.remove._handler(ctx, { id }), /trash first/);
  await api.updateMetadata._handler(ctx, { id, trash: true });
  assert.equal(await api.get._handler(ctx, { id }), null);
  await api.updateMetadata._handler(ctx, { id, trash: false });
  assert.equal((await api.get._handler(ctx, { id })).title, "Renamed");
  await api.updateMetadata._handler(ctx, { id, trash: true });
  await api.remove._handler(ctx, { id });
  assert.equal(rows.has(id), false);
});

test("invalid or oversized files never reach the database", async () => {
  const { rows, context } = database();
  await assert.rejects(api.create._handler(context("alice"), { document: { format: "bad" } }));
  const doc = documentModel.blankDocument();
  doc.pages[0].nodes = [documentModel.createNode("text", { text: "x".repeat(950000) })];
  await assert.rejects(api.create._handler(context("alice"), { document: doc }), /size limit/);
  assert.equal(rows.size, 0);
});
