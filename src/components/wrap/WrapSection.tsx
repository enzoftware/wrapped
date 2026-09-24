'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import type { YearStats } from '../../lib/types';
import { EASE } from '../../lib/anim';
import YearWrap from './YearWrap';
import { SLIDE_LABELS, getSlides } from './themes';

interface WrapSectionProps {
  years: YearStats[];
}

interface Position {
  yearIdx: number;
  slideIdx: number;
  dir: number;
}

export default function WrapSection({ years }: WrapSectionProps) {
  const [pos, setPos] = useState<Position>({ yearIdx: 0, slideIdx: 0, dir: 1 });
  const [paused, setPaused] = useState(false);
  const slidesFor = useCallback((i: number) => getSlides(i === years.length - 1), [years.length]);

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

  // Keep the active pill centred in the mobile scroller (without scrolling the page).
  const pillsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const scroller = pillsRef.current;
    const pill = scroller?.querySelector<HTMLElement>(`[data-year="${current.year}"]`);
    if (!scroller || !pill) return;
    scroller.scrollTo({ left: pill.offsetLeft - scroller.clientWidth / 2 + pill.offsetWidth / 2, behavior: 'smooth' });
  }, [current.year]);

  return (
    <section id="wrap" className="py-14 lg:py-24" style={{ background: 'var(--bg)' }}>
      <div className="mx-auto w-full max-w-[440px] lg:max-w-[1100px] px-3 sm:px-5 lg:px-8 lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-16 xl:gap-24 lg:items-start">

        {/* ── Left column (desktop) / header (mobile) ── */}
        <div className="px-2 lg:px-0 lg:sticky lg:top-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mb-6 lg:mb-10"
          >
            <div className="font-mono-custom text-[11px] tracking-[0.26em] uppercase mb-2.5" style={{ color: 'var(--accent)' }}>
              Tu historia
            </div>
            <h2 className="font-display italic m-0 leading-none text-[44px] lg:text-[64px]" style={{ fontWeight: 900, color: 'var(--ink)' }}>
              Año por año
            </h2>
            <p className="hidden lg:block mt-5 text-[15px] leading-relaxed max-w-[420px]" style={{ color: 'var(--sub)' }}>
              Seis capítulos, uno por año. Las historias avanzan solas — mantén presionado para pausar,
              o usa <kbd className="font-mono-custom text-xs">←</kbd> <kbd className="font-mono-custom text-xs">→</kbd> y <kbd className="font-mono-custom text-xs">espacio</kbd>.
            </p>
          </motion.div>

          {/* Mobile: horizontal year pills with a sliding highlight */}
          <LayoutGroup id="year-pills">
            <div
              ref={pillsRef}
              className="lg:hidden flex gap-2 overflow-x-auto pb-1 -mx-2 px-2 mb-3"
              style={{ scrollbarWidth: 'none' }}
              role="tablist"
              aria-label="Años"
            >
              {years.map((y, i) => {
                const active = i === pos.yearIdx;
                return (
                  <motion.button
                    key={y.year}
                    data-year={y.year}
                    role="tab"
                    aria-selected={active}
                    onClick={() => selectYear(i)}
                    whileTap={{ scale: 0.92 }}
                    className="relative shrink-0 px-4 py-2 rounded-full border-0 cursor-pointer text-[13px] font-semibold"
                    style={{ background: 'rgba(45,26,31,0.06)', color: active ? '#fff' : 'var(--sub)' }}
                  >
                    {active && (
                      <motion.span
                        layoutId="year-pill-bg"
                        className="absolute inset-0 rounded-full"
                        style={{ background: y.color, boxShadow: `0 4px 16px ${y.color}55` }}
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{y.emoji} {y.year}</span>
                  </motion.button>
                );
              })}
            </div>
          </LayoutGroup>

          {/* Mobile: theme line */}
          <AnimatePresence mode="wait">
            <motion.p
              key={current.year}
              className="lg:hidden text-[13px] leading-snug mb-4 min-h-[2.6em]"
              style={{ color: 'var(--sub)' }}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
            >
              {current.theme}
            </motion.p>
          </AnimatePresence>

          {/* Desktop: expanded year rail with chapter list */}
          <LayoutGroup id="year-rail">
            <nav className="hidden lg:flex flex-col gap-2" aria-label="Años">
              {years.map((y, i) => {
                const active = i === pos.yearIdx;
                return (
                  <motion.div
                    key={y.year}
                    layout
                    transition={{ type: 'spring', stiffness: 300, damping: 32 }}
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      background: active ? `${y.color}10` : 'transparent',
                      boxShadow: active ? `inset 0 0 0 1px ${y.color}35` : 'inset 0 0 0 1px var(--hair)',
                    }}
                  >
                    <button
                      onClick={() => selectYear(i)}
                      className="w-full flex items-center gap-4 px-4 py-3 border-0 bg-transparent cursor-pointer text-left"
                    >
                      <motion.span layout="position" className="text-2xl" animate={{ scale: active ? 1.15 : 1 }}>{y.emoji}</motion.span>
                      <span className="flex-1 min-w-0">
                        <span className="flex items-baseline gap-3">
                          <span className="font-display italic text-2xl font-black" style={{ color: active ? y.color : 'var(--ink)' }}>{y.year}</span>
                          <span className="font-mono-custom text-[11px]" style={{ color: 'var(--faint)' }}>{y.total.toLocaleString('en-US')} msgs</span>
                        </span>
                        <span className="block text-[13px] truncate" style={{ color: 'var(--sub)' }}>{y.theme}</span>
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {active && (
                        <motion.ol
                          key="chapters"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.35, ease: EASE }}
                          className="list-none m-0 px-4 pb-3 pt-0 grid grid-cols-2 gap-1"
                        >
                          {slides.map((s, si) => {
                            const on = si === pos.slideIdx;
                            return (
                              <li key={s}>
                                <button
                                  onClick={() => goTo(si)}
                                  className="relative w-full text-left px-3 py-1.5 rounded-lg border-0 bg-transparent cursor-pointer text-[12.5px]"
                                  style={{ color: on ? '#fff' : si < pos.slideIdx ? 'var(--ink)' : 'var(--sub)' }}
                                >
                                  {on && (
                                    <motion.span
                                      layoutId="chapter-bg"
                                      className="absolute inset-0 rounded-lg"
                                      style={{ background: y.color }}
                                      transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                                    />
                                  )}
                                  <span className="relative font-mono-custom text-[10px] mr-2 opacity-60">{String(si + 1).padStart(2, '0')}</span>
                                  <span className="relative">{SLIDE_LABELS[s]}</span>
                                </button>
                              </li>
                            );
                          })}
                        </motion.ol>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </nav>
          </LayoutGroup>
        </div>

        {/* ── Story frame ── */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative lg:sticky lg:top-10 scroll-mt-3"
          id="wrap-story"
        >
          <motion.div
            className="relative w-full rounded-[28px] overflow-hidden h-[min(calc(100svh_-_24px),780px)] min-h-[580px] lg:h-[780px]"
            animate={{ boxShadow: `0 12px 48px ${current.color}33, 0 2px 12px rgba(45,26,31,0.08)` }}
            transition={{ duration: 0.8 }}
          >
            <YearWrap
              year={current}
              slides={slides}
              slideIndex={pos.slideIdx}
              direction={pos.dir}
              paused={paused}
              onNext={next}
              onPrev={prev}
              onGoTo={goTo}
              onTogglePause={togglePause}
            />
          </motion.div>

          {/* Desktop: arrows outside the phone frame */}
          {[
            { label: 'Anterior', onClick: prev, side: '-left-16', glyph: '‹' },
            { label: 'Siguiente', onClick: next, side: '-right-16', glyph: '›' },
          ].map((b) => (
            <motion.button
              key={b.label}
              onClick={b.onClick}
              aria-label={b.label}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.9 }}
              className={`hidden xl:grid place-items-center absolute top-1/2 -translate-y-1/2 ${b.side} w-11 h-11 rounded-full border-0 cursor-pointer text-2xl`}
              style={{ background: 'var(--bg-card)', color: 'var(--ink)', boxShadow: 'inset 0 0 0 1px var(--hair), 0 4px 16px rgba(45,26,31,0.08)' }}
            >
              {b.glyph}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
