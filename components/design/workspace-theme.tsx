"use client";
import { useTheme } from "next-themes";
import type { CSSProperties, ReactNode } from "react";
const light = {
  "--background": "#ffffff",
  "--foreground": "#1e1e1e",
  "--card": "#ffffff",
  "--card-foreground": "#1e1e1e",
  "--muted": "#f5f5f5",
  "--muted-foreground": "#6e6e6e",
  "--border": "#e6e6e6",
  "--input": "#e6e6e6",
  "--primary": "#0d99ff",
  "--primary-foreground": "#ffffff",
  "--accent": "#f5f5f5",
  "--accent-foreground": "#1e1e1e",
  "--secondary": "#f5f5f5",
  "--secondary-foreground": "#1e1e1e",
  "--ring": "#0d99ff",
  "--canvas": "#f5f5f5",
  "--selection": "#e5e9f5",
};
const dark = {
  ...light,
  "--background": "#2c2c2c",
  "--foreground": "#f5f5f5",
  "--card": "#2c2c2c",
  "--card-foreground": "#ffffff",
  "--muted": "#383838",
  "--muted-foreground": "#b3b3b3",
  "--border": "#444444",
  "--input": "#444444",
  "--accent": "#383838",
  "--accent-foreground": "#ffffff",
  "--secondary": "#383838",
  "--secondary-foreground": "#ffffff",
  "--canvas": "#1e1e1e",
  "--selection": "#3b4563",
};
export function WorkspaceTheme({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { resolvedTheme } = useTheme();
  return (
    <div
      data-lenis-prevent
      style={(resolvedTheme === "dark" ? dark : light) as CSSProperties}
      className={`bg-background text-foreground selection:bg-primary/25 text-xs ${className}`}
    >
      {children}
    </div>
  );
}
