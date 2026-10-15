export type VectorPoint = { x: number; y: number };
export type VectorAnchor = VectorPoint & {
  in?: VectorPoint;
  out?: VectorPoint;
};
export function pathData(
  anchors: VectorAnchor[],
  closed = false,
  origin: VectorPoint = { x: 0, y: 0 },
): string {
  if (!anchors.length) return "";
  const point = (p: VectorPoint) => `${origin.x + p.x} ${origin.y + p.y}`;
  let result = `M${point(anchors[0])}`;
  const count = closed ? anchors.length : anchors.length - 1;
  for (let i = 0; i < count; i++) {
    const a = anchors[i],
      b = anchors[(i + 1) % anchors.length];
    result +=
      a.out || b.in
        ? ` C${point(a.out ?? a)} ${point(b.in ?? b)} ${point(b)}`
        : ` L${point(b)}`;
  }
  return result + (closed ? " Z" : "");
}
function evaluate(a: number, b: number, c: number, d: number, t: number) {
  return (
    (1 - t) ** 3 * a +
    3 * (1 - t) ** 2 * t * b +
    3 * (1 - t) * t ** 2 * c +
    t ** 3 * d
  );
}
function extrema(a: number, b: number, c: number, d: number) {
  const qa = -a + 3 * b - 3 * c + d,
    qb = 2 * (a - 2 * b + c),
    qc = b - a;
  if (Math.abs(qa) < 1e-10)
    return Math.abs(qb) < 1e-10 ? [] : [-qc / qb].filter((t) => t > 0 && t < 1);
  const disc = qb * qb - 4 * qa * qc;
  if (disc < 0) return [];
  return [
    (-qb + Math.sqrt(disc)) / (2 * qa),
    (-qb - Math.sqrt(disc)) / (2 * qa),
  ].filter((t) => t > 0 && t < 1);
}
export function vectorBounds(anchors: VectorAnchor[], closed = false) {
  if (!anchors.length) return { x: 0, y: 0, width: 1, height: 1 };
  const points: VectorPoint[] = [...anchors];
  const count = closed ? anchors.length : anchors.length - 1;
  for (let i = 0; i < count; i++) {
    const a = anchors[i],
      b = anchors[(i + 1) % anchors.length],
      h1 = a.out ?? a,
      h2 = b.in ?? b;
    const roots = [
      ...extrema(a.x, h1.x, h2.x, b.x),
      ...extrema(a.y, h1.y, h2.y, b.y),
    ];
    for (const t of roots)
      points.push({
        x: evaluate(a.x, h1.x, h2.x, b.x, t),
        y: evaluate(a.y, h1.y, h2.y, b.y, t),
      });
  }
  const x = Math.min(...points.map((p) => p.x)),
    y = Math.min(...points.map((p) => p.y));
  return {
    x,
    y,
    width: Math.max(1, ...points.map((p) => p.x - x)),
    height: Math.max(1, ...points.map((p) => p.y - y)),
  };
}
export function offsetAnchors(
  anchors: VectorAnchor[],
  dx: number,
  dy: number,
): VectorAnchor[] {
  const offset = (p: VectorPoint) => ({ x: p.x + dx, y: p.y + dy });
  return anchors.map((p) => ({
    ...offset(p),
    ...(p.in ? { in: offset(p.in) } : {}),
    ...(p.out ? { out: offset(p.out) } : {}),
  }));
}
export function scaleAnchors(
  anchors: VectorAnchor[],
  sx: number,
  sy: number,
): VectorAnchor[] {
  const scale = (p: VectorPoint) => ({ x: p.x * sx, y: p.y * sy });
  return anchors.map((p) => ({
    ...scale(p),
    ...(p.in ? { in: scale(p.in) } : {}),
    ...(p.out ? { out: scale(p.out) } : {}),
  }));
}
export function normalizeVector<
  T extends { x: number; y: number; width: number; height: number },
>(node: T, anchors: VectorAnchor[], closed = false) {
  const b = vectorBounds(anchors, closed);
  return {
    ...node,
    x: node.x + b.x,
    y: node.y + b.y,
    width: b.width,
    height: b.height,
    anchors: offsetAnchors(anchors, -b.x, -b.y),
    closed,
  };
}
export function validAnchors(value: unknown): value is VectorAnchor[] {
  const valid = (p: unknown): p is VectorPoint =>
    !!p &&
    typeof p === "object" &&
    Number.isFinite((p as VectorPoint).x) &&
    Number.isFinite((p as VectorPoint).y) &&
    Math.abs((p as VectorPoint).x) <= 1e6 &&
    Math.abs((p as VectorPoint).y) <= 1e6;
  return (
    Array.isArray(value) &&
    value.length <= 10000 &&
    value.every(
      (p) =>
        valid(p) &&
        (!("in" in p) || valid(p.in)) &&
        (!("out" in p) || valid(p.out)),
    )
  );
}
