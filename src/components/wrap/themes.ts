import type { YearStats } from '../../lib/types';

export type SlideType = 'cover' | 'messages' | 'love' | 'media' | 'topics' | 'topDay' | 'highlight' | 'closing';

export const SLIDE_LABELS: Record<SlideType, string> = {
  cover: 'Portada',
  messages: 'Mensajes',
  love: 'Te amo',
  media: 'Multimedia',
  topics: 'Temas',
  topDay: 'Día récord',
  highlight: 'El momento',
  closing: 'Continuará',
};

/** The final year also gets the closing slide. */
export function getSlides(isLast: boolean): SlideType[] {
  const base: SlideType[] = ['cover', 'messages', 'love', 'media', 'topics', 'topDay', 'highlight'];
  return isLast ? [...base, 'closing'] : base;
}

// Each year gets its own ambient "weather", matching its emoji and story.
export type YearTheme = 'petals' | 'embers' | 'stars' | 'hearts' | 'signal' | 'leaves';

const THEME_BY_EMOJI: Record<string, YearTheme> = {
  '🌹': 'petals',  // 2020 — el chat más antiguo
  '🔥': 'embers',  // 2022 — volvieron con todo
  '🚀': 'stars',   // 2023 — año récord
  '💕': 'hearts',  // 2024 — equilibrio
  '📞': 'signal',  // 2025 — llamadas
  '🌱': 'leaves',  // 2026 — la historia continúa
};

export function themeFor(year: YearStats): YearTheme {
  return THEME_BY_EMOJI[year.emoji] ?? 'hearts';
}

// Deterministic pseudo-random so server and client render the same particles.
export function seeded(i: number, k = 0) {
  const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453;
  // Rounded so inline styles serialise identically on server and client.
  return Math.round((x - Math.floor(x)) * 100) / 100;
}
