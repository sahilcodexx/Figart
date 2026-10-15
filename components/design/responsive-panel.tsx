"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { WorkspaceTheme } from "./workspace-theme";
import { IconButton } from "./controls";
import { cn } from "@/lib/utils";

export function useCompactWorkspace(query = "(max-width: 1023px)") {
  return useSyncExternalStore(
    (notify) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", notify);
      return () => media.removeEventListener("change", notify);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

export function ResponsivePanel({
  compact,
  open,
  onClose,
  title,
  side = "left",
  className,
  children,
}: {
  compact: boolean;
  open: boolean;
  onClose: () => void;
  title: string;
  side?: "left" | "right";
  className?: string;
  children: ReactNode;
}) {
  if (!compact)
    return <div className={open ? className : "hidden"}>{children}</div>;
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
    >
      <DialogContent
        aria-describedby={undefined}
        showCloseButton={false}
        className={cn(
          "inset-y-0 flex h-dvh w-[min(360px,calc(100vw-24px))] max-w-none translate-x-0 translate-y-0 flex-col gap-0 overflow-hidden rounded-none border-0 p-0 duration-0 sm:max-w-none",
          side === "left" ? "right-auto left-0" : "right-0 left-auto",
        )}
      >
        <WorkspaceTheme className="flex h-full min-h-0 flex-col">
          <div className="border-border flex h-12 shrink-0 items-center justify-between border-b px-3">
            <DialogTitle className="text-xs font-medium">{title}</DialogTitle>
            <IconButton
              label={`Close ${title.toLowerCase()}`}
              onClick={onClose}
            >
              <X />
            </IconButton>
          </div>
          <div className="flex min-h-0 flex-1 overflow-hidden [&_aside]:w-full [&>aside]:min-w-0 [&>aside]:flex-1">
            {children}
          </div>
        </WorkspaceTheme>
      </DialogContent>
    </Dialog>
  );
}
