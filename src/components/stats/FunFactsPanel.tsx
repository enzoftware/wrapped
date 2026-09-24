'use client';
import { motion } from 'motion/react';
import { animate, stagger, utils } from 'animejs';
import CountUp from '../CountUp';
import type { GlobalStats } from '../../lib/types';
import { EASE, useAnimeInView } from '../../lib/anim';

interface FunFactsPanelProps {
  global: GlobalStats;
}

type Mood = 'laugh' | 'night' | 'bloom' | 'steam';

interface Fact {
  emoji: string;
  label: string;
  value: number;
  note: string;
  color: string;
  mood: Mood;
}

export default function FunFactsPanel({ global }: FunFactsPanelProps) {
  const cards: Fact[] = [
    { emoji: '😂', label: 'Veces que se rieron', value: global.risas, note: 'jajaja, xd y jeje — literalmente contamos', color: '#e89040', mood: 'laugh' },
    { emoji: '🌙', label: 'Mensajes de madrugada', value: global.mensajesNocturnos, note: 'Entre las 12am y las 3am — casi 8k noches sin dormir', color: '#6060c0', mood: 'night' },
    { emoji: '💐', label: 'Cumplidos enviados', value: global.cumplidos, note: '"hermosa", "bonita", "guapo", "lindo" y más', color: '#c06090', mood: 'bloom' },
    { emoji: '🍜', label: 'Conversaciones de comida', value: 1033, note: 'Restaurantes, hambre, qué comer y dónde', color: '#d06040', mood: 'steam' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {cards.map((c, i) => <FactCard key={c.label} fact={c} index={i} />)}
    </div>
  );
}

function FactCard({ fact: c, index }: { fact: Fact; index: number }) {
  // Each emoji acts out its fact: laughing shakes, the moon rocks among stars,
  // flowers bloom with petals, noodles steam.
  const root = useAnimeInView<HTMLDivElement>(() => {
    const opts = { autoplay: false, delay: 300 + index * 120 } as const;
    switch (c.mood) {
      case 'laugh':
        return animate('.ff-emoji', { rotate: [0, -12, 12, -10, 10, -6, 6, 0], y: [0, -4, 0, -4, 0, -2, 0, 0], duration: 900, loop: 2, loopDelay: 1400, ease: 'inOutSine', ...opts });
      case 'night':
        utils.set('.ff-fx', { opacity: 0, scale: 0 });
        return [
          animate('.ff-emoji', { rotate: [-10, 10], duration: 1800, loop: true, alternate: true, ease: 'inOutSine', ...opts }),
          animate('.ff-fx', { opacity: [0, 1, 0.3, 1], scale: [0, 1], duration: 1600, delay: stagger(220, { start: opts.delay }), loop: true, alternate: true, ease: 'inOutSine', autoplay: false }),
        ];
      case 'bloom':
        utils.set('.ff-fx', { opacity: 0 });
        return [
          animate('.ff-emoji', { scale: [0.3, 1.15, 1], rotate: [-30, 0], duration: 1100, ease: 'outElastic(1, .5)', ...opts }),
          animate('.ff-fx', {
            x: (_: unknown, i = 0) => [0, Math.cos((i / 5) * Math.PI * 2) * 26],
            y: (_: unknown, i = 0) => [0, Math.sin((i / 5) * Math.PI * 2) * 26],
            opacity: [0, 1, 0], scale: [0.4, 1], duration: 1300, ease: 'outExpo', ...opts,
          }),
        ];
      case 'steam':
        utils.set('.ff-fx', { opacity: 0 });
        return animate('.ff-fx', { y: [0, -22], x: [0, 4, -4, 0], opacity: [0, 0.8, 0], scaleX: [1, 1.4], duration: 1600, delay: stagger(350, { start: opts.delay }), loop: true, ease: 'outSine', autoplay: false });
    }
  }, [c.mood, index]);

  return (
    <motion.div
      ref={root}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: EASE }}
      whileHover={{ y: -3 }}
      style={{
        borderRadius: 20,
        padding: 20,
        background: 'var(--bg-card)',
        boxShadow: `inset 0 0 0 1px ${c.color}22, 0 2px 12px rgba(45,26,31,0.06)`,
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start',
      }}
    >
      <div className="relative shrink-0 grid place-items-center" style={{ width: 48, height: 48 }}>
        <FX mood={c.mood} color={c.color} />
        <span className="ff-emoji relative" style={{ fontSize: 36, lineHeight: 1, display: 'inline-block' }}>{c.emoji}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="font-mono-custom" style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: c.color, marginBottom: 4 }}>
          {c.label}
        </div>
        <div style={{ fontWeight: 800, fontSize: 36, letterSpacing: '-0.02em', color: c.color, lineHeight: 1 }}>
          <CountUp end={c.value} />
        </div>
        <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 5, lineHeight: 1.4 }}>{c.note}</div>
      </div>
    </motion.div>
  );
}

function FX({ mood, color }: { mood: Mood; color: string }) {
  const base: React.CSSProperties = { position: 'absolute', pointerEvents: 'none' };
  switch (mood) {
    case 'night':
      return <>{[[2, 4], [40, 0], [44, 34]].map(([l, t], i) => (
        <span key={i} className="ff-fx" style={{ ...base, left: l, top: t, fontSize: 9, color }}>✦</span>
      ))}</>;
    case 'bloom':
      return <>{Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="ff-fx" style={{ ...base, left: 20, top: 20, width: 8, height: 8, borderRadius: '80% 0 80% 0', background: color, opacity: 0 }} />
      ))}</>;
    case 'steam':
      return <>{[12, 22, 32].map((l, i) => (
        <span key={i} className="ff-fx" style={{ ...base, left: l, top: -6, width: 3, height: 12, borderRadius: 3, background: 'rgba(45,26,31,0.25)', opacity: 0 }} />
      ))}</>;
    default:
      return null;
  }
}
