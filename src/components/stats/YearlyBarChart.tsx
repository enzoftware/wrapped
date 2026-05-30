'use client';
import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import type { YearStats } from '../../lib/types';

interface YearlyBarChartProps {
  years: YearStats[];
}

export default function YearlyBarChart({ years }: YearlyBarChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const max = Math.max(...years.flatMap((y) => [y.enzo, y.katy]));
  const CHART_HEIGHT = 140;

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column' }}>
      {/* legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 16, fontSize: 12, color: 'var(--sub)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: 'var(--enzo)' }} />
          Enzo
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 12, height: 12, borderRadius: 3, background: 'var(--katy)' }} />
          Katy
        </span>
      </div>

      {/* bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: CHART_HEIGHT }}>
        {years.map((y) => (
          <div key={y.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 9, color: 'var(--faint)', marginBottom: 6 }}>
              {(y.total / 1000).toFixed(0)}k
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, width: '100%', justifyContent: 'center', flex: 1 }}>
              <motion.div
                initial={{ height: 0 }}
                animate={isInView ? { height: (y.enzo / max) * CHART_HEIGHT } : { height: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: 12, borderRadius: '4px 4px 0 0', background: 'var(--enzo)', flexShrink: 0 }}
              />
              <motion.div
                initial={{ height: 0 }}
                animate={isInView ? { height: (y.katy / max) * CHART_HEIGHT } : { height: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: 12, borderRadius: '4px 4px 0 0', background: 'var(--katy)', flexShrink: 0 }}
              />
            </div>
            <div style={{ fontSize: 11, marginTop: 8, fontWeight: 600, color: 'var(--sub)' }}>
              {y.year}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
