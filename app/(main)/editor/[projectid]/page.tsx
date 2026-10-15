import type { Metadata } from "next";
import { EditorLoader } from "@/components/design/editor-loader";
export const metadata: Metadata = { robots:{index:false,follow:false}, title: "Design editor · Figart" };
export default async function EditorPage({
  params,
}: {
  params: Promise<{ projectid: string }>;
}) {
  const { projectid } = await params;
  return <EditorLoader id={projectid} />;
}
