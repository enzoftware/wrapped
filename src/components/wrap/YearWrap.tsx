'use client';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView, useMotionValue, type AnimationPlaybackControls } from 'motion/react';
import type { YearStats } from '../../lib/types';
import { EASE } from '../../lib/anim';
import WrapSlide from './WrapSlide';
import YearAmbient from './YearAmbient';
import { SLIDE_LABELS, type SlideType } from './themes';

interface YearWrapProps {
  year: YearStats;
  slides: SlideType[];
  slideIndex: number;
  direction: number;
  paused: boolean;
  onNext: () => void;
  onPrev: () => void;
  onGoTo: (index: number) => void;
  onTogglePause: () => void;
}

const SLIDE_SECONDS = 7;
const HOLD_MS = 180;
const SWIPE_PX = 48;

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
  year, slides, slideIndex, direction, paused, onNext, onPrev, onGoTo, onTogglePause,
}: YearWrapProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.55 });
  const pageVisible = usePageVisible();
  const [held, setHeld] = useState(false);

  // ── Autoplay: a motion value drives the active progress bar ────────────
  const progress = useMotionValue(0);
  const controls = useRef<AnimationPlaybackControls | null>(null);
  const onNextRef = useRef(onNext);
  onNextRef.current = onNext;
  const running = inView && pageVisible && !held && !paused;
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
    if (!inView) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); onNext(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); onPrev(); }
      if (e.key === ' ' && document.activeElement === document.body) { e.preventDefault(); onTogglePause(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [inView, onNext, onPrev, onTogglePause]);

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

      {/* ── Chrome: progress bars + header ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-30 px-4 pt-4"
        animate={{ opacity: held ? 0.25 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="flex gap-1 mb-3">
          {slides.map((s, i) => (
            <button
              key={`${year.year}-${s}`}
              onClick={() => onGoTo(i)}
              aria-label={`Ir a ${SLIDE_LABELS[s]}`}
              className="relative flex-1 h-[3px] rounded-sm overflow-hidden cursor-pointer border-0 p-0 before:absolute before:-inset-y-2 before:inset-x-0 before:content-['']"
              style={{ background: 'rgba(45,26,31,0.16)' }}
            >
              {i < slideIndex && <span className="absolute inset-0" style={{ background: year.color }} />}
              {i === slideIndex && (
                <motion.span
                  className="absolute inset-0 origin-left"
                  style={{ background: year.color, scaleX: progress, boxShadow: `0 0 6px ${year.color}` }}
                />
              )}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <span className="font-mono-custom text-[10.5px] tracking-[0.2em] uppercase" style={{ color: 'rgba(45,26,31,0.5)' }}>
            Enzo &amp; Katy · {SLIDE_LABELS[slides[slideIndex]]}
          </span>
          <div className="flex items-center gap-2">
            <span className="font-mono-custom text-[11px] font-semibold" style={{ color: year.color }}>{year.year}</span>
            <motion.button
              onClick={onTogglePause}
              whileTap={{ scale: 0.85 }}
              aria-label={paused ? 'Reanudar' : 'Pausar'}
              className="grid place-items-center w-7 h-7 rounded-full border-0 cursor-pointer text-[11px]"
              style={{ background: 'rgba(45,26,31,0.08)', color: 'var(--ink)' }}
            >
              {paused ? '▶' : '❚❚'}
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* ── Slides ── */}
      <div
        className="absolute inset-0 z-10"
        style={{ perspective: 1200, touchAction: 'pan-y' }}
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
            className="absolute inset-0 flex flex-col px-6 pt-[78px] pb-10"
            style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}
          >
            <WrapSlide type={slides[slideIndex]} data={year} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* hold-to-pause indicator */}
      <AnimatePresence>
        {(held || paused) && (
          <motion.div
            className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 font-mono-custom text-[10px] tracking-[0.2em] uppercase px-3 py-1.5 rounded-full pointer-events-none"
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
