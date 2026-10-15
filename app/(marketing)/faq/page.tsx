import { FaqPage } from "@/components/site/product-pages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata(
  "FAQs",
  "Answers about getting started, saving, editing, and exporting with Figart.",
  "/faq",
);
export default function Page() {
  return <FaqPage />;
}
