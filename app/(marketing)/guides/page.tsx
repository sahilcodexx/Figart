import { pageMetadata } from "@/lib/site/metadata";
import { GuidesPage } from "@/components/site/topic-pages";
export const metadata = pageMetadata(
  "Design guides",
  "Practical Figart guides to UI design, Bézier paths, SVG and PNG exports, and keyboard shortcuts.",
  "/guides",
);
export default function Page() {
  return <GuidesPage />;
}
