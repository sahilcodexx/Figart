import { PrivacyPage } from "@/components/site/product-pages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata(
  "Your data & privacy",
  "Understand account storage, browser files, recovery copies, and exports in Figart.",
  "/privacy",
);
export default function Page() {
  return <PrivacyPage />;
}
