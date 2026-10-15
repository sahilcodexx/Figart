import { starterDocument, descendants } from "@/lib/design/document";
import { forestCabin } from "@/lib/design/starter-assets";
import { DocumentGraphics } from "@/components/design/node-renderer";
import { cn } from "@/lib/utils";

const doc = starterDocument();
const roots = doc.pages[0].nodes.filter((node) => !node.parentId);
const nodes = doc.pages[0].nodes.map((node) =>
  node.image
    ? {
        ...node,
        image:
          node.image === forestCabin
            ? "/demo/forest-cabin.jpg"
            : "/demo/lakeside-cabin.jpg",
      }
    : node,
);
const screens = roots.map((root) => {
  const ids = new Set(descendants(nodes, [root.id]));
  return nodes.filter((node) => ids.has(node.id));
});

export function StarterPreview({
  screen = 0,
  className,
}: {
  screen?: number;
  className?: string;
}) {
  const frame = roots[screen] ?? roots[0];
  return (
    <svg
      viewBox={`${frame.x} ${frame.y} ${frame.width} ${frame.height}`}
      role="img"
      aria-label={`Elsewhere editable app design: ${frame.name}`}
      className={cn("block h-auto w-full", className)}
    >
      <DocumentGraphics nodes={screens[screen] ?? screens[0]} />
    </svg>
  );
}
