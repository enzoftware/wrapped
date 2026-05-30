'use client';
import { useRef } from 'react';
import { useInView, motion } from 'framer-motion';
import type { GlobalStats } from '../../lib/types';

interface PlansPanelProps {
  global: GlobalStats;
}

export default function PlansPanel({ global }: PlansPanelProps) {
  const barRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(barRef, { once: true, margin: '-10% 0px' });
  const maxPlanes = Math.max(...global.planesPerYear.map((p) => p.count));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>

      {/* outings breakdown */}
      <div>
        <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>
          Dónde los encontramos
        </div>
        <h3 className="font-display italic" style={{ fontSize: 26, fontWeight: 700, margin: '0 0 20px', lineHeight: 1 }}>
          Sus planes más frecuentes
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {global.outingTypes.map((o, i) => {
            const max = global.outingTypes[0].count;
            return (
              <div key={o.name}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: i === 0 ? 700 : 500, color: 'var(--ink)' }}>
                    <span style={{ fontSize: 18 }}>{o.emoji}</span>
                    {o.name}
                  </span>
                  <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, color: 'var(--accent)' }}>
                    {o.count.toLocaleString()}×
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 5, background: 'rgba(45,26,31,0.08)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(o.count / max) * 100}%` }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', borderRadius: 5, background: `linear-gradient(90deg, #e07888, #d4687a)`, opacity: 1 - i * 0.12 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* plans per year */}
      <div ref={barRef}>
        <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>
          Planes coordinados
        </div>
        <h3 className="font-display italic" style={{ fontSize: 26, fontWeight: 700, margin: '0 0 20px', lineHeight: 1 }}>
          Creciendo año a año
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120 }}>
          {global.planesPerYear.map((p, i) => (
            <div key={p.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
              <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 10, color: 'var(--faint)', marginBottom: 4 }}>{p.count}</div>
              <motion.div
                initial={{ height: 0 }}
                animate={isInView ? { height: (p.count / maxPlanes) * 100 } : { height: 0 }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                style={{ width: '100%', borderRadius: '6px 6px 0 0', background: `linear-gradient(180deg, #e07888, #d4687a)`, minHeight: 4 }}
              />
              <div style={{ fontSize: 10, marginTop: 6, fontWeight: 600, color: 'var(--sub)', fontFamily: '"Roboto Mono", monospace' }}>
                {p.year}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* day of week */}
      <div>
        <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8 }}>
          Día de la semana
        </div>
        <h3 className="font-display italic" style={{ fontSize: 26, fontWeight: 700, margin: '0 0 20px', lineHeight: 1 }}>
          Fines de semana ganan
        </h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
          {global.dayActivity.map((d, i) => {
            const max = Math.max(...global.dayActivity.map((x) => x.count));
            const isWeekend = i >= 5;
            return (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <motion.div
                  initial={{ height: 0 }}
                  whileInView={{ height: (d.count / max) * 80 }}
                  viewport={{ once: true, margin: '-10%' }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    width: '100%', borderRadius: '4px 4px 0 0',
                    background: isWeekend ? 'linear-gradient(180deg, #e07888, #d4687a)' : 'rgba(45,26,31,0.12)',
                    boxShadow: isWeekend ? '0 0 8px rgba(212,104,122,0.3)' : 'none',
                  }}
                />
                <div style={{ fontSize: 11, marginTop: 5, color: isWeekend ? 'var(--accent)' : 'var(--faint)', fontWeight: isWeekend ? 700 : 400 }}>
                  {d.day}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
