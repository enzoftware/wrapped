'use client';
import { useState } from 'react';
import { animate, createTimeline, stagger, utils } from 'animejs';
import { useAnimeInView } from '../../lib/anim';

interface HourlyActivityProps {
  data: number[];
}

const CHART_H = 140;
const SKY_H = 44;

const hrLabel = (hr: number) => {
  if (hr === 0) return '12am';
  if (hr < 12) return `${hr}am`;
  if (hr === 12) return '12pm';
  return `${hr - 12}pm`;
};

/** Height (0–1) of the sun/moon over the chart at a point `t` (0–1) of the day. */
function skyArc(t: number) {
  const day = (t - 0.25) / 0.5;
  if (day >= 0 && day <= 1) return { h: Math.sin(Math.PI * day), sun: true };
  const night = t < 0.25 ? (t + 0.25) / 0.5 : (t - 0.75) / 0.5;
  return { h: 0.55 * Math.sin(Math.PI * night), sun: false };
}

export default function HourlyActivity({ data }: HourlyActivityProps) {
  const max = Math.max(...data);
  const [selected, setSelected] = useState<number | null>(null);

  // Bars rise hour by hour while the sun crosses the sky and the moon takes over.
  const root = useAnimeInView<HTMLDivElement>((el) => {
    const body = el.querySelector<HTMLElement>('.sky-body')!;
    const glyph = body.querySelector<HTMLElement>('span')!;
    utils.set('.hr-bar', { scaleY: 0 });
    utils.set(body, { opacity: 0 });

    const clock = { t: 0 };
    const place = () => {
      const { h, sun } = skyArc(clock.t);
      body.style.left = `${clock.t * 100}%`;
      body.style.bottom = `${h * (SKY_H - 18)}px`;
      glyph.textContent = sun ? '☀️' : '🌙';
    };
    place();

    return [
      createTimeline({ autoplay: false })
        .add('.hr-bar', { scaleY: 1, duration: 900, delay: stagger(55), ease: 'outElastic(1, .7)' }, 0)
        .add(body, { opacity: 1, duration: 300 }, 0),
      animate(clock, { t: 23.5 / 24, duration: 55 * 24 + 600, ease: 'inOutSine', autoplay: false, onUpdate: place }),
    ];
  });

  return (
    <div ref={root} className="flex flex-col" style={{ minHeight: CHART_H + SKY_H + 30 }}>
      {/* sky strip for the sun / moon */}
      <div className="relative" style={{ height: SKY_H, margin: '0 10px' }} aria-hidden>
        <div className="sky-body absolute" style={{ left: '0%', bottom: 0, transform: 'translateX(-50%)', fontSize: 18, lineHeight: 1 }}>
          <span>🌙</span>
        </div>
      </div>

      <div className="relative flex items-end gap-[3px]" style={{ height: CHART_H }}>
        {data.map((v, hr) => {
          const active = hr >= 10 && hr <= 19;
          const heightPct = Math.max(Math.round((v / max) * 1000) / 10, 2);
          return (
            <button
              key={hr}
              type="button"
              className="relative flex-1 h-full flex flex-col items-center justify-end border-0 bg-transparent p-0 cursor-pointer"
              onMouseEnter={() => setSelected(hr)}
              onMouseLeave={() => setSelected(null)}
              onClick={() => setSelected((s) => (s === hr ? null : hr))}
              aria-label={`${hrLabel(hr)}: ${v.toLocaleString('en-US')} mensajes`}
            >
              {selected === hr && (
                <div
                  className="absolute z-10 whitespace-nowrap font-mono-custom"
                  style={{
                    bottom: `calc(${heightPct}% + 8px)`, left: '50%', transform: 'translateX(-50%)',
                    background: 'var(--ink)', color: 'white', fontSize: 10, padding: '4px 8px', borderRadius: 6,
                    boxShadow: '0 2px 8px rgba(45,26,31,0.2)',
                  }}
                >
                  {hrLabel(hr)}: {v.toLocaleString('en-US')}
                </div>
              )}
              <div
                className="hr-bar w-full origin-bottom"
                style={{
                  height: `${heightPct}%`,
                  borderRadius: 3,
                  background: active ? 'linear-gradient(180deg, #e07888, #d4687a)' : 'rgba(45,26,31,0.1)',
                  boxShadow: active ? '0 0 8px rgba(212,104,122,0.3)' : 'none',
                  outline: selected === hr ? '2px solid var(--ink)' : 'none',
                  outlineOffset: 1,
                }}
              />
            </button>
          );
        })}
      </div>
      <div className="flex justify-between mt-2.5 font-mono-custom" style={{ fontSize: 10, color: 'var(--faint)' }}>
        <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span>
      </div>
    </div>
  );
}
