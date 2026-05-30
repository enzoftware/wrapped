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
  apodos: { name: string; count: number }[];
  // New stats
  risas: number;
  mensajesNocturnos: number;
  cumplidos: number;
  outingTypes: OutingType[];
  planesPerYear: { year: number; count: number }[];
  dayActivity: DayActivity[];
}
