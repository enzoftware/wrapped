import type { SignatureSlide, YearStats } from '../../lib/types';

export type SlideType = 'cover' | 'messages' | SignatureSlide | 'topDay' | 'highlight' | 'closing';

export const SLIDE_LABELS: Record<SlideType, string> = {
  cover: 'Portada',
  messages: 'Mensajes',
  night: 'De noche',
  love: 'Te amo',
  laughs: 'Risas',
  reply: 'Respuestas',
  calendar: 'Calendario',
  media: 'Multimedia',
  mornings: 'Buenos días',
  words: 'Palabras',
  calls: 'Llamadas',
  streak: 'La racha',
  stickers: 'Stickers',
  wordStory: 'Su palabra',
  topDay: 'Día récord',
  highlight: 'El momento',
  closing: 'Continuará',
};

/**
 * Every year opens and closes the same way, but the middle is its own: two
 * signature slides that look at what made that year different. The final
 * year also gets the closing slide.
 */
export function getSlides(year: YearStats, isLast: boolean): SlideType[] {
  const slides: SlideType[] = ['cover', 'messages', ...year.signature, 'topDay', 'highlight'];
  return isLast ? [...slides, 'closing'] : slides;
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
