'use client';
import { motion } from 'framer-motion';
import type { YearStats } from '../../lib/types';
import CountUp from '../CountUp';
import TopicsChart from '../stats/TopicsChart';
import { globalStats } from '../../data/stats';

interface WrapSlideProps {
  type: 'cover' | 'messages' | 'love' | 'media' | 'topics' | 'topDay' | 'highlight' | 'closing';
  data: YearStats;
  isActive: boolean;
}

function Kicker({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color }}>
      {children}
    </div>
  );
}

function fadeIn(delay = 0, isActive = true) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: isActive ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    transition: { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

export function WrapSlideInner({ type, data: y, isActive }: WrapSlideProps) {
  const inkColor = 'var(--ink)';
  const subColor = 'var(--sub)';

  const mediaItems = [
    { e: '📸', n: y.fotos,    l: 'fotos' },
    { e: '🎵', n: y.audios,   l: 'audios' },
    { e: '🎭', n: y.stickers, l: 'stickers' },
    { e: '📹', n: y.videos,   l: 'videos' },
  ];
  const mediaMax = Math.max(...mediaItems.map((i) => i.n));

  switch (type) {

    case 'cover':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', flex: 1 }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 60, lineHeight: 1 }}
          >
            {y.emoji}
          </motion.div>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display italic"
            style={{ fontSize: 110, fontWeight: 900, lineHeight: 0.88, marginTop: 10, color: y.color, textShadow: `0 4px 30px ${y.color}55` }}
          >
            {y.year}
          </motion.div>
          <motion.p {...fadeIn(0.35, isActive)} className="font-display italic" style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.3, margin: '18px auto 0', maxWidth: 260, color: inkColor }}>
            {y.theme}
          </motion.p>
          <motion.div {...fadeIn(0.5, isActive)} style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 12, marginTop: 18, color: subColor }}>
            {y.total.toLocaleString('en-US')} mensajes
          </motion.div>
        </div>
      );

    case 'messages': {
      const tot = y.enzo + y.katy;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          <motion.div {...fadeIn(0.1, isActive)} style={{ fontSize: 15, textAlign: 'center', color: subColor }}>
            Este año se dijeron
          </motion.div>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: 'center', margin: '6px 0 4px' }}
          >
            <span style={{ fontWeight: 800, fontSize: 70, letterSpacing: '-0.03em', color: y.color, textShadow: `0 3px 30px ${y.color}55` }}>
              <CountUp end={y.total} />
            </span>
          </motion.div>
          <div className="font-display italic" style={{ fontSize: 22, textAlign: 'center', color: inkColor }}>mensajes</div>

          {/* Chat bubbles */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28, marginBottom: 16 }}>
            {[
              { name: 'Enzo', val: y.enzo, from: 'out' },
              { name: 'Katy', val: y.katy, from: 'in' },
            ].map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, x: p.from === 'out' ? 20 : -20 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.3 + i * 0.12 }}
                style={{ display: 'flex', justifyContent: p.from === 'out' ? 'flex-end' : 'flex-start' }}
              >
                <div style={{
                  padding: '10px 16px',
                  borderRadius: p.from === 'out' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: p.from === 'out' ? y.color : 'rgba(45,26,31,0.08)',
                  maxWidth: '72%',
                }}>
                  <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: p.from === 'out' ? 'rgba(255,255,255,0.8)' : subColor }}>
                    {p.name}
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 22, color: p.from === 'out' ? '#fff' : inkColor }}>
                    {p.val.toLocaleString('en-US')}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'flex', height: 16, borderRadius: 10, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(45,26,31,0.1)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={isActive ? { width: `${(y.enzo / tot) * 100}%` } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: 'var(--enzo)', borderRadius: '10px 0 0 10px' }}
            />
            <motion.div
              initial={{ width: 0 }}
              animate={isActive ? { width: `${(y.katy / tot) * 100}%` } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: 'var(--katy)', borderRadius: '0 10px 10px 0' }}
            />
          </div>
        </div>
      );
    }

    case 'love':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1 }}>
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="animate-pulse-heart"
            style={{ fontSize: 90, color: y.color, lineHeight: 1, textShadow: `0 0 40px ${y.color}66` }}
          >
            ♥
          </motion.div>
          <motion.div {...fadeIn(0.25, isActive)} style={{ marginTop: 24, fontSize: 16, color: subColor }}>
            Se dijeron «te amo»
          </motion.div>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontWeight: 800, fontSize: 84, lineHeight: 1, letterSpacing: '-0.03em', margin: '4px 0', color: inkColor }}
          >
            {isActive ? <CountUp end={y.teAmo} duration={1200} /> : 0}
          </motion.div>
          <div className="font-display italic" style={{ fontSize: 22, color: inkColor }}>veces</div>
          <motion.div
            {...fadeIn(0.5, isActive)}
            style={{ marginTop: 24, padding: '10px 18px', borderRadius: 30, background: `${y.color}18`, border: `1px solid ${y.color}35`, fontSize: 13, color: y.color, fontWeight: 600 }}
          >
            ≈ {(y.teAmo / 365).toFixed(1)} veces al día · todos los días ❤
          </motion.div>
        </div>
      );

    case 'media':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <motion.div {...fadeIn(0.1, isActive)} style={{ marginTop: 16 }}>
            <Kicker color={subColor}>Lo que se enviaron</Kicker>
            <h3 className="font-display italic" style={{ fontSize: 28, fontWeight: 700, margin: '6px 0 0', color: inkColor }}>en {y.year}</h3>
          </motion.div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, flex: 1 }}>
            {mediaItems.map((it, i) => (
              <motion.div
                key={it.l}
                initial={{ opacity: 0, x: -20 }}
                animate={isActive ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.15 + i * 0.1 }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
                  <span style={{ fontSize: 22 }}>{it.e}</span>
                  <span style={{ fontWeight: 800, fontSize: 30, letterSpacing: '-0.02em', color: inkColor }}>
                    {isActive ? <CountUp end={it.n} duration={1000} /> : 0}
                  </span>
                  <span style={{ fontSize: 14, color: subColor }}>{it.l}</span>
                </div>
                <div style={{ height: 6, borderRadius: 4, marginTop: 8, background: 'rgba(45,26,31,0.08)', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isActive ? { width: `${(it.n / mediaMax) * 100}%` } : { width: 0 }}
                    transition={{ duration: 0.7, delay: 0.2 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', background: y.color, borderRadius: 4 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      );

    case 'topics': {
      const top5 = globalStats.topTopics.slice(0, 5);
      return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <motion.div {...fadeIn(0.1, isActive)} style={{ marginTop: 16 }}>
            <Kicker color={subColor}>De qué hablaron más</Kicker>
            <h3 className="font-display italic" style={{ fontSize: 28, fontWeight: 700, margin: '6px 0 0', color: inkColor }}>sus 5 temas</h3>
          </motion.div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: 8 }}>
            {isActive && <TopicsChart topics={top5} yearColor={y.color} />}
          </div>
          <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 10, color: 'var(--faint)', marginTop: 4 }}>
            * distribución estimada — temas globales
          </div>
        </div>
      );
    }

    case 'topDay':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1 }}>
          <motion.div {...fadeIn(0.1, isActive)} style={{ fontSize: 15, color: subColor }}>Su día más intenso</motion.div>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="font-display italic"
            style={{ fontSize: 42, fontWeight: 900, color: y.color, lineHeight: 1.1, margin: '14px 0 24px' }}
          >
            {y.topDay.date}
          </motion.div>

          {/* Chat bubble style */}
          <motion.div {...fadeIn(0.35, isActive)}>
            <div style={{ padding: '16px 24px', borderRadius: '20px 20px 20px 4px', background: y.color, display: 'inline-block' }}>
              <div style={{ fontWeight: 800, fontSize: 68, lineHeight: 1, letterSpacing: '-0.03em', color: '#fff' }}>
                {isActive ? <CountUp end={y.topDay.messages} duration={1200} /> : 0}
              </div>
              <div className="font-display italic" style={{ fontSize: 17, color: 'rgba(255,255,255,0.85)', marginTop: 4 }}>
                mensajes en un solo día
              </div>
            </div>
          </motion.div>

          <motion.p {...fadeIn(0.6, isActive)} style={{ marginTop: 24, fontSize: 14, fontStyle: 'italic', color: subColor }}>
            ¿Qué estarían tramando?
          </motion.p>
        </div>
      );

    case 'highlight':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ fontSize: 60 }}
          >
            {y.emoji}
          </motion.div>
          <motion.p {...fadeIn(0.25, isActive)} className="font-display italic" style={{ fontSize: 25, fontWeight: 600, lineHeight: 1.3, margin: '18px 0 0', color: inkColor }}>
            {y.highlight}
          </motion.p>
          <motion.div
            {...fadeIn(0.45, isActive)}
            style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid rgba(45,26,31,0.10)', fontSize: 13.5, lineHeight: 1.5, color: subColor }}
          >
            {y.funFact}
          </motion.div>
          {/* outro bubble */}
          <motion.div {...fadeIn(0.65, isActive)} style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <div style={{
              padding: '10px 16px', fontSize: 13,
              borderRadius: '16px 16px 4px 16px',
              background: `${y.color}18`, border: `1px solid ${y.color}30`, color: y.color,
            }}>
              ✓✓ ese fue {y.year}
            </div>
          </motion.div>
        </div>
      );

    case 'closing': {
      const g = globalStats;
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1 }}>
          <motion.p {...fadeIn(0.1, isActive)} className="font-display italic" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.15, margin: 0, color: inkColor }}>
            Y la historia<br />continúa…
          </motion.p>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={isActive ? { scale: 1, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontWeight: 800, fontSize: 58, letterSpacing: '-0.03em', color: y.color, textShadow: `0 4px 30px ${y.color}55`, marginTop: 32 }}
          >
            {isActive ? <CountUp end={g.totalMessages} duration={2000} /> : 0}
          </motion.div>
          <div className="font-display italic" style={{ fontSize: 20, color: inkColor }}>mensajes en total</div>
          <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 12, color: 'var(--faint)', marginTop: 10 }}>
            desde el {g.startDate}
          </div>
          <motion.p {...fadeIn(0.9, isActive)} style={{ marginTop: 36, fontSize: 15, fontStyle: 'italic', maxWidth: 240, color: inkColor }}>
            6 años. Cada día, sin falta. ♥
          </motion.p>
        </div>
      );
    }

    default:
      return null;
  }
}
