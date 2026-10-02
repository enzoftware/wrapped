// Computes the countable stats in src/data/stats.ts from a WhatsApp export.
// Usage: bun scripts/parse-chat.ts [path/to/_chat.txt]   (default: data/_chat.txt)
//
// Prints JSON. Copy the numbers into src/data/stats.ts by hand — editorial
// fields (topics, outings, plans, nicknames, themes, highlights, fun facts,
// colors) aren't computed here; see "Updating the content" in the README.

const path = process.argv[2] ?? 'data/_chat.txt';
const text = await Bun.file(path).text();

// "[6/18/20, 11:38:29 PM] Katy Pizan: text" — WhatsApp puts U+202F (narrow
// no-break space) before AM/PM, and marks media/call/system entries with
// U+200E (left-to-right mark), e.g. "\u200eimage omitted" or "Xd \u200eimage omitted".
const HEADER = /^\u200e?\[(\d{1,2})\/(\d{1,2})\/(\d{2}), (\d{1,2}):(\d{2}):(\d{2})[\s\u202f]([AP]M)\] ([^:]+): (.*)$/;
const LRM = '\u200e';

type Msg = { date: Date; year: number; day: string; author: 'enzo' | 'katy'; body: string; isText: boolean };

const all: Msg[] = [];
for (const line of text.split(/\r?\n/)) {
  const m = HEADER.exec(line);
  if (!m) {
    // Continuation of a multi-line message.
    if (all.length && line) all[all.length - 1].body += '\n' + line;
    continue;
  }
  const [, mo, d, yy, h, mi, s, ap, name, body] = m;
  const hour = (Number(h) % 12) + (ap === 'PM' ? 12 : 0);
  const date = new Date(2000 + Number(yy), Number(mo) - 1, Number(d), hour, Number(mi), Number(s));
  all.push({
    date,
    year: date.getFullYear(),
    day: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
    author: name.startsWith('Enzo') ? 'enzo' : 'katy',
    body: body.replaceAll(LRM, ''),
    isText: !body.includes(LRM),
  });
}

const RE = {
  teAmo: /te amo/gi,
  teExtrano: /te extra[ñn]o/gi,
  risas: /\b(ja){2,}\w*|\bxd+\b/gi,
  fotos: /image omitted/,
  videos: /video omitted/,
  audios: /audio omitted/,
  stickers: /sticker omitted/,
  llamadas: /^Voice call/,
  videollamadas: /^Video call/,
};

// Keyword stats count occurrences in text messages; media/calls count entries
// (a captioned photo counts as a photo, not a text message).
const occurrences = (list: Msg[], re: RegExp) =>
  list.reduce((n, m) => n + (m.isText ? (m.body.match(re)?.length ?? 0) : 0), 0);
const entries = (list: Msg[], re: RegExp) => list.filter((m) => !m.isText && re.test(m.body.split('\n')[0])).length;
const texts = (list: Msg[]) => list.filter((m) => m.isText);
const by = (list: Msg[], author: Msg['author']) => list.filter((m) => m.author === author);

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const fmtDay = (iso: string, short = false) => {
  const [y, m, d] = iso.split('-').map(Number);
  const month = MONTHS[m - 1];
  return `${d} ${short ? month.slice(0, 3) : month} ${y}`;
};

function days(list: Msg[]) {
  const perDay = new Map<string, number>();
  for (const m of texts(list)) perDay.set(m.day, (perDay.get(m.day) ?? 0) + 1);
  const [day, messages] = [...perDay].sort((a, b) => b[1] - a[1])[0];
  return { top: { day, messages }, active: perDay.size };
}

function counts(list: Msg[]) {
  return {
    total: texts(list).length,
    enzo: texts(by(list, 'enzo')).length,
    katy: texts(by(list, 'katy')).length,
    teAmo: occurrences(list, RE.teAmo),
    teExtrano: occurrences(list, RE.teExtrano),
    fotos: entries(list, RE.fotos),
    audios: entries(list, RE.audios),
    stickers: entries(list, RE.stickers),
    videos: entries(list, RE.videos),
    llamadas: entries(list, RE.llamadas),
    videollamadas: entries(list, RE.videollamadas),
  };
}

// ── Per-year signals: what each year's signature slides draw ──────────────

const LAUGHS = [
  { label: 'jajaja', re: /\b(?:ja){2,}j?\b/gi },
  { label: 'jejeje', re: /\b(?:je){2,}j?\b/gi },
  { label: 'xd', re: /\bx+d+\b/gi },
  { label: 'jsjs', re: /\b(?:js){2,}\b/gi },
  { label: 'jiji', re: /\b(?:ji){2,}j?\b/gi },
];
const BUENOS_DIAS = /buen(?:os)? d[ií]as/i;
const REPLY_WINDOW_MIN = 360; // a gap longer than 6 h is a new conversation, not a reply

const median = (xs: number[]) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};
const perMonth = (list: Msg[]) => {
  const out = Array<number>(12).fill(0);
  for (const m of list) out[m.date.getMonth()]++;
  return out;
};

/** Longest run of consecutive days with at least one entry, and where it starts/ends. */
function longestStreak(dayKeys: Iterable<string>) {
  const sorted = [...new Set(dayKeys)].sort();
  let best = { days: sorted.length ? 1 : 0, from: sorted[0], to: sorted[0] };
  let run = 1;
  let from = sorted[0];
  for (let i = 1; i < sorted.length; i++) {
    const next = Date.parse(sorted[i]) - Date.parse(sorted[i - 1]) === 86_400_000;
    run = next ? run + 1 : 1;
    if (!next) from = sorted[i];
    if (run > best.days) best = { days: run, from, to: sorted[i] };
  }
  return best;
}

function signals(year: number, list: Msg[]) {
  const text = texts(list);
  const hours = Array<number>(24).fill(0);
  for (const m of text) hours[m.date.getHours()]++;

  // Reply time: whenever the author changes within the window, the gap is a reply.
  const replies = { enzo: [] as number[], katy: [] as number[] };
  for (let i = 1; i < list.length; i++) {
    const gap = (list[i].date.getTime() - list[i - 1].date.getTime()) / 1000;
    if (list[i].author !== list[i - 1].author && gap < REPLY_WINDOW_MIN * 60) replies[list[i].author].push(gap);
  }

  // Text messages for every day of the year, Jan 1 → Dec 31 (for calendar heatmaps).
  const daily = Array<number>(new Date(year, 1, 29).getDate() === 29 ? 366 : 365).fill(0);
  for (const m of text) daily[Math.round((new Date(year, m.date.getMonth(), m.date.getDate()).getTime() - new Date(year, 0, 1).getTime()) / 86_400_000)]++;

  return {
    activeDays: new Set(list.map((m) => m.day)).size,
    streak: longestStreak(list.map((m) => m.day)).days,
    hourly: hours,
    monthly: perMonth(text),
    risas: occurrences(list, RE.risas),
    laughStyles: LAUGHS.map(({ label, re }) => ({ label, count: occurrences(list, re) })).filter((l) => l.count > 0),
    replySeconds: { enzo: Math.round(median(replies.enzo)), katy: Math.round(median(replies.katy)) },
    buenosDias: {
      enzo: text.filter((m) => m.author === 'enzo' && BUENOS_DIAS.test(m.body)).length,
      katy: text.filter((m) => m.author === 'katy' && BUENOS_DIAS.test(m.body)).length,
    },
    videoCallsByMonth: perMonth(list.filter((m) => !m.isText && RE.videollamadas.test(m.body.split('\n')[0]))),
    daily,
  };
}

const hourly = Array<number>(24).fill(0);
const weekday = Array<number>(7).fill(0);
for (const m of texts(all)) {
  hourly[m.date.getHours()]++;
  weekday[m.date.getDay()]++;
}

const first = all[0];
const last = all[all.length - 1];
const totals = counts(all);
const overall = days(all);
const DAY_LABELS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

console.log(JSON.stringify({
  globalStats: {
    startDate: fmtDay(first.day),
    endDate: fmtDay(last.day),
    totalDays: Math.round((Date.parse(last.day) - Date.parse(first.day)) / 86_400_000),
    activeDays: overall.active,
    totalMessages: totals.total,
    enzo: { total: totals.enzo, teAmo: occurrences(by(all, 'enzo'), RE.teAmo) },
    katy: { total: totals.katy, teAmo: occurrences(by(all, 'katy'), RE.teAmo) },
    teAmoTotal: totals.teAmo,
    teExtrano: totals.teExtrano,
    fotos: totals.fotos,
    videos: totals.videos,
    audios: totals.audios,
    stickers: totals.stickers,
    llamadas: totals.llamadas,
    videollamadas: totals.videollamadas,
    hourly,
    mostActiveDay: { date: fmtDay(overall.top.day), messages: overall.top.messages },
    longestStreak: (({ days, from, to }) => ({ days, from: fmtDay(from, true), to: fmtDay(to, true) }))(longestStreak(all.map((m) => m.day))),
    risas: occurrences(all, RE.risas),
    mensajesNocturnos: hourly.slice(0, 4).reduce((a, b) => a + b, 0), // 12–3am
    dayActivity: DAY_LABELS.map((day, i) => ({ day, count: weekday[(i + 1) % 7] })),
  },
  yearStats: [...new Set(all.map((m) => m.year))].map((year) => {
    const list = all.filter((m) => m.year === year);
    const { top } = days(list);
    return { year, ...counts(list), topDay: { date: fmtDay(top.day, true), messages: top.messages }, signals: signals(year, list) };
  }),
}, null, 2));
