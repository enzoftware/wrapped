'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useMotionValue, type AnimationPlaybackControls, type MotionValue } from 'motion/react';
import type { YearStats } from '../../lib/types';
import { EASE } from '../../lib/anim';
import WrapSlide from './WrapSlide';
import YearAmbient from './YearAmbient';
import { SLIDE_LABELS, type SlideType } from './themes';

interface YearWrapProps {
  years: YearStats[];
  yearIndex: number;
  slides: SlideType[];
  slideIndex: number;
  direction: number;
  paused: boolean;
  /** False until the intro splash clears: the story waits, then plays from the top. */
  started: boolean;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (index: number) => void;
  onSelectYear: (index: number) => void;
  onTogglePause: () => void;
}

const SLIDE_SECONDS = 7;
const HOLD_MS = 180;
const SWIPE_PX = 48;
const SPRING = { type: 'spring', stiffness: 380, damping: 36 } as const;

// A shallow "cube" turn between slides, like flipping through stories.
const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '60%' : '-60%', rotateY: dir > 0 ? -28 : 28, opacity: 0 }),
  center: { x: 0, rotateY: 0, opacity: 1, transition: { duration: 0.55, ease: EASE } },
  exit: (dir: number) => ({ x: dir > 0 ? '-45%' : '45%', rotateY: dir > 0 ? 24 : -24, opacity: 0, transition: { duration: 0.4, ease: EASE } }),
};

function usePageVisible() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const onChange = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', onChange);
    return () => document.removeEventListener('visibilitychange', onChange);
  }, []);
  return visible;
}

export default function YearWrap({
  years, yearIndex, slides, slideIndex, direction, paused, started, onNext, onPrev, onGoTo, onSelectYear, onTogglePause,
}: YearWrapProps) {
  const year = years[yearIndex];
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.55 });
  const pageVisible = usePageVisible();
  const [held, setHeld] = useState(false);

  // ── Autoplay: a motion value drives the active progress bar ────────────
  const progress = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;
  const running = started && inView && pageVisible && !held && !paused;
  const slideKey = `${year.year}-${slideIndex}`;

  useEffect(() => {
    progress.set(0);
    const c = animate(progress, 1, {
      duration: SLIDE_SECONDS,
      ease: 'linear',
      onComplete: () => onNextRef.current(),
    });
    c.pause();
    controls.current = c;
    return () => c.stop();
  }, [slideKey, progress]);

  useEffect(() => {
    if (running) controls.current?.play();
    else controls.current?.pause();
  }, [running, slideKey]);

  // ── Keyboard, only while the story is on screen ─────────────────────────
  useEffect(() => {
    if (!inView || !started) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev(); }
      if (e.key === ' ' && document.activeElement === document.body) { e.preventDefault(); onTogglePause(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [inView, started, onNext, onPrev, onTogglePause]);

  // ── Gestures: tap sides, swipe, press-and-hold to pause ─────────────────
  const gesture = useRef<{ x: number; y: number; t: number; timer: number } | null>(null);

  const endGesture = () => {
    if (gesture.current) window.clearTimeout(gesture.current.timer);
    gesture.current = null;
    setHeld(false);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const timer = window.setTimeout(() => setHeld(true), HOLD_MS);
    gesture.current = { x: e.clientX, y: e.clientY, t: performance.now(), timer };
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const g = gesture.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    const dt = performance.now() - g.t;
    endGesture();

    if (Math.abs(dx) > SWIPE_PX && Math.abs(dx) > Math.abs(dy)) {
      dx < 0 ? onNext() : onPrev();
    } else if (dt < 300 && Math.abs(dx) < 10 && Math.abs(dy) < 10) {
      const rect = e.currentTarget.getBoundingClientRect();
      (e.clientX - rect.left) / rect.width < 0.3 ? onPrev() : onNext();
    }
  };

  const bg = `linear-gradient(165deg, ${year.grad[0]} 0%, ${year.grad[1]} 100%)`;

  return (
    <motion.div
      ref={rootRef}
      className="relative w-full h-full overflow-hidden select-none"
      initial={false}
      animate={{ background: bg }}
      transition={{ duration: 0.8, ease: EASE }}
      style={{ background: bg, borderRadius: 'inherit' }}
      role="region"
      aria-roledescription="historia"
      aria-label={`Wrap ${year.year} — ${SLIDE_LABELS[slides[slideIndex]]}, ${slideIndex + 1} de ${slides.length}`}
    >
      {/* per-year ambient layer, cross-fading between years */}
      <AnimatePresence initial={false}>
        <motion.div
          key={year.year}
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <YearAmbient year={year} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(110% 65% at 50% 25%, ${year.color}1c, transparent 60%)` }} />
        </motion.div>
      </AnimatePresence>

      {/* ── Chrome: year track + header, over the story ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-30 px-4"
        style={{ paddingTop: 'calc(env(safe-area-inset-top) + 12px)' }}
        animate={{ opacity: held ? 0.25 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <YearTrack
          years={years}
          yearIndex={yearIndex}
          slides={slides}
          slideIndex={slideIndex}
          progress={progress}
          onGoTo={onGoTo}
          onSelectYear={onSelectYear}
        />

        <div className="flex justify-between items-center gap-3 mt-3">
          <div className="flex items-center gap-2.5 min-w-0">
            {/* the year rolls like an odometer when the chapter changes */}
            <span className="relative block overflow-hidden h-[34px]" aria-live="polite">
              <AnimatePresence initial={false} mode="popLayout" custom={direction}>
                <motion.span
                  key={year.year}
                  custom={direction}
                  className="block font-display italic font-black leading-[34px] text-[32px]"
                  style={{ color: year.color, letterSpacing: '-0.02em' }}
                  initial={{ y: direction > 0 ? '100%' : '-100%', opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: direction > 0 ? '-100%' : '100%', opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                >
                  {year.year}
                </motion.span>
              </AnimatePresence>
            </span>
            <span className="min-w-0 leading-tight">
              <span className="block text-[12px] font-semibold truncate" style={{ color: 'var(--ink)' }}>
                {year.emoji} {chapterTitle(year)}
              </span>
              <span className="block font-mono-custom text-[10px] tracking-[0.16em] uppercase truncate" style={{ color: 'rgba(45,26,31,0.5)' }}>
                {SLIDE_LABELS[slides[slideIndex]]} · {slideIndex + 1}/{slides.length}
              </span>
            </span>
          </div>
          <motion.button
            onClick={onTogglePause}
            whileTap={{ scale: 0.85 }}
            aria-label={paused ? 'Reanudar' : 'Pausar'}
            className="shrink-0 grid place-items-center w-8 h-8 rounded-full border-0 cursor-pointer text-[11px]"
            style={{ background: 'rgba(45,26,31,0.08)', color: 'var(--ink)' }}
          >
            {paused ? '▶' : '❚❚'}
          </motion.button>
        </div>
      </motion.div>

      {/* ── Slides ── */}
      <div
        className="absolute inset-0 z-10"
        style={{ perspective: 1200, touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={endGesture}
        onPointerLeave={endGesture}
        onContextMenu={(e) => e.preventDefault()}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={slideKey}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 flex flex-col px-6"
            style={{
              transformStyle: 'preserve-3d', backfaceVisibility: 'hidden',
              paddingTop: 'calc(env(safe-area-inset-top) + 108px)',
              paddingBottom: 'calc(env(safe-area-inset-bottom) + 40px)',
            }}
          >
            {started && <WrapSlide type={slides[slideIndex]} data={year} />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* hold-to-pause indicator */}
      <AnimatePresence>
        {(held || paused) && (
          <motion.div
            className="absolute bottom-[calc(env(safe-area-inset-bottom)+16px)] left-1/2 -translate-x-1/2 z-30 font-mono-custom text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full pointer-events-none"
            style={{ background: 'rgba(45,26,31,0.75)', color: '#fff' }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
          >
            en pausa
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/** "El año récord — su conversación…" → "El año récord" */
function chapterTitle(y: YearStats) {
  return y.theme.split(' — ')[0];
}

interface YearTrackProps {
  years: YearStats[];
  yearIndex: number;
  slides: SlideType[];
  slideIndex: number;
  progress: MotionValue<number>;
  onGoTo: (index: number) => void;
  onSelectYear: (index: number) => void;
}

/**
 * The whole journey in one row: every year is a segment, and the current one
 * widens and splits into its slides. It says at a glance which year these
 * stats belong to, how far into it you are, and what's left.
 */
function YearTrack({ years, yearIndex, slides, slideIndex, progress, onGoTo, onSelectYear }: YearTrackProps) {
  return (
    <div className="year-track flex gap-1.5" role="tablist" aria-label="Años">
      {years.map((y, i) => {
        const active = i === yearIndex;
        const past = i < yearIndex;
        const label = (
          <span
            className="block font-mono-custom text-[10.5px] leading-none mb-1.5 truncate transition-colors duration-300"
            style={{ color: active ? y.color : past ? 'rgba(45,26,31,0.55)' : 'rgba(45,26,31,0.35)', fontWeight: active ? 700 : 500 }}
          >
            {y.year}
          </span>
        );
        return (
          <motion.div
            key={y.year}
            className="min-w-0"
            style={{ flexBasis: 0 }}
            initial={false}
            animate={{ flexGrow: active ? 4.5 : 1 }}
            transition={SPRING}
          >
            {active ? (
              <>
                <button
                  role="tab"
                  aria-selected
                  onClick={() => onGoTo(0)}
                  aria-label={`${y.year}, desde el inicio`}
                  className="block w-full text-left border-0 bg-transparent p-0 cursor-pointer"
                >
                  {label}
                </button>
                <div className="flex gap-[3px]">
                  {slides.map((s, si) => (
                    <button
                      key={s}
                      onClick={() => onGoTo(si)}
                      aria-label={`Ir a ${SLIDE_LABELS[s]}`}
                      className="relative flex-1 h-[3px] rounded-sm overflow-hidden cursor-pointer border-0 p-0 before:absolute before:-inset-y-2 before:inset-x-0 before:content-['']"
                      style={{ background: 'rgba(45,26,31,0.16)' }}
                    >
                      {si < slideIndex && <span className="absolute inset-0" style={{ background: y.color }} />}
                      {si === slideIndex && (
                        <motion.span
                          className="absolute inset-0 origin-left"
                          style={{ background: y.color, scaleX: progress, boxShadow: `0 0 6px ${y.color}` }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <button
                role="tab"
                aria-selected={false}
                onClick={() => onSelectYear(i)}
                aria-label={`Ir a ${y.year}`}
                className="block w-full text-left border-0 bg-transparent p-0 cursor-pointer relative before:absolute before:-inset-y-2 before:inset-x-0 before:content-['']"
              >
                {label}
                <span
                  className="block h-[3px] rounded-sm transition-colors duration-300"
                  style={{ background: past ? `${y.color}99` : 'rgba(45,26,31,0.16)' }}
                />
              </button>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
