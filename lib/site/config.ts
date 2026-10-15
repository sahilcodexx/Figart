export const siteName = "Figart";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://figart.vercel.app"
).replace(/\/+$/, "");
export const absoluteUrl = (path = "/") =>
  `${siteUrl}${path === "/" ? "" : path}`;
