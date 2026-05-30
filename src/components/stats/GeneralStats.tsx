'use client';
import { motion } from 'framer-motion';
import type { GlobalStats, YearStats } from '../../lib/types';
import StatCard from './StatCard';
import TopicsChart from './TopicsChart';
import HourlyActivity from './HourlyActivity';
import YearlyBarChart from './YearlyBarChart';
import PlansPanel from './PlansPanel';
import FunFactsPanel from './FunFactsPanel';
import CountUp from '../CountUp';
import Bokeh from '../Bokeh';

interface GeneralStatsProps {
  global: GlobalStats;
  years: YearStats[];
}

const EASE = [0.22, 1, 0.36, 1] as const;

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-10%' as const },
    transition: { duration: 0.55, delay, ease: EASE },
  };
}

function Panel({ children, id, accent = false }: { children: React.ReactNode; id?: string; accent?: boolean }) {
  return (
    <div
      id={id}
      style={{
        position: 'relative',
        padding: '60px 24px',
        maxWidth: 390,
        margin: '0 auto',
        background: accent ? 'linear-gradient(170deg, #fdeef3, var(--bg) 70%)' : 'transparent',
      }}
    >
      {children}
    </div>
  );
}

function Kicker({ children, color = 'var(--accent)' }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, letterSpacing: '0.26em', textTransform: 'uppercase', color }}>
      {children}
    </div>
  );
}

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <motion.h2
      {...fadeUp(0.1)}
      className="font-display italic"
      style={{ fontSize: 32, fontWeight: 800, margin: '12px 0 24px', lineHeight: 1, color: 'var(--ink)' }}
    >
      {children}
    </motion.h2>
  );
}

export default function GeneralStats({ global, years }: GeneralStatsProps) {
  const enzoTeAmo = global.enzo.teAmo;
  const katyTeAmo = global.katy.teAmo;
  const teAmoTotal = enzoTeAmo + katyTeAmo;

  const statCards = [
    { emoji: '💬', value: global.totalMessages, label: 'mensajes en total', big: true },
    { emoji: '📅', value: global.activeDays, label: 'días conversando' },
    { emoji: '❤️', value: global.teAmoTotal, label: '«te amo»', accent: 'var(--accent)' },
    { emoji: '📸', value: global.fotos, label: 'fotos' },
    { emoji: '🎵', value: global.audios, label: 'audios' },
    { emoji: '🎭', value: global.stickers, label: 'stickers' },
    { emoji: '📹', value: global.videollamadas, label: 'videollamadas' },
    { emoji: '🥺', value: global.teExtrano, label: '«te extraño»', accent: 'var(--accent-hi)' },
  ];

  return (
    <section id="stats" style={{ background: 'var(--bg)' }}>

      {/* ── 2.1  Intro ──────────────────────────────────────── */}
      <Panel accent>
        <Bokeh colors={['#f5c0cc', '#f0b0d8', '#c8b0e8']} />
        <div style={{ position: 'relative' }}>
          <motion.div {...fadeUp(0)}><Kicker>Estadísticas generales</Kicker></motion.div>
          <motion.h2
            {...fadeUp(0.1)}
            className="font-display italic"
            style={{ fontSize: 50, fontWeight: 900, margin: '16px 0 0', lineHeight: 0.96, color: 'var(--ink)' }}
          >
            6 años.<br />
            <span style={{ color: 'var(--accent)' }}>Una</span><br />
            conversación.
          </motion.h2>

          <motion.div
            {...fadeUp(0.25)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 36, fontFamily: '"Roboto Mono", monospace', fontSize: 13, color: 'var(--sub)' }}
          >
            <span style={{ color: 'var(--accent)' }}>{global.startDate}</span>
            <span style={{ flex: 1, height: 1, background: 'var(--hair)' }} />
            <span>{global.endDate}</span>
          </motion.div>

          <motion.div {...fadeUp(0.35)} style={{ display: 'flex', gap: 14, marginTop: 24 }}>
            {[{ n: global.totalDays, l: 'días en total' }, { n: global.activeDays, l: 'días con mensajes' }].map(({ n, l }) => (
              <div
                key={l}
                style={{ flex: 1, borderRadius: 20, padding: '18px', background: 'var(--bg-card)', boxShadow: 'inset 0 0 0 1px rgba(45,26,31,0.08)' }}
              >
                <div style={{ fontWeight: 800, fontSize: 32, letterSpacing: '-0.02em', color: 'var(--ink)' }}>
                  <CountUp end={n} />
                </div>
                <div style={{ color: 'var(--sub)', fontSize: 12.5, marginTop: 4 }}>{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </Panel>

      {/* ── 2.2  Metric cards ────────────────────────────────── */}
      <Panel>
        <motion.div {...fadeUp(0)}><Kicker>En total</Kicker></motion.div>
        <PanelTitle>Todo lo que se dijeron</PanelTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {statCards.map((c) => <StatCard key={c.label} {...c} />)}
        </div>
      </Panel>

      {/* ── 2.3  Topics ──────────────────────────────────────── */}
      <Panel>
        <motion.div {...fadeUp(0)}><Kicker>De qué hablaron</Kicker></motion.div>
        <PanelTitle>Los temas de 6 años</PanelTitle>
        <TopicsChart topics={global.topTopics.slice(0, 8)} />
      </Panel>

      {/* ── 2.4  Hourly ──────────────────────────────────────── */}
      <Panel>
        <motion.div {...fadeUp(0)}><Kicker>Ritmo del día</Kicker></motion.div>
        <PanelTitle>¿A qué hora hablan?</PanelTitle>
        <motion.p {...fadeUp(0.2)} style={{ color: 'var(--sub)', fontSize: 13, margin: '-12px 0 24px' }}>
          Pico entre las <b style={{ color: 'var(--accent)' }}>10am y 7pm</b>.
        </motion.p>
        <HourlyActivity data={global.hourly} />
      </Panel>

      {/* ── 2.5  Yearly bars ─────────────────────────────────── */}
      <Panel>
        <motion.div {...fadeUp(0)}><Kicker>Año por año</Kicker></motion.div>
        <PanelTitle>¿Quién escribió más?</PanelTitle>
        <YearlyBarChart years={years} />
      </Panel>

      {/* ── 2.6  Plans & outings ─────────────────────────────── */}
      <Panel>
        <motion.div {...fadeUp(0)}><Kicker>Sus planes</Kicker></motion.div>
        <PlansPanel global={global} />
      </Panel>

      {/* ── 2.7  Fun facts ───────────────────────────────────── */}
      <Panel>
        <motion.div {...fadeUp(0)}><Kicker>Datos curiosos</Kicker></motion.div>
        <PanelTitle>Lo que no sabían</PanelTitle>
        <FunFactsPanel global={global} />
      </Panel>

      {/* ── 2.8  Te amo battle ───────────────────────────────── */}
      <Panel accent>
        <Bokeh colors={['#f5c0cc', '#f0b0d8', '#b0c0f0']} />
        <div style={{ position: 'relative' }}>
          <motion.div {...fadeUp(0)}><Kicker>La batalla del «te amo»</Kicker></motion.div>
          <motion.h2 {...fadeUp(0.1)} className="font-display italic" style={{ fontSize: 30, fontWeight: 700, margin: '12px 0 40px', lineHeight: 1, color: 'var(--ink)' }}>
            ¿Quién lo dijo más?
          </motion.h2>

          <motion.div {...fadeUp(0.2)} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, color: 'var(--enzo)', letterSpacing: '0.1em' }}>ENZO</div>
              <div style={{ fontWeight: 800, fontSize: 50, color: 'var(--enzo)', letterSpacing: '-0.03em', lineHeight: 1, marginTop: 6 }}>
                <CountUp end={enzoTeAmo} />
              </div>
              <div style={{ fontSize: 20, marginTop: 4 }}>❤</div>
            </div>
            <div className="font-display italic" style={{ fontSize: 24, color: 'var(--faint)', padding: '0 6px 14px' }}>vs</div>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, color: 'var(--katy)', letterSpacing: '0.1em' }}>KATY</div>
              <div style={{ fontWeight: 800, fontSize: 50, color: 'var(--katy)', letterSpacing: '-0.03em', lineHeight: 1, marginTop: 6 }}>
                <CountUp end={katyTeAmo} />
              </div>
              <div style={{ fontSize: 20, marginTop: 4 }}>❤</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 0.8, ease: EASE }}
            style={{ transformOrigin: 'left' }}
          >
            <div style={{ display: 'flex', height: 16, borderRadius: 10, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(45,26,31,0.08)' }}>
              <div style={{ width: `${(enzoTeAmo / teAmoTotal) * 100}%`, background: 'linear-gradient(90deg, #5b7fd4, #7a9fe0)' }} />
              <div style={{ width: `${(katyTeAmo / teAmoTotal) * 100}%`, background: 'linear-gradient(90deg, #e07898, #d4687a)' }} />
            </div>
          </motion.div>

          <motion.p {...fadeUp(0.4)} style={{ textAlign: 'center', marginTop: 28, fontSize: 14, lineHeight: 1.5, color: 'var(--sub)' }}>
            Enzo lo dijo <b style={{ color: 'var(--ink)' }}>446 veces más</b>.<br />
            Juntos: <b style={{ color: 'var(--accent)' }}>3,292 «te amo»</b> en 6 años.
          </motion.p>

          {/* Chat bubbles */}
          <motion.div {...fadeUp(0.5)} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { text: '«Te amo»', from: 'enzo', note: '— dicho 1,869 veces' },
              { text: '«Te amo»', from: 'katy', note: '— dicho 1,423 veces' },
            ].map((b) => (
              <div key={b.from} style={{ display: 'flex', justifyContent: b.from === 'katy' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '72%', padding: '10px 14px',
                  borderRadius: b.from === 'enzo' ? '16px 16px 16px 4px' : '16px 16px 4px 16px',
                  background: b.from === 'enzo' ? 'rgba(91,127,212,0.12)' : 'rgba(212,104,122,0.12)',
                  border: `1px solid ${b.from === 'enzo' ? 'rgba(91,127,212,0.2)' : 'rgba(212,104,122,0.2)'}`,
                  fontSize: 14, color: b.from === 'enzo' ? 'var(--enzo)' : 'var(--accent)',
                }}>
                  {b.text}
                  <span style={{ display: 'block', fontSize: 11, opacity: 0.6, marginTop: 2 }}>{b.note}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Panel>
    </section>
  );
}
