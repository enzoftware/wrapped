// Minimal typings + loader for the Spotify iFrame API.
// https://developer.spotify.com/documentation/embeds/references/iframe-api

export interface SpotifyPlaybackState {
  isPaused: boolean;
  isBuffering: boolean;
  duration: number; // ms
  position: number; // ms
  playingURI?: string; // e.g. spotify:track:… (sent by the embed, not in the typed docs)
}

export interface SpotifyEmbedController {
  loadUri(uri: string): void;
  play(): void;
  pause(): void;
  resume(): void;
  togglePlay(): void;
  seek(seconds: number): void;
  destroy(): void;
  addListener(event: 'ready', cb: () => void): void;
  addListener(event: 'playback_update', cb: (e: { data: SpotifyPlaybackState }) => void): void;
}

interface SpotifyIFrameAPI {
  createController(
    element: HTMLElement,
    options: { uri: string; width?: string | number; height?: string | number },
    callback: (controller: SpotifyEmbedController) => void,
  ): void;
}

declare global {
  interface Window {
    onSpotifyIframeApiReady?: (api: SpotifyIFrameAPI) => void;
  }
}

const SCRIPT_SRC = 'https://open.spotify.com/embed/iframe-api/v1';
let apiPromise: Promise<SpotifyIFrameAPI> | null = null;

/** Loads the iFrame API script once and resolves with the API object. */
export function loadSpotifyIframeApi(): Promise<SpotifyIFrameAPI> {
  if (apiPromise) return apiPromise;
  apiPromise = new Promise((resolve, reject) => {
    window.onSpotifyIframeApiReady = resolve;
    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onerror = () => { apiPromise = null; reject(new Error('Spotify iFrame API failed to load')); };
    document.body.appendChild(script);
  });
  return apiPromise;
}

export const PLAYLIST = {
  id: '0wBHRHTbcGBWvgrNX7aZgM',
  uri: 'spotify:playlist:0wBHRHTbcGBWvgrNX7aZgM',
  url: 'https://open.spotify.com/playlist/0wBHRHTbcGBWvgrNX7aZgM',
  title: 'Enzo&Kats',
  cover: 'https://i.scdn.co/image/ab67616d00001e022e7558daae7a80e1f5819aa1',
};

/**
 * WebKit browsers (all of iOS, plus desktop Safari) block third-party cookies
 * and don't let our tap reach the cross-origin embed, so the first play usually
 * has to happen inside the embed and logged-in users still only get previews.
 */
export function isWebKitRestricted() {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent;
  const iOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const desktopSafari = /^((?!chrome|chromium|crios|fxios|edg|android).)*safari/i.test(ua);
  return iOS || desktopSafari;
}

/** Logged-out (or cookie-blocked) embeds play clips of ≤30 s instead of full tracks. */
export const isPreviewClip = (durationMs: number) => durationMs > 0 && durationMs <= 31_000;

export interface TrackInfo { title: string; cover: string }
const trackCache = new Map<string, Promise<TrackInfo | null>>();

/** Song title + cover for a `spotify:track:` URI, via Spotify's public oEmbed (CORS-enabled). */
export function fetchTrackInfo(uri: string): Promise<TrackInfo | null> {
  const id = uri.startsWith('spotify:track:') ? uri.slice('spotify:track:'.length) : null;
  if (!id) return Promise.resolve(null);
  if (!trackCache.has(uri)) {
    const url = `https://open.spotify.com/oembed?url=${encodeURIComponent(`https://open.spotify.com/track/${id}`)}`;
    trackCache.set(uri, fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => (d ? { title: d.title as string, cover: d.thumbnail_url as string } : null))
      .catch(() => null));
  }
  return trackCache.get(uri)!;
}

export const SPOTIFY_LOGIN_URL = 'https://accounts.spotify.com/login';
