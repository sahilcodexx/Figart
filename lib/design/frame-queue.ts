export function createFrameQueue<T>(
  apply: (value: T) => void,
  request: (callback: FrameRequestCallback) => number = (callback) =>
    requestAnimationFrame(callback),
  cancel: (id: number) => void = (id) => cancelAnimationFrame(id),
) {
  let frame: number | null = null;
  let pending: { value: T } | null = null;
  const flush = () => {
    if (frame !== null) cancel(frame);
    frame = null;
    const job = pending;
    pending = null;
    if (job) apply(job.value);
  };
  return {
    push(value: T) {
      pending = { value };
      if (frame === null) frame = request(flush);
    },
    flush,
    cancel() {
      if (frame !== null) cancel(frame);
      frame = null;
      pending = null;
    },
  };
}
