import { RefObject, useEffect } from "react";

type IdleHandle = number;
type RICWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => IdleHandle;
  cancelIdleCallback?: (h: IdleHandle) => void;
};

/* Two-stage deferred video preload.
   Pattern: keep <video preload="none"> while the surface is closed (no
   network cost), and once `active` flips true, wait `delayMs` for any
   entrance animation to finish, then schedule .load() during the next
   browser idle window. By the time the user reaches the video its buffer
   is already there, but we never pay the cost while idle. */
export function useDeferredVideoLoad(
  videoRef: RefObject<HTMLVideoElement | null>,
  active: boolean,
  delayMs = 600,
) {
  useEffect(() => {
    if (!active) return;
    const video = videoRef.current;
    if (!video) return;
    if (video.readyState >= 2) return;

    const w = window as RICWindow;
    let idleHandle: IdleHandle | undefined;

    const schedule = () => {
      if (w.requestIdleCallback) {
        idleHandle = w.requestIdleCallback(() => { video.load(); }, { timeout: 1500 });
      } else {
        idleHandle = window.setTimeout(() => { video.load(); }, 0);
      }
    };

    const t = window.setTimeout(schedule, delayMs);
    return () => {
      window.clearTimeout(t);
      if (idleHandle !== undefined) {
        if (w.cancelIdleCallback) w.cancelIdleCallback(idleHandle);
        else clearTimeout(idleHandle);
      }
    };
  }, [active, delayMs, videoRef]);
}
