"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useClerk, useUser, UserButton } from "@clerk/nextjs";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Clock3,
  Cloud,
  Copy,
  FilePlus2,
  Folder,
  Grid2X2,
  Home,
  LayoutGrid,
  List,
  Loader2,
  Moon,
  Menu,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Shapes,
  Star,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";
import { api } from "@/convex/_generated/api";
import type { Doc } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  blankDocument,
  createNode,
  DesignDocument,
  normalizeDocument,
  starterDocument,
} from "@/lib/design/document";
import { LocalFile, readFiles } from "@/lib/design/storage";
import { WorkspaceTheme } from "./workspace-theme";
import { ResourcesPanel } from "./resources-panel";
import { FilePreview } from "./file-preview";
import { IconButton } from "./controls";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import { ResponsivePanel, useCompactWorkspace } from "./responsive-panel";

type Section = "recents" | "drafts" | "starred" | "trash" | "templates";
export function DesignDashboard() {
  const [section, setSection] = useState<Section>("recents");
  const compact = useCompactWorkspace("(max-width: 767px)");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const chooseSection = (next: Section) => {
    setSection(next);
    setNavigationOpen(false);
  };
  const [search, setSearch] = useState("");
  const [list, setList] = useState(false);
  const [creating, setCreating] = useState(false);
  const [sort, setSort] = useState("updated");
  const [renaming, setRenaming] = useState<Doc<"designs"> | null>(null);
  const [deleteFile, setDeleteFile] = useState<Doc<"designs"> | null>(null);
  const [recovery, setRecovery] = useState<LocalFile[]>([]);
  const [showRecovery, setShowRecovery] = useState(false);
  const importRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const files = useQuery(api.designs.list, isAuthenticated ? {} : "skip");
  const create = useMutation(api.designs.create);
  const update = useMutation(api.designs.updateMetadata);
  const remove = useMutation(api.designs.remove);
  const signIn = () => openSignIn({ forceRedirectUrl: "/dashboard" });
  useEffect(() => {
    Promise.resolve().then(() =>
      setRecovery(readFiles().filter((f) => !f.id.startsWith("cloud-"))),
    );
  }, []);
  const newFile = async (document: DesignDocument = blankDocument()) => {
    if (!isAuthenticated) {
      signIn();
      return;
    }
    if (creating) return;
    setCreating(true);
    try {
      const id = await create({ document });
      router.push(`/editor/cloud-${id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Could not create file",
      );
    } finally {
      setCreating(false);
    }
  };
  const change = async (
    file: Doc<"designs">,
    values: { starred?: boolean; trash?: boolean; title?: string },
  ) => {
    try {
      await update({ id: file._id, ...values });
    } catch {
      toast.error("Could not update this file. Please try again.");
    }
  };
  const name = user?.firstName || "Your";
  const activeFiles = (files ?? []).filter((f) => !f.trashedAt);
  const visible = (files ?? [])
    .filter((f) => {
      if (section === "trash" ? !f.trashedAt : !!f.trashedAt) return false;
      return (
        (section !== "starred" || f.starred) &&
        f.title.toLowerCase().includes(search.toLowerCase())
      );
    })
    .sort((a, b) =>
      sort === "name"
        ? a.title.localeCompare(b.title)
        : b.updatedAt - a.updatedAt,
    );
  const title = {
    recents: "Recently viewed",
    drafts: "Drafts",
    starred: "Starred",
    trash: "Trash",
    templates: "Templates",
  }[section];
  const date = (time: number) => {
    const days = Math.floor((Date.now() - time) / 86400000);
    return days === 0
      ? "Edited today"
      : days === 1
        ? "Edited yesterday"
        : `Edited ${new Date(time).toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
  };
  return (
    <WorkspaceTheme className="fixed inset-0 z-50 flex overflow-hidden">
      <TooltipProvider delayDuration={250}>
        <ResponsivePanel
          compact={compact}
          open={!compact || navigationOpen}
          onClose={() => setNavigationOpen(false)}
          title="Workspace navigation"
          className="flex shrink-0"
        >
          <aside className="border-border bg-background flex h-full w-[240px] shrink-0 flex-col overflow-y-auto border-r px-3 pb-3">
            <div className="flex h-12 shrink-0 items-center gap-3 px-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-[#49616b] text-[10px] text-white">
                {user?.firstName?.[0] ?? "F"}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex min-w-0 flex-1 items-center gap-2 text-sm font-semibold">
                    <span className="truncate">
                      {user?.fullName || "Figart"}
                    </span>
                    <ChevronDown className="size-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem asChild>
                    <Link href="/">Figart home</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      setTheme(resolvedTheme === "dark" ? "light" : "dark")
                    }
                  >
                    {resolvedTheme === "dark"
                      ? "Light appearance"
                      : "Dark appearance"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <IconButton
                label="Toggle theme"
                onClick={() =>
                  setTheme(resolvedTheme === "dark" ? "light" : "dark")
                }
              >
                {resolvedTheme === "dark" ? <Sun /> : <Moon />}
              </IconButton>
            </div>
            <label className="bg-muted mb-3 flex h-9 items-center gap-2 rounded-md px-2.5">
              <Search className="text-muted-foreground size-3.5" />
              <Input
                aria-label="Search files"
                placeholder="Search files"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="h-8 border-0 bg-transparent! px-0 text-xs shadow-none focus-visible:ring-0"
              />
            </label>
            <nav aria-label="Files navigation" className="space-y-1">
              {(
                [
                  { id: "recents", label: "Recents", icon: Clock3 },
                  { id: "drafts", label: "Drafts", icon: FilePlus2 },
                  { id: "starred", label: "Starred", icon: Star },
                ] as const
              ).map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => chooseSection(id)}
                  className={cn(
                    "hover:bg-muted flex h-8 w-full items-center gap-3 rounded-md px-3 text-left text-xs",
                    section === id && "text-foreground bg-(--selection)",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                  {id === "drafts" && (
                    <span className="text-muted-foreground ml-auto text-[10px]">
                      {activeFiles.length || ""}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            <div className="border-border my-5 border-t" />
            <div className="mb-4 flex items-center justify-between px-3">
              <span className="text-muted-foreground text-[11px] font-medium">
                Workspace
              </span>
              <Cloud className="text-muted-foreground size-3.5" />
            </div>
            <button
              onClick={() => chooseSection("drafts")}
              className="hover:bg-muted flex items-center gap-2.5 rounded-md px-3 py-2 text-left"
            >
              <span className="flex size-6 items-center justify-center rounded-md bg-[#6a7894] text-[10px] font-medium text-white">
                {user?.firstName?.[0] ?? "F"}
              </span>
              <span className="min-w-0 flex-1 truncate text-xs">
                {name === "Your" ? "Your workspace" : `${name}’s workspace`}
              </span>
              <ChevronDown className="text-muted-foreground size-3" />
            </button>
            <button
              onClick={() => chooseSection("drafts")}
              className="text-muted-foreground hover:text-foreground ml-6 flex h-8 items-center gap-2 px-3 text-[11px]"
            >
              <Folder className="size-3.5" />
              All files
            </button>
            <button
              onClick={() => chooseSection("templates")}
              className={cn(
                "hover:bg-muted mt-5 flex h-9 items-center gap-3 rounded-md px-3 text-xs",
                section === "templates" && "bg-muted",
              )}
            >
              <Shapes className="size-4" />
              Templates
            </button>
            <button
              onClick={() => chooseSection("trash")}
              className={cn(
                "hover:bg-muted flex h-9 items-center gap-3 rounded-md px-3 text-xs",
                section === "trash" && "bg-muted",
              )}
            >
              <Trash2 className="size-4" />
              Trash
            </button>
            <div className="mt-auto space-y-3">
              <div className="flex items-center justify-between px-2">
                <Link
                  href="/"
                  className="text-muted-foreground flex items-center gap-2 text-[11px]"
                >
                  <Home className="size-3.5" />
                  Figart home
                </Link>
                {isAuthenticated ? (
                  <UserButton />
                ) : (
                  <Link href="/editor/demo" aria-label="Try the demo">
                    <CircleHelp className="text-muted-foreground size-4" />
                  </Link>
                )}
              </div>
            </div>
          </aside>
        </ResponsivePanel>
        <main className="bg-background min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
          <header className="border-border bg-background sticky top-0 z-20 flex min-h-14 flex-wrap items-center justify-between gap-2 border-b px-4 py-2 sm:px-6 lg:px-9">
            <div className="text-muted-foreground flex items-center gap-2 text-xs">
              {compact && (
                <IconButton
                  label="Open workspace navigation"
                  onClick={() => setNavigationOpen(true)}
                >
                  <Menu />
                </IconButton>
              )}
              <span className="text-foreground">
                {section === "recents" ? "Recents" : title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="border-border h-9 rounded-full border px-3 text-xs sm:px-4"
                onClick={() => chooseSection("templates")}
                aria-label="Browse resources"
              >
                <Shapes className="size-3.5 text-[#b18bff]" />
                <span className="hidden sm:inline">Resources</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="border-border h-9 rounded-full border px-3 text-xs sm:px-4"
                onClick={() => importRef.current?.click()}
              >
                <Upload className="size-3.5" />
                Import
              </Button>
              <Button
                size="sm"
                disabled={creating || isLoading}
                onClick={() => void newFile()}
                className="border-border bg-muted text-foreground hover:bg-accent h-9 rounded-full border px-4 text-xs"
              >
                {creating ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <span className="bg-primary flex size-4 items-center justify-center rounded-xs">
                    <FilePlus2 className="size-3 text-white" />
                  </span>
                )}
                Design
              </Button>
            </div>
          </header>
          <div className="px-4 pt-5 pb-10 sm:px-6 lg:px-9">
            {section === "recents" && !search && (
              <ResourcesPanel
                onCreate={(doc) => void newFile(doc)}
                onBrowse={() => chooseSection("templates")}
              />
            )}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1">
                {(
                  [
                    {
                      id: "recents",
                      label: search ? "Search results" : "Recently viewed",
                    },
                    { id: "drafts", label: "Drafts" },
                    { id: "starred", label: "Starred files" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => chooseSection(tab.id)}
                    className={cn(
                      "text-muted-foreground rounded-md px-2.5 py-1.5 text-[11px] whitespace-nowrap",
                      section === tab.id &&
                        "bg-muted text-foreground font-medium",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <select
                  aria-label="Sort files"
                  value={sort}
                  onChange={(event) => setSort(event.target.value)}
                  className="text-muted-foreground mr-2 bg-transparent text-[11px] outline-none"
                >
                  <option value="updated">Last modified</option>
                  <option value="name">Alphabetical</option>
                </select>
                <div className="bg-muted flex rounded-md p-0.5">
                  <IconButton
                    label="Grid view"
                    active={!list}
                    onClick={() => setList(false)}
                    className={
                      !list
                        ? "bg-background text-foreground hover:bg-background shadow-xs"
                        : ""
                    }
                  >
                    <Grid2X2 />
                  </IconButton>
                  <IconButton
                    label="List view"
                    active={list}
                    onClick={() => setList(true)}
                    className={
                      list
                        ? "bg-background text-foreground hover:bg-background shadow-xs"
                        : ""
                    }
                  >
                    <List />
                  </IconButton>
                </div>
              </div>
            </div>
            {section === "templates" ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                <button
                  className="border-border hover:border-primary/60 overflow-hidden rounded-lg border text-left"
                  onClick={() => void newFile(starterDocument())}
                >
                  <div className="h-52 bg-[#e5e4ee] p-5">
                    <FilePreview document={starterDocument()} />
                  </div>
                  <div className="p-4">
                    <h2 className="font-semibold">
                      Elsewhere — Boutique stays
                    </h2>
                    <p className="text-muted-foreground mt-1 text-[11px]">
                      Discover, stay details & booking · 3 editable screens
                    </p>
                  </div>
                </button>
                {[
                  {
                    title: "Desktop wireframe",
                    width: 1440,
                    height: 1024,
                    color: "#e5ecf6",
                  },
                  {
                    title: "Mobile wireframe",
                    width: 390,
                    height: 844,
                    color: "#eee7f2",
                  },
                ].map((t) => {
                  const doc = blankDocument(t.title);
                  doc.pages[0].nodes = [
                    createNode("frame", {
                      name: t.title,
                      width: t.width,
                      height: t.height,
                    }),
                  ];
                  return (
                    <button
                      key={t.title}
                      onClick={() => void newFile(doc)}
                      className="border-border hover:border-primary/60 overflow-hidden rounded-lg border text-left"
                    >
                      <div
                        className="h-52 p-6"
                        style={{ backgroundColor: t.color }}
                      >
                        <FilePreview document={doc} />
                      </div>
                      <div className="p-4">
                        <h2 className="font-semibold">{t.title}</h2>
                        <p className="text-muted-foreground mt-1 text-[11px]">
                          Blank frame · {t.width} × {t.height}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : isLoading || (isAuthenticated && files === undefined) ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="text-primary size-5 animate-spin" />
              </div>
            ) : !isAuthenticated ? (
              <div className="bg-muted/60 flex min-h-[420px] flex-col items-center justify-center rounded-xl px-8 text-center">
                <div className="bg-background mb-6 flex size-16 items-center justify-center rounded-2xl shadow-sm">
                  <LayoutGrid className="text-primary size-7" />
                </div>
                <h2 className="mb-2 text-xl font-semibold">
                  Your next idea starts here
                </h2>
                <p className="text-muted-foreground mb-6 max-w-sm text-xs leading-6">
                  Create, explore, and bring your designs together.
                  <br />
                  Sign in to save every file to your account.
                </p>
                <Button onClick={signIn} className="h-9 text-xs">
                  Sign in to start designing
                  <ArrowRight className="size-3.5" />
                </Button>
                <Link
                  href="/editor/demo"
                  className="text-muted-foreground mt-4 text-[11px] underline underline-offset-4"
                >
                  Or explore the editor first
                </Link>
              </div>
            ) : (
              <>
                {visible.length ? (
                  <div
                    className={cn(
                      "grid gap-x-8 gap-y-8",
                      !list &&
                        "grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4",
                    )}
                  >
                    {visible.map((file) => (
                      <article
                        key={file._id}
                        className={cn(
                          "group border-border hover:border-primary/60 relative overflow-hidden rounded-xl border transition-colors",
                          list && "flex items-center",
                        )}
                      >
                        {section === "trash" ? (
                          <div className="flex-1 p-4">
                            <h2 className="font-medium">{file.title}</h2>
                            <p className="text-muted-foreground mt-1 text-[10px]">
                              Deleted{" "}
                              {new Date(file.trashedAt!).toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          <Link
                            href={`/editor/cloud-${file._id}`}
                            className={cn(
                              "block",
                              list && "flex min-w-0 flex-1 items-center",
                            )}
                          >
                            <div
                              className={cn(
                                "flex items-center justify-center p-5",
                                list ? "h-20 w-28 shrink-0" : "aspect-[1.78]",
                              )}
                              style={{
                                backgroundColor:
                                  (file.document as DesignDocument).pages[0]
                                    ?.background ?? "#1e1e1e",
                              }}
                            >
                              <FilePreview
                                document={file.document as DesignDocument}
                              />
                            </div>
                            <div className="border-border flex min-w-0 items-center gap-3 border-t px-4 py-3">
                              <span className="bg-primary flex size-4 shrink-0 items-center justify-center rounded-xs">
                                <FilePlus2 className="size-3 text-white" />
                              </span>
                              <div className="min-w-0">
                                <h2 className="truncate text-xs font-semibold">
                                  {file.title}
                                </h2>
                                <p className="text-muted-foreground mt-1 text-[10px]">
                                  {date(file.updatedAt)}
                                </p>
                              </div>
                            </div>
                          </Link>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Options for ${file.title}`}
                              className={cn(
                                "bg-background/80 absolute right-2 bottom-5 opacity-100 group-hover:opacity-100 focus-visible:opacity-100 md:opacity-0",
                                list && "top-6",
                                section === "trash" && "opacity-100",
                              )}
                            >
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {section === "trash" ? (
                              <>
                                <DropdownMenuItem
                                  onClick={() =>
                                    void change(file, { trash: false })
                                  }
                                >
                                  Restore file
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => setDeleteFile(file)}
                                  className="text-destructive"
                                >
                                  Delete permanently
                                </DropdownMenuItem>
                              </>
                            ) : (
                              <>
                                <DropdownMenuItem
                                  onClick={() => setRenaming(file)}
                                >
                                  <Pencil className="size-3.5" />
                                  Rename
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    void change(file, {
                                      starred: !file.starred,
                                    })
                                  }
                                >
                                  <Star className="size-3.5" />
                                  {file.starred
                                    ? "Remove star"
                                    : "Add to starred"}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    void newFile({
                                      ...file.document,
                                      title: `${file.title} copy`,
                                    })
                                  }
                                >
                                  <Copy className="size-3.5" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    void change(file, { trash: true })
                                  }
                                >
                                  <Trash2 className="size-3.5" />
                                  Move to trash
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        {file.starred && (
                          <Star className="absolute top-3 right-3 size-3.5 fill-amber-400 text-amber-400" />
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="border-border flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                    <Folder className="text-muted-foreground/50 mb-4 size-8" />
                    <h2 className="mb-2 text-sm font-medium">
                      {search
                        ? "No matching files"
                        : section === "trash"
                          ? "Trash is empty"
                          : section === "starred"
                            ? "Keep your favorites close"
                            : "Make room for your ideas"}
                    </h2>
                    <p className="text-muted-foreground mb-5 max-w-xs text-[11px] leading-5">
                      {search
                        ? "Try another file name."
                        : section === "starred"
                          ? "Star a file from its menu to find it here."
                          : section === "trash"
                            ? "Files you delete will appear here."
                            : "Create your first design file. Every change saves automatically to your account."}
                    </p>
                    {!search &&
                      (section === "recents" || section === "drafts") && (
                        <Button
                          size="sm"
                          onClick={() => void newFile()}
                          className="text-xs"
                        >
                          <Plus className="size-3.5" />
                          New design file
                        </Button>
                      )}
                  </div>
                )}
              </>
            )}
            {!!recovery.length && isAuthenticated && (
              <div className="border-border mt-6 border-t pt-4">
                <button
                  onClick={() => setShowRecovery(!showRecovery)}
                  className="text-muted-foreground flex items-center gap-2 text-[11px]"
                >
                  <ChevronRight
                    className={cn("size-3", showRecovery && "rotate-90")}
                  />
                  Browser recovery files ({recovery.length})
                </button>
                {showRecovery && (
                  <div className="mt-3 space-y-2">
                    {recovery.map((file) => (
                      <div
                        key={file.id}
                        className="bg-muted flex flex-wrap items-center justify-between gap-3 rounded-md p-3"
                      >
                        <span>{file.title}</span>
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={creating}
                          className="h-7 text-[10px]"
                          onClick={async () => {
                            await newFile(file.document);
                          }}
                        >
                          Save a copy to account
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
        <Dialog
          open={!!renaming}
          onOpenChange={(open) => {
            if (!open) setRenaming(null);
          }}
        >
          <DialogContent className="overflow-hidden border-0 p-0 sm:max-w-sm">
            <WorkspaceTheme className="p-6">
              <DialogHeader>
                <DialogTitle className="text-sm">Rename file</DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  Choose a name for your design.
                </DialogDescription>
              </DialogHeader>
              <form
                className="mt-5 space-y-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const form = new FormData(event.currentTarget);
                  if (renaming)
                    await change(renaming, {
                      title: String(form.get("title")),
                    });
                  setRenaming(null);
                }}
              >
                <Input
                  autoFocus
                  name="title"
                  aria-label="New file name"
                  defaultValue={renaming?.title}
                  maxLength={200}
                  required
                />
                <Button type="submit" className="w-full text-xs">
                  Save name
                </Button>
              </form>
            </WorkspaceTheme>
          </DialogContent>
        </Dialog>
        <Dialog
          open={!!deleteFile}
          onOpenChange={(open) => {
            if (!open) setDeleteFile(null);
          }}
        >
          <DialogContent className="overflow-hidden border-0 p-0 sm:max-w-sm">
            <WorkspaceTheme className="p-6">
              <DialogHeader>
                <DialogTitle className="text-sm">
                  Delete permanently?
                </DialogTitle>
                <DialogDescription className="text-muted-foreground text-xs">
                  “{deleteFile?.title}” will be removed from your account. This
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <Button
                variant="destructive"
                className="mt-5 w-full text-xs"
                onClick={async () => {
                  try {
                    if (deleteFile) await remove({ id: deleteFile._id });
                    setDeleteFile(null);
                  } catch {
                    toast.error("Could not delete file");
                  }
                }}
              >
                Delete file
              </Button>
            </WorkspaceTheme>
          </DialogContent>
        </Dialog>
        <input
          ref={importRef}
          type="file"
          accept=".figart,.repimly,application/json"
          className="hidden"
          onChange={async (event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (!file) return;
            try {
              if (file.size > 900000)
                throw new Error(
                  "File exceeds the database size limit. Reduce embedded images first.",
                );
              await newFile(normalizeDocument(JSON.parse(await file.text())));
            } catch (error) {
              toast.error(
                error instanceof Error ? error.message : "Invalid design file",
              );
            }
          }}
        />
      </TooltipProvider>
    </WorkspaceTheme>
  );
}
