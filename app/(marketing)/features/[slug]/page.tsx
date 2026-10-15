import { notFound } from "next/navigation";
import { topicPages } from "@/lib/site/catalog";
import { pageMetadata } from "@/lib/site/metadata";
import { TopicArticle } from "@/components/site/topic-pages";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return topicPages
    .filter((page) => page.path.startsWith("/features/"))
    .map((page) => ({ slug: page.path.split("/").at(-1)! }));
}
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = topicPages.find((page) => page.path === `/features/${slug}`);
  if (!page) return {};
  return pageMetadata(page.label, page.description, page.path);
}
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = topicPages.find((page) => page.path === `/features/${slug}`);
  if (!page) notFound();
  return <TopicArticle page={page} />;
}
