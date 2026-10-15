import type { DesignNode } from "@/lib/design/document";
import { pathData } from "@/lib/design/vector";
import { isContainer } from "@/lib/design/document";
import { memo, useId, type ReactNode } from "react";

export function NodeGraphic({
  node: n,
  children,
}: {
  node: DesignNode;
  children?: ReactNode;
}) {
  const scope = useId();
  const paint = { fill: n.fill, stroke: n.stroke, strokeWidth: n.strokeWidth };
  const shape =
    n.type === "ellipse" ? (
      <ellipse
        cx={n.x + n.width / 2}
        cy={n.y + n.height / 2}
        rx={n.width / 2}
        ry={n.height / 2}
        {...paint}
      />
    ) : n.type === "line" ? (
      <line
        x1={n.x}
        y1={n.y}
        x2={n.x + n.width}
        y2={n.y + n.height}
        stroke={n.stroke === "none" ? n.fill : n.stroke}
        strokeWidth={Math.max(1, n.strokeWidth)}
      />
    ) : n.type === "text" ? (
      <text
        x={
          n.x +
          (n.textAlign === "center"
            ? n.width / 2
            : n.textAlign === "right"
              ? n.width
              : 0)
        }
        y={n.y}
        fill={n.fill}
        fontFamily={`${n.fontFamily}, sans-serif`}
        fontSize={n.fontSize}
        fontWeight={n.fontWeight}
        textAnchor={
          n.textAlign === "center"
            ? "middle"
            : n.textAlign === "right"
              ? "end"
              : "start"
        }
        dominantBaseline="text-before-edge"
      >
        {n.text.split("\n").map((line, i) => (
          <tspan
            key={i}
            x={
              n.x +
              (n.textAlign === "center"
                ? n.width / 2
                : n.textAlign === "right"
                  ? n.width
                  : 0)
            }
            dy={i ? n.fontSize * 1.4 : 0}
          >
            {line || " "}
          </tspan>
        ))}
      </text>
    ) : n.type === "path" && n.anchors ? (
      <path
        d={pathData(n.anchors, n.closed, n)}
        {...paint}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : n.type === "path" && n.points ? (
      <path
        d={n.points
          .map((p, i) => `${i ? "L" : "M"}${n.x + p.x} ${n.y + p.y}`)
          .join(" ")}
        {...paint}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ) : (
      <rect
        x={n.x}
        y={n.y}
        width={n.width}
        height={n.height}
        rx={n.radius}
        {...paint}
      />
    );
  const clipId = `clip-${scope}`;
  return (
    <g
      opacity={n.opacity}
      transform={
        n.rotation
          ? `rotate(${n.rotation} ${n.x + n.width / 2} ${n.y + n.height / 2})`
          : undefined
      }
    >
      {n.shadow && (
        <defs>
          <filter
            id={`shadow-${scope}`}
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity=".18" />
          </filter>
        </defs>
      )}
      <g filter={n.shadow ? `url(#shadow-${scope})` : undefined}>{shape}</g>
      {n.image && (
        <image
          href={n.image}
          x={n.x}
          y={n.y}
          width={n.width}
          height={n.height}
          preserveAspectRatio="xMidYMid slice"
        />
      )}
      {n.clip && isContainer(n) ? (
        <>
          <defs>
            <clipPath id={clipId}>
              <rect
                x={n.x}
                y={n.y}
                width={n.width}
                height={n.height}
                rx={n.radius}
              />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>{children}</g>
        </>
      ) : (
        children
      )}
    </g>
  );
}
export const DocumentGraphics = memo(function DocumentGraphics({
  nodes,
  parentId = null,
  onNodeClick,
}: {
  nodes: DesignNode[];
  parentId?: string | null;
  onNodeClick?: (node: DesignNode) => void;
}) {
  return (
    <>
      {nodes
        .filter((n) => n.parentId === parentId && n.visible)
        .map((n) => (
          <g
            key={n.id}
            onClick={
              onNodeClick
                ? (e) => {
                    if (n.prototypeTarget) {
                      e.stopPropagation();
                      onNodeClick(n);
                    }
                  }
                : undefined
            }
            className={
              onNodeClick && n.prototypeTarget ? "cursor-pointer" : undefined
            }
          >
            <NodeGraphic node={n}>
              <DocumentGraphics
                nodes={nodes}
                parentId={n.id}
                onNodeClick={onNodeClick}
              />
            </NodeGraphic>
          </g>
        ))}
    </>
  );
});
