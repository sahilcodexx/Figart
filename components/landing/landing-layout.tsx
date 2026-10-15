import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { landingContainer } from "./shared";
import styles from "./landing.module.css";

export function LandingLayout({ children }: { children: ReactNode }) {
  return (
    <main className={cn(styles.theme, "overflow-hidden")}>
      <div className={landingContainer}>{children}</div>
    </main>
  );
}
