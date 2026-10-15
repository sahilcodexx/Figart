import type { Metadata } from "next";
import { absoluteUrl } from "./config.ts";

export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title: `${title} · Figart`,
    description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      title: `${title} · Figart`,
      description,
      url: absoluteUrl(path),
      siteName: "Figart",
      type: "website",
      images: [
        {
          url: absoluteUrl("/figart-og.png"),
          width: 1200,
          height: 630,
          alt: "Figart browser design workspace",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [absoluteUrl("/figart-og.png")],
      title: `${title} · Figart`,
      description,
    },
  };
}
