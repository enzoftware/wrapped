'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { YearStats } from '../../lib/types';
import { WrapSlideInner } from './WrapSlide';
import FloatingHearts from '../FloatingHearts';

interface YearWrapProps {
  year: YearStats;
  isActive: boolean;
}

type SlideType = 'cover' | 'messages' | 'love' | 'media' | 'topics' | 'topDay' | 'highlight' | 'closing';

function getSlides(year: YearStats): SlideType[] {
  const base: SlideType[] = ['cover', 'messages', 'love', 'media', 'topics', 'topDay', 'highlight'];
  if (year.year === 2026) return [...base, 'closing'];
  return base;
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0.4 }),
  center: { x: 0, opacity: 1, transition: { duration: 0.42, ease: EASE } },
  exit: (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0.4, transition: { duration: 0.32, ease: EASE } }),
};

export default function YearWrap({ year, isActive }: YearWrapProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);
  const slides = getSlides(year);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback((idx: number, dir: number) => {
    setDirection(dir);
    setCurrentSlide(idx);
  }, []);

  const next = useCallback(() => {
    if (currentSlide < slides.length - 1) goTo(currentSlide + 1, 1);
  }, [currentSlide, slides.length, goTo]);

  const prev = useCallback(() => {
    if (currentSlide > 0) goTo(currentSlide - 1, -1);
  }, [currentSlide, goTo]);

  useEffect(() => {
    setCurrentSlide(0);
    setDirection(1);
  }, [year.year]);

  useEffect(() => {
    if (!isActive) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isActive, next, prev]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 48) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  const slideType = slides[currentSlide];
  const grad = `linear-gradient(165deg, ${year.grad[0]}, ${year.grad[1]})`;

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden', width: '100%', minHeight: 680, background: grad, userSelect: 'none' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* subtle floating hearts */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.35, pointerEvents: 'none' }}>
        <FloatingHearts color={year.color} n={8} />
      </div>

      {/* year color radial glow */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(110% 65% at 50% 25%, ${year.color}18, transparent 55%)`, pointerEvents: 'none' }} />

      {/* Story progress bars */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20, padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 12 }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > currentSlide ? 1 : -1)}
              style={{
                flex: 1, height: 3, borderRadius: 2, border: 'none', padding: 0, cursor: 'pointer',
                background: i <= currentSlide ? year.color : 'rgba(45,26,31,0.18)',
                boxShadow: i === currentSlide ? `0 0 6px ${year.color}` : 'none',
                transition: 'background 0.2s',
              }}
            />
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 10.5, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(45,26,31,0.5)' }}>
            Enzo &amp; Katy
          </span>
          <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, fontWeight: 600, color: year.color }}>
            {year.year}
          </span>
        </div>
      </div>

      {/* Slide content */}
      <div style={{ position: 'absolute', inset: 0, paddingTop: 72, paddingBottom: 52, paddingLeft: 24, paddingRight: 24, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={`${year.year}-${currentSlide}`}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}
          >
            <WrapSlideInner type={slideType} data={year} isActive={isActive} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Desktop nav arrows */}
      {currentSlide > 0 && (
        <button
          onClick={prev}
          className="hidden md:flex"
          style={{
            position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 20,
            width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'rgba(45,26,31,0.12)', backdropFilter: 'blur(8px)',
            boxShadow: 'inset 0 0 0 1px rgba(45,26,31,0.15)',
            alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--ink)',
          }}
        >‹</button>
      )}
      {currentSlide < slides.length - 1 && (
        <button
          onClick={next}
          className="hidden md:flex"
          style={{
            position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', zIndex: 20,
            width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
            background: 'rgba(45,26,31,0.12)', backdropFilter: 'blur(8px)',
            boxShadow: 'inset 0 0 0 1px rgba(45,26,31,0.15)',
            alignItems: 'center', justifyContent: 'center', fontSize: 18, color: 'var(--ink)',
          }}
        >›</button>
      )}

      {/* Mobile tap zones */}
      <div className="md:hidden" style={{ position: 'absolute', left: 0, top: 72, bottom: 52, width: '35%', zIndex: 10, cursor: currentSlide > 0 ? 'pointer' : 'default' }} onClick={prev} />
      <div className="md:hidden" style={{ position: 'absolute', right: 0, top: 72, bottom: 52, width: '35%', zIndex: 10, cursor: currentSlide < slides.length - 1 ? 'pointer' : 'default' }} onClick={next} />

      {/* Dot indicators */}
      <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 20 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i, i > currentSlide ? 1 : -1)}
            style={{
              width: 6, height: 6, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer',
              background: i === currentSlide ? year.color : 'rgba(45,26,31,0.2)',
              transform: i === currentSlide ? 'scale(1.5)' : 'scale(1)',
              transition: 'all 0.2s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
