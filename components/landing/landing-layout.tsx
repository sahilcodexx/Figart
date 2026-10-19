import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { landingContainer } from "./shared";
import styles from "./landing.module.css";

export function LandingLayout({
  children,
  hero,
}: {
  children: ReactNode;
  hero?: ReactNode;
}) {
  return (
    <main className={cn(styles.theme, "overflow-x-clip")}>
      {hero}
      <div className={landingContainer}>{children}</div>
    </main>
  );
}
