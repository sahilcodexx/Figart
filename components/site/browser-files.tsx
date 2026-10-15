"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, FolderOpen, Search } from "lucide-react";
import { FilePreview } from "@/components/design/file-preview";
import { normalizeDocument } from "@/lib/design/document";
import { downloadFile, readFiles, type LocalFile } from "@/lib/design/storage";
import { LandingButton } from "@/components/landing/shared";

export function BrowserFiles() {
  const [files, setFiles] = useState<LocalFile[] | null>(null);
  const [search, setSearch] = useState("");
  const [limit, setLimit] = useState(12);
  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (!active || document.visibilityState === "hidden") return;
      const valid = readFiles()
        .flatMap((file) => {
          try {
            if (
              !file ||
              typeof file.id !== "string" ||
              file.id.startsWith("cloud-")
            )
              return [];
            const document = normalizeDocument(file.document);
            return [{ ...file, title: document.title, document }];
          } catch {
            return [];
          }
        })
        .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
      setFiles(valid);
    };
    void Promise.resolve().then(refresh);
    window.addEventListener("repimly-files", refresh);
    window.addEventListener("storage", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      active = false;
      window.removeEventListener("repimly-files", refresh);
      window.removeEventListener("storage", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  const filtered =
    files?.filter((file) =>
      file.title.toLowerCase().includes(search.trim().toLowerCase()),
    ) ?? [];
  return (
    <section aria-labelledby="browser-files-title">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <h2 id="browser-files-title" className="text-2xl">
            On this browser
          </h2>
          <p className="mt-2 text-sm text-[#888]">
            Local designs and recovery copies on this device.
          </p>
        </div>
        <label className="relative flex items-center">
          <Search className="absolute left-3 size-4 text-[#999]" />
          <span className="sr-only">Search browser files</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setLimit(12);
            }}
            type="search"
            placeholder="Search browser files"
            className="h-11 rounded-lg border border-[#e3e5df] bg-white pr-4 pl-10 text-sm outline-none focus:border-[#147bd0]"
          />
        </label>
      </div>
      {files === null ? (
        <p role="status" className="py-16 text-sm text-[#999]">
          Reading browser files…
        </p>
      ) : filtered.length ? (
        <>
          <p aria-live="polite" className="mt-7 text-xs text-[#999]">
            {filtered.length} {filtered.length === 1 ? "file" : "files"}
          </p>
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.slice(0, limit).map((file) => (
              <article
                key={file.id}
                className="overflow-hidden rounded-xl border border-[#e4e6df] bg-white"
              >
                <Link
                  href={`/editor/${encodeURIComponent(file.id)}`}
                  aria-label={`Open ${file.title}`}
                  className="block h-56 overflow-hidden bg-[#e8ebe2] p-5"
                >
                  <FilePreview document={file.document} />
                </Link>
                <div className="flex items-center justify-between gap-4 border-t border-[#e9e9e7] p-5">
                  <div className="min-w-0">
                    <Link
                      href={`/editor/${encodeURIComponent(file.id)}`}
                      className="block truncate text-[15px] hover:text-[#147bd0]"
                    >
                      {file.title}
                    </Link>
                    <p className="mt-1 text-[11px] text-[#999]">
                      {Number.isFinite(file.updatedAt)
                        ? new Date(file.updatedAt).toLocaleDateString()
                        : "Browser file"}
                      {file.pending ? " · Recovery copy" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-label={`Download editable copy of ${file.title}`}
                    onClick={() =>
                      downloadFile(
                        JSON.stringify(file.document, null, 2),
                        `${file.title}.figart`,
                      )
                    }
                    className="rounded-md p-2 text-[#888] hover:bg-[#f2f7fa] hover:text-[#147bd0]"
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
          {filtered.length > limit && (
            <button
              type="button"
              onClick={() => setLimit((value) => value + 12)}
              className="mt-7 rounded-lg border border-[#e2e4df] px-5 py-3 text-sm text-[#777] hover:bg-[#f5f6f3]"
            >
              Show more files
            </button>
          )}
        </>
      ) : (
        <div className="mt-7 flex flex-col items-center rounded-xl border border-dashed border-[#dfe4da] bg-[#f7f8f4] px-6 py-16 text-center">
          <FolderOpen className="mb-5 size-9 text-[#9da992]" />
          <h3 className="text-2xl">
            {search ? "No matching files." : "Room for your next idea."}
          </h3>
          <p className="mt-3 mb-6 text-sm text-[#888]">
            {search
              ? "Try another title, or clear your search."
              : "Create a browser file or import an editable design to see it here."}
          </p>
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="text-sm text-[#147bd0]"
            >
              Clear search
            </button>
          ) : (
            <LandingButton href="/start">Create a local file</LandingButton>
          )}
        </div>
      )}
    </section>
  );
}
