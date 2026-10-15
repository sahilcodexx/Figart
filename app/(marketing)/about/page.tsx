import { AboutPage } from "@/components/site/product-pages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata(
  "Meet the maker",
  "Meet Sahil, the maker behind Figart\u2019s browser design workspace.",
  "/about",
);
export default function Page() {
  return <AboutPage />;
}
