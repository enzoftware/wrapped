'use client';
import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import type { Topic } from '../../lib/types';

interface TopicsChartProps {
  topics: Topic[];
  yearColor?: string;
}

const PALETTE = ['#d4687a','#c06090','#a860a0','#9060b0','#7868c0','#6070cc','#5078d0','#4080d4'];

export default function TopicsChart({ topics, yearColor }: TopicsChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const max = topics[0]?.count ?? 1;

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {topics.map((t, i) => {
        const barColor = yearColor || PALETTE[i] || '#d4687a';
        return (
          <div key={t.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? 'var(--ink)' : 'var(--sub)' }}>
                {t.name}
              </span>
              <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, color: i === 0 ? barColor : 'var(--faint)' }}>
                {t.count.toLocaleString('en-US')}
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 5, background: 'rgba(45,26,31,0.08)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: `${(t.count / max) * 100}%` } : { width: 0 }}
                transition={{ duration: 0.8, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: '100%', borderRadius: 5, background: barColor, boxShadow: i === 0 ? `0 0 14px ${barColor}55` : 'none' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
