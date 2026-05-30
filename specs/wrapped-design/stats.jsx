/* stats.jsx — section 2, six distinct full-screen panels.
   Exports: StatsIntro, StatsMetrics, StatsTopics, StatsHourly, StatsYearly, StatsBattle */

const Kicker = ({ children, tint = EKT.coral }) => (
  <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, letterSpacing: '.26em',
    textTransform: 'uppercase', color: tint }}>{children}</div>
);

/* 2·1 — intro panel */
function StatsIntro() {
  return (
    <Phone bg="#0a0a0a">
      <Bokeh colors={['#e85d75', '#a855f7', '#ec4899']} />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Kicker>Estadísticas generales</Kicker>
        <h1 className="dsp" style={{ fontStyle: 'italic', fontWeight: 800, fontSize: 56, lineHeight: .96, margin: '18px 0 0' }}>
          6 años.<br /><span style={{ color: EKT.coral }}>Una</span><br />conversación.
        </h1>
        <div style={{ marginTop: 40, display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: '"Roboto Mono", monospace', fontSize: 13, color: EKT.sub }}>
          <span style={{ color: EKT.coral }}>{GLOBAL.startDate}</span>
          <span style={{ flex: 1, height: 1, background: EKT.hair }} />
          <span>{GLOBAL.endDate}</span>
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 26 }}>
          {[['2,172', 'días en total'], ['1,414', 'días con mensajes']].map(([n, l]) => (
            <div key={l} style={{ flex: 1, background: EKT.card, borderRadius: 16, padding: '20px 18px',
              boxShadow: `inset 0 0 0 1px ${EKT.hair}` }}>
              <div style={{ fontWeight: 800, fontSize: 34, letterSpacing: '-.02em' }}>{n}</div>
              <div style={{ color: EKT.sub, fontSize: 12.5, marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </Phone>
  );
}

/* 2·2 — metric cards grid */
function StatsMetrics() {
  const cards = [
    { e: '💬', n: '132,105', l: 'mensajes en total', big: true },
    { e: '📅', n: '1,414',   l: 'días conversando' },
    { e: '❤️', n: '3,292',   l: '«te amo»', tint: EKT.coral },
    { e: '📸', n: '4,886',   l: 'fotos' },
    { e: '🎵', n: '2,224',   l: 'audios' },
    { e: '🎭', n: '6,735',   l: 'stickers' },
    { e: '📹', n: '158',     l: 'videollamadas' },
    { e: '🥺', n: '284',     l: '«te extraño»', tint: EKT.coral },
  ];
  return (
    <Phone bg="#0a0a0a">
      <Kicker>En total</Kicker>
      <h2 className="dsp" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 30, margin: '12px 0 18px', lineHeight: 1 }}>
        Todo lo que se dijeron
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, flex: 1, alignContent: 'start' }}>
        {cards.map((c) => (
          <div key={c.l} style={{ background: c.big ? 'linear-gradient(160deg, rgba(232,93,117,.22), rgba(168,85,247,.14))' : EKT.card,
            borderRadius: 16, padding: '18px 16px', boxShadow: `inset 0 0 0 1px ${c.big ? 'rgba(232,93,117,.4)' : EKT.hair}`,
            display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span style={{ fontSize: 17 }}>{c.e}</span>
            <div style={{ fontWeight: 800, fontSize: c.big ? 34 : 28, letterSpacing: '-.02em', color: c.tint || EKT.ink, lineHeight: 1 }}>{c.n}</div>
            <div style={{ color: EKT.sub, fontSize: 12, lineHeight: 1.25 }}>{c.l}</div>
          </div>
        ))}
      </div>
    </Phone>
  );
}

/* 2·3 — horizontal topics bars */
function StatsTopics() {
  const top = GLOBAL.topTopics.slice(0, 8);
  const max = top[0].count;
  const palette = ['#e85d75', '#ec5a86', '#d65a9b', '#c05cae', '#a85fc0', '#9462cf', '#8166d6', '#7169db'];
  return (
    <Phone bg="#0a0a0a">
      <Kicker>De qué hablaron</Kicker>
      <h2 className="dsp" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 30, margin: '12px 0 22px', lineHeight: 1 }}>
        Los temas de 6 años
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 15, flex: 1 }}>
        {top.map((t, i) => (
          <div key={t.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: i === 0 ? 700 : 500, color: i === 0 ? EKT.ink : EKT.sub }}>{t.name}</span>
              <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 12, color: i === 0 ? EKT.coral : EKT.faint }}>{fmt(t.count)}</span>
            </div>
            <div style={{ height: 8, borderRadius: 5, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
              <div style={{ width: (t.count / max * 100) + '%', height: '100%', borderRadius: 5,
                background: palette[i], boxShadow: i === 0 ? '0 0 18px rgba(232,93,117,.5)' : 'none' }} />
            </div>
          </div>
        ))}
      </div>
    </Phone>
  );
}

/* 2·4 — hourly activity heatmap bars */
function StatsHourly() {
  const h = GLOBAL.hourly;
  const max = Math.max(...h);
  return (
    <Phone bg="#0a0a0a">
      <Kicker>Ritmo del día</Kicker>
      <h2 className="dsp" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 30, margin: '12px 0 6px', lineHeight: 1 }}>
        ¿A qué hora hablan?
      </h2>
      <p style={{ color: EKT.sub, fontSize: 13, margin: '0 0 30px' }}>Pico de actividad entre las <b style={{ color: EKT.coral }}>10am y 7pm</b>.</p>

      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 3 }}>
        {h.map((v, hr) => {
          const active = hr >= 10 && hr <= 19;
          return (
            <div key={hr} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', height: '100%' }}>
              <div style={{ width: '100%', height: (v / max * 100) + '%', borderRadius: 3,
                background: active ? 'linear-gradient(180deg,#f07189,#e85d75)' : 'rgba(255,255,255,.14)',
                boxShadow: active ? '0 0 12px rgba(232,93,117,.4)' : 'none' }} />
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10,
        fontFamily: '"Roboto Mono", monospace', fontSize: 10, color: EKT.faint }}>
        <span>12am</span><span>6am</span><span>12pm</span><span>6pm</span><span>11pm</span>
      </div>
    </Phone>
  );
}

/* 2·5 — Enzo vs Katy grouped bars by year */
function StatsYearly() {
  const max = Math.max(...YEARS.map((y) => Math.max(y.enzo, y.katy)));
  return (
    <Phone bg="#0a0a0a">
      <Kicker>Año por año</Kicker>
      <h2 className="dsp" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 30, margin: '12px 0 14px', lineHeight: 1 }}>
        ¿Quién escribió más?
      </h2>
      <div style={{ display: 'flex', gap: 18, marginBottom: 18, fontSize: 12, color: EKT.sub }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: EKT.enzo }} />Enzo</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}><span style={{ width: 11, height: 11, borderRadius: 3, background: EKT.katy }} />Katy</span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 12 }}>
        {YEARS.map((y) => (
          <div key={y.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
            <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 9.5, color: EKT.faint, marginBottom: 7 }}>{(y.total / 1000).toFixed(0)}k</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, width: '100%', justifyContent: 'center', flex: 1 }}>
              <div style={{ width: 12, height: (y.enzo / max * 100) + '%', borderRadius: '4px 4px 0 0', background: EKT.enzo }} />
              <div style={{ width: 12, height: (y.katy / max * 100) + '%', borderRadius: '4px 4px 0 0', background: EKT.katy }} />
            </div>
            <div style={{ fontSize: 12, color: EKT.sub, marginTop: 9, fontWeight: 600 }}>{y.year}</div>
          </div>
        ))}
      </div>
    </Phone>
  );
}

/* 2·6 — the "te amo" battle */
function StatsBattle() {
  const e = GLOBAL.enzo.teAmo, k = GLOBAL.katy.teAmo, tot = e + k;
  return (
    <Phone bg="linear-gradient(170deg,#1a0712,#0a0a0a 60%)">
      <Bokeh colors={['#e85d75', '#ec4899', '#5b8cff']} />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Kicker>La batalla del «te amo»</Kicker>
          <h2 className="dsp" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 32, margin: '14px 0 0', lineHeight: 1 }}>
            ¿Quién lo dijo más?
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', margin: '46px 4px 22px' }}>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 12, color: EKT.enzo, letterSpacing: '.1em' }}>ENZO</div>
            <div style={{ fontWeight: 800, fontSize: 50, color: EKT.enzo, letterSpacing: '-.03em', lineHeight: 1, marginTop: 6 }}>{fmt(e)}</div>
            <div style={{ fontSize: 18, marginTop: 4 }}>❤</div>
          </div>
          <div className="dsp" style={{ fontStyle: 'italic', fontSize: 26, color: EKT.faint, padding: '0 6px 14px' }}>vs</div>
          <div style={{ textAlign: 'center', flex: 1 }}>
            <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 12, color: EKT.katy, letterSpacing: '.1em' }}>KATY</div>
            <div style={{ fontWeight: 800, fontSize: 50, color: EKT.katy, letterSpacing: '-.03em', lineHeight: 1, marginTop: 6 }}>{fmt(k)}</div>
            <div style={{ fontSize: 18, marginTop: 4 }}>❤</div>
          </div>
        </div>

        <div style={{ display: 'flex', height: 16, borderRadius: 10, overflow: 'hidden', boxShadow: `inset 0 0 0 1px ${EKT.hair}` }}>
          <div style={{ width: (e / tot * 100) + '%', background: 'linear-gradient(90deg,#5b8cff,#7aa0ff)' }} />
          <div style={{ width: (k / tot * 100) + '%', background: 'linear-gradient(90deg,#f472b6,#ec4899)' }} />
        </div>
        <div style={{ textAlign: 'center', marginTop: 30, color: EKT.sub, fontSize: 14, lineHeight: 1.5 }}>
          Enzo lo dijo <b style={{ color: EKT.ink }}>446 veces más</b>.<br />Juntos: <b style={{ color: EKT.coral }}>3,292 «te amo»</b> en 6 años.
        </div>
      </div>
    </Phone>
  );
}

Object.assign(window, { StatsIntro, StatsMetrics, StatsTopics, StatsHourly, StatsYearly, StatsBattle });
