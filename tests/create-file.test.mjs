import test from "node:test";
import assert from "node:assert/strict";
import { blankDocument } from "../lib/design/document.ts";
import {
  createDesignCopy,
  DesignCreationError,
} from "../lib/design/create-file.ts";

test("local creation writes the editable document before opening its unique file", async () => {
  const doc = blankDocument("My first design");
  const backups = [];
  const result = await createDesignCopy(doc, (file) => backups.push(file));
  assert.equal(backups.length, 1);
  assert.equal(backups[0].document, doc);
  assert.equal(backups[0].pending, false);
  assert.equal(result.fileId, backups[0].id);
  assert.match(result.fileId, /^local-/);
});

test("account creation backs up first and records success only after the account file exists", async () => {
  const doc = blankDocument();
  const backups = [];
  const result = await createDesignCopy(
    doc,
    (file) => backups.push(file),
    async (document) => {
      assert.equal(backups.length, 1);
      assert.equal(backups[0].pending, true);
      assert.equal(document, doc);
      return "saved-file";
    },
  );
  assert.equal(result.fileId, "cloud-saved-file");
  assert.equal(backups[1].pending, false);
});

test("account errors retain the browser copy and expose its recovery route", async () => {
  const backups = [];
  await assert.rejects(
    createDesignCopy(
      blankDocument(),
      (file) => backups.push(file),
      async () => {
        throw new Error("unavailable");
      },
    ),
    (error) => {
      assert.ok(error instanceof DesignCreationError);
      assert.equal(error.backupId, backups[0].id);
      return true;
    },
  );
  assert.equal(backups.length, 1);
  assert.equal(backups[0].pending, true);
});

test("an initial browser storage failure stops creation; a later metadata failure does not misreport an account success", async () => {
  let remoteCalled = false;
  await assert.rejects(
    createDesignCopy(
      blankDocument(),
      () => {
        throw new Error("storage full");
      },
      async () => {
        remoteCalled = true;
        return "not-created";
      },
    ),
    /storage full/,
  );
  assert.equal(remoteCalled, false);
  let writes = 0;
  const result = await createDesignCopy(
    blankDocument(),
    () => {
      if (++writes > 1) throw new Error("storage full");
    },
    async () => "created",
  );
  assert.equal(result.fileId, "cloud-created");
  assert.equal(result.backupUpdated, false);
});
