'use client';
import { createTimeline, stagger, utils } from 'animejs';
import type { YearStats } from '../../lib/types';
import { useAnimeInView } from '../../lib/anim';

interface YearlyBarChartProps {
  years: YearStats[];
}

const CHART_HEIGHT = 160;

export default function YearlyBarChart({ years }: YearlyBarChartProps) {
  const max = Math.max(...years.flatMap((y) => [y.enzo, y.katy]));

  // Enzo and Katy's bars race up side by side; each year's emoji pops on top.
  const root = useAnimeInView<HTMLDivElement>(() => {
    utils.set('.yb-bar', { scaleY: 0 });
    utils.set('.yb-top', { opacity: 0, y: 10, scale: 0.4 });
    return createTimeline({ autoplay: false, defaults: { ease: 'outExpo' } })
      .add('.yb-bar', { scaleY: 1, duration: 1100, delay: stagger(60), ease: 'outElastic(1, .8)' }, 0)
      .add('.yb-top', { opacity: 1, y: 0, scale: 1, duration: 700, delay: stagger(90), ease: 'outBack(2)' }, 500);
  }, [years.length]);

  return (
    <div ref={root} className="flex flex-col">
      {/* legend */}
      <div className="flex gap-4 mb-4" style={{ fontSize: 12, color: 'var(--sub)' }}>
        {[{ n: 'Enzo', c: 'var(--enzo)' }, { n: 'Katy', c: 'var(--katy)' }].map((l) => (
          <span key={l.n} className="flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-[3px]" style={{ background: l.c }} />
            {l.n}
          </span>
        ))}
      </div>

      <div className="flex items-end gap-2 lg:gap-6" style={{ height: CHART_HEIGHT + 44 }}>
        {years.map((y) => (
          <div key={y.year} className="flex-1 h-full flex flex-col items-center justify-end">
            <div className="yb-top flex flex-col items-center mb-1.5">
              <span style={{ fontSize: 14 }}>{y.emoji}</span>
              <span className="font-mono-custom" style={{ fontSize: 9, color: 'var(--faint)' }}>{(y.total / 1000).toFixed(0)}k</span>
            </div>
            <div className="flex items-end justify-center gap-0.5 w-full">
              {[{ v: y.enzo, c: 'var(--enzo)' }, { v: y.katy, c: 'var(--katy)' }].map((b, i) => (
                <div
                  key={i}
                  className="yb-bar origin-bottom shrink-0 w-3 lg:w-7"
                  style={{ height: Math.round((b.v / max) * CHART_HEIGHT), borderRadius: '4px 4px 0 0', background: b.c }}
                  title={`${i === 0 ? 'Enzo' : 'Katy'} ${y.year}: ${b.v.toLocaleString('en-US')}`}
                />
              ))}
            </div>
            <div className="mt-2 font-semibold" style={{ fontSize: 11, color: 'var(--sub)' }}>{y.year}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
