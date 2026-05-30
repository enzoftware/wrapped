'use client';
import { motion } from 'framer-motion';
import CountUp from '../CountUp';
import type { GlobalStats } from '../../lib/types';

interface FunFactsPanelProps {
  global: GlobalStats;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-10%' as const },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
});

export default function FunFactsPanel({ global }: FunFactsPanelProps) {
  const cards = [
    {
      emoji: '😂',
      label: 'Veces que se rieron',
      value: global.risas,
      note: 'jajaja, xd y jeje — literalmente contamos',
      color: '#e89040',
    },
    {
      emoji: '🌙',
      label: 'Mensajes de madrugada',
      value: global.mensajesNocturnos,
      note: 'Entre las 12am y las 3am — casi 8k noches sin dormir',
      color: '#6060c0',
    },
    {
      emoji: '💐',
      label: 'Cumplidos enviados',
      value: global.cumplidos,
      note: '"hermosa", "bonita", "guapo", "lindo" y más',
      color: '#c06090',
    },
    {
      emoji: '🍜',
      label: 'Conversaciones de comida',
      value: 1033,
      note: 'Restaurantes, hambre, qué comer y dónde',
      color: '#d06040',
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {cards.map((c, i) => (
        <motion.div
          key={c.label}
          {...fadeUp(i * 0.1)}
          style={{
            borderRadius: 20,
            padding: '20px 20px',
            background: 'var(--bg-card)',
            boxShadow: `inset 0 0 0 1px ${c.color}22, 0 2px 12px rgba(45,26,31,0.06)`,
            display: 'flex',
            gap: 16,
            alignItems: 'flex-start',
          }}
        >
          <div style={{ fontSize: 36, lineHeight: 1, flexShrink: 0 }}>{c.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, fontFamily: '"Roboto Mono", monospace', letterSpacing: '0.1em', textTransform: 'uppercase', color: c.color, marginBottom: 4 }}>
              {c.label}
            </div>
            <div style={{ fontWeight: 800, fontSize: 36, letterSpacing: '-0.02em', color: c.color, lineHeight: 1 }}>
              <CountUp end={c.value} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--sub)', marginTop: 5, lineHeight: 1.4 }}>
              {c.note}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
