// Shared music state across Astro islands (WrapSection, IntroSplash, MusicPlayer are
// separate React roots, but share this module instance on the page).
const bus = new EventTarget();
let introDone = false;
let playerOpen = false;

/* ── Start (from the intro splash) ───────────────────────────────────── */

/**
 * "Toca para empezar" doesn't try to autoplay: it opens the playlist panel so
 * the visitor presses play themselves (the only reliable gesture on iOS, and
 * a choice of song everywhere). The panel tucks itself away once music plays.
 */
export function startMusic() {
  openPlayer('needs-tap');
}

/* ── Player panel ─────────────────────────────────────────────────────── */

export type OpenReason = 'user' | 'needs-tap';

export function openPlayer(reason: OpenReason = 'user') {
  bus.dispatchEvent(new CustomEvent<OpenReason>('open', { detail: reason }));
}

export function onOpenPlayer(cb: (reason: OpenReason) => void) {
  const handler = (e: Event) => cb((e as CustomEvent<OpenReason>).detail);
  bus.addEventListener('open', handler);
  return () => bus.removeEventListener('open', handler);
}

/** MusicPlayer reports whether its panel is open; the wrap pauses its story meanwhile. */
export function setPlayerOpen(open: boolean) {
  if (open === playerOpen) return;
  playerOpen = open;
  bus.dispatchEvent(new Event('player'));
}

/** Calls `cb` with the panel's open state now and on every change. */
export function onPlayerOpenChange(cb: (open: boolean) => void) {
  const handler = () => cb(playerOpen);
  handler();
  bus.addEventListener('player', handler);
  return () => bus.removeEventListener('player', handler);
}

/* ── Intro gate (IntroSplash → WrapSection) ─────────────────────────────────── */

// The splash shows on every full page load (the tap is what lets music start).
// This flag lives as long as the page does, so client-side navigation back to
// the wrap skips it; `intro-seen` on <html> hides the splash's server HTML.
export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  document.documentElement.classList.add('intro-seen');
  bus.dispatchEvent(new Event('intro'));
}

export const isIntroDone = () => introDone;

/** Runs `cb` once the intro splash is gone (immediately if it already is). */
export function whenIntroDone(cb: () => void) {
  if (introDone) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  bus.addEventListener('intro', handler, { once: true });
  return () => bus.removeEventListener('intro', handler);
}
