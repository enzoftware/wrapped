'use client';
import { animate, createDrawable, stagger, utils } from 'animejs';
import type { YearStats } from '../../lib/types';
import { useAnime } from '../../lib/anim';
import { seeded, themeFor, type YearTheme } from './themes';

interface YearAmbientProps {
  year: YearStats;
}

const COUNT: Record<YearTheme, number> = {
  petals: 14, embers: 18, stars: 26, hearts: 14, signal: 4, leaves: 10,
};

/** Background "weather" for a year's story, driven by anime.js loops. */
export default function YearAmbient({ year }: YearAmbientProps) {
  const theme = themeFor(year);
  const n = COUNT[theme];
  const c = year.color;

  const root = useAnime<HTMLDivElement>((el) => {
    const h = el.clientHeight;
    const w = el.clientWidth;
    const items = el.querySelectorAll<HTMLElement>('.amb');

    switch (theme) {
      case 'petals':
        // Rose petals drifting down and tumbling.
        items.forEach((p) => {
          animate(p, {
            y: [-40, h + 40],
            x: () => [0, utils.random(-60, 60)],
            rotate: () => [utils.random(-40, 40), utils.random(180, 420)],
            duration: () => utils.random(7000, 11000),
            delay: () => utils.random(0, 7000),
            ease: 'inOutSine',
            loop: true,
          });
        });
        break;

      case 'embers':
        // Sparks rising from the bottom and flickering out.
        items.forEach((p) => {
          animate(p, {
            y: () => [0, -utils.random(h * 0.45, h * 0.9)],
            x: () => [0, utils.random(-40, 40)],
            opacity: [0, 1, 0.8, 0],
            scale: [1, 0.3],
            duration: () => utils.random(2600, 4600),
            delay: () => utils.random(0, 3500),
            ease: 'outQuad',
            loop: true,
          });
        });
        break;

      case 'stars': {
        // Twinkling field plus the occasional shooting star.
        animate('.amb', {
          opacity: () => [utils.random(0.1, 0.3, 2), utils.random(0.7, 1, 2)],
          scale: [0.6, 1.2],
          duration: () => utils.random(900, 2200),
          delay: stagger(90, { from: 'random' }),
          loop: true,
          alternate: true,
          ease: 'inOutSine',
        });
        animate('.amb-streak', {
          x: [0, -w * 1.4],
          y: [0, w * 0.8],
          opacity: [0, 1, 0],
          duration: 1100,
          delay: stagger(2600, { start: 1200 }),
          loopDelay: 5200,
          loop: true,
          ease: 'inQuad',
        });
        break;
      }

      case 'hearts':
        // Enzo (blue) and Katy (pink) hearts rising side by side — the year of balance.
        items.forEach((p) => {
          animate(p, {
            y: () => [0, -utils.random(h * 0.6, h * 1.05)],
            x: () => [0, utils.random(-24, 24)],
            opacity: [0, 0.9, 0],
            scale: () => [0.6, utils.random(1, 1.5, 2)],
            duration: () => utils.random(4200, 6400),
            delay: () => utils.random(0, 5000),
            ease: 'outSine',
            loop: true,
          });
        });
        break;

      case 'signal':
        // Concentric call waves radiating out, like a phone ringing.
        animate('.amb', {
          scale: [0.2, 3.2],
          opacity: [0.55, 0],
          duration: 3600,
          delay: stagger(900),
          loop: true,
          ease: 'outSine',
        });
        break;

      case 'leaves': {
        // A vine grows along the bottom, leaves float up from it.
        const [vine] = createDrawable(el.querySelector('.amb-vine path')!);
        animate(vine, { draw: ['0 0', '0 1'], duration: 2600, ease: 'inOutSine' });
        items.forEach((p) => {
          animate(p, {
            y: () => [0, -utils.random(h * 0.4, h * 0.85)],
            x: () => [0, utils.random(-50, 50)],
            rotate: () => [0, utils.random(-160, 160)],
            opacity: [0, 0.85, 0],
            duration: () => utils.random(6000, 9000),
            delay: () => utils.random(800, 6000),
            ease: 'inOutSine',
            loop: true,
          });
        });
        break;
      }
    }
  }, [year.year]);

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {Array.from({ length: n }, (_, i) => <Particle key={i} i={i} theme={theme} color={c} />)}

      {theme === 'stars' && [0, 1].map((i) => (
        <div
          key={`s${i}`}
          className="amb-streak"
          style={{
            position: 'absolute', top: `${8 + i * 18}%`, left: `${70 + i * 18}%`,
            width: 90, height: 2, borderRadius: 2, opacity: 0,
            background: `linear-gradient(90deg, ${c}, transparent)`,
            transform: 'rotate(-30deg)',
          }}
        />
      ))}

      {theme === 'leaves' && (
        <svg className="amb-vine" viewBox="0 0 400 60" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: 60 }}>
          <path d="M0 50 C60 20 90 58 150 36 S250 10 300 34 S370 52 400 22" fill="none" stroke={c} strokeOpacity={0.35} strokeWidth={2} strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

function Particle({ i, theme, color }: { i: number; theme: YearTheme; color: string }) {
  const r1 = seeded(i, 1);
  const r2 = seeded(i, 2);
  const px = (n: number) => Math.round(n * 10) / 10;
  const base: React.CSSProperties = { position: 'absolute', willChange: 'transform, opacity' };

  switch (theme) {
    case 'petals': {
      const s = px(9 + r2 * 8);
      return (
        <div className="amb" style={{
          ...base, left: `${px(r1 * 96)}%`, top: 0, width: s, height: px(s * 1.35),
          borderRadius: '80% 0 80% 0', background: color, opacity: px(0.18 + r2 * 0.14),
          transform: 'translateY(-40px)',
        }} />
      );
    }
    case 'embers': {
      const s = px(3 + r2 * 4);
      return (
        <div className="amb" style={{
          ...base, left: `${px(6 + r1 * 88)}%`, bottom: 0, width: s, height: s, borderRadius: '50%',
          background: i % 3 ? color : '#f5a623', boxShadow: `0 0 ${px(s * 2)}px ${color}`, opacity: 0,
        }} />
      );
    }
    case 'stars': {
      const s = px(2 + r2 * 2.5);
      return (
        <div className="amb" style={{
          ...base, left: `${px(r1 * 100)}%`, top: `${px(seeded(i, 3) * 100)}%`, width: s, height: s,
          borderRadius: '50%', background: color, opacity: 0.25,
        }} />
      );
    }
    case 'hearts': {
      const enzo = i % 2 === 0;
      return (
        <div className="amb" style={{
          ...base, left: `${px(enzo ? 4 + r1 * 40 : 56 + r1 * 40)}%`, bottom: -10,
          fontSize: px(12 + r2 * 10), color: enzo ? 'var(--enzo)' : 'var(--katy)', opacity: 0,
        }}>♥</div>
      );
    }
    case 'signal':
      return (
        <div className="amb" style={{
          ...base, left: '50%', top: '26%', width: 160, height: 160, margin: '-80px 0 0 -80px',
          borderRadius: '50%', border: `1.5px solid ${color}`, opacity: 0,
        }} />
      );
    case 'leaves':
      return (
        <div className="amb" style={{
          ...base, left: `${px(6 + r1 * 88)}%`, bottom: 24, fontSize: px(12 + r2 * 8), opacity: 0,
          filter: 'saturate(0.8)',
        }}>{i % 3 === 0 ? '🌿' : '🍃'}</div>
      );
  }
}
