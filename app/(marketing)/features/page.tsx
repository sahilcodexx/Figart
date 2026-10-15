import { FeaturesPage } from "@/components/site/product-pages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata(
  "Features",
  "Explore Figart\u2019s canvas, vector tools, layers, components, saving, and exports.",
  "/features",
);
export default function Page() {
  return <FeaturesPage />;
}
