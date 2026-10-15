import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { footerColumns, marketingPaths } from "../lib/site/navigation.ts";
import { topicPages } from "../lib/site/catalog.ts";
import { pageMetadata } from "../lib/site/metadata.ts";
import { absoluteUrl } from "../lib/site/config.ts";

test("every marketing destination has a real static page or generated topic route", () => {
  for (const route of marketingPaths.filter((path) => path !== "/")) {
    const topic = topicPages.find((page) => page.path === route);
    const file = new URL(
      `../app/(marketing)${topic ? route.split("/").slice(0, -1).join("/") + "/[slug]" : route}/page.tsx`,
      import.meta.url,
    );
    assert.ok(existsSync(file), `Missing page: ${route}`);
    const source = readFileSync(file, "utf8");
    assert.ok(
      source.includes(topic ? "generateMetadata" : "export const metadata"),
      `Missing metadata: ${route}`,
    );
    if (topic)
      assert.ok(
        source.includes("generateStaticParams"),
        `Missing generated route: ${route}`,
      );
    else
      assert.ok(
        source.includes(`"${route}"`),
        `Missing canonical path: ${route}`,
      );
  }
});

test("all expanded footer links resolve to implemented pages or existing app destinations", () => {
  assert.deepEqual(
    footerColumns.map((column) => column.title),
    ["Product", "Use cases", "Resources", "Company"],
  );
  const existing = ["/dashboard", "/editor/demo", "/sign-in", "/sign-up"];
  for (const link of footerColumns.flatMap((column) => column.links))
    assert.ok(
      link.href.startsWith("https://") ||
        marketingPaths.includes(link.href) ||
        existing.includes(link.href),
      `Unknown destination ${link.href}`,
    );
  assert.equal(
    footerColumns
      .flatMap((column) => column.links)
      .find((link) => link.label === "Start locally").href,
    "/start",
  );
});

test("topic metadata uses the Figart brand, configured origin, and unique descriptions", () => {
  assert.equal(
    new Set(topicPages.map((page) => page.path)).size,
    topicPages.length,
  );
  assert.equal(
    new Set(topicPages.map((page) => page.description)).size,
    topicPages.length,
  );
  for (const page of topicPages) {
    const metadata = pageMetadata(page.label, page.description, page.path);
    assert.equal(metadata.title, `${page.label} · Figart`);
    assert.equal(metadata.alternates.canonical, absoluteUrl(page.path));
    for (const related of page.related)
      assert.ok(
        marketingPaths.includes(related.split("#")[0]),
        `Broken related link ${related}`,
      );
  }
  assert.equal(
    new URL(absoluteUrl()).hostname,
    new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://figart.vercel.app")
      .hostname,
  );
});
