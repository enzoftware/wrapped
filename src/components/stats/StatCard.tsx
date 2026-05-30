'use client';
import { useRef } from 'react';
import { useInView } from 'framer-motion';
import CountUp from '../CountUp';

interface StatCardProps {
  emoji: string;
  value: number;
  label: string;
  accent?: string;
  big?: boolean;
}

export default function StatCard({ emoji, value, label, accent, big }: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-5% 0px' });
  const color = accent || 'var(--ink)';

  return (
    <div
      ref={ref}
      style={{
        borderRadius: 20,
        padding: big ? '20px 18px' : '18px 16px',
        background: big
          ? `linear-gradient(160deg, rgba(212,104,122,0.14), rgba(168,85,247,0.06))`
          : 'var(--bg-card)',
        boxShadow: big
          ? 'inset 0 0 0 1.5px rgba(212,104,122,0.35), 0 2px 12px rgba(45,26,31,0.06)'
          : 'inset 0 0 0 1px rgba(45,26,31,0.08), 0 2px 8px rgba(45,26,31,0.04)',
        display: 'flex', flexDirection: 'column', gap: 6,
        opacity: isInView ? 1 : 0,
        transform: isInView ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.5s 0.1s, transform 0.5s 0.1s',
      }}
    >
      <span style={{ fontSize: 18 }}>{emoji}</span>
      <div style={{ fontWeight: 800, fontSize: big ? 32 : 26, letterSpacing: '-0.02em', color, lineHeight: 1 }}>
        <CountUp end={value} />
      </div>
      <div style={{ color: 'var(--sub)', fontSize: 12, lineHeight: 1.25 }}>{label}</div>
    </div>
  );
}
