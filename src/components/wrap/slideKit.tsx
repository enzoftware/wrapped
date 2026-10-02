import { animate, stagger, utils } from 'animejs';

// Shared building blocks for the wrap's slides.

export const MONO = '"Roboto Mono", monospace';
export const INK = 'var(--ink)';
export const SUB = 'var(--sub)';
export const READ_BLUE = '#34B7F1';

export const column: React.CSSProperties = { display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 };
export const centered: React.CSSProperties = { ...column, alignItems: 'center', justifyContent: 'center', textAlign: 'center' };

export function Kicker({ children, color = SUB }: { children: React.ReactNode; color?: string }) {
  return (
    <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color }}>
      {children}
    </div>
  );
}

/** Kicker + display title, the top of most data slides. */
export function SlideHeader({ kicker, title, color }: { kicker: string; title: React.ReactNode; color?: string }) {
  return (
    <div className="rv pre-anim" style={{ marginTop: 8 }}>
      <Kicker color={color}>{kicker}</Kicker>
      <h3 className="font-display italic" style={{ fontSize: 28, fontWeight: 700, lineHeight: 1.12, margin: '6px 0 0', color: INK }}>{title}</h3>
    </div>
  );
}

/** Generic entrance for `.rv` elements; slides layer their thematic motion on top. */
export function revealIn(delay = 0) {
  utils.set('.rv', { opacity: 0, y: 14 });
  return animate('.rv', { opacity: 1, y: 0, duration: 700, delay: stagger(110, { start: delay }), ease: 'outExpo' });
}

/** 7.86 → "7.9" — per-day rates read better with one decimal. */
export const oneDecimal = (n: number) => (Math.round(n * 10) / 10).toFixed(1);
