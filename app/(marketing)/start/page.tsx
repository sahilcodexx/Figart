import { StartPage } from "@/components/site/product-pages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata(
  "Start locally",
  "Create a browser design file without signing in. Start blank, use a template, or import an editable file.",
  "/start",
);
export default function Page() {
  return <StartPage />;
}
