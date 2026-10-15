export type PanelVisibility = {
  left: boolean;
  right: boolean;
  restore: { left: boolean; right: boolean };
};
export const defaultPanels: PanelVisibility = {
  left: true,
  right: true,
  restore: { left: true, right: true },
};
export function togglePanels(state: PanelVisibility): PanelVisibility {
  return state.left || state.right
    ? {
        left: false,
        right: false,
        restore: { left: state.left, right: state.right },
      }
    : {
        ...state,
        ...(state.restore.left || state.restore.right
          ? state.restore
          : { left: true, right: true }),
      };
}
export function dragDelta(
  start: { x: number; y: number },
  current: { x: number; y: number },
  grid: boolean,
  axisLock: boolean,
) {
  let x = current.x - start.x,
    y = current.y - start.y;
  if (axisLock) {
    if (Math.abs(x) >= Math.abs(y)) y = 0;
    else x = 0;
  }
  const step = grid ? 20 : 1;
  return { x: Math.round(x / step) * step, y: Math.round(y / step) * step };
}
export function fitViewport(
  bounds: { x: number; y: number; width: number; height: number },
  size: { width: number; height: number },
  maxZoom = 1.5,
) {
  const zoom = Math.min(
    maxZoom,
    Math.max(
      0.05,
      Math.min(
        Math.max(1, size.width - 120) / Math.max(1, bounds.width),
        Math.max(1, size.height - 160) / Math.max(1, bounds.height),
      ),
    ),
  );
  return {
    zoom,
    x: (size.width - bounds.width * zoom) / 2 - bounds.x * zoom,
    y: (size.height - bounds.height * zoom) / 2 - bounds.y * zoom,
  };
}

export type CanvasView = { x: number; y: number; zoom: number };
export type ZoomChange = number | ((current: number) => number);
export function wheelPixels(delta: number, mode: number, pageSize = 800) {
  if (!Number.isFinite(delta)) return 0;
  return delta * (mode === 1 ? 16 : mode === 2 ? pageSize : 1);
}
export function zoomAt(
  view: CanvasView,
  requested: number,
  anchor: { x: number; y: number },
): CanvasView {
  if (
    !Number.isFinite(requested) ||
    !Number.isFinite(anchor.x) ||
    !Number.isFinite(anchor.y)
  )
    return view;
  const zoom = Math.max(0.05, Math.min(8, requested));
  if (zoom === view.zoom) return view;
  const ratio = zoom / view.zoom;
  return {
    zoom,
    x: anchor.x - (anchor.x - view.x) * ratio,
    y: anchor.y - (anchor.y - view.y) * ratio,
  };
}
export function wheelZoomAt(
  view: CanvasView,
  delta: number,
  mode: number,
  anchor: { x: number; y: number },
  pageSize = 800,
): CanvasView {
  const pixels = Math.max(
    -80,
    Math.min(80, wheelPixels(delta, mode, pageSize)),
  );
  return zoomAt(view, view.zoom * Math.exp(-pixels * 0.001), anchor);
}
