'use client';
import { animate, createDrawable, createTimeline, splitText, stagger, steps, utils } from 'animejs';
import type { YearStats } from '../../lib/types';
import CountUp from '../CountUp';
import { globalStats, yearStats } from '../../data/stats';
import { useAnime } from '../../lib/anim';
import { themeFor, type SlideType } from './themes';
import { centered, column, INK, Kicker, MONO, READ_BLUE, revealIn, SUB } from './slideKit';
import {
  CalendarSlide, CallsSlide, LaughsSlide, MorningsSlide, NightSlide, ReplySlide, StickersSlide, StreakSlide, WordsSlide, WordStorySlide,
} from './SignatureSlides';

interface WrapSlideProps {
  type: SlideType;
  data: YearStats;
}

export default function WrapSlide({ type, data }: WrapSlideProps) {
  switch (type) {
    case 'cover': return <CoverSlide y={data} />;
    case 'messages': return <MessagesSlide y={data} />;
    case 'love': return <LoveSlide y={data} />;
    case 'media': return <MediaSlide y={data} />;
    case 'night': return <NightSlide y={data} />;
    case 'laughs': return <LaughsSlide y={data} />;
    case 'reply': return <ReplySlide y={data} />;
    case 'calendar': return <CalendarSlide y={data} />;
    case 'mornings': return <MorningsSlide y={data} />;
    case 'words': return <WordsSlide y={data} />;
    case 'calls': return <CallsSlide y={data} />;
    case 'streak': return <StreakSlide y={data} />;
    case 'stickers': return <StickersSlide y={data} />;
    case 'wordStory': return <WordStorySlide y={data} />;
    case 'topDay': return <TopDaySlide y={data} />;
    case 'highlight': return <HighlightSlide y={data} />;
    case 'closing': return <ClosingSlide y={data} />;
    default: return null;
  }
}

/* ── Cover — the year rolls in, its emoji performs its theme ─────────── */

function CoverSlide({ y }: { y: YearStats }) {
  const theme = themeFor(y);

  const root = useAnime<HTMLDivElement>((el) => {
    const split = splitText(el.querySelector<HTMLElement>('.cv-year')!, { chars: true });
    utils.set('.cv-year', { opacity: 1 });
    utils.set(split.chars, { opacity: 0, y: 50, rotateX: -90 });
    utils.set('.cv-emoji', { opacity: 0 });

    const tl = createTimeline({ defaults: { ease: 'outExpo' } });
    tl.add(split.chars, { opacity: 1, y: 0, rotateX: 0, duration: 1000, delay: stagger(90) }, 250);
    revealIn(700);

    // Emoji entrance (outer element) + idle loop (inner element), per year theme,
    // so the two never fight over the same transform.
    const emoji = '.cv-emoji';
    const idle = '.cv-emoji-idle';
    switch (theme) {
      case 'stars': // rocket launches in from below, then hovers
        tl.add(emoji, { opacity: [0, 1], y: [220, 0], rotate: [-20, 0], duration: 1200 }, 0);
        animate(idle, { y: [-6, 6], duration: 1300, loop: true, alternate: true, ease: 'inOutSine', delay: 1300 });
        break;
      case 'embers': // fire flickers
        tl.add(emoji, { opacity: [0, 1], scale: [0.2, 1], duration: 800, ease: 'outBack(2)' }, 0);
        animate(idle, { scaleY: [1, 1.12, 0.96, 1.08, 1], scaleX: [1, 0.95, 1.03, 0.97, 1], duration: 900, loop: true, ease: 'inOutSine', delay: 900 });
        break;
      case 'signal': // phone rings
        tl.add(emoji, { opacity: [0, 1], scale: [0.4, 1], duration: 700, ease: 'outBack(2)' }, 0);
        animate(idle, { rotate: [0, -16, 16, -12, 12, -6, 0], duration: 700, loop: true, loopDelay: 1400, delay: 900, ease: 'inOutSine' });
        break;
      case 'leaves': // sprout grows from the ground
        utils.set(emoji, { transformOrigin: '50% 100%' });
        tl.add(emoji, { opacity: [0, 1], scaleY: [0, 1], scaleX: [0.6, 1], duration: 1100, ease: 'outElastic(1, .5)' }, 0);
        animate(idle, { rotate: [-4, 4], duration: 1800, loop: true, alternate: true, ease: 'inOutSine', delay: 1100 });
        break;
      case 'petals': // rose unfurls with a twirl
        tl.add(emoji, { opacity: [0, 1], rotate: [-120, 0], scale: [0.3, 1], duration: 1100 }, 0);
        animate(idle, { rotate: [-5, 5], duration: 2200, loop: true, alternate: true, ease: 'inOutSine', delay: 1100 });
        break;
      default: // hearts beat
        tl.add(emoji, { opacity: [0, 1], scale: [0.3, 1], duration: 800, ease: 'outBack(2)' }, 0);
        animate(idle, { scale: [1, 1.15, 1, 1.1, 1], duration: 1100, loop: true, loopDelay: 500, delay: 900, ease: 'inOutSine' });
    }

    animate('.cv-hint', { opacity: [0.35, 0.9], duration: 1100, loop: true, alternate: true, delay: 1800, ease: 'inOutSine' });
    return () => split.revert();
  }, [y.year]);

  return (
    <div ref={root} style={centered}>
      <div className="cv-emoji pre-anim" style={{ fontSize: 64, lineHeight: 1, display: 'inline-block' }}>
        <span className="cv-emoji-idle" style={{ display: 'inline-block', transformOrigin: theme === 'leaves' ? '50% 100%' : '50% 50%' }}>{y.emoji}</span>
      </div>
      <div
        className="cv-year pre-anim font-display italic"
        style={{ fontSize: 'clamp(96px, 30vw, 124px)', fontWeight: 900, lineHeight: 0.9, marginTop: 12, color: y.color, textShadow: `0 4px 30px ${y.color}55` }}
      >
        {y.year}
      </div>
      <p className="rv pre-anim font-display italic" style={{ fontSize: 21, fontWeight: 600, lineHeight: 1.3, margin: '20px auto 0', maxWidth: 280, color: INK }}>
        {y.theme}
      </p>
      <div
        className="rv pre-anim"
        style={{ fontFamily: MONO, fontSize: 12, marginTop: 20, padding: '8px 14px', borderRadius: 30, color: y.color, background: `${y.color}14`, border: `1px solid ${y.color}30` }}
      >
        {y.total.toLocaleString('en-US')} mensajes
      </div>
      <div className="cv-hint" style={{ position: 'absolute', bottom: 18, left: 0, right: 0, fontFamily: MONO, fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: SUB }}>
        <span className="lg:hidden">toca para continuar →</span>
        <span className="hidden lg:inline">← → para navegar</span>
      </div>
    </div>
  );
}

/* ── Messages — someone is typing… then the chat lands ──────────────── */

function MessagesSlide({ y }: { y: YearStats }) {
  const tot = y.enzo + y.katy;
  const enzoPct = (y.enzo / tot) * 100;
  const katyPct = 100 - enzoPct;

  const root = useAnime<HTMLDivElement>(() => {
    revealIn(0);
    utils.set('.bub', { opacity: 0, scale: 0 });
    utils.set('.split-seg', { width: '0%' });
    utils.set('.typing', { opacity: 0, scale: 0.6 });
    utils.set('.split-lbl', { opacity: 0 });

    const dots = animate('.typing-dot', {
      y: [0, -5, 0], duration: 600, delay: stagger(120), loop: true, ease: 'inOutSine',
    });

    createTimeline({ defaults: { ease: 'outExpo' } })
      .add('.typing', { opacity: 1, scale: 1, duration: 400, ease: 'outBack(2)' }, 300)
      .add('.typing', { opacity: 0, scale: 0.4, duration: 250, ease: 'inQuad', onComplete: () => { dots.pause(); } }, 1300)
      .add('.bub', { opacity: 1, scale: 1, duration: 650, ease: 'outBack(1.6)', delay: stagger(220) }, 1450)
      .add('.split-seg-enzo', { width: `${enzoPct}%`, duration: 1100 }, 1700)
      .add('.split-seg-katy', { width: `${katyPct}%`, duration: 1100 }, 1700)
      .add('.split-lbl', { opacity: [0, 1], duration: 500 }, 2300)
      .add('.tick', { color: READ_BLUE, duration: 300, delay: stagger(120) }, 2500);
  }, [y.year]);

  return (
    <div ref={root} style={{ ...column, justifyContent: 'center' }}>
      <div className="rv pre-anim" style={{ fontSize: 15, textAlign: 'center', color: SUB }}>Este año se dijeron</div>
      <div className="rv pre-anim" style={{ textAlign: 'center', margin: '6px 0 2px' }}>
        <span style={{ fontWeight: 800, fontSize: 'clamp(56px, 18vw, 76px)', letterSpacing: '-0.03em', color: y.color, textShadow: `0 3px 30px ${y.color}55` }}>
          <CountUp end={y.total} delay={200} />
        </span>
      </div>
      <div className="rv pre-anim font-display italic" style={{ fontSize: 22, textAlign: 'center', color: INK }}>mensajes</div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 28, marginBottom: 20, minHeight: 132 }}>
        <div className="typing pre-anim" style={{ position: 'absolute', left: 0, top: 0, padding: '14px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(45,26,31,0.08)', display: 'flex', gap: 5, transformOrigin: '0% 100%' }}>
          {[0, 1, 2].map((i) => <span key={i} className="typing-dot" style={{ width: 7, height: 7, borderRadius: '50%', background: 'rgba(45,26,31,0.4)', display: 'block' }} />)}
        </div>
        {[
          { name: 'Katy', val: y.katy, out: false },
          { name: 'Enzo', val: y.enzo, out: true },
        ].map((p) => (
          <div key={p.name} style={{ display: 'flex', justifyContent: p.out ? 'flex-end' : 'flex-start' }}>
            <div
              className="bub pre-anim"
              style={{
                padding: '10px 16px', maxWidth: '72%',
                borderRadius: p.out ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                background: p.out ? y.color : 'rgba(255,255,255,0.75)',
                boxShadow: p.out ? `0 6px 20px ${y.color}40` : '0 2px 10px rgba(45,26,31,0.08)',
                transformOrigin: p.out ? '100% 100%' : '0% 100%',
              }}
            >
              <div style={{ fontFamily: MONO, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: p.out ? 'rgba(255,255,255,0.8)' : SUB }}>{p.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span style={{ fontWeight: 800, fontSize: 24, color: p.out ? '#fff' : INK, fontVariantNumeric: 'tabular-nums' }}>{p.val.toLocaleString('en-US')}</span>
                <span className="tick" style={{ fontSize: 12, color: p.out ? 'rgba(255,255,255,0.6)' : 'rgba(45,26,31,0.35)' }}>✓✓</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', height: 14, borderRadius: 10, overflow: 'hidden', background: 'rgba(45,26,31,0.06)' }}>
        <div className="split-seg split-seg-enzo" style={{ width: `${enzoPct}%`, background: 'var(--enzo)' }} />
        <div className="split-seg split-seg-katy" style={{ width: `${katyPct}%`, background: 'var(--katy)' }} />
      </div>
      <div className="split-lbl" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontFamily: MONO, fontSize: 11 }}>
        <span style={{ color: 'var(--enzo)' }}>Enzo {enzoPct.toFixed(0)}%</span>
        <span style={{ color: 'var(--katy)' }}>{katyPct.toFixed(0)}% Katy</span>
      </div>
    </div>
  );
}

/* ── Love — a heart is drawn, beats, and bursts ─────────────────────── */

const HEART_PATH = 'M50 86 C22 66 6 50 6 32 C6 18 17 8 30 8 C39 8 46 13 50 21 C54 13 61 8 70 8 C83 8 94 18 94 32 C94 50 78 66 50 86 Z';
const BURST = 14;

function LoveSlide({ y }: { y: YearStats }) {
  const root = useAnime<HTMLDivElement>(() => {
    const [outline] = createDrawable('.love-heart path');
    revealIn(900);
    utils.set('.love-heart path', { fillOpacity: 0 });
    utils.set('.burst', { opacity: 0 });

    createTimeline()
      .add(outline, { draw: ['0 0', '0 1'], duration: 1100, ease: 'inOutSine' }, 0)
      .add('.love-heart path', { fillOpacity: 1, duration: 500, ease: 'outQuad' }, 900);

    // Heartbeat, and on every beat a ring of little hearts escapes.
    animate('.love-heart', { scale: [1, 1.14, 1, 1.08, 1], duration: 1000, loop: true, loopDelay: 700, delay: 1300, ease: 'inOutSine' });
    animate('.burst', {
      x: (_: unknown, i = 0) => [0, Math.cos((i / BURST) * Math.PI * 2) * utils.random(90, 140)],
      y: (_: unknown, i = 0) => [0, Math.sin((i / BURST) * Math.PI * 2) * utils.random(90, 140)],
      scale: () => [0.4, utils.random(0.8, 1.4, 2)],
      opacity: [1, 0],
      duration: 1300,
      delay: 1350,
      loopDelay: 400,
      loop: true,
      ease: 'outExpo',
    });
  }, [y.year]);

  return (
    <div ref={root} style={centered}>
      <div style={{ position: 'relative', width: 130, height: 122 }}>
        {Array.from({ length: BURST }, (_, i) => (
          <span key={i} className="burst" style={{ position: 'absolute', left: '50%', top: '45%', marginLeft: -7, marginTop: -8, fontSize: 14, color: i % 2 ? y.color : 'var(--katy)', opacity: 0 }}>♥</span>
        ))}
        <svg className="love-heart" viewBox="0 0 100 94" style={{ width: '100%', height: '100%', overflow: 'visible', filter: `drop-shadow(0 0 24px ${y.color}66)` }}>
          <path d={HEART_PATH} fill={y.color} stroke={y.color} strokeWidth={3} strokeLinejoin="round" />
        </svg>
      </div>
      <div className="rv pre-anim" style={{ marginTop: 26, fontSize: 16, color: SUB }}>Se dijeron «te amo»</div>
      <div className="rv pre-anim" style={{ fontWeight: 800, fontSize: 'clamp(68px, 22vw, 88px)', lineHeight: 1, letterSpacing: '-0.03em', margin: '4px 0', color: INK }}>
        <CountUp end={y.teAmo} duration={1400} delay={900} />
      </div>
      <div className="rv pre-anim font-display italic" style={{ fontSize: 22, color: INK }}>veces</div>
      <div className="rv pre-anim" style={{ marginTop: 24, padding: '10px 18px', borderRadius: 30, background: `${y.color}18`, border: `1px solid ${y.color}35`, fontSize: 13, color: y.color, fontWeight: 600 }}>
        ≈ {(y.teAmo / 365).toFixed(1)} veces al día · todos los días ❤
      </div>
    </div>
  );
}

/* ── Media — camera flash, then the polaroids get dealt ─────────────── */

function MediaSlide({ y }: { y: YearStats }) {
  const items = [
    { e: '📸', n: y.fotos, l: 'fotos' },
    { e: '🎵', n: y.audios, l: 'audios' },
    { e: '🎭', n: y.stickers, l: 'stickers' },
    { e: '📹', n: y.videos, l: 'videos' },
  ];
  const sum = items.reduce((a, i) => a + i.n, 0) || 1;
  const segColors = [y.color, `${y.color}bb`, `${y.color}80`, `${y.color}4d`];

  const root = useAnime<HTMLDivElement>((el) => {
    revealIn(0);
    const grid = el.querySelector<HTMLElement>('.pol-grid')!;
    const cx = grid.offsetWidth / 2;
    const cy = grid.offsetHeight / 2;
    const cards = el.querySelectorAll<HTMLElement>('.pol');

    // Stack every card in the middle of the grid, slightly askew, then deal them out.
    cards.forEach((c) => {
      utils.set(c, {
        x: cx - (c.offsetLeft + c.offsetWidth / 2),
        y: cy - (c.offsetTop + c.offsetHeight / 2) + 30,
        rotate: utils.random(-18, 18),
        scale: 0.8,
        opacity: 0,
      });
    });
    utils.set('.seg', { width: '0%' });

    createTimeline({ defaults: { ease: 'outExpo' } })
      .add('.flash', { opacity: [0, 0.9, 0], duration: 520, ease: 'outQuad' }, 150)
      .add(cards, { opacity: 1, duration: 200, delay: stagger(60) }, 350)
      .add(cards, {
        x: 0, y: 0, scale: 1,
        rotate: (_: unknown, i = 0) => (i % 2 ? 2.5 : -2.5),
        duration: 1000, delay: stagger(130),
      }, 700)
      .add('.seg', { width: (s?: unknown) => (s as HTMLElement).dataset.w + '%', duration: 900, delay: stagger(90) }, 1400);
  }, [y.year]);

  return (
    <div ref={root} style={column}>
      <div className="flash" style={{ position: 'absolute', inset: -120, background: '#fff', opacity: 0, pointerEvents: 'none', zIndex: 5 }} />
      <div className="rv pre-anim" style={{ marginTop: 8 }}>
        <Kicker>Lo que se enviaron</Kicker>
        <h3 className="font-display italic" style={{ fontSize: 28, fontWeight: 700, margin: '6px 0 0', color: INK }}>en {y.year}</h3>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div className="pol-grid" style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {items.map((it) => (
            <div
              key={it.l}
              className="pol"
              style={{
                background: '#fff', borderRadius: 10, padding: '10px 10px 14px',
                boxShadow: '0 8px 24px rgba(45,26,31,0.12), 0 1px 3px rgba(45,26,31,0.08)',
              }}
            >
              <div style={{ aspectRatio: '4 / 3', borderRadius: 6, display: 'grid', placeItems: 'center', fontSize: 34, background: `linear-gradient(150deg, ${y.grad[0]}, ${y.color}30)` }}>
                {it.e}
              </div>
              <div style={{ fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', color: INK, marginTop: 8, lineHeight: 1 }}>
                <CountUp end={it.n} duration={1100} delay={900} />
              </div>
              <div className="font-display italic" style={{ fontSize: 14, color: SUB }}>{it.l}</div>
            </div>
          ))}
        </div>

        <div className="rv pre-anim" style={{ marginTop: 26 }}>
          <div style={{ display: 'flex', height: 10, borderRadius: 6, overflow: 'hidden', background: 'rgba(45,26,31,0.06)' }}>
            {items.map((it, i) => (
              <div key={it.l} className="seg" data-w={((it.n / sum) * 100).toFixed(2)} style={{ width: `${(it.n / sum) * 100}%`, background: segColors[i] }} />
            ))}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10.5, color: SUB, marginTop: 8, textAlign: 'center' }}>
            {sum.toLocaleString('en-US')} archivos compartidos
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Top day — the calendar page tears, messages rain down ──────────── */

const RAIN = 16;

function TopDaySlide({ y }: { y: YearStats }) {
  const [day, month] = y.topDay.date.split(' ');
  const prevDay = Math.max(Number(day) - 1, 1);

  const root = useAnime<HTMLDivElement>((el) => {
    const h = el.clientHeight;
    revealIn(1000);
    utils.set('.cal', { opacity: 0, rotateX: -95 });
    utils.set('.cal-bubble', { opacity: 0, scale: 0.3 });

    createTimeline({ defaults: { ease: 'outExpo' } })
      .add('.cal', { opacity: 1, rotateX: 0, duration: 1000, ease: 'outBack(1.4)' }, 150)
      .add('.cal-old', { rotate: 14, y: 260, x: 40, opacity: 0, duration: 900, ease: 'inQuad' }, 850)
      .add('.cal-bubble', { opacity: 1, scale: 1, duration: 700, ease: 'outBack(1.8)' }, 1300);

    // A steady downpour of tiny chat bubbles — the sheer volume of that day.
    animate('.drop', {
      y: [-40, h + 40],
      duration: () => utils.random(1400, 2600),
      delay: () => utils.random(0, 2400),
      loop: true,
      ease: 'linear',
    });
  }, [y.year]);

  return (
    <div ref={root} style={centered}>
      <div aria-hidden style={{ position: 'absolute', inset: '-80px -24px', overflow: 'hidden', pointerEvents: 'none' }}>
        {Array.from({ length: RAIN }, (_, i) => (
          <span
            key={i}
            className="drop"
            style={{
              position: 'absolute', top: 0, left: `${Math.round((i / RAIN) * 1000) / 10 + 2}%`,
              width: 14 + (i % 3) * 6, height: 10, borderRadius: i % 2 ? '6px 6px 6px 2px' : '6px 6px 2px 6px',
              background: y.color, opacity: [0.1, 0.13, 0.16, 0.19][i % 4], transform: 'translateY(-40px)',
            }}
          />
        ))}
      </div>

      <div className="rv pre-anim" style={{ fontSize: 15, color: SUB, position: 'relative' }}>Su día más intenso</div>

      <div style={{ position: 'relative', margin: '16px 0 22px', perspective: 700 }}>
        <Calendar className="cal cal-old" month={month} day={String(prevDay)} color={y.color} style={{ position: 'absolute', inset: 0, zIndex: 2, opacity: 0 }} />
        <Calendar className="cal pre-anim" month={month} day={day} color={y.color} style={{ transformOrigin: '50% 0%' }} />
      </div>

      <div className="cal-bubble pre-anim" style={{ position: 'relative', padding: '14px 22px', borderRadius: '20px 20px 20px 4px', background: y.color, boxShadow: `0 10px 30px ${y.color}55`, transformOrigin: '0% 100%' }}>
        <div style={{ fontWeight: 800, fontSize: 56, lineHeight: 1, letterSpacing: '-0.03em', color: '#fff' }}>
          <CountUp end={y.topDay.messages} duration={1300} delay={1300} />
        </div>
        <div className="font-display italic" style={{ fontSize: 16, color: 'rgba(255,255,255,0.88)', marginTop: 4 }}>
          mensajes en un solo día
        </div>
      </div>

      <p className="rv pre-anim" style={{ position: 'relative', marginTop: 22, fontSize: 14, fontStyle: 'italic', color: SUB }}>
        {y.topDay.date} · ¿Qué estarían tramando?
      </p>
    </div>
  );
}

function Calendar({ className, month, day, color, style }: { className: string; month: string; day: string; color: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={{ width: 132, borderRadius: 16, overflow: 'hidden', background: '#fff', boxShadow: '0 12px 32px rgba(45,26,31,0.14)', ...style }}>
      <div style={{ background: color, color: '#fff', fontFamily: MONO, fontSize: 12, fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '7px 0' }}>
        {month}
      </div>
      <div className="font-display" style={{ fontSize: 64, fontWeight: 900, lineHeight: 1.05, color: 'var(--ink)', padding: '6px 0 10px' }}>
        {day}
      </div>
    </div>
  );
}

/* ── Highlight — the story is read aloud, then marked as read ───────── */

function HighlightSlide({ y }: { y: YearStats }) {
  const root = useAnime<HTMLDivElement>((el) => {
    const split = splitText(el.querySelector<HTMLElement>('.hl-text')!, { words: true });
    utils.set('.hl-text', { opacity: 1 });
    utils.set(split.words, { opacity: 0, y: 10, filter: 'blur(6px)' });
    utils.set('.hl-emoji', { opacity: 0, scale: 0.3, rotate: -30 });
    utils.set('.hl-rest', { opacity: 0, y: 14 });

    createTimeline({ defaults: { ease: 'outExpo' } })
      .add('.hl-emoji', { opacity: 1, scale: 1, rotate: 0, duration: 900, ease: 'outBack(2)' }, 100)
      .add(split.words, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 700, delay: stagger(55) }, 400)
      .add('.hl-rest', { opacity: 1, y: 0, duration: 700, delay: stagger(250) }, `+=${100}`)
      .add('.hl-tick', { color: READ_BLUE, duration: 300 }, '+=500');

    return () => split.revert();
  }, [y.year]);

  return (
    <div ref={root} style={{ ...column, justifyContent: 'center' }}>
      <div className="hl-emoji pre-anim" style={{ fontSize: 60, display: 'inline-block', alignSelf: 'flex-start' }}>{y.emoji}</div>
      <p className="hl-text pre-anim font-display italic" style={{ fontSize: 'clamp(22px, 6.6vw, 26px)', fontWeight: 600, lineHeight: 1.3, margin: '18px 0 0', color: INK }}>
        {y.highlight}
      </p>
      <div className="hl-rest pre-anim" style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid rgba(45,26,31,0.10)', fontSize: 13.5, lineHeight: 1.5, color: SUB }}>
        {y.funFact}
      </div>
      <div className="hl-rest pre-anim" style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
        <div style={{ padding: '10px 16px', fontSize: 13, borderRadius: '16px 16px 4px 16px', background: `${y.color}18`, border: `1px solid ${y.color}30`, color: y.color }}>
          ese fue {y.year} <span className="hl-tick" style={{ color: 'rgba(45,26,31,0.35)', marginLeft: 4 }}>✓✓</span>
        </div>
      </div>
    </div>
  );
}

/* ── Closing — fireworks in every year's colour ─────────────────────── */

const SPARKS = 12;
const BURSTS = [
  { left: '22%', top: '18%', delay: 600 },
  { left: '78%', top: '26%', delay: 1400 },
  { left: '50%', top: '8%', delay: 2200 },
];

function ClosingSlide({ y }: { y: YearStats }) {
  const g = globalStats;
  const palette = yearStats.map((ys) => ys.color);

  const root = useAnime<HTMLDivElement>((el) => {
    const split = splitText(el.querySelector<HTMLElement>('.cl-type')!, { chars: true });
    utils.set('.cl-type', { opacity: 1 });
    utils.set(split.chars, { opacity: 0 });
    revealIn(1500);

    createTimeline()
      .add(split.chars, { opacity: 1, duration: 1, delay: stagger(55) }, 200)
      .add('.cl-caret', { opacity: [1, 0], duration: 500, loop: 6, alternate: true, ease: steps(1) }, 0);

    el.querySelectorAll<HTMLElement>('.fw').forEach((group, gi) => {
      animate(group.querySelectorAll('.spark'), {
        x: (_: unknown, i = 0) => [0, Math.cos((i / SPARKS) * Math.PI * 2) * utils.random(50, 80)],
        y: (_: unknown, i = 0) => [0, Math.sin((i / SPARKS) * Math.PI * 2) * utils.random(50, 80) + 20],
        scale: [1, 0.2],
        opacity: [1, 0],
        duration: 1400,
        delay: BURSTS[gi].delay,
        loopDelay: 1800,
        loop: true,
        ease: 'outExpo',
      });
    });

    animate('.cl-cta', { scale: [1, 1.04], duration: 1100, loop: true, alternate: true, ease: 'inOutSine', delay: 3200 });

    return () => split.revert();
  }, [y.year]);

  return (
    <div ref={root} style={centered}>
      {BURSTS.map((b, gi) => (
        <div key={gi} className="fw" aria-hidden style={{ position: 'absolute', left: b.left, top: b.top, pointerEvents: 'none' }}>
          {Array.from({ length: SPARKS }, (_, i) => (
            <span key={i} className="spark" style={{ position: 'absolute', width: 7, height: 7, borderRadius: '50%', background: palette[(i + gi) % palette.length], opacity: 0 }} />
          ))}
        </div>
      ))}

      <p className="font-display italic" style={{ fontSize: 34, fontWeight: 700, lineHeight: 1.15, margin: 0, color: INK, position: 'relative' }}>
        <span className="cl-type pre-anim">Y la historia continúa…</span>
        <span className="cl-caret" style={{ display: 'inline-block', width: 2, height: '0.9em', background: y.color, marginLeft: 4, verticalAlign: '-0.1em' }} />
      </p>
      <div className="rv pre-anim" style={{ fontWeight: 800, fontSize: 'clamp(48px, 15vw, 60px)', letterSpacing: '-0.03em', color: y.color, textShadow: `0 4px 30px ${y.color}55`, marginTop: 32 }}>
        <CountUp end={g.totalMessages} duration={2000} delay={1500} />
      </div>
      <div className="rv pre-anim font-display italic" style={{ fontSize: 20, color: INK }}>mensajes en total</div>
      <div className="rv pre-anim" style={{ fontFamily: MONO, fontSize: 12, color: 'var(--faint)', marginTop: 10 }}>
        desde el {g.startDate}
      </div>
      <p className="rv pre-anim" style={{ marginTop: 36, fontSize: 15, fontStyle: 'italic', maxWidth: 240, color: INK }}>
        11 años. Cada día, sin falta. ♥
      </p>
      <div className="rv pre-anim" style={{ display: 'flex', gap: 6, marginTop: 18 }}>
        {yearStats.map((ys) => <span key={ys.year} title={String(ys.year)} style={{ fontSize: 18 }}>{ys.emoji}</span>)}
      </div>
      {/* The way out of the wrap: on to the full stats. Pointer events stop here so
          the story's tap-to-advance doesn't also fire. */}
      <a
        href="/stats"
        className="rv pre-anim cl-cta"
        onPointerDown={(e) => e.stopPropagation()}
        onPointerUp={(e) => e.stopPropagation()}
        style={{
          position: 'relative', marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '14px 26px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 15,
          color: '#fff', background: `linear-gradient(135deg, ${y.color}cc, ${y.color})`,
          boxShadow: `0 10px 30px ${y.color}55`,
        }}
      >
        Ver estadísticas <span aria-hidden style={{ fontSize: 17 }}>→</span>
      </a>
    </div>
  );
}
