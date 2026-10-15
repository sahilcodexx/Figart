import { DesignDocument, normalizeDocument } from "./document";
export type LocalFile = {
  id: string;
  title: string;
  updatedAt: number;
  document: DesignDocument;
  starred?: boolean;
  pending?: boolean;
  revision?: number;
};
const KEY = "repimly-design-files-v1";
export function readFiles(): LocalFile[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}
export function writeFile(file: LocalFile) {
  const files = readFiles();
  localStorage.setItem(
    KEY,
    JSON.stringify([file, ...files.filter((f) => f.id !== file.id)]),
  );
  window.dispatchEvent(new Event("repimly-files"));
}
export function removeFile(id: string) {
  localStorage.setItem(
    KEY,
    JSON.stringify(readFiles().filter((f) => f.id !== id)),
  );
  window.dispatchEvent(new Event("repimly-files"));
}
export function readFile(id: string) {
  const file = readFiles().find((f) => f.id === id);
  if (!file) return null;
  return { ...file, document: normalizeDocument(file.document) };
}
export function downloadFile(
  content: Blob | string,
  name: string,
  type = "application/json",
) {
  const url = URL.createObjectURL(
    typeof content === "string" ? new Blob([content], { type }) : content,
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
