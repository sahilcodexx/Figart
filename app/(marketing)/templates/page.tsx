import { TemplatesPage } from "@/components/site/product-pages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata(
  "Starter design",
  "Make the editable Elsewhere app your own: discover, stay details, and booking review screens.",
  "/templates",
);
export default function Page() {
  return <TemplatesPage />;
}
