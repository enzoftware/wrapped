'use client';
import { useEffect, useRef, useState } from 'react';
import { animate, createDrawable, createTimeline, splitText, stagger, utils } from 'animejs';
import { useAnime, prefersReducedMotion } from '../../lib/anim';
import { isIntroDone, markIntroDone, startMusic } from '../../lib/music';
import { PLAYLIST } from '../../lib/spotify';
import Bokeh from '../Bokeh';
import FloatingHearts from '../FloatingHearts';

const HEART_PATH = 'M50 86 C22 66 6 50 6 32 C6 18 17 8 30 8 C39 8 46 13 50 21 C54 13 61 8 70 8 C83 8 94 18 94 32 C94 50 78 66 50 86 Z';

/**
 * The front door, shown on every full page load: browsers only allow audio
 * after a user gesture, so the opening tap doubles as "start the music". On
 * exit the title lifts away, the record flies into the floating vinyl player
 * and the backdrop dissolves onto the first story of the wrap.
 */
export default function IntroSplash() {
  const [visible, setVisible] = useState(true);
  const leaving = useRef(false);

  // Back from /stats via client-side navigation: the music is already sorted,
  // and `intro-seen` hid our server HTML before paint.
  useEffect(() => {
    if (isIntroDone()) { setVisible(false); return; }
    document.documentElement.classList.add('intro-open');
    return () => document.documentElement.classList.remove('intro-open');
  }, []);

  const root = useAnime<HTMLDivElement>((el) => {
    const title = el.querySelector<HTMLElement>('.is-title')!;
    const split = splitText(title, { words: true, chars: true });
    const [heart] = createDrawable(el.querySelector('.is-heart path')!);

    utils.set(split.chars, { opacity: 0, y: 40, rotateX: -80 });
    utils.set(split.words, { whiteSpace: 'nowrap' });
    utils.set(title, { opacity: 1 });
    utils.set('.is-in', { opacity: 0, y: 16 });
    utils.set('.is-record', { opacity: 0, scale: 0.6, rotate: -90 });

    createTimeline({ defaults: { ease: 'outExpo' } })
      .add(heart, { draw: ['0 0', '0 1'], duration: 1400, ease: 'inOutSine' }, 0)
      .add('.is-heart path', { fillOpacity: [0, 0.12], duration: 500 }, 1100)
      .add('.is-eyebrow', { opacity: 1, y: 0, duration: 700 }, 150)
      .add(split.chars, { opacity: 1, y: 0, rotateX: 0, duration: 900, delay: stagger(45) }, 350)
      .add('.is-record', { opacity: 1, scale: 1, rotate: 0, duration: 1200 }, 800)
      .add('.is-in:not(.is-eyebrow)', { opacity: 1, y: 0, duration: 800, delay: stagger(110) }, 1000);

    // Idle life: the heart beats, the record spins, sound ripples off it, the CTA breathes.
    animate('.is-heart', { scale: [1, 1.05, 1, 1.03, 1], duration: 1400, loop: true, loopDelay: 700, delay: 2000, ease: 'inOutSine' });
    animate('.is-spin', { rotate: [0, 360], duration: 9000, ease: 'linear', loop: true });
    animate('.is-wave', { scale: [1, 1.9], opacity: [0.45, 0], duration: 2600, delay: stagger(870, { start: 1400 }), loop: true, ease: 'outSine' });
    animate('.is-cta', { scale: [1, 1.04], duration: 1100, loop: true, alternate: true, ease: 'inOutSine', delay: 2200 });

    return () => split.revert();
  });

  const dismiss = (withMusic: boolean) => {
    if (leaving.current) return;
    leaving.current = true;
    // Call play synchronously inside the gesture — before any await or animation.
    if (withMusic) void startMusic();

    const el = root.current;
    const finish = () => {
      document.documentElement.classList.remove('intro-open');
      setVisible(false);
    };
    if (!el || prefersReducedMotion()) { markIntroDone(); finish(); return; }
    el.classList.add('is-leaving');

    // Fly the record into the corner player.
    const record = el.querySelector<HTMLElement>('.is-record')!;
    const target = document.querySelector<HTMLElement>('[data-vinyl]');
    const from = record.getBoundingClientRect();
    const to = target?.getBoundingClientRect();
    const dx = to ? to.left + to.width / 2 - (from.left + from.width / 2) : 0;
    const dy = to ? to.top + to.height / 2 - (from.top + from.height / 2) : 200;
    const scale = to ? to.width / from.width : 0.2;

    createTimeline({ defaults: { ease: 'inOutQuart' } })
      .add('.is-in, .is-wave', { opacity: 0, y: -12, duration: 350, ease: 'outQuad' }, 0)
      .add('.is-title', { opacity: 0, y: -40, scale: 0.94, duration: 600, ease: 'inQuart' }, 0)
      .add('.is-heart', { opacity: 0, scale: 1.25, duration: 700, ease: 'inQuad' }, 0)
      .add('.is-decor', { opacity: 0, duration: 600, ease: 'outQuad' }, 0)
      .add(record, { x: dx, y: dy, scale, duration: 900 }, 150)
      .add(record, { opacity: 0, duration: 200 }, 900)
      // The wrap starts as the backdrop begins to clear, so its first story plays in view.
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
      className="intro-splash fixed inset-0 z-[60] grid place-items-center px-6 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Bienvenida"
      onClick={() => dismiss(true)}
    >
      <div
        className="is-backdrop absolute inset-0"
        style={{ background: 'rgba(253,246,240,0.82)', backdropFilter: 'blur(18px) saturate(1.2)', WebkitBackdropFilter: 'blur(18px) saturate(1.2)' }}
      />
      <div className="is-decor absolute inset-0 pointer-events-none" aria-hidden>
        <Bokeh colors={['#f5c0cc', '#f0b0d8', '#d0b8f0']} />
        <FloatingHearts color="#d4687a" n={12} />
      </div>

      <div className="relative flex flex-col items-center text-center w-full max-w-[380px]">
        {/* heart outline drawn behind the title */}
        <svg
          className="is-heart absolute pointer-events-none"
          viewBox="0 0 100 94"
          style={{ width: 'min(96vw, 440px)', top: -24, left: '50%', marginLeft: 'calc(min(96vw, 440px) / -2)' }}
          aria-hidden
        >
          <path d={HEART_PATH} fill="#d4687a" fillOpacity={0} stroke="#d4687a" strokeOpacity={0.35} strokeWidth={0.8} strokeLinecap="round" />
        </svg>

        <div className="is-in is-eyebrow pre-anim relative flex items-center gap-2.5 mb-5" style={{ color: 'var(--accent)' }}>
          <span>♥</span>
          <span className="font-mono-custom text-xs tracking-[0.32em] uppercase">Enzo &amp; Katy</span>
          <span>♥</span>
        </div>

        <h1
          className="is-title pre-anim relative font-display italic font-black leading-[0.95] m-0"
          style={{
            fontSize: 'clamp(50px, 15vw, 84px)',
            perspective: 600,
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
            textShadow: '0 4px 40px rgba(212,104,122,0.18)',
          }}
        >
          WhatsApp<br />
          <span style={{ color: 'var(--accent)' }}>Wrap</span>
        </h1>

        <div className="is-in pre-anim relative mt-4 flex items-center gap-4 font-mono-custom text-[13px] tracking-[0.12em]" style={{ color: 'var(--sub)' }}>
          <span style={{ width: 22, height: 1, background: 'var(--faint)', display: 'inline-block' }} />
          2020 — 2026
          <span style={{ width: 22, height: 1, background: 'var(--faint)', display: 'inline-block' }} />
        </div>

        {/* the record */}
        <div className="is-record pre-anim relative grid place-items-center mt-8" style={{ width: 'min(42vw, 168px)', aspectRatio: '1' }}>
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
            <img src={PLAYLIST.cover} alt="" width={76} height={76} className="rounded-full w-[46%] h-auto" style={{ boxShadow: '0 0 0 4px #2d1a1f' }} />
            <span className="absolute w-2.5 h-2.5 rounded-full" style={{ background: 'var(--bg)' }} />
            {/* sheen */}
            <span className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'conic-gradient(from 30deg, transparent 0 20%, rgba(255,255,255,0.10) 25%, transparent 32% 70%, rgba(255,255,255,0.08) 75%, transparent 82%)' }} />
          </div>
        </div>

        <p className="is-in pre-anim mt-6 mb-0 text-sm leading-relaxed max-w-[280px]" style={{ color: 'var(--sub)' }}>
          🎧 Sube el volumen. Seis años de historia con banda sonora: <b style={{ color: 'var(--ink)' }}>{PLAYLIST.title}</b>.
        </p>

        <button
          onClick={(e) => { e.stopPropagation(); dismiss(true); }}
          className="is-in is-cta pre-anim mt-7 inline-flex items-center gap-2.5 font-bold text-base px-8 py-4 rounded-full border-0 cursor-pointer"
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
