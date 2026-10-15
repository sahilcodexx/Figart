"use client";
import {
  localEditorFileId,
  loadLocalEditorFile,
} from "@/lib/design/local-editor";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import { DesignDocument, normalizeDocument, uid } from "@/lib/design/document";
import { downloadFile, readFile, writeFile } from "@/lib/design/storage";
import { DesignWorkspace } from "./editor";
import { WorkspaceTheme } from "./workspace-theme";
function Loading() {
  return (
    <WorkspaceTheme className="fixed inset-0 z-50 flex items-center justify-center">
      <Loader2 className="text-primary size-5 animate-spin" />
    </WorkspaceTheme>
  );
}
function Missing({ message }: { message: string }) {
  return (
    <WorkspaceTheme className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4">
      <h1 className="text-lg font-semibold">Couldn&apos;t open this file</h1>
      <p className="text-muted-foreground max-w-md text-center">{message}</p>
      <Link
        href="/dashboard"
        className="bg-primary rounded-md px-4 py-2 text-white"
      >
        Back to files
      </Link>
    </WorkspaceTheme>
  );
}
export function EditorLoader({ id }: { id: string }) {
  return id.startsWith("cloud-") ? (
    <CloudEditor id={id.slice(6)} />
  ) : (
    <LocalEditor key={localEditorFileId(id)} id={id} />
  );
}
function LocalEditor({ id }: { id: string }) {
  const fileId = localEditorFileId(id);
  const [state, setState] = useState<{
    fileId?: string;
    doc?: DesignDocument;
    error?: string;
  }>({});
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      try {
        const loaded = loadLocalEditorFile(id, {
          read: readFile,
          write: writeFile,
        });
        if (!cancelled) setState(loaded);
      } catch (error) {
        if (!cancelled)
          setState({
            fileId,
            error:
              error instanceof Error ? error.message : "Unable to read file.",
          });
      }
    });
    return () => {
      cancelled = true;
    };
  }, [id, fileId]);
  if (state.fileId !== fileId) return <Loading />;
  if (state.error) return <Missing message={state.error} />;
  return state.doc ? (
    <DesignWorkspace key={fileId} id={fileId} initial={state.doc} />
  ) : (
    <Loading />
  );
}
function CloudEditor({ id }: { id: string }) {
  const file = useQuery(api.designs.get, { id: id as Id<"designs"> });
  if (file === undefined) return <Loading />;
  if (!file)
    return (
      <Missing message="This file is unavailable or belongs to another account." />
    );
  let doc: DesignDocument;
  try {
    doc = normalizeDocument(file.document);
  } catch {
    return <Missing message="The stored design has an unsupported format." />;
  }
  return <CloudDocument key={id} file={file} initial={doc} />;
}
function CloudDocument({
  file,
  initial,
}: {
  file: Doc<"designs">;
  initial: DesignDocument;
}) {
  const save = useMutation(api.designs.save);
  const [backup] = useState(() => {
    try {
      const local = readFile(`cloud-${file._id}`);
      return local?.pending &&
        JSON.stringify(local.document) !== JSON.stringify(initial)
        ? local
        : null;
    } catch {
      return null;
    }
  });
  const [choice, setChoice] = useState<"recovery" | "database" | null>(
    backup ? null : "database",
  );
  const persist = useCallback(
    async (document: DesignDocument, expectedRevision: number) => {
      return await save({ id: file._id, document, expectedRevision });
    },
    [file._id, save],
  );
  if (backup && !choice)
    return (
      <WorkspaceTheme className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-8">
        <h1 className="text-lg font-semibold">Unsynced edits found</h1>
        <p className="max-w-sm text-center text-xs leading-6 text-muted-foreground">
          This browser has edits that did not reach the database. You can
          recover them or open the saved database version.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            className="rounded-md bg-primary px-4 py-2 text-white"
            onClick={() => setChoice("recovery")}
          >
            Recover edits
          </button>
          <button
            className="rounded-md bg-muted px-4 py-2"
            onClick={() => {
              try {
                writeFile({
                  ...backup,
                  id: `local-${uid()}`,
                  title: `${backup.title} recovery`,
                });
                writeFile({
                  id: `cloud-${file._id}`,
                  title: initial.title,
                  document: initial,
                  updatedAt: file.updatedAt,
                  pending: false,
                  revision: file.revision ?? 0,
                });
              } catch {
                /* Keep the original recovery record if storage is unavailable. */
              }
              setChoice("database");
            }}
          >
            Open database version
          </button>
        </div>
        <button
          className="text-xs text-muted-foreground underline"
          onClick={() =>
            downloadFile(
              JSON.stringify(backup.document, null, 2),
              `${backup.title}-recovery.figart`,
            )
          }
        >
          Download recovery file
        </button>
      </WorkspaceTheme>
    );
  return (
    <DesignWorkspace
      id={`cloud-${file._id}`}
      initial={choice === "recovery" ? backup!.document : initial}
      savedDocument={initial}
      initialRevision={
        choice === "recovery"
          ? (backup?.revision ?? file.revision ?? 0)
          : (file.revision ?? 0)
      }
      onCloudSave={persist}
    />
  );
}
