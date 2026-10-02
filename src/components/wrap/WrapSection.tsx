'use client';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import type { YearStats } from '../../lib/types';
import { EASE } from '../../lib/anim';
import { whenIntroDone } from '../../lib/music';
import YearWrap from './YearWrap';
import YearAmbient from './YearAmbient';
import { getSlides } from './themes';

interface WrapSectionProps {
  years: YearStats[];
}

interface Position {
  yearIdx: number;
  slideIdx: number;
  dir: number;
}

// Survives client-side navigation, so coming back from /stats resumes where they left off.
const START: Position = { yearIdx: 0, slideIdx: 0, dir: 1 };
let lastPos = START;

/**
 * The whole screen is the story. On mobile the story is full-bleed; on wider
 * screens it sits in a phone-shaped card over a full-screen stage that takes
 * on the current year's colors, weather and number.
 */
export default function WrapSection({ years }: WrapSectionProps) {
  // Render the server's starting point first (so hydration matches), then jump
  // to the saved spot before paint. Slides only mount once `started`, below.
  const [pos, setPos] = useState<Position>(START);
  const [paused, setPaused] = useState(false);
  const [started, setStarted] = useState(false);
  const slidesFor = useCallback((i: number) => getSlides(years[i], i === years.length - 1), [years]);

  useLayoutEffect(() => { if (lastPos !== START) setPos(lastPos); }, []);
  useEffect(() => { lastPos = pos; }, [pos]);
  // Hold the first story until the intro splash clears, so it plays in view.
  useEffect(() => whenIntroDone(() => setStarted(true)), []);

  const current = years[pos.yearIdx];
  const slides = slidesFor(pos.yearIdx);

  // Stories flow straight into the next year, like moving to the next person's story.
  const next = useCallback(() => setPos((p) => {
    if (p.slideIdx < slidesFor(p.yearIdx).length - 1) return { ...p, slideIdx: p.slideIdx + 1, dir: 1 };
    if (p.yearIdx < years.length - 1) return { yearIdx: p.yearIdx + 1, slideIdx: 0, dir: 1 };
    return p;
  }), [slidesFor, years.length]);

  const prev = useCallback(() => setPos((p) => {
    if (p.slideIdx > 0) return { ...p, slideIdx: p.slideIdx - 1, dir: -1 };
    if (p.yearIdx > 0) return { yearIdx: p.yearIdx - 1, slideIdx: slidesFor(p.yearIdx - 1).length - 1, dir: -1 };
    return p;
  }), [slidesFor]);

  const goTo = useCallback((slideIdx: number) => setPos((p) => ({ ...p, slideIdx, dir: slideIdx >= p.slideIdx ? 1 : -1 })), []);
  const selectYear = useCallback((yearIdx: number) => setPos((p) => ({ yearIdx, slideIdx: 0, dir: yearIdx >= p.yearIdx ? 1 : -1 })), []);
  const togglePause = useCallback(() => setPaused((v) => !v), []);

  const stageBg = `linear-gradient(160deg, ${current.grad[0]} 0%, ${current.grad[1]} 100%)`;

  return (
    <section id="wrap" className="wrap-stage fixed inset-0 overflow-hidden" style={{ background: 'var(--bg)' }}>
      {/* ── Desktop stage: the year's colors, weather and a giant watermark ── */}
      <motion.div
        className="hidden md:block absolute inset-0"
        initial={false}
        animate={{ background: stageBg }}
        transition={{ duration: 0.8, ease: EASE }}
        style={{ background: stageBg }}
        aria-hidden
      >
        <AnimatePresence initial={false}>
          <motion.div
            key={current.year}
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <YearAmbient year={current} />
            <motion.div
              className="absolute inset-0 grid place-items-center font-display italic font-black leading-none select-none"
              style={{ fontSize: 'min(34vw, 60vh)', color: current.color, opacity: 0.09, letterSpacing: '-0.04em' }}
              initial={{ y: pos.dir > 0 ? 60 : -60 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
            >
              {current.year}
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(60% 70% at 50% 50%, transparent 40%, rgba(253,246,240,0.55) 100%)' }} />

        <div className="absolute top-7 left-8 flex items-center gap-2.5" style={{ color: 'var(--accent)' }}>
          <span>♥</span>
          <span className="font-mono-custom text-[11px] tracking-[0.3em] uppercase">Enzo &amp; Katy · WhatsApp Wrap</span>
        </div>
        <div className="absolute bottom-7 left-8 font-mono-custom text-[11px] tracking-[0.08em]" style={{ color: 'var(--sub)' }}>
          <kbd>←</kbd> <kbd>→</kbd> navegar · <kbd>espacio</kbd> pausar
        </div>
      </motion.div>

      {/* ── The story: full-bleed on mobile, a phone-shaped card on desktop ── */}
      <div className="relative h-full w-full md:grid md:place-items-center md:p-6">
        <div className="relative h-full w-full md:h-[min(880px,calc(100dvh-48px))] md:w-[clamp(380px,calc((100dvh-48px)*0.5),430px)]">
          <motion.div
            className="relative h-full w-full overflow-hidden md:rounded-[32px]"
            animate={{ boxShadow: `0 24px 80px ${current.color}40, 0 4px 16px rgba(45,26,31,0.10)` }}
            transition={{ duration: 0.8 }}
          >
            <YearWrap
              years={years}
              yearIndex={pos.yearIdx}
              slides={slides}
              slideIndex={pos.slideIdx}
              direction={pos.dir}
              paused={paused}
              started={started}
              onNext={next}
              onPrev={prev}
              onGoTo={goTo}
              onSelectYear={selectYear}
              onTogglePause={togglePause}
            />
          </motion.div>

          {/* Desktop: arrows beside the card */}
          {[
            { label: 'Anterior', onClick: prev, side: '-left-[72px]', glyph: '‹' },
            { label: 'Siguiente', onClick: next, side: '-right-[72px]', glyph: '›' },
          ].map((b) => (
            <motion.button
              key={b.label}
              onClick={b.onClick}
              aria-label={b.label}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              className={`hidden md:grid place-items-center absolute top-1/2 -translate-y-1/2 ${b.side} w-12 h-12 rounded-full border-0 cursor-pointer text-2xl`}
              style={{ background: 'rgba(255,248,245,0.85)', color: 'var(--ink)', boxShadow: 'inset 0 0 0 1px var(--hair), 0 4px 16px rgba(45,26,31,0.08)', backdropFilter: 'blur(8px)' }}
            >
              {b.glyph}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
