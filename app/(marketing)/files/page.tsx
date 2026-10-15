import { FilesPage } from "@/components/site/product-pages";
import { pageMetadata } from "@/lib/site/metadata";
export const metadata = {
  ...pageMetadata(
    "Your files",
    "Open browser design files, download editable backups, or visit your account workspace.",
    "/files",
  ),
  robots: { index: false, follow: true },
};
export default function Page() {
  return <FilesPage />;
}
