/** The year-specific slides; each one is a different way of looking at that year. */
export type SignatureSlide =
  | 'night' | 'love' | 'laughs' | 'reply' | 'calendar' | 'media'
  | 'mornings' | 'words' | 'calls' | 'streak' | 'stickers' | 'wordStory';

/** Computed per year by scripts/parse-chat.ts — what the signature slides draw. */
export interface YearSignals {
  activeDays: number;
  /** Longest run of consecutive days inside the year. */
  streak: number;
  /** Text messages per hour, 0–23. */
  hourly: number[];
  /** Text messages per month, Jan–Dec. */
  monthly: number[];
  risas: number;
  laughStyles: { label: string; count: number }[];
  /** Median time to answer the other, in seconds. */
  replySeconds: { enzo: number; katy: number };
  buenosDias: { enzo: number; katy: number };
  videoCallsByMonth: number[];
  /** Text messages for every day, Jan 1 → Dec 31 — only kept for years drawn as a calendar. */
  daily?: number[];
}

export interface YearStats {
  year: number;
  total: number;
  enzo: number;
  katy: number;
  teAmo: number;
  teExtrano: number;
  planes: number;
  fotos: number;
  audios: number;
  stickers: number;
  videos: number;
  llamadas: number;
  videollamadas: number;
  color: string;
  grad: [string, string];
  emoji: string;
  theme: string;
  topDay: { date: string; messages: number };
  highlight: string;
  funFact: string;
  signature: [SignatureSlide, SignatureSlide];
  signals: YearSignals;
  /** Hand-picked words that this year used far more than any other (for the `words` slide). */
  words?: { note: string; list: { word: string; count: number }[] };
  /** One word's life across the years (for the `wordStory` slide). */
  wordStory?: { word: string; byYear: { year: number; count: number }[] };
}

export interface Topic {
  name: string;
  count: number;
}

export interface OutingType {
  emoji: string;
  name: string;
  count: number;
}

export interface DayActivity {
  day: string;
  count: number;
}

export interface GlobalStats {
  startDate: string;
  endDate: string;
  totalDays: number;
  activeDays: number;
  totalMessages: number;
  enzo: { total: number; teAmo: number };
  katy: { total: number; teAmo: number };
  teAmoTotal: number;
  teExtrano: number;
  planes: number;
  fotos: number;
  videos: number;
  audios: number;
  stickers: number;
  llamadas: number;
  videollamadas: number;
  topTopics: Topic[];
  hourly: number[];
  mostActiveDay: { date: string; messages: number };
  longestStreak: { days: number; from: string; to: string };
  apodos: { name: string; count: number }[];
  // New stats
  risas: number;
  mensajesNocturnos: number;
  cumplidos: number;
  outingTypes: OutingType[];
  planesPerYear: { year: number; count: number }[];
  dayActivity: DayActivity[];
}
