import test from "node:test";
import assert from "node:assert/strict";
import { blankDocument } from "../lib/design/document.ts";
import {
  loadLocalEditorFile,
  localEditorFileId,
} from "../lib/design/local-editor.ts";

function repository(files) {
  const saved = [];
  return {
    saved,
    read: (id) => files.get(id) ?? null,
    write: (file) => {
      files.set(file.id, file);
      saved.push(file);
    },
  };
}

test("opening the demo ignores legacy and stale upgrade slots without replacing either saved file", () => {
  const old = { document: blankDocument("Ridgeline app") };
  const files = new Map([
    ["demo", old],
    ["local-demo-elsewhere-v1", old],
  ]);
  const repo = repository(files);
  const loaded = loadLocalEditorFile("demo", repo);
  assert.equal(loaded.fileId, localEditorFileId("demo"));
  assert.notEqual(loaded.doc.title, "Ridgeline app");
  assert.ok(
    loaded.doc.pages[0].nodes.some((node) => node.id === "elsewhere-discover"),
  );
  assert.equal(files.get("demo"), old);
  assert.equal(files.get("local-demo-elsewhere-v1"), old);
  assert.equal(repo.saved.length, 1);
  assert.equal(repo.saved[0].id, loaded.fileId);
});

test("reopening the current demo resumes user edits rather than reseeding it", () => {
  const edited = blankDocument("My edited Elsewhere");
  const repo = repository(
    new Map([[localEditorFileId("demo"), { document: edited }]]),
  );
  assert.equal(loadLocalEditorFile("demo", repo).doc, edited);
  assert.equal(repo.saved.length, 0);
});

test("switching local file identities returns that file and never substitutes the demo", () => {
  const design = blankDocument("My design");
  const repo = repository(new Map([["local-work", { document: design }]]));
  assert.deepEqual(loadLocalEditorFile("local-work", repo), {
    fileId: "local-work",
    doc: design,
  });
  assert.throws(
    () => loadLocalEditorFile("local-missing", repo),
    /not in this browser/,
  );
  assert.equal(repo.saved.length, 0);
});
