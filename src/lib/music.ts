// Shared music state across Astro islands (Hero, IntroSplash, MusicPlayer are
// separate React roots, but share this module instance on the page).
import { isWebKitRestricted, type SpotifyEmbedController, type SpotifyPlaybackState } from './spotify';

type StartResult = 'playing' | 'needs-tap';

const bus = new EventTarget();
let controller: SpotifyEmbedController | null = null;
let playback: SpotifyPlaybackState | null = null;
let introDone = false;

export const INTRO_KEY = 'ek-intro-seen';

/* ── Controller + playback (fed by MusicPlayer) ───────────────────────── */

export function registerController(c: SpotifyEmbedController | null) {
  controller = c;
  if (c) bus.dispatchEvent(new Event('ready'));
}

export function reportPlayback(state: SpotifyPlaybackState) {
  playback = state;
  bus.dispatchEvent(new Event('playback'));
}

const isPlaying = () => !!playback && !playback.isPaused;

function once(event: string, timeoutMs: number, done: () => boolean = () => true) {
  return new Promise<boolean>((resolve) => {
    if (done()) return resolve(true);
    const onEvent = () => { if (done()) finish(true); };
    const timer = window.setTimeout(() => finish(false), timeoutMs);
    function finish(ok: boolean) {
      window.clearTimeout(timer);
      bus.removeEventListener(event, onEvent);
      resolve(ok);
    }
    bus.addEventListener(event, onEvent);
  });
}

/**
 * Starts the playlist from a user gesture. Browsers (Safari especially) may
 * still refuse to start audio in the cross-origin embed; if nothing is playing
 * shortly after, we open the player panel so the visitor can press Spotify's
 * own play button, which always counts as a direct gesture.
 */
export async function startMusic(): Promise<StartResult> {
  // WebKit almost always refuses: try anyway, but show the player right away
  // instead of making the visitor wait for the fallback.
  const restricted = isWebKitRestricted();
  if (!controller) await once('ready', 8000, () => !!controller);
  controller?.play();
  if (restricted) {
    openPlayer('needs-tap');
    return 'needs-tap';
  }
  const ok = await once('playback', 2000, isPlaying);
  if (!ok) openPlayer('needs-tap');
  return ok ? 'playing' : 'needs-tap';
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

/* ── Intro gate (IntroSplash → Hero) ──────────────────────────────────── */

export function markIntroDone() {
  if (introDone) return;
  introDone = true;
  bus.dispatchEvent(new Event('intro'));
}

/** Runs `cb` once the intro splash is gone (immediately if it never showed). */
export function whenIntroDone(cb: () => void) {
  if (introDone || document.documentElement.classList.contains('intro-seen')) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  bus.addEventListener('intro', handler, { once: true });
  return () => bus.removeEventListener('intro', handler);
}
