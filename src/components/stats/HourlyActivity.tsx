'use client';
import { useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';

interface HourlyActivityProps {
  data: number[];
}

export default function HourlyActivity({ data }: HourlyActivityProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });
  const max = Math.max(...data);
  const [hovered, setHovered] = useState<number | null>(null);

  const hrLabel = (hr: number) => {
    if (hr === 0) return '12am';
    if (hr < 12) return `${hr}am`;
    if (hr === 12) return '12pm';
    return `${hr - 12}pm`;
  };

  return (
    <div ref={ref} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 160 }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 3, minHeight: 120 }}>
        {data.map((v, hr) => {
          const active = hr >= 10 && hr <= 19;
          const heightPct = Math.max((v / max) * 100, 2);
          return (
            <div
              key={hr}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: 120, position: 'relative', cursor: 'default' }}
              onMouseEnter={() => setHovered(hr)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === hr && (
                <div
                  style={{
                    position: 'absolute', bottom: '100%', marginBottom: 6,
                    background: 'var(--ink)', color: 'white',
                    fontSize: 10, padding: '4px 8px', borderRadius: 6,
                    whiteSpace: 'nowrap', left: '50%', transform: 'translateX(-50%)',
                    zIndex: 10, fontFamily: '"Roboto Mono", monospace',
                    boxShadow: '0 2px 8px rgba(45,26,31,0.2)',
                  }}
                >
                  {hrLabel(hr)}: {v.toLocaleString()}
                </div>
              )}
              <motion.div
                initial={{ height: 0 }}
                animate={isInView ? { height: `${heightPct}%` } : { height: 0 }}
                transition={{ duration: 0.6, delay: hr * 0.02, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: '100%',
                  borderRadius: 3,
                  background: active
                    ? 'linear-gradient(180deg, #e07888, #d4687a)'
                    : 'rgba(45,26,31,0.1)',
                  boxShadow: active ? '0 0 8px rgba(212,104,122,0.3)' : 'none',
                }}
              />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontFamily: '"Roboto Mono", monospace', fontSize: 10, color: 'var(--faint)' }}>
        <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span>
      </div>
    </div>
  );
}
