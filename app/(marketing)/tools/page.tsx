import { ToolsPage } from "@/components/site/product-pages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata(
  "Design tools",
  "A practical guide to Figart\u2019s drawing tools, typography, layers, and keyboard shortcuts.",
  "/tools",
);
export default function Page() {
  return <ToolsPage />;
}
