"use client";
import * as React from "react";
import { ContextMenu as Primitive } from "radix-ui";
import { cn } from "@/lib/utils";
const ContextMenu = Primitive.Root;
const ContextMenuTrigger = Primitive.Trigger;
function ContextMenuContent({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.Content>) {
  return (
    <Primitive.Portal>
      <Primitive.Content
        data-slot="context-menu-content"
        className={cn(
          "z-50 min-w-52 overflow-hidden rounded-lg border border-neutral-200 bg-white p-1 text-neutral-900 shadow-xl dark:border-neutral-700 dark:bg-[#2c2c2c] dark:text-white",
          className,
        )}
        {...props}
      />
    </Primitive.Portal>
  );
}
function ContextMenuItem({
  className,
  ...props
}: React.ComponentProps<typeof Primitive.Item>) {
  return (
    <Primitive.Item
      data-slot="context-menu-item"
      className={cn(
        "relative flex cursor-default items-center gap-2 rounded-sm px-2 py-2 text-[11px] outline-none select-none data-disabled:pointer-events-none data-disabled:opacity-40 data-highlighted:bg-[#0d99ff] data-highlighted:text-white",
        className,
      )}
      {...props}
    />
  );
}
function ContextMenuSeparator(
  props: React.ComponentProps<typeof Primitive.Separator>,
) {
  return (
    <Primitive.Separator
      className="my-1 h-px bg-neutral-200 dark:bg-neutral-700"
      {...props}
    />
  );
}
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
};
