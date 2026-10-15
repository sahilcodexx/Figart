import { HelpPage } from "@/components/site/product-pages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata(
  "Help & getting started",
  "Create your first file, learn the canvas controls, and find help with saving and exports.",
  "/help",
);
export default function Page() {
  return <HelpPage />;
}
