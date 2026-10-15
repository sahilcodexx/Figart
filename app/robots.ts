import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site/config";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/dashboard",
        "/editor/",
        "/files",
        "/sign-in",
        "/sign-up",
        "/sso-callback/",
      ],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl(),
  };
}
