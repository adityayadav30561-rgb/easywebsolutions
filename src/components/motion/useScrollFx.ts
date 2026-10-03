"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether scroll-linked movement (pinned horizontal rails, parallax, scrubbed
 * transforms) should run.
 *
 * Only on a mouse/trackpad, where Lenis drives the scroll in step with every
 * animation frame. On touch screens the browser scrolls on its own compositor
 * thread and reports positions to JavaScript late and unevenly (iOS Safari
 * especially), so anything moved by JS in response to scroll stutters. There
 * we fall back to native scrolling and native swipe carousels instead.
 */
const QUERY = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function useScrollFx() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    // Server/first paint: the static, native-scroll layout (safe everywhere).
    () => false,
  );
}
