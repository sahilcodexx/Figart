"use client";
import Link from "next/link";
import { WorkspaceTheme } from "@/components/design/workspace-theme";
import { Button } from "@/components/ui/button";
export default function WorkspaceError({ reset }: { reset: () => void }) {
  return (
    <WorkspaceTheme className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-8">
      <h1 className="text-lg font-semibold">
        The workspace couldn&apos;t load
      </h1>
      <p className="text-muted-foreground max-w-md text-center text-xs leading-relaxed">
        Your local files are still in this browser. If cloud files are
        unavailable, make sure the new Convex design functions are running and
        sign in again.
      </p>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={reset}>
          Try again
        </Button>
        <Button asChild>
          <Link href="/dashboard">Back to files</Link>
        </Button>
      </div>
    </WorkspaceTheme>
  );
}
