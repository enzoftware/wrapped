import { useEffect, useLayoutEffect, useRef, type DependencyList } from 'react';
import { createScope } from 'animejs';
import { inView } from 'motion';

// Shared animation helpers.
//   motion (motion.dev)  → layout, presence, gestures, scroll-in reveals
//   anime.js             → thematic timelines, particles, text splitting, SVG drawing

export const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Runs anime.js code inside a scope rooted at the returned ref, so selectors
 * only match descendants and every animation is reverted on unmount.
 * Elements are hidden from inside `fn` (never via CSS), so with reduced motion
 * the callback is skipped and content simply renders in its final state.
 */
export function useAnime<T extends HTMLElement = HTMLDivElement>(
  fn: (root: T) => void | (() => void),
  deps: DependencyList = [],
) {
  const root = useRef<T>(null);
  useIsoLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const scope = createScope({ root: el }).add(() => fn(el));
    return () => { scope.revert(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return root;
}

type Playable = { play: () => unknown };

/**
 * Like useAnime, but `build` creates paused animations (autoplay: false) that
 * start the first time the root scrolls into view (via motion's inView).
 */
export function useAnimeInView<T extends HTMLElement = HTMLDivElement>(
  build: (root: T) => Playable | Playable[],
  deps: DependencyList = [],
) {
  return useAnime<T>((el) => {
    const built = build(el);
    const list = Array.isArray(built) ? built : [built];
    let stop = () => {};
    stop = inView(el, () => {
      list.forEach((a) => a.play());
      stop();
    }, { margin: '0px 0px -15% 0px' });
    return () => stop();
  }, deps);
}
