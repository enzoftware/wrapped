/* foundations.jsx — design tokens, phone frame, shared chrome + a spec card.
   Exports to window: EKT, YEARS, GLOBAL, fmt, Phone, Foundations, Bokeh, Hearts */

const EKT = {
  bg:      '#0a0a0a',
  ink:     '#ffffff',
  sub:     'rgba(255,255,255,0.62)',
  faint:   'rgba(255,255,255,0.40)',
  hair:    'rgba(255,255,255,0.10)',
  card:    'rgba(255,255,255,0.05)',
  coral:   '#e85d75',   // global accent
  enzo:    '#5b8cff',   // azul
  katy:    '#ec4899',   // rosa
  W: 390, H: 844,
};

// per-year identity, straight from the spec
const YEARS = [
  { year: 2020, total: 8821,  enzo: 5284,  katy: 3537,  teAmo: 446, teExtrano: 8,  planes: 20,  fotos: 376,  audios: 87,  stickers: 85,  videos: 16,  llamadas: 0,  videollamadas: 0,
    color: '#e85d75', grad: ['#1a0a10', '#3d0d1f'], emoji: '🌹',
    theme: 'El inicio — pandemia, encierro y amor a distancia',
    topDay: { date: '22 ago 2020', messages: 392 },
    highlight: 'Empezaron a escribirse en plena pandemia. Enzo decía «te amo» más que nadie.',
    funFact: '85 stickers en el primer año — aprendían el lenguaje digital juntos.' },
  { year: 2022, total: 13584, enzo: 7228,  katy: 6356,  teAmo: 361, teExtrano: 43, planes: 42,  fotos: 416,  audios: 132, stickers: 507, videos: 61,  llamadas: 0,  videollamadas: 0,
    color: '#c2855a', grad: ['#120a04', '#3b1f0a'], emoji: '🔥',
    theme: 'El reencuentro — retomando lo que siempre fue',
    topDay: { date: '1 oct 2022', messages: 400 },
    highlight: 'Volvieron con todo. 43 veces se dijeron «te extraño» — el doble que el año anterior.',
    funFact: 'Los stickers se multiplicaron por 6×. Definitivamente encontraron su idioma.' },
  { year: 2023, total: 33962, enzo: 17773, katy: 16189, teAmo: 662, teExtrano: 60, planes: 158, fotos: 1177, audios: 602, stickers: 2153, videos: 116, llamadas: 4,  videollamadas: 1,
    color: '#a855f7', grad: ['#0d0518', '#1e0a3c'], emoji: '🚀',
    theme: 'El año récord — su conversación en modo explosivo',
    topDay: { date: '26 jul 2023', messages: 527 },
    highlight: 'Su año más hablador de toda la historia: 33,962 mensajes. El 26 de julio mandaron 527 en un solo día.',
    funFact: '602 audios enviados — empezaron a preferir la voz sobre el texto.' },
  { year: 2024, total: 30280, enzo: 14210, katy: 16070, teAmo: 713, teExtrano: 79, planes: 213, fotos: 1101, audios: 385, stickers: 1311, videos: 63,  llamadas: 28, videollamadas: 5,
    color: '#ec4899', grad: ['#120010', '#330026'], emoji: '💕',
    theme: 'El año del equilibrio — Katy toma la delantera',
    topDay: { date: '29 feb 2024', messages: 265 },
    highlight: 'Por primera vez, Katy escribió más que Enzo (16,070 vs 14,210). Y también ganó en «te amos»: 713, el máximo histórico.',
    funFact: 'El día más activo fue el 29 de febrero — un día que solo existe cada 4 años.' },
  { year: 2025, total: 32397, enzo: 16376, katy: 16021, teAmo: 657, teExtrano: 78, planes: 263, fotos: 1124, audios: 742, stickers: 1609, videos: 74,  llamadas: 82, videollamadas: 146,
    color: '#06b6d4', grad: ['#020c14', '#03253b'], emoji: '📞',
    theme: 'El año de las llamadas — conectados más allá del texto',
    topDay: { date: '29 mar 2025', messages: 290 },
    highlight: '146 videollamadas en un año — casi una cada 2.5 días. También el récord en planes coordinados: 263.',
    funFact: '742 audios enviados — su año más «vocal» de toda la historia.' },
  { year: 2026, total: 13061, enzo: 6788,  katy: 6273,  teAmo: 219, teExtrano: 15, planes: 108, fotos: 672,  audios: 276, stickers: 1070, videos: 64,  llamadas: 29, videollamadas: 6,
    color: '#10b981', grad: ['#021209', '#053d1e'], emoji: '🌱',
    theme: 'En curso — la historia continúa',
    topDay: { date: '1 feb 2026', messages: 308 },
    highlight: 'A mitad de año ya llevan 13,061 mensajes. Siguen escribiéndose todos los días.',
    funFact: 'Solo en los primeros 5 meses ya enviaron 672 fotos.' },
];

const GLOBAL = {
  startDate: '18 junio 2020', endDate: '30 mayo 2026',
  totalDays: 2172, activeDays: 1414, totalMessages: 132105,
  enzo: { total: 67659, teAmo: 1869 }, katy: { total: 64446, teAmo: 1423 },
  teAmoTotal: 3292, teExtrano: 284, planes: 895,
  fotos: 4886, videos: 395, audios: 2224, stickers: 6735,
  llamadas: 143, videollamadas: 158,
  topTopics: [
    { name: 'Sentimientos y amor', count: 4039 }, { name: 'Planes y salidas', count: 1953 },
    { name: 'Comida y restaurantes', count: 901 }, { name: 'Tecnología y entretenimiento', count: 724 },
    { name: 'Finanzas y dinero', count: 723 }, { name: 'Familia', count: 581 },
    { name: 'Viajes', count: 433 }, { name: 'Buenos días / noches', count: 401 },
    { name: 'Deportes y fútbol', count: 354 }, { name: 'Trabajo y estudio', count: 332 },
    { name: 'Salud y bienestar', count: 225 }, { name: 'Mascotas', count: 146 },
  ],
  hourly: [4370,2067,1123,583,240,227,591,1323,3010,5946,9019,9434,8670,8671,8481,8464,8238,8055,8512,7517,6959,7225,6942,6468],
  mostActiveDay: { date: '26 julio 2023', messages: 527 },
};

// match the spec's comma grouping (132,105) so handoff numbers read identically
const fmt = (n) => n.toLocaleString('en-US');

/* ---- phone chrome ---------------------------------------------------- */
function StatusBar({ tint = '#fff' }) {
  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 54, zIndex: 30,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      padding: '0 30px 8px', color: tint, pointerEvents: 'none' }}>
      <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600, letterSpacing: '.2px' }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="17" height="12" viewBox="0 0 17 12" fill={tint}><rect x="0" y="7" width="3" height="5" rx="1"/><rect x="4.5" y="4.5" width="3" height="7.5" rx="1"/><rect x="9" y="2" width="3" height="10" rx="1"/><rect x="13.5" y="0" width="3" height="12" rx="1"/></svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill={tint}><path d="M8 2.6c2.1 0 4 .8 5.4 2.1l1.5-1.5C13 1.2 10.6.2 8 .2 5.4.2 3 1.2 1.1 3.2l1.5 1.5C4 3.4 5.9 2.6 8 2.6Z"/><path d="M8 6.2c1.1 0 2.1.4 2.9 1.2l1.5-1.5C11.1 4.7 9.6 4 8 4s-3.1.7-4.4 1.9l1.5 1.5C5.9 6.6 6.9 6.2 8 6.2Z"/><circle cx="8" cy="10" r="1.7"/></svg>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <div style={{ width: 22, height: 11, borderRadius: 3, border: `1px solid ${tint}`, opacity: .9, padding: 1.5, display: 'flex' }}>
            <div style={{ flex: 1, background: tint, borderRadius: 1 }} />
          </div>
          <div style={{ width: 1.5, height: 4, background: tint, borderRadius: 1, opacity: .5 }} />
        </div>
      </div>
    </div>
  );
}

function HomeIndicator({ tint = 'rgba(255,255,255,.85)' }) {
  return <div style={{ position: 'absolute', bottom: 9, left: '50%', transform: 'translateX(-50%)',
    width: 134, height: 5, borderRadius: 3, background: tint, zIndex: 30 }} />;
}

// The screen. `bg` is the full-bleed background (color/gradient). Children render
// in the safe area between status bar and home indicator.
function Phone({ bg = EKT.bg, statusTint = '#fff', homeTint, children, pad = 26, noPad }) {
  return (
    <div style={{ position: 'relative', width: EKT.W, height: EKT.H, overflow: 'hidden',
      background: bg, borderRadius: 46, color: EKT.ink,
      fontFamily: 'Inter, sans-serif',
      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.06)' }}>
      <StatusBar tint={statusTint} />
      <div style={{ position: 'absolute', inset: 0, paddingTop: 54, paddingBottom: 34,
        paddingLeft: noPad ? 0 : pad, paddingRight: noPad ? 0 : pad,
        display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <HomeIndicator tint={homeTint} />
    </div>
  );
}

/* ---- ambient backgrounds --------------------------------------------- */
function Bokeh({ colors = ['#e85d75', '#ec4899', '#a855f7'] }) {
  const blobs = [
    { c: colors[0], x: '-12%', y: '6%',  s: 280, o: .22 },
    { c: colors[1], x: '64%',  y: '0%',  s: 220, o: .18 },
    { c: colors[2], x: '30%',  y: '58%', s: 320, o: .16 },
    { c: colors[0], x: '70%',  y: '66%', s: 200, o: .14 },
  ];
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {blobs.map((b, i) => (
        <div key={i} style={{ position: 'absolute', left: b.x, top: b.y, width: b.s, height: b.s,
          borderRadius: '50%', background: b.c, opacity: b.o, filter: 'blur(60px)' }} />
      ))}
    </div>
  );
}

function Hearts({ color = '#e85d75', n = 14 }) {
  const seed = [[8,82,18,.5,0],[22,40,12,.35,1.6],[40,88,22,.6,.4],[58,30,14,.4,2.2],
    [74,70,20,.55,1.1],[88,46,12,.32,.7],[15,16,16,.45,2.8],[48,60,11,.3,1.4],
    [66,12,18,.5,.2],[82,90,15,.42,2.5],[31,72,13,.36,.9],[92,22,14,.4,1.8],
    [5,54,12,.3,3.1],[55,4,16,.46,.6]].slice(0, n);
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {seed.map((h, i) => (
        <div key={i} style={{ position: 'absolute', left: h[0] + '%', top: h[1] + '%',
          fontSize: h[2], color, opacity: h[3], animation: `ekFloat ${7 + h[2] / 4}s ease-in-out ${h[4]}s infinite` }}>♥</div>
      ))}
    </div>
  );
}

/* ---- a foundations / tokens reference card for handoff --------------- */
function Foundations() {
  const Swatch = ({ c, name, hex }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ width: '100%', height: 52, borderRadius: 10, background: c, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.08)' }} />
      <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: EKT.ink, fontWeight: 600 }}>{name}</div>
      <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 10, color: EKT.faint, marginTop: -4 }}>{hex}</div>
    </div>
  );
  return (
    <div style={{ width: 760, minHeight: 844, background: '#0a0a0a', borderRadius: 20, color: EKT.ink,
      padding: 44, fontFamily: 'Inter, sans-serif', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.07)' }}>
      <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, letterSpacing: '.18em', color: EKT.coral, textTransform: 'uppercase' }}>Design tokens · handoff</div>
      <div className="dsp" style={{ fontSize: 46, marginTop: 10, fontWeight: 800, fontStyle: 'italic' }}>Enzo &amp; Katy Wrap</div>
      <div style={{ color: EKT.sub, fontSize: 15, marginTop: 6, maxWidth: 560 }}>Spotify-Wrapped-inspired, mobile-first. Dark intimate base, per-year color identities. Diseño en 390 × 844 (iPhone safe-area).</div>

      <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, letterSpacing: '.18em', color: EKT.faint, textTransform: 'uppercase', marginTop: 38 }}>Tipografía</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28, marginTop: 16 }}>
        <div>
          <div className="dsp" style={{ fontSize: 40, fontStyle: 'italic', fontWeight: 800 }}>Playfair Display</div>
          <div style={{ color: EKT.sub, fontSize: 13, marginTop: 4 }}>Display · títulos, años, cifras de portada. Italic 800/900.</div>
        </div>
        <div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 34, fontWeight: 800 }}>Inter</div>
          <div style={{ color: EKT.sub, fontSize: 13, marginTop: 4 }}>UI + cifras de datos + cuerpo. 400 / 600 / 800.</div>
        </div>
      </div>

      <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, letterSpacing: '.18em', color: EKT.faint, textTransform: 'uppercase', marginTop: 36 }}>Base + acentos</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginTop: 16 }}>
        <Swatch c="#0a0a0a" name="Fondo" hex="#0a0a0a" />
        <Swatch c={EKT.coral} name="Coral · global" hex="#e85d75" />
        <Swatch c={EKT.enzo} name="Enzo" hex="#5b8cff" />
        <Swatch c={EKT.katy} name="Katy" hex="#ec4899" />
        <Swatch c="#ffffff" name="Tinta" hex="#ffffff" />
      </div>

      <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, letterSpacing: '.18em', color: EKT.faint, textTransform: 'uppercase', marginTop: 36 }}>Identidad por año</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: 12, marginTop: 16 }}>
        {YEARS.map((y) => (
          <div key={y.year} style={{ borderRadius: 12, height: 116, padding: 12, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            background: `linear-gradient(160deg, ${y.grad[0]}, ${y.grad[1]})`, boxShadow: `inset 0 0 0 1px ${y.color}55` }}>
            <div style={{ fontSize: 22 }}>{y.emoji}</div>
            <div>
              <div className="dsp" style={{ fontStyle: 'italic', fontWeight: 800, fontSize: 22, color: y.color }}>{y.year}</div>
              <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 9, color: EKT.faint }}>{y.color}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { EKT, YEARS, GLOBAL, fmt, Phone, StatusBar, HomeIndicator, Bokeh, Hearts, Foundations });
