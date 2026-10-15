import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { PageShell, PageCta } from "./page-shell";
import { Eyebrow, LandingButton } from "@/components/landing/shared";
import { StarterPreview } from "@/components/landing/starter-preview";
import {
  topicPages,
  topicGroupPath,
  type TopicGroup,
  type TopicPage,
} from "@/lib/site/catalog";
import { shortcuts } from "@/lib/site/content";

export function TopicDirectory({ group }: { group: TopicGroup }) {
  return (
    <section className="mt-20 border-t border-[#e7e9e5] pt-10">
      <Eyebrow>
        {group === "Resources" ? "Practical guides" : "Go a little deeper"}
      </Eyebrow>
      <h2 className="mb-8 text-3xl tracking-[-0.3px]">
        {group === "Product"
          ? "A closer look at the tools."
          : group === "Use cases"
            ? "Find your starting point."
            : "Learn by making something."}
      </h2>
      <div className="grid gap-5 md:grid-cols-2">
        {topicPages
          .filter((page) => page.group === group)
          .map((page) => (
            <Link
              href={page.path}
              key={page.path}
              className="group rounded-xl border border-[#e5e7e3] bg-white p-7 transition-colors hover:border-[#a9d5ef] hover:bg-[#f8fcfe]"
            >
              <span className="text-[11px] uppercase tracking-[0.08em] text-[#999]">
                {page.group}
              </span>
              <h3 className="mt-4 flex items-center justify-between gap-5 text-[23px] text-[#555]">
                {page.label}
                <ArrowRight className="size-4 shrink-0 text-[#147bd0] transition-transform group-hover:translate-x-1" />
              </h3>
              <p className="mt-4 text-[15px] leading-[1.65] text-[#888]">
                {page.description}
              </p>
            </Link>
          ))}
      </div>
    </section>
  );
}

export function TopicArticle({ page }: { page: TopicPage }) {
  const related = page.related.map((path) => ({
    path,
    label:
      topicPages.find((topic) => topic.path === path)?.label ||
      (
        {
          "/templates": "Editable templates",
          "/tools": "Design tools",
          "/start": "Create a browser file",
          "/privacy": "Your data & privacy",
          "/help#shortcuts": "Shortcut reference",
        } as Record<string, string>
      )[path] ||
      "Help & getting started",
  }));
  return (
    <PageShell
      eyebrow={page.label}
      title={page.title}
      description={page.description}
      path={page.path}
      breadcrumbs={[{ label: page.group, href: topicGroupPath(page.group) }]}
    >
      <div className="grid items-start gap-12 lg:grid-cols-[1fr_280px] lg:gap-20">
        <article className="min-w-0">
          <div className="mb-10 rounded-xl bg-[#edf7fb] p-7 text-[16px] leading-[1.7] text-[#71858e]">
            {page.group === "Resources"
              ? "A practical guide to the tools available in Figart today. Work through these steps in the editable demo, or use them in your own document."
              : "Make the idea concrete on an editable canvas. These workflows use the tools available in Figart today, with separate layers you can select and refine."}
          </div>
          {page.sections.map((section, index) => (
            <section
              key={section.title}
              id={`section-${index + 1}`}
              className="scroll-mt-28 border-b border-[#e7e9e5] py-9 first:pt-0"
            >
              <p className="mb-3 text-[11px] text-[#a0a6a1]">0{index + 1}</p>
              <h2 className="text-[28px] leading-[1.2] tracking-[-0.4px] md:text-[32px]">
                {section.title}
              </h2>
              <p className="mt-5 text-[17px] leading-[1.85] text-[#777]">
                {section.body}
              </p>
            </section>
          ))}
          <section id="try-it" className="scroll-mt-28 pt-10">
            <Eyebrow>Try it in your next file</Eyebrow>
            <h2 className="text-[28px]">A few steps to get moving.</h2>
            <ol className="mt-7 space-y-4">
              {page.steps.map((step, index) => (
                <li
                  key={step}
                  className="flex items-start gap-4 rounded-lg border border-[#e8ebe5] bg-white p-5"
                >
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#edf6fc] text-xs text-[#147bd0]">
                    {index + 1}
                  </span>
                  <p className="pt-0.5 text-[16px] leading-[1.6] text-[#777]">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
          </section>
          {page.path === "/guides/keyboard-shortcuts" && (
            <dl className="mt-10 overflow-hidden rounded-xl border border-[#e5e7e3]">
              {shortcuts.map((shortcut) => (
                <div
                  key={shortcut.label}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee] px-5 py-4 last:border-0"
                >
                  <dt className="text-sm text-[#777]">{shortcut.label}</dt>
                  <dd>
                    <kbd className="rounded border border-[#e0e3dc] bg-white px-2 py-1 font-sans text-xs text-[#666]">
                      {shortcut.keys}
                    </kbd>
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </article>
        <aside className="lg:sticky lg:top-28">
          <div className="rounded-xl border border-[#e4e7df] bg-white p-6">
            <p className="text-xs uppercase tracking-[0.08em] text-[#999]">
              On this page
            </p>
            <nav aria-label="Article sections" className="mt-5 space-y-4">
              {page.sections.map((section, index) => (
                <a
                  key={section.title}
                  href={`#section-${index + 1}`}
                  className="block text-sm leading-relaxed text-[#777] hover:text-[#147bd0]"
                >
                  {section.title}
                </a>
              ))}
              <a href="#try-it" className="block text-sm text-[#147bd0]">
                Try it yourself
              </a>
            </nav>
          </div>
          <div className="mt-5 overflow-hidden rounded-xl bg-[#e8ebe2] p-6">
            <p className="mb-4 text-sm text-[#77836c]">
              See the ideas in a real design.
            </p>
            <StarterPreview className="mx-auto w-[150px] rounded-[10px] shadow-sm" />
            <LandingButton
              href="/editor/demo"
              className="mt-5 h-10 w-full text-sm"
            >
              Explore the demo
            </LandingButton>
          </div>
        </aside>
      </div>
      <section className="mt-20 border-t border-[#e5e8e1] pt-10">
        <Eyebrow>Keep exploring</Eyebrow>
        <h2 className="mb-7 text-3xl">A useful next step.</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center justify-between gap-5 rounded-xl border border-[#e5e7e3] bg-white p-6 text-[16px] text-[#666] hover:border-[#a9d5ef]"
            >
              {item.label}
              <ArrowRight className="size-4 shrink-0 text-[#147bd0]" />
            </Link>
          ))}
        </div>
      </section>
      <PageCta />
    </PageShell>
  );
}

export function GuidesPage() {
  return (
    <PageShell
      eyebrow="Guides"
      title={
        <>
          A little guidance.
          <br />A lot to make your own.
        </>
      }
      description="Practical guides to your first Figart file, drawing with Bézier paths, choosing an export format, and moving comfortably around the canvas."
      path="/guides"
    >
      <section className="grid items-center gap-10 rounded-2xl bg-[#e8f5fa] p-8 sm:p-12 md:grid-cols-[1fr_1.2fr]">
        <div>
          <BookOpen className="mb-6 size-7 text-[#147bd0]" />
          <h2 className="text-3xl leading-tight tracking-[-0.4px]">
            Start with a small,
            <br />
            visible change.
          </h2>
          <p className="mt-5 max-w-md text-base leading-[1.7] text-[#7c8c93]">
            Open the Elsewhere demo, pick a headline, and try another direction.
            Each guide takes a specific part of that workflow and explains how
            to work with it.
          </p>
          <LandingButton href="/guides/getting-started" className="mt-7">
            Create your first design
          </LandingButton>
        </div>
        <div className="flex items-center justify-center gap-5 overflow-hidden">
          <StarterPreview
            screen={0}
            className="w-[170px] shrink-0 rounded-xl shadow-lg"
          />
          <StarterPreview
            screen={2}
            className="mt-14 w-[170px] shrink-0 rounded-xl shadow-lg"
          />
        </div>
      </section>
      <TopicDirectory group="Resources" />
      <PageCta />
    </PageShell>
  );
}
