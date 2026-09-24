'use client';
import { animate, utils } from 'animejs';
import { useAnime } from '../lib/anim';

interface FloatingHeartsProps {
  color?: string;
  n?: number;
}

const SEED = [
  [8, 82, 18, 0.22], [22, 40, 12, 0.18], [40, 88, 22, 0.28],
  [58, 30, 14, 0.20], [74, 70, 20, 0.24], [88, 46, 12, 0.16],
  [15, 16, 16, 0.22], [48, 60, 11, 0.14], [66, 12, 18, 0.20],
  [82, 90, 15, 0.18], [31, 72, 13, 0.16], [92, 22, 14, 0.20],
  [5, 54, 12, 0.14], [55, 4, 16, 0.22],
];

export default function FloatingHearts({ color = '#d4687a', n = 14 }: FloatingHeartsProps) {
  const hearts = SEED.slice(0, n);

  const root = useAnime<HTMLDivElement>((el) => {
    // Each heart wanders on its own loop so the field never looks synchronised.
    el.querySelectorAll('.fh').forEach((heart) => {
      animate(heart, {
        y: () => utils.random(-22, -8),
        x: () => utils.random(-8, 8),
        rotate: () => utils.random(-14, 14),
        scale: [1, 1.12],
        duration: () => utils.random(2800, 4600),
        delay: () => utils.random(0, 1800),
        ease: 'inOutSine',
        loop: true,
        alternate: true,
      });
    });
  }, [n]);

  return (
    <div ref={root} className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {hearts.map((h, i) => (
        <div
          key={i}
          className="fh"
          style={{
            position: 'absolute', left: `${h[0]}%`, top: `${h[1]}%`,
            fontSize: h[2], color, opacity: h[3], willChange: 'transform',
          }}
        >
          ♥
        </div>
      ))}
    </div>
  );
}
