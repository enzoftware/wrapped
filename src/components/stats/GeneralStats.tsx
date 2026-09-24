'use client';
import { motion } from 'motion/react';
import { inView } from 'motion';
import { animate, createTimeline, splitText, stagger, utils } from 'animejs';
import type { GlobalStats, YearStats } from '../../lib/types';
import StatCard from './StatCard';
import TopicsChart from './TopicsChart';
import HourlyActivity from './HourlyActivity';
import YearlyBarChart from './YearlyBarChart';
import PlansPanel from './PlansPanel';
import FunFactsPanel from './FunFactsPanel';
import CountUp from '../CountUp';
import Bokeh from '../Bokeh';
import { EASE, useAnime, useAnimeInView } from '../../lib/anim';

interface GeneralStatsProps {
  global: GlobalStats;
  years: YearStats[];
}

function fadeUp(delay = 0) {
  return {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-10%' as const },
    transition: { duration: 0.55, delay, ease: EASE },
  };
}

function Panel({ children, id, accent = false, className = '' }: { children: React.ReactNode; id?: string; accent?: boolean; className?: string }) {
  return (
    <div
      id={id}
      className={`relative px-5 py-14 lg:px-10 lg:py-16 ${accent ? 'lg:rounded-[32px] lg:my-6 overflow-hidden' : ''} ${className}`}
      style={{ background: accent ? 'linear-gradient(170deg, #fdeef3, var(--bg) 70%)' : 'transparent' }}
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
      className="font-display italic text-[32px] lg:text-[40px]"
      style={{ fontWeight: 800, margin: '12px 0 24px', lineHeight: 1, color: 'var(--ink)' }}
    >
      {children}
    </motion.h2>
  );
}

export default function GeneralStats({ global, years }: GeneralStatsProps) {
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
      <div className="mx-auto w-full max-w-[440px] lg:max-w-[1100px] lg:px-8 lg:grid lg:grid-cols-2 lg:gap-x-8">

        {/* ── 2.1  Intro ──────────────────────────────────────── */}
        <Panel accent className="lg:col-span-2">
          <Bokeh colors={['#f5c0cc', '#f0b0d8', '#c8b0e8']} />
          <Intro global={global} />
        </Panel>

        {/* ── 2.2  Metric cards ────────────────────────────────── */}
        <Panel className="lg:col-span-2">
          <motion.div {...fadeUp(0)}><Kicker>En total</Kicker></motion.div>
          <PanelTitle>Todo lo que se dijeron</PanelTitle>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {statCards.map((c, i) => <StatCard key={c.label} index={i} {...c} />)}
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
          <motion.p {...fadeUp(0.2)} style={{ color: 'var(--sub)', fontSize: 13, margin: '-12px 0 12px' }}>
            Pico entre las <b style={{ color: 'var(--accent)' }}>10am y 7pm</b>. Toca una barra para ver la hora.
          </motion.p>
          <HourlyActivity data={global.hourly} />
        </Panel>

        {/* ── 2.5  Yearly bars ─────────────────────────────────── */}
        <Panel className="lg:col-span-2">
          <motion.div {...fadeUp(0)}><Kicker>Año por año</Kicker></motion.div>
          <PanelTitle>¿Quién escribió más?</PanelTitle>
          <YearlyBarChart years={years} />
        </Panel>

        {/* ── 2.6  Plans & outings ─────────────────────────────── */}
        <Panel className="lg:col-span-2">
          <motion.div {...fadeUp(0)} style={{ marginBottom: 20 }}><Kicker>Sus planes</Kicker></motion.div>
          <PlansPanel global={global} />
        </Panel>

        {/* ── 2.7  Fun facts ───────────────────────────────────── */}
        <Panel className="lg:col-span-2">
          <motion.div {...fadeUp(0)}><Kicker>Datos curiosos</Kicker></motion.div>
          <PanelTitle>Lo que no sabían</PanelTitle>
          <FunFactsPanel global={global} />
        </Panel>

        {/* ── 2.8  Te amo battle ───────────────────────────────── */}
        <Panel accent className="lg:col-span-2">
          <Bokeh colors={['#f5c0cc', '#f0b0d8', '#b0c0f0']} />
          <TeAmoBattle global={global} />
        </Panel>
      </div>
    </section>
  );
}

/* ── Intro: the headline assembles word by word ─────────────────────── */

function Intro({ global }: { global: GlobalStats }) {
  const root = useAnime<HTMLDivElement>((el) => {
    const split = splitText(el.querySelector<HTMLElement>('.intro-title')!, { words: { wrap: 'clip' } });
    utils.set('.intro-title', { opacity: 1 });
    utils.set(split.words, { y: '100%' });
    utils.set('.intro-line', { scaleX: 0 });
    const tl = createTimeline({ autoplay: false, defaults: { ease: 'outExpo' } })
      .add(split.words, { y: '0%', duration: 900, delay: stagger(120) }, 100)
      .add('.intro-line', { scaleX: 1, duration: 1200 }, 500);
    const stop = inView(el, () => { tl.play(); }, { amount: 0.3 });
    return () => { stop(); split.revert(); };
  });

  return (
    <div ref={root} className="relative lg:grid lg:grid-cols-2 lg:gap-16 lg:items-end">
      <div>
        <motion.div {...fadeUp(0)}><Kicker>Estadísticas generales</Kicker></motion.div>
        <h2
          className="intro-title pre-anim font-display italic text-[50px] lg:text-[76px]"
          style={{ fontWeight: 900, margin: '16px 0 0', lineHeight: 0.96, color: 'var(--ink)' }}
        >
          6 años.<br />
          <span style={{ color: 'var(--accent)' }}>Una</span><br />
          conversación.
        </h2>
      </div>

      <div>
        <motion.div
          {...fadeUp(0.25)}
          style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 36, fontFamily: '"Roboto Mono", monospace', fontSize: 13, color: 'var(--sub)' }}
        >
          <span style={{ color: 'var(--accent)' }}>{global.startDate}</span>
          <span className="intro-line origin-left" style={{ flex: 1, height: 1, background: 'var(--accent)', opacity: 0.4 }} />
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
    </div>
  );
}

/* ── Te amo battle: a tug of war with hearts flying to the middle ────── */

const VOLLEY = 8;

function TeAmoBattle({ global }: { global: GlobalStats }) {
  const enzoTeAmo = global.enzo.teAmo;
  const katyTeAmo = global.katy.teAmo;
  const teAmoTotal = enzoTeAmo + katyTeAmo;
  const enzoPct = Math.round((enzoTeAmo / teAmoTotal) * 1000) / 10;

  const root = useAnimeInView<HTMLDivElement>((el) => {
    const rope = el.querySelector<HTMLElement>('.tug-rope')!;
    const w = rope.offsetWidth;
    utils.set('.tug-enzo', { width: '50%' });
    utils.set('.tug-knot', { left: '50%' });

    return [
      // The rope sways back and forth before settling on the real split.
      createTimeline({ autoplay: false, delay: 300 })
        .add(['.tug-knot'], { left: ['50%', '42%', '58%', '46%', `${enzoPct}%`], duration: 2200, ease: 'inOutSine' }, 0)
        .add('.tug-enzo', { width: ['50%', '42%', '58%', '46%', `${enzoPct}%`], duration: 2200, ease: 'inOutSine' }, 0)
        .add('.tug-knot', { scale: [1, 1.4, 1], duration: 500, ease: 'outBack(3)' }, '-=100'),
      // Volleys of hearts from each side meeting in the middle.
      animate('.volley-enzo', {
        x: [0, w * 0.46], y: () => [0, utils.random(-18, 18)], opacity: [0, 1, 0], scale: [0.6, 1.1],
        duration: 1400, delay: stagger(260, { start: 400 }), loop: true, loopDelay: 800, ease: 'outQuad', autoplay: false,
      }),
      animate('.volley-katy', {
        x: [0, -w * 0.46], y: () => [0, utils.random(-18, 18)], opacity: [0, 1, 0], scale: [0.6, 1.1],
        duration: 1400, delay: stagger(260, { start: 530 }), loop: true, loopDelay: 800, ease: 'outQuad', autoplay: false,
      }),
    ];
  }, [enzoPct]);

  return (
    <div ref={root} className="relative mx-auto max-w-[640px]">
      <motion.div {...fadeUp(0)}><Kicker>La batalla del «te amo»</Kicker></motion.div>
      <motion.h2 {...fadeUp(0.1)} className="font-display italic text-[30px] lg:text-[44px]" style={{ fontWeight: 700, margin: '12px 0 40px', lineHeight: 1, color: 'var(--ink)' }}>
        ¿Quién lo dijo más?
      </motion.h2>

      <motion.div {...fadeUp(0.2)} style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22 }}>
        {[
          { who: 'ENZO', n: enzoTeAmo, c: 'var(--enzo)' },
          null,
          { who: 'KATY', n: katyTeAmo, c: 'var(--katy)' },
        ].map((p, i) => p ? (
          <div key={p.who} style={{ textAlign: 'center', flex: 1 }}>
            <div className="font-mono-custom" style={{ fontSize: 11, color: p.c, letterSpacing: '0.1em' }}>{p.who}</div>
            <div className="text-[50px] lg:text-[64px]" style={{ fontWeight: 800, color: p.c, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 6 }}>
              <CountUp end={p.n} />
            </div>
          </div>
        ) : (
          <div key={i} className="font-display italic" style={{ fontSize: 24, color: 'var(--faint)', padding: '0 6px 14px' }}>vs</div>
        ))}
      </motion.div>

      {/* tug-of-war rope */}
      <div className="tug-rope relative" style={{ height: 44 }}>
        {Array.from({ length: VOLLEY }, (_, i) => (
          <span key={`e${i}`} className="volley-enzo absolute" style={{ left: 0, top: 10, fontSize: 16, color: 'var(--enzo)', opacity: 0 }} aria-hidden>♥</span>
        ))}
        {Array.from({ length: VOLLEY }, (_, i) => (
          <span key={`k${i}`} className="volley-katy absolute" style={{ right: 0, top: 10, fontSize: 16, color: 'var(--katy)', opacity: 0 }} aria-hidden>♥</span>
        ))}
        <div className="absolute left-0 right-0" style={{ top: 14, display: 'flex', height: 16, borderRadius: 10, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(45,26,31,0.08)' }}>
          <div className="tug-enzo" style={{ width: `${enzoPct}%`, background: 'linear-gradient(90deg, #5b7fd4, #7a9fe0)' }} />
          <div style={{ flex: 1, background: 'linear-gradient(90deg, #e07898, #d4687a)' }} />
        </div>
        <div
          className="tug-knot absolute grid place-items-center"
          style={{ left: `${enzoPct}%`, top: 6, width: 32, height: 32, marginLeft: -16, borderRadius: '50%', background: '#fff', boxShadow: '0 4px 14px rgba(45,26,31,0.18)', fontSize: 15, zIndex: 2 }}
        >
          ❤️
        </div>
      </div>

      <motion.p {...fadeUp(0.4)} style={{ textAlign: 'center', marginTop: 28, fontSize: 14, lineHeight: 1.5, color: 'var(--sub)' }}>
        Enzo lo dijo <b style={{ color: 'var(--ink)' }}>{(enzoTeAmo - katyTeAmo).toLocaleString('en-US')} veces más</b>.<br />
        Juntos: <b style={{ color: 'var(--accent)' }}>{teAmoTotal.toLocaleString('en-US')} «te amo»</b> en 6 años.
      </motion.p>

      {/* Chat bubbles */}
      <motion.div {...fadeUp(0.5)} style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          { text: '«Te amo»', from: 'enzo', note: `— dicho ${enzoTeAmo.toLocaleString('en-US')} veces` },
          { text: '«Te amo»', from: 'katy', note: `— dicho ${katyTeAmo.toLocaleString('en-US')} veces` },
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
  );
}
