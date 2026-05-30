'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { YearStats } from '../../lib/types';
import YearWrap from './YearWrap';

interface WrapSectionProps {
  years: YearStats[];
}

export default function WrapSection({ years }: WrapSectionProps) {
  const [activeYear, setActiveYear] = useState(years[0].year);
  const current = years.find((y) => y.year === activeYear) ?? years[0];

  return (
    <section id="wrap" style={{ background: 'var(--bg)', paddingTop: 60, paddingBottom: 60 }}>
      <div style={{ maxWidth: 390, margin: '0 auto', padding: '0 20px' }}>

        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 28 }}
        >
          <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 10 }}>
            Tu historia
          </div>
          <h2 className="font-display italic" style={{ fontSize: 44, fontWeight: 900, margin: 0, lineHeight: 1, color: 'var(--ink)' }}>
            Año por año
          </h2>
        </motion.div>

        {/* year selector pills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{ display: 'flex', gap: 8, marginBottom: 16, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}
        >
          {years.map((y) => (
            <button
              key={y.year}
              onClick={() => setActiveYear(y.year)}
              style={{
                flexShrink: 0,
                padding: '8px 16px',
                borderRadius: 40,
                fontWeight: 600,
                fontSize: 13,
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.25s',
                background: activeYear === y.year ? y.color : 'rgba(45,26,31,0.07)',
                color: activeYear === y.year ? '#fff' : 'var(--sub)',
                boxShadow: activeYear === y.year ? `0 4px 16px ${y.color}44` : 'none',
                transform: activeYear === y.year ? 'scale(1.05)' : 'scale(1)',
              }}
            >
              {y.emoji} {y.year}
            </button>
          ))}
        </motion.div>

        {/* theme label */}
        <AnimatePresence mode="wait">
          <motion.p
            key={activeYear + '-theme'}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            style={{ fontSize: 13, marginBottom: 20, color: 'var(--sub)', lineHeight: 1.45 }}
          >
            {current.theme}
          </motion.p>
        </AnimatePresence>

        {/* story frame */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeYear + '-story'}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              borderRadius: 28,
              overflow: 'hidden',
              boxShadow: `0 8px 40px ${current.color}30, 0 2px 12px rgba(45,26,31,0.08)`,
              minHeight: 680,
            }}
          >
            <YearWrap year={current} isActive={true} />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
