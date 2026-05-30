/* wrap.jsx — section 3.  Story shell, 3 aesthetic directions, the full 2023
   template, 6 year covers, and the 2026 closing slide.
   Exports: DirEditorial, DirBurbuja, DirTipo,
            W23Cover, W23Messages, W23Love, W23Media, W23Topics, W23TopDay, W23Highlight,
            YearCover, ClosingSlide */

/* ---- story chrome ---------------------------------------------------- */
function StoryTop({ y, idx, n }) {
  return (
    <div style={{ position: 'relative', zIndex: 5 }}>
      <div style={{ display: 'flex', gap: 4 }}>
        {Array.from({ length: n }).map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, borderRadius: 2,
            background: i <= idx ? y.color : 'rgba(255,255,255,.22)',
            boxShadow: i === idx ? `0 0 8px ${y.color}` : 'none' }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
        <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, letterSpacing: '.22em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,.7)' }}>Enzo &amp; Katy</span>
        <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 11, color: y.color, fontWeight: 600 }}>{y.year}</span>
      </div>
    </div>
  );
}

function Arrows({ y }) {
  const btn = { position: 'absolute', top: '50%', transform: 'translateY(-50%)', zIndex: 25,
    width: 34, height: 34, borderRadius: '50%', background: 'rgba(0,0,0,.28)',
    backdropFilter: 'blur(6px)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.18)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 16 };
  return (<>
    <div style={{ ...btn, left: 10 }}>‹</div>
    <div style={{ ...btn, right: 10 }}>›</div>
  </>);
}

function WrapSlide({ y, idx, n, children, dim = .42 }) {
  const grad = `linear-gradient(165deg, ${y.grad[0]}, ${y.grad[1]})`;
  return (
    <Phone bg={grad}>
      <div style={{ position: 'absolute', inset: 0, opacity: .5 }}><Hearts color={y.color} n={8} /></div>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 70% at 50% 30%, ${y.color}22, transparent 60%)` }} />
      <StoryTop y={y} idx={idx} n={n} />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', zIndex: 5 }}>
        {children}
      </div>
      <Arrows y={y} />
    </Phone>
  );
}

/* ---- reusable cover content ----------------------------------------- */
function CoverInner({ y, big = 104 }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
      <div style={{ fontSize: 52, lineHeight: 1 }}>{y.emoji}</div>
      <div className="dsp" style={{ fontStyle: 'italic', fontWeight: 900, fontSize: big, lineHeight: .9, margin: '14px 0 0',
        color: y.color, textShadow: `0 6px 50px ${y.color}66` }}>{y.year}</div>
      <p className="dsp" style={{ fontStyle: 'italic', fontWeight: 500, fontSize: 21, lineHeight: 1.3, margin: '20px auto 0', maxWidth: 260, color: '#fff' }}>
        {y.theme}
      </p>
      <div style={{ marginTop: 22, fontFamily: '"Roboto Mono", monospace', fontSize: 12.5, color: 'rgba(255,255,255,.62)', letterSpacing: '.04em' }}>
        {fmt(y.total)} mensajes
      </div>
    </div>
  );
}

/* ================= 3 AESTHETIC DIRECTIONS (on the 2023 cover) ========= */
const Y23 = YEARS[2];

function DirEditorial() {
  return <WrapSlide y={Y23} idx={0} n={7}><CoverInner y={Y23} /></WrapSlide>;
}

function DirBurbuja() {
  const grad = `linear-gradient(165deg, ${Y23.grad[0]}, ${Y23.grad[1]})`;
  const inB = { alignSelf: 'flex-start', background: 'rgba(255,255,255,.10)', borderRadius: '16px 16px 16px 4px' };
  const outB = { alignSelf: 'flex-end', background: Y23.color, color: '#fff', borderRadius: '16px 16px 4px 16px' };
  const bub = { maxWidth: '78%', padding: '11px 15px', fontSize: 15, lineHeight: 1.35, boxShadow: '0 4px 16px rgba(0,0,0,.25)' };
  return (
    <Phone bg={grad}>
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(120% 70% at 50% 20%, ${Y23.color}22, transparent 60%)` }} />
      <StoryTop y={Y23} idx={0} n={7} />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', zIndex: 5 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 18 }}>
          <div style={{ ...bub, ...inB }}>¿Sabes cuánto hablamos este año? 👀</div>
          <div style={{ ...bub, ...outB }}>33,962 mensajes 🚀</div>
          <div style={{ ...bub, ...inB }}>nuestro récord de todos los tiempos</div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' }}>
          <div className="dsp" style={{ fontStyle: 'italic', fontWeight: 900, fontSize: 96, lineHeight: .9, color: Y23.color, textShadow: `0 6px 50px ${Y23.color}66` }}>2023</div>
          <p className="dsp" style={{ fontStyle: 'italic', fontSize: 19, margin: '12px auto 0', maxWidth: 250 }}>{Y23.theme}</p>
        </div>
        <div style={{ ...bub, ...outB, fontFamily: '"Roboto Mono", monospace', fontSize: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
          desliza para ver el año <span>✓✓</span>
        </div>
      </div>
    </Phone>
  );
}

function DirTipo() {
  const grad = `linear-gradient(165deg, ${Y23.grad[0]}, ${Y23.grad[1]})`;
  return (
    <Phone bg={grad}>
      <div className="ek-grain" style={{ position: 'absolute', inset: 0 }} />
      {/* giant outlined year, bleeding */}
      <div className="dsp" style={{ position: 'absolute', top: 150, left: -28, fontStyle: 'italic', fontWeight: 900,
        fontSize: 290, lineHeight: .8, color: 'transparent', WebkitTextStroke: `2px ${Y23.color}`, opacity: .9, whiteSpace: 'nowrap' }}>23</div>
      <div className="dsp" style={{ position: 'absolute', top: 360, left: 30, fontStyle: 'italic', fontWeight: 900,
        fontSize: 150, lineHeight: .8, color: Y23.color, textShadow: `0 8px 60px ${Y23.color}` }}>20</div>
      <StoryTop y={Y23} idx={0} n={7} />
      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', zIndex: 5 }}>
        <div style={{ fontSize: 40 }}>{Y23.emoji}</div>
        <p className="dsp" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 26, lineHeight: 1.15, margin: '12px 0 12px', maxWidth: 300 }}>
          El año récord — en modo explosivo
        </p>
        <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 13, color: Y23.color, letterSpacing: '.06em', borderTop: `1px solid rgba(255,255,255,.14)`, paddingTop: 14 }}>
          33,962 MENSAJES · EL MÁS HABLADOR
        </div>
      </div>
    </Phone>
  );
}

/* ================= 2023 FULL TEMPLATE (7 slides) ===================== */
function W23Cover() { return <WrapSlide y={Y23} idx={0} n={7}><CoverInner y={Y23} /></WrapSlide>; }

function W23Messages() {
  const e = Y23.enzo, k = Y23.katy, tot = e + k;
  return (
    <WrapSlide y={Y23} idx={1} n={7}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 16, textAlign: 'center' }}>Este año se dijeron</div>
        <div style={{ textAlign: 'center', margin: '8px 0 4px' }}>
          <span style={{ fontWeight: 800, fontSize: 76, letterSpacing: '-.03em', color: Y23.color, textShadow: `0 4px 40px ${Y23.color}66` }}>{fmt(Y23.total)}</span>
        </div>
        <div className="dsp" style={{ fontStyle: 'italic', fontSize: 24, textAlign: 'center', color: '#fff' }}>mensajes</div>

        <div style={{ marginTop: 46, display: 'flex', height: 18, borderRadius: 10, overflow: 'hidden', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.15)' }}>
          <div style={{ width: (e / tot * 100) + '%', background: EKT.enzo }} />
          <div style={{ width: (k / tot * 100) + '%', background: EKT.katy }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14 }}>
          <div>
            <div style={{ color: EKT.enzo, fontWeight: 700, fontSize: 13, letterSpacing: '.1em', fontFamily: '"Roboto Mono", monospace' }}>ENZO</div>
            <div style={{ fontWeight: 800, fontSize: 26 }}>{fmt(e)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: EKT.katy, fontWeight: 700, fontSize: 13, letterSpacing: '.1em', fontFamily: '"Roboto Mono", monospace' }}>KATY</div>
            <div style={{ fontWeight: 800, fontSize: 26 }}>{fmt(k)}</div>
          </div>
        </div>
      </div>
    </WrapSlide>
  );
}

function W23Love() {
  return (
    <WrapSlide y={Y23} idx={2} n={7}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 96, color: Y23.color, lineHeight: 1, textShadow: `0 0 60px ${Y23.color}`, animation: 'ekPulse 1.6s ease-in-out infinite' }}>♥</div>
        <div style={{ marginTop: 30, color: 'rgba(255,255,255,.78)', fontSize: 17 }}>Se dijeron «te amo»</div>
        <div style={{ fontWeight: 800, fontSize: 92, lineHeight: 1, letterSpacing: '-.03em', margin: '4px 0' }}>{Y23.teAmo}</div>
        <div className="dsp" style={{ fontStyle: 'italic', fontSize: 22 }}>veces</div>
        <div style={{ marginTop: 26, padding: '10px 18px', borderRadius: 30, background: 'rgba(255,255,255,.08)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.14)', fontSize: 13.5, color: '#fff' }}>
          ≈ 1.8 veces al día · todos los días ❤
        </div>
      </div>
    </WrapSlide>
  );
}

function W23Media() {
  const items = [
    { e: '📸', n: Y23.fotos,    l: 'fotos' },
    { e: '🎵', n: Y23.audios,   l: 'audios' },
    { e: '🎭', n: Y23.stickers, l: 'stickers' },
    { e: '📹', n: Y23.videos,   l: 'videos' },
  ];
  const max = Math.max(...items.map((i) => i.n));
  return (
    <WrapSlide y={Y23} idx={3} n={7}>
      <div style={{ marginTop: 26 }}>
        <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 16 }}>Lo que se enviaron</div>
        <h3 className="dsp" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 30, margin: '6px 0 0' }}>en 2023</h3>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 20 }}>
        {items.map((it) => (
          <div key={it.l}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <span style={{ fontSize: 22 }}>{it.e}</span>
              <span style={{ fontWeight: 800, fontSize: 32, letterSpacing: '-.02em' }}>{fmt(it.n)}</span>
              <span style={{ color: 'rgba(255,255,255,.65)', fontSize: 15 }}>{it.l}</span>
            </div>
            <div style={{ height: 6, borderRadius: 4, marginTop: 8, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}>
              <div style={{ width: (it.n / max * 100) + '%', height: '100%', background: Y23.color, borderRadius: 4 }} />
            </div>
          </div>
        ))}
      </div>
    </WrapSlide>
  );
}

function W23Topics() {
  const top = GLOBAL.topTopics.slice(0, 5);
  const max = top[0].count;
  return (
    <WrapSlide y={Y23} idx={4} n={7}>
      <div style={{ marginTop: 26 }}>
        <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 16 }}>De qué hablaron más</div>
        <h3 className="dsp" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 30, margin: '6px 0 0' }}>sus 5 temas</h3>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18 }}>
        {top.map((t, i) => (
          <div key={t.name}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontSize: 15, fontWeight: i === 0 ? 700 : 500 }}>{i + 1}. {t.name}</span>
            </div>
            <div style={{ height: 8, borderRadius: 5, background: 'rgba(255,255,255,.08)', overflow: 'hidden' }}>
              <div style={{ width: (t.count / max * 100) + '%', height: '100%', background: Y23.color, borderRadius: 5, opacity: 1 - i * 0.13 }} />
            </div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 10.5, color: 'rgba(255,255,255,.4)' }}>* distribución estimada — temas globales</div>
    </WrapSlide>
  );
}

function W23TopDay() {
  return (
    <WrapSlide y={Y23} idx={5} n={7}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <div style={{ color: 'rgba(255,255,255,.7)', fontSize: 16 }}>Su día más intenso</div>
        <div className="dsp" style={{ fontStyle: 'italic', fontWeight: 800, fontSize: 46, lineHeight: 1.05, margin: '16px 0 28px', color: Y23.color }}>
          26 de julio<br />2023
        </div>
        <div style={{ fontWeight: 800, fontSize: 80, lineHeight: 1, letterSpacing: '-.03em' }}>527</div>
        <div className="dsp" style={{ fontStyle: 'italic', fontSize: 20, marginTop: 2 }}>mensajes en un solo día</div>
        <p style={{ marginTop: 30, color: 'rgba(255,255,255,.6)', fontSize: 14.5, fontStyle: 'italic' }}>¿Qué estarían tramando?</p>
      </div>
    </WrapSlide>
  );
}

function W23Highlight() {
  return (
    <WrapSlide y={Y23} idx={6} n={7}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 60 }}>{Y23.emoji}</div>
        <p className="dsp" style={{ fontStyle: 'italic', fontWeight: 600, fontSize: 28, lineHeight: 1.28, margin: '22px 0 0' }}>
          {Y23.highlight}
        </p>
        <div style={{ marginTop: 26, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,.14)',
          color: 'rgba(255,255,255,.62)', fontSize: 14.5, lineHeight: 1.5 }}>
          {Y23.funFact}
        </div>
      </div>
    </WrapSlide>
  );
}

/* ================= YEAR COVERS + CLOSING ============================= */
function YearCover({ y }) { return <WrapSlide y={y} idx={0} n={7}><CoverInner y={y} big={100} /></WrapSlide>; }

function ClosingSlide() {
  const y = YEARS[5];
  return (
    <WrapSlide y={y} idx={6} n={7}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <p className="dsp" style={{ fontStyle: 'italic', fontWeight: 700, fontSize: 32, lineHeight: 1.15, margin: 0 }}>
          Y la historia<br />continúa…
        </p>
        <div style={{ marginTop: 40, fontWeight: 800, fontSize: 64, letterSpacing: '-.03em', color: y.color, textShadow: `0 4px 40px ${y.color}66` }}>132,105</div>
        <div className="dsp" style={{ fontStyle: 'italic', fontSize: 21 }}>mensajes en total</div>
        <div style={{ marginTop: 14, fontFamily: '"Roboto Mono", monospace', fontSize: 12.5, color: 'rgba(255,255,255,.55)' }}>desde el 18 junio 2020</div>
        <p style={{ marginTop: 40, color: '#fff', fontSize: 16, fontStyle: 'italic', maxWidth: 240 }}>6 años. Cada día, sin falta. ♥</p>
      </div>
    </WrapSlide>
  );
}

Object.assign(window, {
  StoryTop, WrapSlide, CoverInner,
  DirEditorial, DirBurbuja, DirTipo,
  W23Cover, W23Messages, W23Love, W23Media, W23Topics, W23TopDay, W23Highlight,
  YearCover, ClosingSlide,
});
