import type { MetadataRoute } from "next";
import { marketingPaths } from "@/lib/site/navigation";
import { absoluteUrl } from "@/lib/site/config";
export default function sitemap(): MetadataRoute.Sitemap {
  return marketingPaths
    .filter((path) => path !== "/files")
    .map((path) => ({ url: absoluteUrl(path) }));
}
