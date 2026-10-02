'use client';
import { animate, createDrawable, createTimeline, splitText, stagger, steps, utils } from 'animejs';
import type { YearStats } from '../../lib/types';
import CountUp from '../CountUp';
import { globalStats, yearStats } from '../../data/stats';
import { useAnime } from '../../lib/anim';
import { centered, column, INK, MONO, oneDecimal, revealIn, SlideHeader, SUB } from './slideKit';

// Each year's two signature slides: a different question, and a different
// chart, for every year — so no two chapters of the wrap look alike.

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);
const fmt = (n: number) => n.toLocaleString('en-US');
const MONTH_INITIALS = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
const MONTHS_SHORT = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];

/** A per-active-day rate for every year, so partial years compare fairly. */
const ratePerYear = (pick: (y: YearStats) => number) =>
  yearStats.map((ys) => ({ year: ys.year, color: ys.color, rate: pick(ys) / ys.signals.activeDays }));

/**
 * Rotating SVG groups are drawn symmetric around their pivot (an invisible
 * circle pads the box), so the pivot is simply the box's center — `view-box`
 * origins resolve differently across engines.
 */
const SPIN: React.CSSProperties = { transformBox: 'fill-box', transformOrigin: '50% 50%' };

const hourLabel = (h: number) => `${h % 12 || 12} ${h < 12 ? 'am' : 'pm'}`;

function Note({ children, y }: { children: React.ReactNode; y: YearStats }) {
  return (
    <div className="rv pre-anim" style={{ marginTop: 14, padding: '12px 16px', borderRadius: 16, fontSize: 13.5, lineHeight: 1.45, color: INK, background: `${y.color}12`, border: `1px solid ${y.color}2a` }}>
      {children}
    </div>
  );
}

/* ── 2020 · Night — a 24-hour clock whose dark side is the busy one ───── */

const NIGHT_HOURS = [20, 21, 22, 23, 0, 1, 2, 3];

export function NightSlide({ y }: { y: YearStats }) {
  const hours = y.signals.hourly;
  const peak = hours.indexOf(Math.max(...hours));
  const max = hours[peak];
  const nightShare = Math.round((sum(NIGHT_HOURS.map((h) => hours[h])) / sum(hours)) * 100);
  const S = 240;
  const C = S / 2;
  const R0 = 42;
  const LEN = 70;
  const SHADE = R0 + LEN + 8;

  const root = useAnime<HTMLDivElement>(() => {
    revealIn(0);
    utils.set('.nc-bar', { scaleY: 0 });
    utils.set('.nc-peak', { opacity: 0, scale: 0.6 });
    createTimeline({ defaults: { ease: 'outExpo' } })
      .add('.nc-bar', { scaleY: 1, duration: 900, delay: stagger(40) }, 300)
      .add('.nc-hand', { rotate: [0, peak * 15], duration: 1700, ease: 'inOutQuart' }, 500)
      .add('.nc-peak', { opacity: 1, scale: 1, duration: 600, ease: 'outBack(2)' }, 2100);
    animate('.nc-star', { opacity: [0.15, 0.9], duration: () => utils.random(900, 1700), delay: () => utils.random(0, 1200), loop: true, alternate: true, ease: 'inOutSine' });
  }, [y.year]);

  return (
    <div ref={root} className="sig-slide" style={column}>
      <SlideHeader kicker="Noches en vela" title="Lo suyo era la noche" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox={`-26 -26 ${S + 52} ${S + 52}`} style={{ width: '100%', maxWidth: 290, overflow: 'visible' }} aria-hidden>
          {/* the night hours (8 pm → 4 am) softly shaded */}
          <path d={`M ${C} ${C} L ${C - SHADE * Math.sin(Math.PI / 3)} ${C - SHADE / 2} A ${SHADE} ${SHADE} 0 0 1 ${C + SHADE * Math.sin(Math.PI / 3)} ${C - SHADE / 2} Z`} fill={`${y.color}12`} />
          {[[-8, 18], [S + 4, 30], [S - 10, S + 6], [6, S - 4], [C + 30, -14]].map(([sx, sy], i) => (
            <text key={i} className="nc-star" x={sx} y={sy} fontSize={i % 2 ? 9 : 12} fill={y.color} opacity={0.3}>✦</text>
          ))}
          <circle cx={C} cy={C} r={R0 - 6} fill="#fff" opacity={0.7} />
          {hours.map((v, h) => {
            const len = Math.max(4, (v / max) * LEN);
            const night = NIGHT_HOURS.includes(h);
            return (
              <g key={h} transform={`rotate(${h * 15} ${C} ${C})`}>
                <rect
                  className="nc-bar"
                  x={C - 4} y={C - R0 - len} width={8} height={len} rx={4}
                  fill={h === peak ? y.color : night ? `${y.color}bb` : 'rgba(45,26,31,0.14)'}
                  style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }}
                />
              </g>
            );
          })}
          {[0, 6, 12, 18].map((h) => {
            const a = (h * 15 * Math.PI) / 180;
            const r = R0 + LEN + 16;
            return (
              <text key={h} x={C + r * Math.sin(a)} y={C - r * Math.cos(a) + 4} textAnchor="middle" fontFamily={MONO} fontSize={10} fill="rgba(45,26,31,0.45)">
                {hourLabel(h)}
              </text>
            );
          })}
          <g className="nc-hand" style={SPIN}>
            <circle cx={C} cy={C} r={R0 - 10} fill="none" />
            <line x1={C} y1={C} x2={C} y2={C - R0 + 10} stroke={INK} strokeWidth={3} strokeLinecap="round" />
          </g>
          <circle cx={C} cy={C} r={5} fill={INK} />
          <text x={C} y={C + 24} textAnchor="middle" fontSize={16}>🌙</text>
        </svg>
        <div className="nc-peak" style={{ marginTop: 4, padding: '7px 14px', borderRadius: 30, fontFamily: MONO, fontSize: 12, color: '#fff', background: y.color, boxShadow: `0 6px 18px ${y.color}55` }}>
          su hora pico: {hourLabel(peak)} · {fmt(max)} mensajes
        </div>
      </div>
      <div className="rv pre-anim" style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontWeight: 800, fontSize: 52, letterSpacing: '-0.03em', lineHeight: 1, color: y.color }}>
          <CountUp end={nightShare} duration={1400} delay={900} />%
        </span>
        <span style={{ fontSize: 14, lineHeight: 1.35, color: SUB }}>de sus mensajes llegaron entre las 8 pm y las 4 am</span>
      </div>
    </div>
  );
}

/* ── 2022 · Laughs — their laughs jiggle, and the year takes the trophy ── */

export function LaughsSlide({ y }: { y: YearStats }) {
  const rates = ratePerYear((ys) => ys.signals.risas);
  const mine = rates.find((r) => r.year === y.year)!;
  const best = Math.max(...rates.map((r) => r.rate));
  const styles = y.signals.laughStyles.filter((l) => l.count >= 10).sort((a, b) => b.count - a.count);
  const top = styles[0]?.count ?? 1;

  const root = useAnime<HTMLDivElement>(() => {
    revealIn(0);
    utils.set('.lg-word', { opacity: 0, scale: 0.2 });
    utils.set('.lg-bar', { width: '0%' });
    createTimeline({ defaults: { ease: 'outExpo' } })
      .add('.lg-word', { opacity: 1, scale: 1, duration: 900, ease: 'outElastic(1, .55)', delay: stagger(160) }, 250)
      .add('.lg-bar', { width: (b?: unknown) => (b as HTMLElement).dataset.w + '%', duration: 1000, delay: stagger(90) }, 900)
      .add('.lg-cup', { opacity: [0, 1], scale: [0.3, 1], rotate: [-40, 0], duration: 800, ease: 'outBack(2.5)' }, 1700);
    // ja-ja-ja: every word shakes with laughter, each to its own rhythm.
    animate('.lg-shake', { rotate: [-5, 5], y: [0, -3], duration: () => utils.random(180, 260), loop: true, alternate: true, ease: 'inOutSine', delay: 1200 });
  }, [y.year]);

  return (
    <div ref={root} className="sig-slide" style={column}>
      <SlideHeader kicker="El año de las risas" title={<>Se rieron <span style={{ color: y.color }}>{oneDecimal(mine.rate)}</span> veces al día</>} />
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', gap: '10px 14px', padding: '8px 0' }}>
        {styles.map((l, i) => (
          <div key={l.label} className="lg-word" style={{ display: 'inline-block' }}>
            <span
              className="lg-shake"
              style={{
                display: 'inline-flex', alignItems: 'baseline', gap: 6, padding: '8px 14px',
                borderRadius: i % 2 ? '18px 18px 18px 4px' : '18px 18px 4px 18px',
                background: i === 0 ? y.color : '#fff', color: i === 0 ? '#fff' : INK,
                boxShadow: i === 0 ? `0 8px 22px ${y.color}55` : '0 3px 12px rgba(45,26,31,0.08)',
              }}
            >
              <b style={{ fontSize: 16 + 22 * Math.sqrt(l.count / top), letterSpacing: '-0.02em' }}>{l.label}</b>
              <span style={{ fontFamily: MONO, fontSize: 11, opacity: 0.75 }}>{fmt(l.count)}</span>
            </span>
          </div>
        ))}
      </div>
      <div className="rv pre-anim" style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: SUB, marginBottom: 8 }}>
        risas por día, cada año
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {rates.map((r) => {
          const me = r.year === y.year;
          return (
            <div key={r.year} style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: MONO, fontSize: 11 }}>
              <span style={{ width: 32, color: me ? y.color : SUB, fontWeight: me ? 700 : 400 }}>{r.year}</span>
              <div style={{ flex: 1, height: me ? 12 : 8, borderRadius: 6, background: 'rgba(45,26,31,0.07)', overflow: 'hidden' }}>
                <div className="lg-bar" data-w={((r.rate / best) * 100).toFixed(1)} style={{ width: `${(r.rate / best) * 100}%`, height: '100%', borderRadius: 6, background: me ? y.color : 'rgba(45,26,31,0.22)' }} />
              </div>
              <span style={{ width: 52, textAlign: 'right', color: me ? INK : SUB, fontWeight: me ? 700 : 400 }}>
                {oneDecimal(r.rate)}{me && r.rate === best && <span className="lg-cup" style={{ display: 'inline-block', marginLeft: 4 }}>🏆</span>}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── 2022 · Reply — two stopwatches race to the answer ──────────────── */

const fmtSeconds = (s: number) => (s < 60 ? `${s} s` : `${Math.floor(s / 60)} min${s % 60 ? ` ${s % 60} s` : ''}`);

function Stopwatch({ name, seconds, color }: { name: string; seconds: number; color: string }) {
  const R = 52;
  return (
    <div className="rw-watch" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <svg viewBox="-64 -76 128 140" style={{ width: 132, overflow: 'visible' }} aria-hidden>
        <rect x={-7} y={-74} width={14} height={10} rx={3} fill={color} />
        <circle r={R + 6} fill="#fff" stroke="rgba(45,26,31,0.12)" strokeWidth={2} />
        {Array.from({ length: 60 }, (_, i) => (
          <line key={i} x1={0} y1={-R} x2={0} y2={-R + (i % 5 ? 4 : 9)} stroke={i % 5 ? 'rgba(45,26,31,0.2)' : 'rgba(45,26,31,0.45)'} strokeWidth={i % 5 ? 1 : 2} transform={`rotate(${i * 6})`} />
        ))}
        <circle className="rw-arc" r={R - 14} fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={10} transform="rotate(-90)" />
        <g className="rw-hand" data-deg={(seconds / 60) * 360} style={SPIN}>
          <circle r={R - 6} fill="none" />
          <line x1={0} y1={8} x2={0} y2={-R + 6} stroke={color} strokeWidth={3} strokeLinecap="round" />
        </g>
        <circle r={5} fill={color} />
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color }}>{name}</div>
        <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', color: INK }}>{fmtSeconds(seconds)}</div>
      </div>
    </div>
  );
}

export function ReplySlide({ y }: { y: YearStats }) {
  const { enzo, katy } = y.signals.replySeconds;
  const avg = (ys: YearStats) => (ys.signals.replySeconds.enzo + ys.signals.replySeconds.katy) / 2;
  const slowest = yearStats.reduce((a, b) => (avg(b) > avg(a) ? b : a));
  const fastest = yearStats.reduce((a, b) => (avg(b) < avg(a) ? b : a));
  const times = slowest.year !== y.year ? avg(slowest) / avg(y) : 0;

  const root = useAnime<HTMLDivElement>((el) => {
    revealIn(0);
    utils.set('.rw-watch', { opacity: 0, y: 30 });
    const tl = createTimeline({ defaults: { ease: 'outExpo' } })
      .add('.rw-watch', { opacity: 1, y: 0, duration: 800, delay: stagger(150) }, 200);
    el.querySelectorAll<SVGGElement>('.rw-hand').forEach((hand, i) => {
      tl.add(hand, { rotate: [0, Number(hand.dataset.deg)], duration: 1800, ease: 'inOutCubic' }, 700 + i * 150);
    });
    // The watch "ticks" once the time is in — a little click of the crown.
    tl.add('.rw-watch', { scale: [1, 1.05, 1], duration: 400, delay: stagger(150), ease: 'inOutSine' }, 2700);
  }, [y.year]);

  return (
    <div ref={root} className="sig-slide" style={column}>
      <SlideHeader kicker="Respondían al toque" title={fastest.year === y.year ? 'Su año más rápido' : 'Así de rápido respondían'} />
      <p className="rv pre-anim" style={{ margin: '10px 0 0', fontSize: 14, lineHeight: 1.4, color: SUB }}>
        Lo que tardaba cada uno, normalmente, en contestarle al otro:
      </p>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
        <Stopwatch name="Enzo" seconds={enzo} color="var(--enzo)" />
        <Stopwatch name="Katy" seconds={katy} color="var(--katy)" />
      </div>
      {times > 1.2 && (
        <Note y={y}>
          <b style={{ color: y.color }}>{oneDecimal(times)}× más rápido</b> que en {slowest.year}, cuando tardaban {fmtSeconds(Math.round(avg(slowest)))} en promedio.
        </Note>
      )}
      <div className="rv pre-anim" style={{ fontFamily: MONO, fontSize: 10, color: 'var(--faint)', marginTop: 10 }}>
        * mediana entre un mensaje y la respuesta del otro, dentro de una misma charla
      </div>
    </div>
  );
}

/* ── 2023 · Calendar — the whole year, one square per day ───────────── */

export function CalendarSlide({ y }: { y: YearStats }) {
  const daily = y.signals.daily ?? [];
  const active = daily.filter((n) => n > 0).length;
  const recordIdx = daily.indexOf(Math.max(...daily));
  const sorted = daily.filter((n) => n > 0).sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] || 1;
  const level = (n: number) => (n === 0 ? 0 : n < median * 0.6 ? 1 : n < median ? 2 : n < median * 1.6 ? 3 : 4);
  const fills = ['transparent', `${y.color}2a`, `${y.color}5c`, `${y.color}a6`, y.color];
  const topMonth = y.signals.monthly.indexOf(Math.max(...y.signals.monthly));

  const months = Array.from({ length: 12 }, (_, m) => {
    const first = new Date(y.year, m, 1);
    const start = Math.round((first.getTime() - new Date(y.year, 0, 1).getTime()) / 86_400_000);
    const length = new Date(y.year, m + 1, 0).getDate();
    return { m, start, length, offset: (first.getDay() + 6) % 7 }; // weeks start on Monday
  });

  const root = useAnime<HTMLDivElement>(() => {
    revealIn(0);
    utils.set('.cd-cell', { opacity: 0, scale: 0.2 });
    utils.set('.cd-record-tag', { opacity: 0, y: 6 });
    createTimeline({ defaults: { ease: 'outExpo' } })
      .add('.cd-cell', { opacity: 1, scale: 1, duration: 500, delay: stagger(3.5) }, 300)
      .add('.cd-record-tag', { opacity: 1, y: 0, duration: 600 }, 1800);
    animate('.cd-record', { scale: [1, 1.9, 1], duration: 900, loop: true, loopDelay: 900, delay: 1800, ease: 'inOutSine' });
  }, [y.year]);

  return (
    <div ref={root} className="sig-slide" style={column}>
      <SlideHeader kicker={`${daily.length} días`} title={<>Hablaron <span style={{ color: y.color }}>{active}</span> de {daily.length} días</>} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px 10px' }}>
          {months.map(({ m, start, length, offset }) => (
            <div key={m}>
              <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: m === topMonth ? y.color : SUB, fontWeight: m === topMonth ? 700 : 400, marginBottom: 4 }}>
                {MONTHS_SHORT[m]}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
                {Array.from({ length: offset }, (_, i) => <span key={`o${i}`} />)}
                {Array.from({ length }, (_, d) => {
                  const idx = start + d;
                  const n = daily[idx] ?? 0;
                  const isRecord = idx === recordIdx;
                  return (
                    <span
                      key={d}
                      className={`cd-cell${isRecord ? ' cd-record' : ''}`}
                      title={`${d + 1} ${MONTHS_SHORT[m]} · ${n}`}
                      style={{
                        aspectRatio: '1', borderRadius: 2, background: fills[level(n)],
                        boxShadow: n === 0 ? 'inset 0 0 0 1px rgba(45,26,31,0.18)' : isRecord ? `0 0 0 1.5px #fff, 0 0 8px 2px ${y.color}` : 'none',
                        position: 'relative', zIndex: isRecord ? 2 : 1,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="cd-record-tag" style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16, fontSize: 13, color: SUB }}>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: y.color, boxShadow: `0 0 8px ${y.color}` }} />
          <span><b style={{ color: INK }}>{y.topDay.date}</b> · el día más intenso: {fmt(y.topDay.messages)} mensajes</span>
        </div>
      </div>
      <div className="rv pre-anim" style={{ display: 'flex', gap: 10 }}>
        {[
          { n: `${y.signals.streak}`, l: 'días seguidos, su racha del año' },
          { n: MONTHS[topMonth], l: `su mes más intenso · ${fmt(y.signals.monthly[topMonth])}` },
        ].map((c) => (
          <div key={c.l} style={{ flex: 1, padding: '10px 12px', borderRadius: 14, background: 'rgba(255,255,255,0.7)', boxShadow: 'inset 0 0 0 1px rgba(45,26,31,0.08)' }}>
            <div className="font-display italic" style={{ fontSize: 22, fontWeight: 800, color: y.color, lineHeight: 1.1 }}>{c.n}</div>
            <div style={{ fontSize: 11.5, lineHeight: 1.3, color: SUB, marginTop: 2 }}>{c.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 2024 · Mornings — the sun comes up, one dot per «buenos días» ──── */

const DOTS_PER_ROW = 22;

export function MorningsSlide({ y }: { y: YearStats }) {
  const { enzo, katy } = y.signals.buenosDias;
  const people = [
    { name: 'Katy', n: katy, color: 'var(--katy)' },
    { name: 'Enzo', n: enzo, color: 'var(--enzo)' },
  ].sort((a, b) => b.n - a.n);
  const [lead, other] = people;
  const total = enzo + katy;
  const isRecord = yearStats.every((ys) => ys.signals.buenosDias.enzo + ys.signals.buenosDias.katy <= total);

  const root = useAnime<HTMLDivElement>(() => {
    revealIn(0);
    utils.set('.mo-sun', { y: 70 });
    utils.set('.mo-dot', { opacity: 0, scale: 0 });
    createTimeline({ defaults: { ease: 'outExpo' } })
      .add('.mo-sun', { y: 0, duration: 1600, ease: 'outQuart' }, 200)
      .add('.mo-dot', { opacity: 1, scale: 1, duration: 500, ease: 'outBack(2)', delay: stagger(14) }, 900);
    animate('.mo-rays', { rotate: 360, duration: 24000, ease: 'linear', loop: true });
  }, [y.year]);

  return (
    <div ref={root} className="sig-slide" style={column}>
      <SlideHeader kicker="Buenos días" title={<>Los buenos días son de <span style={{ color: lead.color }}>{lead.name}</span></>} />
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
        <svg viewBox="0 0 240 104" style={{ width: '78%', maxWidth: 240, overflow: 'hidden' }} aria-hidden>
          <defs>
            <linearGradient id="mo-sun-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#ffd27a" />
              <stop offset="1" stopColor="#f59e5b" />
            </linearGradient>
            <clipPath id="mo-horizon"><rect x="0" y="0" width="240" height="96" /></clipPath>
          </defs>
          <g clipPath="url(#mo-horizon)">
            <g className="mo-sun">
              <g className="mo-rays" style={SPIN}>
                {Array.from({ length: 14 }, (_, i) => (
                  <line key={i} x1={120} y1={96 - 52} x2={120} y2={96 - 72} stroke="#f7b267" strokeWidth={4} strokeLinecap="round" transform={`rotate(${i * (360 / 14)} 120 96)`} />
                ))}
              </g>
              <circle cx={120} cy={96} r={42} fill="url(#mo-sun-fill)" />
            </g>
          </g>
          <line x1={8} y1={96} x2={232} y2={96} stroke="rgba(45,26,31,0.25)" strokeWidth={2} strokeLinecap="round" />
        </svg>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
        {people.map((p) => (
          <div key={p.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: p.color }}>{p.name}</span>
              <span style={{ fontWeight: 800, fontSize: 22, color: INK }}>{p.n}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(${DOTS_PER_ROW}, 1fr)`, gap: 4 }}>
              {Array.from({ length: p.n }, (_, i) => (
                <span key={i} className="mo-dot" style={{ aspectRatio: '1', borderRadius: '50%', background: p.color, opacity: 0.9 }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <Note y={y}>
        ☀️ {lead.name} dio los buenos días <b>{oneDecimal(lead.n / Math.max(other.n, 1))}× más</b> que {other.name}
        {isRecord ? <> · {total} en el año, <b style={{ color: y.color }}>su récord</b>.</> : '.'}
      </Note>
    </div>
  );
}

/* ── 2024 · Words — what that year kept saying ───────────────────────── */

export function WordsSlide({ y }: { y: YearStats }) {
  const words = y.words?.list ?? [];
  const max = Math.max(...words.map((w) => w.count), 1);
  // Biggest words in the middle of the cloud, smaller ones around them.
  const ranked = [...words].sort((a, b) => b.count - a.count);
  const cloud = ranked.reduce<typeof words>((acc, w, i) => (i % 2 ? [...acc, w] : [w, ...acc]), []);
  const styleOf = (w: (typeof words)[number]) => {
    const rank = ranked.indexOf(w);
    return rank < 2 ? 0 : rank % 2 ? 1 : 2;
  };

  const root = useAnime<HTMLDivElement>(() => {
    revealIn(0);
    utils.set('.wd-word', { opacity: 0, y: -40, rotate: () => utils.random(-25, 25) });
    createTimeline()
      .add('.wd-word', { opacity: 1, y: 0, rotate: 0, duration: 1000, ease: 'outElastic(1, .6)', delay: stagger(110, { from: 'center' }) }, 250);
    animate('.wd-float', { y: [-3, 3], duration: () => utils.random(1600, 2600), loop: true, alternate: true, ease: 'inOutSine', delay: 1400 });
  }, [y.year]);

  return (
    <div ref={root} className="sig-slide" style={column}>
      <SlideHeader kicker="Palabras del año" title={`Lo que más se dijeron en ${y.year}`} />
      <div style={{ flex: 1, display: 'flex', flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center', alignItems: 'baseline', gap: '4px 14px' }}>
        {cloud.map((w) => {
          const size = 15 + 30 * Math.sqrt(w.count / max);
          const style = styleOf(w);
          return (
            <span key={w.word} className="wd-word" style={{ display: 'inline-block' }}>
              <span
                className={`wd-float${style === 0 ? ' font-display italic' : ''}`}
                style={{
                  display: 'inline-block', fontSize: size, lineHeight: 1.15,
                  fontWeight: style === 0 ? 800 : style === 1 ? 700 : 500,
                  fontFamily: style === 2 ? MONO : undefined,
                  color: style === 0 ? y.color : style === 1 ? INK : SUB,
                }}
              >
                {w.word}<sup style={{ fontFamily: MONO, fontSize: 9, fontWeight: 400, color: 'var(--faint)', marginLeft: 2 }}>{w.count}</sup>
              </span>
            </span>
          );
        })}
      </div>
      {y.words && <Note y={y}>{y.words.note}</Note>}
    </div>
  );
}

/* ── 2025 · Calls — the phone rings, the months light up ─────────────── */

export function CallsSlide({ y }: { y: YearStats }) {
  const calls = y.signals.videoCallsByMonth;
  const total = sum(calls);
  const max = Math.max(...calls, 1);
  const peak = calls.indexOf(max);
  // The stretch of consecutive months with a call every few days.
  let run = { from: 0, to: -1 };
  for (let i = 0, from = -1; i < 12; i++) {
    if (calls[i] >= 10) { if (from < 0) from = i; if (i - from > run.to - run.from) run = { from, to: i }; }
    else from = -1;
  }
  const inRun = (m: number) => m >= run.from && m <= run.to;
  const runCalls = sum(calls.slice(run.from, run.to + 1));
  const runDays = sum(Array.from({ length: run.to - run.from + 1 }, (_, i) => new Date(y.year, run.from + i + 1, 0).getDate()));

  const root = useAnime<HTMLDivElement>(() => {
    revealIn(0);
    utils.set('.ca-bar', { scaleY: 0 });
    utils.set('.ca-val', { opacity: 0, y: 6 });
    createTimeline()
      .add('.ca-bar', { scaleY: 1, duration: 1100, ease: 'outElastic(1, .7)', delay: stagger(70) }, 500)
      .add('.ca-val', { opacity: 1, y: 0, duration: 500, ease: 'outExpo' }, 1500);
    animate('.ca-ring', { scale: [0.6, 2.2], opacity: [0.5, 0], duration: 1600, delay: stagger(500), loop: true, ease: 'outSine' });
    animate('.ca-phone', { rotate: [0, -14, 14, -10, 10, 0], duration: 600, loop: true, loopDelay: 1200, ease: 'inOutSine' });
  }, [y.year]);

  return (
    <div ref={root} className="sig-slide" style={column}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <SlideHeader kicker="El año de las llamadas" title={<><CountUp end={total} duration={1400} delay={300} /> videollamadas</>} />
        <div style={{ position: 'relative', width: 56, height: 56, marginTop: 8, flexShrink: 0, display: 'grid', placeItems: 'center' }} aria-hidden>
          {[0, 1, 2].map((i) => <span key={i} className="ca-ring" style={{ position: 'absolute', inset: 6, borderRadius: '50%', border: `2px solid ${y.color}`, opacity: 0 }} />)}
          <span className="ca-phone" style={{ fontSize: 30, display: 'inline-block' }}>📞</span>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 6, padding: '28px 0 0' }}>
        {calls.map((n, m) => (
          <div key={m} style={{ flex: 1, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center' }}>
            {m === peak && <span className="ca-val" style={{ fontWeight: 800, fontSize: 15, color: y.color, marginBottom: 4 }}>{n}</span>}
            <div
              className="ca-bar"
              style={{
                width: '100%', height: `${Math.max(3, (n / max) * 72)}%`, borderRadius: '8px 8px 3px 3px',
                transformOrigin: '50% 100%',
                background: inRun(m) ? `linear-gradient(180deg, ${y.color}, ${y.color}bb)` : n ? `${y.color}40` : 'rgba(45,26,31,0.08)',
                boxShadow: m === peak ? `0 6px 16px ${y.color}55` : 'none',
              }}
            />
            <span style={{ fontFamily: MONO, fontSize: 10, marginTop: 6, color: inRun(m) ? y.color : SUB, fontWeight: inRun(m) ? 700 : 400 }}>{MONTH_INITIALS[m]}</span>
          </div>
        ))}
      </div>
      {run.to >= run.from && (
        <Note y={y}>
          De {MONTHS[run.from]} a {MONTHS[run.to]}: <b style={{ color: y.color }}>{runCalls} videollamadas</b>, {runCalls >= runDays ? 'más de una por día' : 'casi una por día'}. Solo en {MONTHS[peak]}, {max}.
        </Note>
      )}
    </div>
  );
}

/* ── 2025 · Streak — a ring of days that never broke ────────────────── */

export function StreakSlide({ y }: { y: YearStats }) {
  const { days, from, to } = globalStats.longestStreak;
  const R = 92;
  const frac = Math.min(days / 365, 1);
  const end = frac * Math.PI * 2;
  const endsOnAnniversary = to.startsWith('2 oct');

  const root = useAnime<HTMLDivElement>(() => {
    revealIn(0);
    const [ring] = createDrawable('.st-ring');
    utils.set('.st-end', { opacity: 0, scale: 0 });
    utils.set('.st-tick', { opacity: 0 });
    createTimeline()
      .add('.st-tick', { opacity: 1, duration: 300, delay: stagger(40) }, 200)
      .add(ring, { draw: ['0 0', `0 ${frac}`], duration: 2200, ease: 'inOutSine' }, 400)
      .add('.st-end', { opacity: 1, scale: 1, duration: 700, ease: 'outBack(3)' }, 2500);
    animate('.st-end-beat', { scale: [1, 1.25, 1], duration: 900, loop: true, loopDelay: 600, delay: 3200, ease: 'inOutSine' });
  }, [y.year]);

  return (
    <div ref={root} className="sig-slide" style={column}>
      <SlideHeader kicker="La racha" title="Ni un día sin hablarse" />
      <div style={{ flex: 1, display: 'grid', placeItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 250 }}>
          <svg viewBox="-120 -120 240 240" style={{ width: '100%', overflow: 'visible' }} aria-hidden>
            <circle r={R} fill="none" stroke="rgba(45,26,31,0.08)" strokeWidth={14} />
            {Array.from({ length: 12 }, (_, i) => (
              <line key={i} className="st-tick" x1={0} y1={-R - 12} x2={0} y2={-R - 18} stroke="rgba(45,26,31,0.3)" strokeWidth={2} strokeLinecap="round" transform={`rotate(${i * 30})`} />
            ))}
            <circle className="st-ring" r={R} fill="none" stroke={y.color} strokeWidth={14} strokeLinecap="round" transform="rotate(-90)" style={{ filter: `drop-shadow(0 0 6px ${y.color}88)` }} />
            <g className="st-end" style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
              <g transform={`translate(${R * Math.sin(end)} ${-R * Math.cos(end)})`}>
                <g className="st-end-beat" style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
                  <circle r={13} fill="#fff" stroke={y.color} strokeWidth={2} />
                  <text y={5} textAnchor="middle" fontSize={13}>❤️</text>
                </g>
              </g>
            </g>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center' }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 56, letterSpacing: '-0.04em', lineHeight: 1, color: INK }}>
                <CountUp end={days} duration={2200} delay={400} />
              </div>
              <div className="font-display italic" style={{ fontSize: 16, color: SUB }}>días seguidos</div>
            </div>
          </div>
        </div>
      </div>
      <div className="rv pre-anim" style={{ display: 'flex', justifyContent: 'space-between', fontFamily: MONO, fontSize: 11, color: SUB }}>
        <span>desde {from}</span><span style={{ color: y.color }}>→</span><span>hasta {to}</span>
      </div>
      <Note y={y}>
        Su racha más larga: casi un año entero escribiéndose todos los días
        {endsOnAnniversary ? <>, y llegó justo hasta su aniversario <b style={{ color: y.color }}>el 2 de octubre</b> <span style={{ color: y.color }}>♥</span></> : '.'}
      </Note>
    </div>
  );
}

/* ── 2026 · Stickers — towers of stickers, one per sticker-a-day ────── */

const STICKERS = ['🐻', '🐱', '🫶', '😹', '🐶', '🥹', '🤭', '🐧', '🦦'];

export function StickersSlide({ y }: { y: YearStats }) {
  const rates = ratePerYear((ys) => ys.stickers);
  const best = Math.max(...rates.map((r) => r.rate));
  const tallest = Math.max(...rates.map((r) => Math.round(r.rate)));
  const mine = rates.find((r) => r.year === y.year)!;
  const months = y.signals.monthly.filter((n) => n > 0).length;

  const root = useAnime<HTMLDivElement>((el) => {
    revealIn(0);
    const h = el.clientHeight;
    utils.set('.sk-st', { y: -h, opacity: 0 });
    utils.set('.sk-crown', { y: -h / 2, opacity: 0 });
    createTimeline()
      .add('.sk-st', { y: 0, opacity: 1, duration: 900, ease: 'outBounce', delay: stagger(55, { reversed: true }) }, 300)
      .add('.sk-crown', { y: 0, opacity: 1, duration: 900, ease: 'outBounce' }, '+=100');
    animate('.sk-crown', { rotate: [-10, 10], duration: 900, loop: true, alternate: true, ease: 'inOutSine', delay: 2600 });
  }, [y.year]);

  return (
    <div ref={root} className="sig-slide" style={column}>
      <SlideHeader kicker="La era de los stickers" title={<><span style={{ color: y.color }}>{oneDecimal(mine.rate)}</span> stickers al día</>} />
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 6, paddingTop: 16 }}>
        {rates.map((r, ri) => {
          const me = r.year === y.year;
          const n = Math.max(1, Math.round(r.rate));
          return (
            <div key={r.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {me && r.rate === best && <span className="sk-crown" style={{ fontSize: 22, display: 'inline-block' }}>👑</span>}
              <div style={{ display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', minHeight: tallest * 28 }}>
                {Array.from({ length: n }, (_, i) => (
                  <span key={i} className="sk-st" style={{ display: 'inline-block', marginTop: -2 }}>
                    <span
                      style={{
                        display: 'inline-block', fontSize: me ? 28 : 22, lineHeight: 1,
                        transform: `rotate(${((ri * 7 + i * 13) % 21) - 10}deg)`, filter: me ? 'none' : 'grayscale(0.5) opacity(0.75)',
                      }}
                    >
                      {STICKERS[(ri * 3 + i) % STICKERS.length]}
                    </span>
                  </span>
                ))}
              </div>
              <span style={{ fontFamily: MONO, fontSize: 10.5, marginTop: 8, color: me ? y.color : SUB, fontWeight: me ? 700 : 400 }}>{r.year}</span>
              <span style={{ fontFamily: MONO, fontSize: 10, color: me ? INK : 'var(--faint)' }}>{oneDecimal(r.rate)}</span>
            </div>
          );
        })}
      </div>
      <Note y={y}>
        <b style={{ color: y.color }}>{fmt(y.stickers)} stickers</b> en solo {months} meses{mine.rate === best ? ' — nunca se habían mandado tantos por día' : ''}. Cada sticker de la torre = uno al día.
      </Note>
    </div>
  );
}

/* ── 2026 · Word story — one word, from first use to everyday ───────── */

export function WordStorySlide({ y }: { y: YearStats }) {
  const story = y.wordStory;
  const points = (story?.byYear ?? []).map((b) => {
    const ys = yearStats.find((s) => s.year === b.year);
    return { ...b, rate: ys ? b.count / ys.signals.activeDays : 0 };
  });
  const maxRate = Math.max(...points.map((p) => p.rate), 0.01);
  const born = points.find((p) => p.count > 0);
  const last = points[points.length - 1];
  const W = 300;
  const H = 130;
  const xy = points.map((p, i) => [12 + (i * (W - 24)) / Math.max(points.length - 1, 1), H - 14 - (p.rate / maxRate) * (H - 34)] as const);
  const line = xy.map(([x, yy], i) => `${i ? 'L' : 'M'} ${x} ${yy}`).join(' ');
  const area = `${line} L ${xy[xy.length - 1][0]} ${H - 14} L ${xy[0][0]} ${H - 14} Z`;

  const root = useAnime<HTMLDivElement>((el) => {
    const split = splitText(el.querySelector<HTMLElement>('.ws-word')!, { chars: true });
    utils.set('.ws-word', { opacity: 1 });
    utils.set(split.chars, { opacity: 0 });
    revealIn(1200);
    const [path] = createDrawable('.ws-line');
    utils.set('.ws-area', { opacity: 0 });
    utils.set('.ws-dot', { opacity: 0, scale: 0 });
    createTimeline()
      .add(split.chars, { opacity: 1, duration: 1, delay: stagger(160) }, 200)
      .add('.ws-caret', { opacity: [1, 0], duration: 450, loop: 5, alternate: true, ease: steps(1) }, 0)
      .add(path, { draw: ['0 0', '0 1'], duration: 1600, ease: 'inOutSine' }, 1100)
      .add('.ws-dot', { opacity: 1, scale: 1, duration: 500, ease: 'outBack(2.5)', delay: stagger(260) }, 1150)
      .add('.ws-area', { opacity: 1, duration: 900, ease: 'outQuad' }, 2300);
    return () => split.revert();
  }, [y.year]);

  if (!story) return null;
  return (
    <div ref={root} className="sig-slide" style={centered}>
      <div className="rv pre-anim"><span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: SUB }}>Su palabra</span></div>
      <div className="font-display italic" style={{ fontSize: 'clamp(76px, 24vw, 104px)', fontWeight: 900, lineHeight: 1, margin: '10px 0 4px', color: y.color, textShadow: `0 6px 30px ${y.color}44` }}>
        «<span className="ws-word pre-anim">{story.word}</span>»
        <span className="ws-caret" style={{ display: 'inline-block', width: 3, height: '0.75em', background: y.color, marginLeft: 4, verticalAlign: '-0.05em' }} />
      </div>
      <svg viewBox={`0 0 ${W} ${H + 18}`} style={{ width: '100%', maxWidth: 330, overflow: 'visible', marginTop: 14 }} aria-hidden>
        <defs>
          <linearGradient id="ws-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={y.color} stopOpacity={0.35} />
            <stop offset="1" stopColor={y.color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <line x1={0} y1={H - 14} x2={W} y2={H - 14} stroke="rgba(45,26,31,0.12)" />
        <path className="ws-area" d={area} fill="url(#ws-fill)" />
        <path className="ws-line" d={line} fill="none" stroke={y.color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => {
          const [x, yy] = xy[i];
          const label = p === last ? `${oneDecimal(p.rate)}/día` : p === born ? 'nace' : null;
          return (
            <g key={p.year}>
              <g className="ws-dot" style={{ transformBox: 'fill-box', transformOrigin: '50% 50%' }}>
                <circle cx={x} cy={yy} r={p === last ? 6 : 4} fill={p.count ? y.color : '#fff'} stroke={y.color} strokeWidth={2} />
              </g>
              {label && <text x={x} y={yy - 12} textAnchor={p === last ? 'end' : 'middle'} fontFamily={MONO} fontSize={11} fontWeight={700} fill={y.color}>{label}</text>}
              <text x={x} y={H + 6} textAnchor="middle" fontFamily={MONO} fontSize={10} fill={p === last ? y.color : 'rgba(45,26,31,0.45)'}>{p.year}</text>
            </g>
          );
        })}
      </svg>
      {born && (
        <p className="rv pre-anim" style={{ margin: '16px 0 0', fontSize: 14.5, lineHeight: 1.45, maxWidth: 300, color: INK }}>
          Apareció en {born.year} ({born.count} veces). En {last.year} ya sale <b style={{ color: y.color }}>{oneDecimal(last.rate)} veces al día</b>
          {last.rate === maxRate ? ' — más que nunca.' : '.'}
        </p>
      )}
    </div>
  );
}
