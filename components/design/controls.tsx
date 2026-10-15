import type { ComponentProps, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export function IconButton({
  label,
  active,
  children,
  className,
  ...props
}: ComponentProps<typeof Button> & { label: string; active?: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          title={label}
          variant="ghost"
          size="icon-sm"
          className={cn(
            "size-7 rounded-sm text-inherit [&_svg]:size-3.5",
            active &&
              "bg-primary/15 text-primary hover:bg-primary/20 hover:text-primary",
            className,
          )}
          {...props}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent className="border-0 bg-neutral-900 text-xs text-white">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
export function PanelSection({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="border-border space-y-3 border-b px-4 py-4">
      <div className="flex h-5 items-center justify-between">
        <h3 className="text-[11px] font-semibold">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}
export function NumberField({
  label,
  value,
  onChange,
  min,
  max,
  suffix,
  displayLabel,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  suffix?: string;
  displayLabel?: ReactNode;
}) {
  return (
    <label className="bg-muted focus-within:ring-primary flex h-6 min-w-0 items-center gap-1.5 rounded-sm px-2 text-[11px] focus-within:ring-1">
      <span className="text-muted-foreground shrink-0">
        {displayLabel ?? label}
      </span>
      <Input
        key={value}
        type="number"
        aria-label={label}
        defaultValue={Math.round(value * 100) / 100}
        min={min}
        max={max}
        onBlur={(event) => {
          const n = Number(event.target.value);
          if (event.target.value.trim() && Number.isFinite(n))
            onChange(Math.min(max ?? 1000000, Math.max(min ?? -1000000, n)));
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        className="h-auto min-w-0 rounded-none border-0 bg-transparent! p-0 text-[11px] md:text-[11px] shadow-none focus-visible:ring-0"
      />
      {suffix && <span className="text-muted-foreground">{suffix}</span>}
    </label>
  );
}
export function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="bg-muted flex h-6 items-center gap-2 rounded-sm px-2">
      <input
        type="color"
        aria-label={`${label} color`}
        value={/^#[0-9a-f]{6}$/i.test(value) ? value : "#ffffff"}
        onChange={(event) => onChange(event.target.value)}
        className="size-4 shrink-0 cursor-pointer overflow-hidden rounded-xs border-0 bg-transparent p-0"
      />
      <Input
        key={value}
        aria-label={label}
        defaultValue={value.replace("#", "").toUpperCase()}
        onBlur={(event) => {
          const color = event.target.value;
          if (/^#?[a-f0-9]{6}$/i.test(color))
            onChange(color.startsWith("#") ? color : `#${color}`);
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        className="h-auto w-full rounded-none border-0 bg-transparent! p-0 font-mono text-[11px] md:text-[11px] shadow-none focus-visible:ring-0"
      />
      <span className="text-muted-foreground text-[10px]">100%</span>
    </div>
  );
}
