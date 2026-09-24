'use client';
import { useEffect, useRef } from 'react';
import { useInView } from 'motion/react';
import { animate } from 'animejs';
import { prefersReducedMotion } from '../lib/anim';

interface CountUpProps {
  end: number;
  duration?: number;
  delay?: number;
  className?: string;
  format?: (n: number) => string;
}

const defaultFormat = (n: number) => n.toLocaleString('en-US');

export default function CountUp({ end, duration = 1800, delay = 0, className, format = defaultFormat }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-10% 0px' });

  useEffect(() => {
    const el = ref.current;
    if (!isInView || !el) return;
    if (prefersReducedMotion()) { el.textContent = format(end); return; }

    // Tween a plain object and write straight to the DOM — no React re-render per frame.
    const counter = { v: 0 };
    const anim = animate(counter, {
      v: end,
      duration,
      delay,
      ease: 'outExpo',
      onUpdate: () => { el.textContent = format(Math.round(counter.v)); },
    });
    return () => { anim.pause(); };
  }, [isInView, end, duration, delay, format]);

  return (
    <span ref={ref} className={className} style={{ fontVariantNumeric: 'tabular-nums' }}>
      {format(0)}
    </span>
  );
}
