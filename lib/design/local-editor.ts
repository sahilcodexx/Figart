import { starterDocument, type DesignDocument } from "./document.ts";
import { STARTER_DEMO_FILE } from "./starter.ts";

type LocalRepository = {
  read: (id: string) => { document: DesignDocument } | null;
  write: (file: {
    id: string;
    title: string;
    document: DesignDocument;
    updatedAt: number;
  }) => void;
};

export const localEditorFileId = (routeId: string) =>
  routeId === "demo" ? STARTER_DEMO_FILE : routeId;

export function loadLocalEditorFile(
  routeId: string,
  repository: LocalRepository,
) {
  const fileId = localEditorFileId(routeId);
  const local = repository.read(fileId);
  const doc =
    local?.document ?? (routeId === "demo" ? starterDocument() : null);
  if (!doc)
    throw new Error(
      "This local file is not in this browser. Open a design from your files or import a .figart backup.",
    );
  if (!local)
    repository.write({
      id: fileId,
      title: doc.title,
      document: doc,
      updatedAt: Date.now(),
    });
  return { fileId, doc };
}
