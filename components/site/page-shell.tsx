import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Eyebrow,
  LandingButton,
  landingContainer,
} from "@/components/landing/shared";
import { cn } from "@/lib/utils";
import { absoluteUrl } from "@/lib/site/config";
import { StructuredData } from "./structured-data";
import styles from "@/components/landing/landing.module.css";

export function PageShell({
  eyebrow,
  title,
  description,
  children,
  path,
  breadcrumbs = [],
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
  path?: string;
  breadcrumbs?: { label: string; href: string }[];
}) {
  return (
    <main className={cn(styles.theme, "min-h-[65vh] pb-4")}>
      {path && (
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { name: "Home", url: "/" },
              ...breadcrumbs.map((item) => ({
                name: item.label,
                url: item.href,
              })),
              { name: eyebrow, url: path },
            ].map((item, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: item.name,
              item: absoluteUrl(item.url),
            })),
          }}
        />
      )}
      <div className={landingContainer}>
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 pt-7 text-xs text-[#999]"
        >
          <Link href="/" className="hover:text-[#147bd0]">
            Home
          </Link>
          <ChevronRight className="size-3" />
          {breadcrumbs.map((item) => (
            <span key={item.href} className="flex items-center gap-2">
              <Link href={item.href} className="hover:text-[#147bd0]">
                {item.label}
              </Link>
              <ChevronRight className="size-3" />
            </span>
          ))}
          <span aria-current="page" className="text-[#666]">
            {eyebrow}
          </span>
        </nav>
        <header className="max-w-[850px] pt-16 pb-14 md:pt-20 md:pb-20">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-[40px] leading-[1.1] font-normal tracking-[-0.7px] md:text-[58px]">
            {title}
          </h1>
          <p className="mt-6 max-w-[690px] text-[18px] leading-[1.55] text-[#777] md:text-xl">
            {description}
          </p>
        </header>
        {children}
      </div>
    </main>
  );
}

export function PageCta({
  title = "Something in mind? Make it real.",
  description = "Start with a blank canvas, or make the Elsewhere starter your own.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section className="mt-20 flex flex-col items-center rounded-2xl bg-linear-to-b from-[#e9faff] to-[#bee6f3] px-6 py-16 text-center md:mt-28">
      <h2 className="text-3xl leading-tight tracking-[-0.4px] md:text-[38px]">
        {title}
      </h2>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-[#708087]">
        {description}
      </p>
      <div className="mt-7 flex flex-wrap justify-center gap-3">
        <LandingButton href="/start">Start locally</LandingButton>
        <LandingButton href="/dashboard" secondary>
          Open workspace
        </LandingButton>
      </div>
    </section>
  );
}
