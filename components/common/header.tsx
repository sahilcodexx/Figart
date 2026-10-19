"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Menu, X } from "lucide-react";
import {
  Brand,
  LandingButton,
  landingContainer,
} from "@/components/landing/shared";
import { cn } from "@/lib/utils";
import { marketingPaths } from "@/lib/site/navigation";
import styles from "@/components/landing/landing.module.css";

import {
  getHeroNavigation,
  getServerHeroNavigation,
  subscribeHeroNavigation,
} from "@/lib/site/hero-navigation";

export default function Header() {
  const path = usePathname();
  const { isSignedIn } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const heroNavigationVisible = useSyncExternalStore(
    subscribeHeroNavigation,
    getHeroNavigation,
    getServerHeroNavigation,
  );
  const hideForHero = path === "/" && !heroNavigationVisible;
  if (!marketingPaths.includes(path)) return null;
  const links = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Explore", href: "/features" },
    { label: "Templates", href: "/templates" },
  ];
  return (
    <header
      data-site-header
      aria-hidden={hideForHero || undefined}
      inert={hideForHero || undefined}
      className={cn(
        styles.theme,
        "top-0 z-40 border-b border-[#e9eae8]",
        path === "/" ? "fixed inset-x-0" : "sticky",
        hideForHero
          ? "pointer-events-none invisible -translate-y-full"
          : "visible translate-y-0",
        path === "/" && !hideForHero && styles.navigationEntrance,
      )}
    >
      <div
        className={cn(
          landingContainer,
          "flex h-15 items-center justify-between gap-3 sm:gap-5",
        )}
      >
        <Brand />
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-14 text-[18px] text-[#777777] lg:flex"
        >
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={path === link.href ? "page" : undefined}
              className={`transition-colors hover:text-[#147bd0] ${path === link.href ? "text-[#147bd0]" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3 sm:gap-7">
          <Link
            href={isSignedIn ? "/dashboard" : "/sign-in"}
            className="hidden text-[18px] text-[#777777] hover:text-[#147bd0] sm:block"
          >
            {isSignedIn ? "My workspace" : "Log In"}
          </Link>
          <LandingButton
            href="/dashboard"
            className="h-8 px-3 text-xs sm:h-[37px] sm:px-3.5 sm:text-[14px] [&_svg]:hidden sm:[&_svg]:block"
          >
            Get Started
          </LandingButton>
          <button
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen(!menuOpen)}
            className="rounded-md p-1.5 hover:bg-[#f1f1f1] lg:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full flex flex-col gap-1 border-b border-[#e9eae8] bg-[#fdfdfd] p-5 shadow-sm lg:hidden"
        >
          {[...links, { label: "Log In", href: "/sign-in" }].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-4 py-3 text-sm hover:bg-[#f1f1f1]"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
