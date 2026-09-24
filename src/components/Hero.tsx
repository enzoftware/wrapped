'use client';
import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { animate, createTimeline, createDrawable, splitText, stagger, utils } from 'animejs';
import Bokeh from './Bokeh';
import FloatingHearts from './FloatingHearts';
import { EASE, useAnime } from '../lib/anim';

const HEART_PATH = 'M50 86 C22 66 6 50 6 32 C6 18 17 8 30 8 C39 8 46 13 50 21 C54 13 61 8 70 8 C83 8 94 18 94 32 C94 50 78 66 50 86 Z';

// Decorative chat bubbles that orbit the title on wider screens.
const SIDE_BUBBLES = [
  { text: 'te amo ♥', side: 'left', top: '28%', who: 'enzo' },
  { text: '3,292 veces 🥹', side: 'left', top: '58%', who: 'katy' },
  { text: 'buenos días amor ☀️', side: 'right', top: '24%', who: 'katy' },
  { text: '¿salimos hoy? 🍕', side: 'right', top: '60%', who: 'enzo' },
] as const;

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const root = useAnime<HTMLDivElement>((el) => {
    const title = el.querySelector<HTMLElement>('.hero-title')!;
    const split = splitText(title, { words: true, chars: true });
    const [heart] = createDrawable(el.querySelector('.hero-heart path')!);

    utils.set(split.chars, { opacity: 0, y: 40, rotateX: -80 });
    utils.set('.hero-fade', { opacity: 0, y: 16 });
    utils.set('.hero-title', { opacity: 1 });
    utils.set(split.words, { whiteSpace: 'nowrap' });
    utils.set('.hero-bubble', { opacity: 0, scale: 0.6 });

    createTimeline({ defaults: { ease: 'outExpo' } })
      .add(heart, { draw: ['0 0', '0 1'], duration: 1400, ease: 'inOutSine' }, 0)
      .add('.hero-heart path', { fillOpacity: [0, 0.14], duration: 500 }, 1100)
      .add('.hero-eyebrow', { opacity: 1, y: 0, duration: 700 }, 200)
      .add(split.chars, { opacity: 1, y: 0, rotateX: 0, duration: 900, delay: stagger(45) }, 450)
      .add('.hero-fade:not(.hero-eyebrow)', { opacity: 1, y: 0, duration: 800, delay: stagger(140) }, 1100)
      .add('.hero-bubble', { opacity: 1, scale: 1, duration: 900, ease: 'outElastic(1, .6)', delay: stagger(160) }, 1500);

    // Continuous touches: the heart outline beats, the CTA emits a soft ring, bubbles bob.
    animate('.hero-heart', { scale: [1, 1.06, 1, 1.04, 1], duration: 1400, loop: true, loopDelay: 600, delay: 2200, ease: 'inOutSine' });
    animate('.hero-cta-ring', { scale: [1, 1.18], opacity: [0.5, 0], duration: 1800, loop: true, delay: 2600, ease: 'outQuad' });
    animate('.hero-bubble-inner', {
      y: () => utils.random(-10, -4),
      duration: () => utils.random(2200, 3200),
      loop: true, alternate: true, ease: 'inOutSine',
    });

    return () => split.revert();
  });

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex items-center justify-center min-h-svh px-4 overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      <Bokeh colors={['#f5c0cc', '#f0b0d8', '#d0b8f0']} />
      <FloatingHearts color="#d4687a" n={14} />

      {/* soft radial vignette to focus center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(80% 70% at 50% 45%, transparent 50%, rgba(253,246,240,0.6) 100%)' }}
      />

      <motion.div
        ref={root}
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 w-full max-w-[1100px] flex justify-center"
      >
        {/* Desktop-only chat bubbles framing the title */}
        {SIDE_BUBBLES.map((b) => (
          <div
            key={b.text}
            className="hero-bubble pre-anim hidden lg:block absolute"
            style={{ top: b.top, [b.side]: '2%' }}
            aria-hidden
          >
            <div
              className="hero-bubble-inner px-4 py-2.5 text-sm font-medium"
              style={{
                borderRadius: b.who === 'enzo' ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                background: b.who === 'enzo' ? 'rgba(91,127,212,0.12)' : 'rgba(212,104,122,0.14)',
                border: `1px solid ${b.who === 'enzo' ? 'rgba(91,127,212,0.25)' : 'rgba(212,104,122,0.28)'}`,
                color: b.who === 'enzo' ? 'var(--enzo)' : 'var(--accent-hi)',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 6px 24px rgba(45,26,31,0.06)',
              }}
            >
              {b.text}
            </div>
          </div>
        ))}

        <div className="relative flex flex-col items-center text-center px-6 pb-16 max-w-[390px] md:max-w-[720px] w-full">
          {/* heart outline drawn behind the title */}
          <svg
            className="hero-heart absolute pointer-events-none"
            viewBox="0 0 100 94"
            style={{ width: 'min(92vw, 520px)', top: '4%', left: '50%', marginLeft: 'calc(min(92vw, 520px) / -2)', opacity: 0.9 }}
            aria-hidden
          >
            <path d={HEART_PATH} fill="#d4687a" fillOpacity={0} stroke="#d4687a" strokeOpacity={0.35} strokeWidth={0.8} strokeLinecap="round" />
          </svg>

          {/* eyebrow */}
          <div className="pre-anim hero-fade hero-eyebrow flex items-center gap-2.5 mb-6 relative" style={{ color: 'var(--accent)' }}>
            <span style={{ fontSize: 15 }}>♥</span>
            <span className="font-mono-custom text-xs tracking-[0.32em] uppercase">Enzo &amp; Katy</span>
            <span style={{ fontSize: 15 }}>♥</span>
          </div>

          <h1
            className="hero-title pre-anim font-display italic font-black leading-none m-0 relative"
            style={{
              fontSize: 'clamp(52px, 15vw, 120px)',
              whiteSpace: 'nowrap',
              perspective: 600,
              letterSpacing: '-0.01em',
              color: 'var(--ink)',
              textShadow: '0 4px 40px rgba(212,104,122,0.18)',
            }}
          >
            WhatsApp<br />
            <span style={{ color: 'var(--accent)' }}>Wrap</span>
          </h1>

          {/* date range */}
          <div className="pre-anim hero-fade mt-7 flex items-center gap-4 font-mono-custom text-sm tracking-[0.12em]" style={{ color: 'var(--sub)' }}>
            <span style={{ width: 26, height: 1, background: 'var(--hair)', display: 'inline-block' }} />
            2020 — 2026
            <span style={{ width: 26, height: 1, background: 'var(--hair)', display: 'inline-block' }} />
          </div>

          {/* subtitle */}
          <p className="pre-anim hero-fade mt-6 text-sm md:text-base leading-relaxed max-w-[260px] md:max-w-[340px]" style={{ color: 'var(--sub)' }}>
            Seis años de conversación, día por día.<br />Esta es su historia en números.
          </p>

          {/* CTA button */}
          <div className="pre-anim hero-fade relative mt-9 inline-flex">
            <span
              className="hero-cta-ring absolute inset-0 rounded-full pointer-events-none"
              style={{ border: '2px solid #d4687a', opacity: 0 }}
              aria-hidden
            />
            <motion.a
              href="#stats"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="relative inline-flex items-center gap-2.5 no-underline font-bold text-base px-8 py-4 rounded-full cursor-pointer"
              style={{
                background: 'linear-gradient(135deg, #e07888, #d4687a)',
                color: '#ffffff',
                boxShadow: '0 8px 32px rgba(212,104,122,0.35)',
              }}
            >
              Ver nuestra historia
              <span style={{ fontSize: 17 }}>→</span>
            </motion.a>
          </div>
        </div>
      </motion.div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.6, duration: 0.6, ease: EASE }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bob"
        style={{ color: 'var(--faint)' }}
      >
        <span className="font-mono-custom text-[10px] tracking-[0.22em] uppercase">desliza</span>
        <span style={{ fontSize: 16 }}>↓</span>
      </motion.div>
    </section>
  );
}
