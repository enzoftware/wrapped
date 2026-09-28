'use client';
import { useEffect, useRef, useState } from 'react';
import { animate, createTimeline, stagger, utils } from 'animejs';
import { useAnime, prefersReducedMotion } from '../../lib/anim';
import { INTRO_KEY, markIntroDone, startMusic } from '../../lib/music';
import { PLAYLIST } from '../../lib/spotify';

/**
 * First-visit gate: browsers only allow audio after a user gesture, so the
 * opening tap doubles as "start the music". On exit the big record flies into
 * the floating vinyl player in the corner, and the hero intro begins.
 */
export default function IntroSplash() {
  const [visible, setVisible] = useState(true);
  const leaving = useRef(false);

  // Already seen in this session → the inline script hid us before paint.
  useEffect(() => {
    if (document.documentElement.classList.contains('intro-seen')) {
      setVisible(false);
      markIntroDone();
      return;
    }
    document.documentElement.classList.add('intro-open');
    return () => document.documentElement.classList.remove('intro-open');
  }, []);

  const root = useAnime<HTMLDivElement>(() => {
    utils.set('.is-in', { opacity: 0, y: 16 });
    utils.set('.is-record', { opacity: 0, scale: 0.6, rotate: -90 });
    createTimeline({ defaults: { ease: 'outExpo' } })
      .add('.is-record', { opacity: 1, scale: 1, rotate: 0, duration: 1200 }, 100)
      .add('.is-in', { opacity: 1, y: 0, duration: 800, delay: stagger(120) }, 400);

    // Slow spin, sound waves rippling off the record, a breathing call to action.
    animate('.is-spin', { rotate: [0, 360], duration: 9000, ease: 'linear', loop: true });
    animate('.is-wave', { scale: [1, 1.9], opacity: [0.45, 0], duration: 2600, delay: stagger(870), loop: true, ease: 'outSine' });
    animate('.is-cta', { scale: [1, 1.04], duration: 1100, loop: true, alternate: true, ease: 'inOutSine', delay: 1400 });
  });

  const dismiss = (withMusic: boolean) => {
    if (leaving.current) return;
    leaving.current = true;
    try { sessionStorage.setItem(INTRO_KEY, withMusic ? 'music' : 'silent'); } catch { /* private mode */ }
    // Call play synchronously inside the gesture — before any await or animation.
    if (withMusic) void startMusic();

    const el = root.current;
    const finish = () => {
      document.documentElement.classList.remove('intro-open');
      setVisible(false);
    };
    if (!el || prefersReducedMotion()) { markIntroDone(); finish(); return; }

    // Fly the record into the corner player.
    const record = el.querySelector<HTMLElement>('.is-record')!;
    const target = document.querySelector<HTMLElement>('[data-vinyl]');
    const from = record.getBoundingClientRect();
    const to = target?.getBoundingClientRect();
    const dx = to ? to.left + to.width / 2 - (from.left + from.width / 2) : 0;
    const dy = to ? to.top + to.height / 2 - (from.top + from.height / 2) : 200;
    const scale = to ? to.width / from.width : 0.2;

    createTimeline({ defaults: { ease: 'inOutQuart' } })
      .add('.is-in, .is-wave', { opacity: 0, y: -10, duration: 350, ease: 'outQuad' }, 0)
      .add(record, { x: dx, y: dy, scale, duration: 900 }, 150)
      .add(record, { opacity: 0, duration: 200 }, 900)
      .add('.is-backdrop', { opacity: 0, duration: 700, ease: 'outQuad', onBegin: markIntroDone }, 450)
      .then(finish);
  };

  // Keyboard: Enter starts with music (focused buttons handle their own), Escape enters silently.
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss(false);
      if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); dismiss(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!visible) return null;

  return (
    <div
      ref={root}
      className="intro-splash fixed inset-0 z-[60] grid place-items-center px-6"
      role="dialog"
      aria-modal="true"
      aria-label="Bienvenida"
      onClick={() => dismiss(true)}
    >
      <div
        className="is-backdrop absolute inset-0"
        style={{ background: 'rgba(253,246,240,0.55)', backdropFilter: 'blur(18px) saturate(1.2)', WebkitBackdropFilter: 'blur(18px) saturate(1.2)' }}
      />

      <div className="relative flex flex-col items-center text-center max-w-[340px]">
        <div className="is-in pre-anim flex items-center gap-2.5 mb-8" style={{ color: 'var(--accent)' }}>
          <span>♥</span>
          <span className="font-mono-custom text-xs tracking-[0.32em] uppercase">Enzo &amp; Katy</span>
          <span>♥</span>
        </div>

        {/* the record */}
        <div className="is-record pre-anim relative grid place-items-center" style={{ width: 200, height: 200 }}>
          {[0, 1, 2].map((i) => (
            <span key={i} className="is-wave absolute inset-0 rounded-full" style={{ border: '2px solid var(--accent)', opacity: 0 }} aria-hidden />
          ))}
          <div
            className="is-spin relative grid place-items-center w-full h-full rounded-full"
            style={{
              background: 'repeating-radial-gradient(circle, #2d1a1f 0 2px, #3b242a 2px 4px)',
              boxShadow: '0 20px 60px rgba(45,26,31,0.35), inset 0 0 0 6px #241418',
            }}
          >
            <img src={PLAYLIST.cover} alt="" width={92} height={92} className="rounded-full" style={{ boxShadow: '0 0 0 4px #2d1a1f' }} />
            <span className="absolute w-3 h-3 rounded-full" style={{ background: 'var(--bg)' }} />
            {/* sheen */}
            <span className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'conic-gradient(from 30deg, transparent 0 20%, rgba(255,255,255,0.10) 25%, transparent 32% 70%, rgba(255,255,255,0.08) 75%, transparent 82%)' }} />
          </div>
        </div>

        <h1 className="is-in pre-anim font-display italic font-black mt-9 mb-0 leading-none text-[40px]" style={{ color: 'var(--ink)' }}>
          {PLAYLIST.title}
        </h1>
        <p className="is-in pre-anim mt-3 text-sm leading-relaxed" style={{ color: 'var(--sub)' }}>
          🎧 Sube el volumen. Su historia viene con banda sonora.
        </p>

        <button
          onClick={(e) => { e.stopPropagation(); dismiss(true); }}
          className="is-in is-cta pre-anim mt-8 inline-flex items-center gap-2.5 font-bold text-base px-8 py-4 rounded-full border-0 cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #e07888, #d4687a)', color: '#fff', boxShadow: '0 10px 32px rgba(212,104,122,0.4)' }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden><path d="M4 2.5v11a1 1 0 0 0 1.5.86l9-5.5a1 1 0 0 0 0-1.72l-9-5.5A1 1 0 0 0 4 2.5z" /></svg>
          Toca para empezar
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); dismiss(false); }}
          className="is-in pre-anim mt-4 text-xs underline underline-offset-4 border-0 bg-transparent cursor-pointer"
          style={{ color: 'var(--sub)' }}
        >
          Entrar sin música
        </button>
      </div>
    </div>
  );
}
