"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Twitter } from "lucide-react";
import { Brand, landingContainer } from "@/components/landing/shared";
import { cn } from "@/lib/utils";
import { footerColumns, marketingPaths } from "@/lib/site/navigation";
import styles from "@/components/landing/landing.module.css";

const footerLink =
  "rounded-sm transition-colors hover:text-[#147bd0] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#147bd0]";

export default function Footer() {
  const path = usePathname();
  if (!marketingPaths.includes(path)) return null;
  return (
    <footer className={cn(styles.theme, "overflow-hidden pt-8 sm:pt-12")}>
      <div className={landingContainer}>
        <div className="grid gap-x-10 gap-y-12 py-12 sm:py-16 lg:grid-cols-[minmax(200px,1.25fr)_repeat(4,minmax(0,1fr))] lg:gap-x-10">
          <div className="lg:pr-4">
            <Brand />
            <p className="mt-4 max-w-[260px] text-sm leading-6 text-[#737570]">
              A little space for your biggest ideas. Design, explore, and make
              something worth sharing.
            </p>
            <div className="mt-5 flex items-center gap-2">
              <Link
                href="https://github.com/sahilcodexx"
                aria-label="Figart on GitHub"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  footerLink,
                  "flex size-9 items-center justify-center rounded-full border border-[#e4e6e3] text-[#62655f] hover:border-[#147bd0]/40",
                )}
              >
                <Github className="size-4" />
              </Link>
              <Link
                href="https://twitter.com/sahilcodex"
                aria-label="Figart on X / Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  footerLink,
                  "flex size-9 items-center justify-center rounded-full border border-[#e4e6e3] text-[#62655f] hover:border-[#147bd0]/40",
                )}
              >
                <Twitter className="size-4" />
              </Link>
            </div>
          </div>
          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-9 sm:grid-cols-4 lg:col-span-4 lg:gap-x-10"
          >
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h2 className="mb-4 text-[13px] leading-5 font-medium text-[#424440]">
                  {column.title}
                </h2>
                <ul className="space-y-3 text-[13px] leading-5 text-[#737570]">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={cn(footerLink, "inline-block py-0.5")}
                        {...(link.href.startsWith("https")
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
        <div className="flex flex-col gap-4 border-t border-[#e8e9e7] py-6 text-xs leading-5 text-[#80827d] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Figart. A space to make.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link href="/privacy" className={footerLink}>
              Privacy
            </Link>
            <Link href="/help" className={footerLink}>
              Help & support
            </Link>
            <Link href="/faq" className={footerLink}>
              FAQs
            </Link>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="mt-14 -mb-[0.24em] bg-linear-to-b from-[#c8edf5] to-[#f3fafb] bg-clip-text text-center text-[clamp(112px,32vw,460px)] leading-[0.85] font-semibold tracking-tight text-transparent select-none sm:mt-20"
        >
          figart
        </div>
      </div>
    </footer>
  );
}
