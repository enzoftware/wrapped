'use client';
import { motion } from 'motion/react';
import { createTimeline, utils } from 'animejs';
import CountUp from '../CountUp';
import { EASE, useAnimeInView } from '../../lib/anim';

interface StatCardProps {
  emoji: string;
  value: number;
  label: string;
  accent?: string;
  big?: boolean;
  index?: number;
}

export default function StatCard({ emoji, value, label, accent, big, index = 0 }: StatCardProps) {
  const color = accent || 'var(--ink)';

  // The emoji drops in and wobbles once the card lands.
  const root = useAnimeInView<HTMLDivElement>(() => {
    utils.set('.sc-emoji', { opacity: 0 });
    return createTimeline({ autoplay: false, delay: 250 + index * 70 })
      .add('.sc-emoji', { opacity: [0, 1], y: [-18, 0], scale: [0.4, 1], duration: 700, ease: 'outElastic(1, .55)' })
      .add('.sc-emoji', { rotate: [0, -14, 10, -6, 0], duration: 600, ease: 'inOutSine' }, '-=200');
  }, [index]);

  return (
    <motion.div
      ref={root}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-5%' }}
      transition={{ duration: 0.55, delay: index * 0.06, ease: EASE }}
      whileHover={{ y: -4, boxShadow: '0 12px 28px rgba(45,26,31,0.10)' }}
      whileTap={{ scale: 0.97 }}
      className={big ? 'col-span-2 lg:col-span-1' : undefined}
      style={{
        borderRadius: 20,
        padding: big ? '20px 18px' : '18px 16px',
        background: big
          ? 'linear-gradient(160deg, rgba(212,104,122,0.14), rgba(168,85,247,0.06))'
          : 'var(--bg-card)',
        boxShadow: big
          ? 'inset 0 0 0 1.5px rgba(212,104,122,0.35), 0 2px 12px rgba(45,26,31,0.06)'
          : 'inset 0 0 0 1px rgba(45,26,31,0.08), 0 2px 8px rgba(45,26,31,0.04)',
        display: 'flex', flexDirection: 'column', gap: 6,
      }}
    >
      <span className="sc-emoji" style={{ fontSize: big ? 22 : 18, display: 'inline-block', alignSelf: 'flex-start' }}>{emoji}</span>
      <div style={{ fontWeight: 800, fontSize: big ? 36 : 26, letterSpacing: '-0.02em', color, lineHeight: 1 }}>
        <CountUp end={value} />
      </div>
      <div style={{ color: 'var(--sub)', fontSize: 12, lineHeight: 1.25 }}>{label}</div>
    </motion.div>
  );
}
