import { DesignDocument, getBounds } from "@/lib/design/document";
import { DocumentGraphics } from "./node-renderer";
export function FilePreview({ document: doc }: { document: DesignDocument }) {
  const nodes = doc.pages[0]?.nodes ?? [];
  const b = getBounds(nodes.filter((n) => !n.parentId));
  return nodes.length ? (
    <svg
      viewBox={`${b.x - 60} ${b.y - 60} ${b.width + 120} ${b.height + 120}`}
      className="h-full w-full"
      aria-hidden="true"
    >
      <DocumentGraphics nodes={nodes} />
    </svg>
  ) : (
    <div className="h-full w-full" />
  );
}
