'use client';
import { motion } from 'framer-motion';
import Bokeh from './Bokeh';
import FloatingHearts from './FloatingHearts';

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex items-center justify-center min-h-screen px-4"
      style={{ background: 'var(--bg)' }}
    >
      <Bokeh colors={['#f5c0cc', '#f0b0d8', '#d0b8f0']} />
      <FloatingHearts color="#d4687a" n={14} />

      {/* soft radial vignette to focus center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(80% 70% at 50% 45%, transparent 50%, rgba(253,246,240,0.6) 100%)' }}
      />

      <div className="relative z-10 flex flex-col items-center text-center px-6 pb-16 max-w-[390px] w-full">
        {/* eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex items-center gap-2.5 mb-6"
          style={{ color: 'var(--accent)' }}
        >
          <span style={{ fontSize: 15 }}>♥</span>
          <span className="font-mono-custom text-xs tracking-[0.32em] uppercase" style={{ color: 'var(--accent)' }}>
            Enzo &amp; Katy
          </span>
          <span style={{ fontSize: 15 }}>♥</span>
        </motion.div>

        {/* stagger title */}
        <h1
          className="font-display italic font-black leading-none m-0"
          style={{
            fontSize: 'clamp(52px, 16vw, 72px)',
            letterSpacing: '-0.01em',
            color: 'var(--ink)',
            textShadow: '0 4px 40px rgba(212,104,122,0.18)',
          }}
        >
          {('WhatsApp').split('').map((ch, i) => (
            <motion.span
              key={`t1-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-block', whiteSpace: 'pre' }}
            >
              {ch}
            </motion.span>
          ))}
          <br />
          {('Wrap').split('').map((ch, i) => (
            <motion.span
              key={`t2-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 1.0 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              style={{ display: 'inline-block', color: 'var(--accent)' }}
            >
              {ch}
            </motion.span>
          ))}
        </h1>

        {/* date range */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mt-7 flex items-center gap-4 font-mono-custom text-sm tracking-[0.12em]"
          style={{ color: 'var(--sub)' }}
        >
          <span style={{ width: 26, height: 1, background: 'var(--hair)', display: 'inline-block' }} />
          2020 — 2026
          <span style={{ width: 26, height: 1, background: 'var(--hair)', display: 'inline-block' }} />
        </motion.div>

        {/* subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mt-6 text-sm leading-relaxed max-w-[250px]"
          style={{ color: 'var(--sub)' }}
        >
          Seis años de conversación, día por día.<br />Esta es su historia en números.
        </motion.p>

        {/* CTA button */}
        <motion.a
          href="#stats"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="mt-9 inline-flex items-center gap-2.5 no-underline font-bold text-base px-8 py-4 rounded-full cursor-pointer"
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

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 0.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bob"
        style={{ color: 'var(--faint)' }}
      >
        <span className="font-mono-custom text-[10px] tracking-[0.22em] uppercase">desliza</span>
        <span style={{ fontSize: 16 }}>↓</span>
      </motion.div>
    </section>
  );
}
