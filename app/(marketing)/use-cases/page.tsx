import { UseCasesPage } from "@/components/site/product-pages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = pageMetadata(
  "Use cases",
  "Explore ways to use Figart for interfaces, visual identities, websites, and vector artwork.",
  "/use-cases",
);
export default function Page() {
  return <UseCasesPage />;
}
