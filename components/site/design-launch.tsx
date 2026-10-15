"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useConvexAuth, useMutation } from "convex/react";
import { toast } from "sonner";
import { ArrowRight, FilePlus2, Loader2, Upload } from "lucide-react";
import { api } from "@/convex/_generated/api";
import {
  blankDocument,
  normalizeDocument,
  starterDocument,
  type DesignDocument,
} from "@/lib/design/document";
import { writeFile } from "@/lib/design/storage";
import {
  createDesignCopy,
  DesignCreationError,
} from "@/lib/design/create-file";
import { Button } from "@/components/ui/button";

export function useCreateDesign() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const create = useMutation(api.designs.create);
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);
  const launch = async (doc: DesignDocument, localOnly = false) => {
    if (pending.current || (!localOnly && isLoading)) return;
    pending.current = true;
    setBusy(true);
    try {
      const result = await createDesignCopy(
        doc,
        writeFile,
        !localOnly && isAuthenticated
          ? (document) => create({ document })
          : undefined,
      );
      if (!result.backupUpdated)
        toast.warning(
          "Account file created. The browser backup status could not be updated.",
        );
      router.push(`/editor/${result.fileId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create the design.",
        error instanceof DesignCreationError
          ? {
              action: {
                label: "Open browser copy",
                onClick: () => router.push(`/editor/${error.backupId}`),
              },
            }
          : undefined,
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };
  return { launch, busy, isLoading };
}

export function TemplateButton() {
  const { launch, busy, isLoading } = useCreateDesign();
  return (
    <Button
      disabled={busy || isLoading}
      onClick={() => void launch(starterDocument())}
      className="h-[46px] rounded-[9px] bg-[#147bd0] px-5 text-[16px] font-normal text-white hover:bg-[#116db9]"
    >
      {busy ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <FilePlus2 className="size-4" />
      )}
      Use this template
    </Button>
  );
}

export function LocalStartForm() {
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState("blank");
  const file = useRef<HTMLInputElement>(null);
  const { launch, busy } = useCreateDesign();
  return (
    <div className="rounded-2xl border border-[#e6e8e5] bg-white p-6 sm:p-9">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const doc = kind === "blank" ? blankDocument() : starterDocument();
          doc.title = title.trim() || doc.title;
          void launch(doc, true);
        }}
      >
        <label htmlFor="local-file-title" className="text-sm text-[#555]">
          Give your idea a name
        </label>
        <input
          id="local-file-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={200}
          placeholder="My next big idea"
          className="mt-3 h-12 w-full rounded-lg border border-[#ddd] bg-[#fafafa] px-4 text-base outline-none focus:border-[#147bd0] focus:ring-2 focus:ring-[#147bd0]/15"
        />
        <fieldset className="mt-7">
          <legend className="mb-3 text-sm text-[#555]">
            Choose a starting point
          </legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                id: "blank",
                title: "A blank canvas",
                detail: "An open space for something new.",
              },
              {
                id: "elsewhere",
                title: "The Elsewhere starter",
                detail: "Three complete, editable app screens.",
              },
            ].map((option) => (
              <label
                key={option.id}
                className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${kind === option.id ? "border-[#147bd0] bg-[#f3f9fe]" : "border-[#e6e6e6]"}`}
              >
                <input
                  type="radio"
                  name="starting-point"
                  value={option.id}
                  checked={kind === option.id}
                  onChange={() => setKind(option.id)}
                  className="mt-1 accent-[#147bd0]"
                />
                <span>
                  <span className="block text-sm text-[#444]">
                    {option.title}
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-[#888]">
                    {option.detail}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <Button
          type="submit"
          disabled={busy}
          className="mt-7 h-12 w-full rounded-lg bg-[#147bd0] text-base font-normal text-white hover:bg-[#116db9]"
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <ArrowRight className="size-4" />
          )}
          Create browser file
        </Button>
      </form>
      <div className="mt-6 border-t border-[#eee] pt-5">
        <button
          type="button"
          disabled={busy}
          onClick={() => file.current?.click()}
          className="flex items-center gap-2 text-sm text-[#777] hover:text-[#147bd0]"
        >
          <Upload className="size-4" />
          Or import an editable Figart file
        </button>
        <input
          ref={file}
          type="file"
          accept=".figart,.repimly,application/json"
          className="hidden"
          aria-label="Import Figart file"
          onChange={async (event) => {
            const picked = event.target.files?.[0];
            event.target.value = "";
            if (!picked) return;
            try {
              if (picked.size > 4 * 1024 * 1024)
                throw new Error("Choose a design file under 4 MB.");
              await launch(
                normalizeDocument(JSON.parse(await picked.text())),
                true,
              );
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Invalid design file.",
              );
            }
          }}
        />
      </div>
    </div>
  );
}
