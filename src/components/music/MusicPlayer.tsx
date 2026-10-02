'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useDragControls } from 'motion/react';
import { animate, stagger, utils, type JSAnimation } from 'animejs';
import { EASE, useAnime } from '../../lib/anim';
import {
  fetchTrackInfo, isAudible, isPreviewClip, isWebKitRestricted, loadSpotifyIframeApi, PLAYLIST, SPOTIFY_LOGIN_URL,
  type SpotifyEmbedController, type SpotifyPlaybackState, type TrackInfo,
} from '../../lib/spotify';
import { onOpenPlayer, setPlayerOpen, whenIntroDone } from '../../lib/music';

type Status = 'loading' | 'ready' | 'error';

const RING_R = 29;
const RING_C = 2 * Math.PI * RING_R;
const EMBED_HEIGHT = 352; // tall enough for Spotify to show the track list

/**
 * Floating vinyl button + playlist panel. The Spotify embed stays mounted while
 * the panel is closed, so the music keeps playing through the whole wrap.
 */
export default function MusicPlayer() {
  const [status, setStatus] = useState<Status>('loading');
  const [open, setOpen] = useState(false);
  const [playback, setPlayback] = useState<SpotifyPlaybackState | null>(null);
  const [hint, setHint] = useState(false);
  const [needsTap, setNeedsTap] = useState(false);
  const [restricted, setRestricted] = useState(false);
  const [track, setTrack] = useState<TrackInfo | null>(null);
  // Sound really coming out. Not just `!isPaused`: after a refused play() on
  // iOS the embed can stay on its optimistic "playing" state in silence.
  const [audible, setAudible] = useState(false);
  const needsTapRef = useRef(false);
  needsTapRef.current = needsTap;
  const awaitingLogin = useRef(false);
  const controller = useRef<SpotifyEmbedController | null>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const touched = useRef(false);
  const drag = useDragControls();

  const playing = audible;
  const playingRef = useRef(false);
  playingRef.current = playing;
  const preview = !!playback && isPreviewClip(playback.duration);
  const progress = playback && playback.duration > 0 ? playback.position / playback.duration : 0;

  // ── Spotify embed ──────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    const container = embedRef.current;
    if (!container) return;
    // Hand Spotify a node React doesn't manage — it gets replaced by the iframe.
    const host = document.createElement('div');
    container.appendChild(host);

    loadSpotifyIframeApi()
      .then((api) => {
        if (cancelled) return;
        api.createController(host, { uri: PLAYLIST.uri, width: '100%', height: EMBED_HEIGHT }, (c) => {
          if (cancelled) { c.destroy(); return; }
          controller.current = c;
          c.addListener('ready', () => setStatus('ready'));
          c.addListener('playback_update', (e) => {
            setPlayback(e.data);
            setAudible((was) => !e.data.isPaused && (was || isAudible(e.data)));
            if (isAudible(e.data) && needsTapRef.current) {
              // The music really started (not just the embed's optimistic "playing"
              // before iOS refuses it) — tuck the panel away and let the wrap continue.
              setNeedsTap(false);
              window.setTimeout(() => setOpen(false), 1400);
            }
          });
        });
      })
      .catch(() => { if (!cancelled) setStatus('error'); });

    return () => {
      cancelled = true;
      controller.current?.destroy();
      controller.current = null;
      container.replaceChildren();
    };
  }, []);

  useEffect(() => setRestricted(isWebKitRestricted()), []);

  // Show what's playing: the embed reports the track URI, oEmbed gives title + art.
  const playingURI = playback?.playingURI;
  useEffect(() => {
    if (!playingURI) return;
    let stale = false;
    fetchTrackInfo(playingURI).then((info) => { if (!stale && info) setTrack(info); });
    return () => { stale = true; };
  }, [playingURI]);

  // After logging in on accounts.spotify.com (new tab), reload the embed so it
  // picks up the session and plays full tracks.
  useEffect(() => {
    const onFocus = () => {
      if (!awaitingLogin.current) return;
      awaitingLogin.current = false;
      controller.current?.loadUri(PLAYLIST.uri);
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const toggleOpen = useCallback(() => {
    touched.current = true;
    setHint(false);
    setOpen((o) => !o);
  }, []);

  // Other islands (the intro splash) can open the panel, e.g. when the browser
  // refused to start audio and the visitor needs to press Spotify's play button.
  useEffect(() => onOpenPlayer((reason) => {
    setHint(false);
    setOpen(true);
    if (reason === 'needs-tap') setNeedsTap(true);
  }), []);

  // A one-time nudge so people discover there's music, once the intro is gone.
  useEffect(() => {
    let show = 0;
    let hide = 0;
    const stop = whenIntroDone(() => {
      show = window.setTimeout(() => { if (!touched.current && !playingRef.current) setHint(true); }, 4000);
      hide = window.setTimeout(() => setHint(false), 11000);
    });
    return () => { stop(); window.clearTimeout(show); window.clearTimeout(hide); };
  }, []);

  useEffect(() => setPlayerOpen(open), [open]);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  // ── anime.js: spinning record + equalizer, driven by playback state ────
  const loops = useRef<JSAnimation[]>([]);
  const vinylRef = useAnime<HTMLDivElement>(() => {
    loops.current = [
      animate('.mp-disc', { rotate: [0, 360], duration: 5200, ease: 'linear', loop: true, autoplay: false }),
      animate('.mp-eq span', {
        scaleY: () => [0.25, utils.random(0.6, 1, 2)],
        duration: () => utils.random(280, 480),
        delay: stagger(90),
        loop: true, alternate: true, ease: 'inOutSine', autoplay: false,
      }),
    ];
  });

  useEffect(() => {
    loops.current.forEach((a) => (playing ? a.play() : a.pause()));
  }, [playing]);

  const statusLine =
    status === 'error' ? 'No se pudo cargar Spotify' :
    status === 'loading' ? 'Cargando playlist…' :
    needsTap ? 'Toca ▶ en Spotify para empezar' :
    track ? `${playing ? '♪' : '❚❚'} ${track.title}${preview ? ' · avance' : ''}` :
    playing ? (preview ? 'Sonando · avance de 30 s' : 'Sonando ahora') :
    playback ? 'En pausa' : 'Toca ▶ en Spotify o elige una canción';

  return (
    <>
      {/* mobile backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="md:hidden fixed inset-0 z-40"
            style={{ background: 'rgba(45,26,31,0.35)', backdropFilter: 'blur(2px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            aria-hidden
          />
        )}
      </AnimatePresence>

      {/* ── Panel: bottom sheet on mobile, floating card on desktop ── */}
      <motion.div
        role="dialog"
        aria-label="Playlist de Spotify"
        aria-hidden={!open}
        inert={!open}
        className="fixed z-50 left-0 right-0 bottom-0 md:left-auto md:right-6 md:bottom-28 md:w-[380px] rounded-t-[28px] md:rounded-[24px] px-4 pt-3 md:pt-4"
        style={{
          background: 'var(--bg-card)',
          boxShadow: '0 -8px 40px rgba(45,26,31,0.18), inset 0 0 0 1px var(--hair)',
          paddingBottom: 'max(16px, env(safe-area-inset-bottom))',
          pointerEvents: open ? 'auto' : 'none',
        }}
        initial={false}
        animate={open ? { y: 0, opacity: 1, scale: 1 } : { y: '105%', opacity: 0, scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 380, damping: 36 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        dragListener={false}
        dragControls={drag}
        dragSnapToOrigin
        onDragEnd={(_, info) => { if (info.offset.y > 90 || info.velocity.y > 500) setOpen(false); }}
      >
        {/* grab handle (mobile) — the only area that drags, so the embed scrolls normally */}
        <div
          className="md:hidden mx-auto mb-3 h-5 w-full flex justify-center items-start cursor-grab touch-none"
          onPointerDown={(e) => drag.start(e)}
          aria-hidden
        >
          <span className="block w-10 h-1.5 rounded-full" style={{ background: 'var(--hair)' }} />
        </div>

        <div className="flex items-center gap-3 mb-3">
          <img src={PLAYLIST.cover} alt="" width={48} height={48} className="rounded-xl shrink-0" style={{ boxShadow: '0 4px 14px rgba(45,26,31,0.15)' }} />
          <div className="flex-1 min-w-0">
            <div className="font-mono-custom text-[10px] tracking-[0.2em] uppercase" style={{ color: 'var(--accent)' }}>Nuestra playlist</div>
            <div className="font-display italic text-xl font-bold leading-tight truncate" style={{ color: 'var(--ink)' }}>{PLAYLIST.title}</div>
            <div className="text-xs truncate" style={{ color: 'var(--sub)' }}>{statusLine}</div>
          </div>
          <button
            ref={closeRef}
            onClick={() => setOpen(false)}
            aria-label="Cerrar playlist"
            className="grid place-items-center w-9 h-9 rounded-full border-0 cursor-pointer text-lg"
            style={{ background: 'rgba(45,26,31,0.06)', color: 'var(--ink)' }}
          >
            ×
          </button>
        </div>

        {/* Spotify embed: its own track list lets people switch songs */}
        <div
          className="relative rounded-xl overflow-hidden"
          style={{
            height: EMBED_HEIGHT, background: 'rgba(45,26,31,0.05)',
            outline: needsTap ? '3px solid var(--accent)' : 'none', outlineOffset: 3,
            animation: needsTap ? 'ekGlow 1.6s ease-out infinite' : 'none',
          }}
        >
          <div ref={embedRef} className="absolute inset-0" />
          {status !== 'ready' && (
            <div className="absolute inset-0 grid place-items-center text-sm text-center px-6" style={{ color: 'var(--sub)' }}>
              {status === 'error'
                ? <a href={PLAYLIST.url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)' }}>Abrir la playlist en Spotify ↗</a>
                : 'Cargando canciones…'}
            </div>
          )}
        </div>

        <FullTracksNote
          preview={preview}
          restricted={restricted}
          onLogin={() => { awaitingLogin.current = true; }}
        />
      </motion.div>

      {/* ── Floating vinyl ── */}
      <div
        ref={vinylRef}
        className={`fixed z-50 right-4 md:right-6 ${open ? 'max-md:hidden' : ''}`}
        style={{ bottom: 'max(16px, calc(env(safe-area-inset-bottom) + 8px))' }}
      >
        <AnimatePresence>
          {hint && !open && (
            <motion.button
              onClick={toggleOpen}
              className="absolute right-full top-1/2 mr-3 whitespace-nowrap px-3.5 py-2 text-[13px] font-medium border-0 cursor-pointer"
              style={{ borderRadius: '16px 16px 4px 16px', background: 'var(--ink)', color: '#fff', translateY: '-50%', boxShadow: '0 6px 20px rgba(45,26,31,0.2)' }}
              initial={{ opacity: 0, x: 12, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.9 }}
              transition={{ duration: 0.35, ease: EASE }}
            >
              ♪ Ponle música
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleOpen}
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.92 }}
          aria-label={open ? 'Cerrar playlist' : 'Abrir playlist'}
          title={track ? track.title : PLAYLIST.title}
          aria-expanded={open}
          className="relative grid place-items-center w-[66px] h-[66px] rounded-full border-0 p-0 cursor-pointer"
          style={{ background: 'var(--bg-card)', boxShadow: '0 8px 28px rgba(45,26,31,0.22)' }}
        >
          {/* progress ring */}
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 66 66" aria-hidden>
            <circle cx="33" cy="33" r={RING_R} fill="none" stroke="var(--hair)" strokeWidth="3" />
            <circle
              cx="33" cy="33" r={RING_R} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 0.6s linear' }}
            />
          </svg>

          {/* the record: cover art in the middle of grooved vinyl */}
          <div
            data-vinyl className="mp-disc relative grid place-items-center w-[52px] h-[52px] rounded-full"
            style={{ background: 'repeating-radial-gradient(circle, #2d1a1f 0 2px, #3b242a 2px 4px)' }}
          >
            <img src={track?.cover ?? PLAYLIST.cover} alt="" width={26} height={26} className="rounded-full object-cover" style={{ boxShadow: '0 0 0 2px #2d1a1f' }} />
            <span className="absolute w-1.5 h-1.5 rounded-full" style={{ background: 'var(--bg-card)' }} />
          </div>

          {/* equalizer badge */}
          <motion.span
            className="mp-eq absolute -top-1 -right-1 flex items-end gap-[2px] h-5 px-1.5 py-1 rounded-full"
            style={{ background: 'var(--accent)' }}
            animate={{ scale: playing ? 1 : 0, opacity: playing ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 28 }}
            aria-hidden
          >
            {[0, 1, 2].map((i) => (
              <span key={i} className="block w-[3px] h-full rounded-full origin-bottom" style={{ background: '#fff' }} />
            ))}
          </motion.span>
        </motion.button>
      </div>
    </>
  );
}

/**
 * The embed only plays full songs when it can see a Spotify login, which needs
 * third-party cookies. Chrome/Firefox desktop: log in and we reload the embed.
 * Safari and every iOS browser block those cookies, so the app is the way.
 */
function FullTracksNote({ preview, restricted, onLogin }: { preview: boolean; restricted: boolean; onLogin: () => void }) {
  const link = 'shrink-0 no-underline font-semibold';
  if (!preview) {
    return (
      <div className="flex justify-between items-center gap-3 mt-2.5 text-[11px]" style={{ color: 'var(--faint)' }}>
        <span>{restricted ? 'En iPhone y Safari, Spotify solo permite avances de 30 s aquí.' : '¿Solo avances de 30 s? Inicia sesión en Spotify en este navegador.'}</span>
        <a href={PLAYLIST.url} target="_blank" rel="noreferrer" className={link} style={{ color: 'var(--accent)' }}>Abrir ↗</a>
      </div>
    );
  }
  return (
    <div className="mt-3 rounded-xl px-3.5 py-3 text-[12px] leading-snug" style={{ background: 'rgba(212,104,122,0.10)', color: 'var(--ink)' }}>
      <div className="font-semibold mb-0.5">Estás escuchando avances de 30 s</div>
      <div style={{ color: 'var(--sub)' }}>
        {restricted
          ? 'Tu navegador no deja que Spotify reconozca tu sesión aquí. Ábrela en la app para escucharla completa.'
          : 'Inicia sesión en Spotify y vuelve a esta pestaña: las canciones sonarán completas.'}
      </div>
      <div className="flex gap-2 mt-2.5">
        {!restricted && (
          <a href={SPOTIFY_LOGIN_URL} target="_blank" rel="noreferrer" onClick={onLogin}
            className={`${link} px-3 py-1.5 rounded-full text-white`} style={{ background: 'var(--accent)' }}>
            Iniciar sesión ↗
          </a>
        )}
        <a href={PLAYLIST.url} target="_blank" rel="noreferrer"
          className={`${link} px-3 py-1.5 rounded-full`}
          style={restricted ? { background: '#1DB954', color: '#fff' } : { color: 'var(--accent)', boxShadow: 'inset 0 0 0 1px currentColor' }}>
          Abrir en Spotify ↗
        </a>
      </div>
    </div>
  );
}
