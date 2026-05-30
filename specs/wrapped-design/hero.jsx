/* hero.jsx — landing / hero screen.  Exports: HeroScreen */

function HeroScreen() {
  return (
    <Phone bg="#0a0a0a">
      <Bokeh />
      <Hearts n={14} />
      {/* faint vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(120% 80% at 50% 40%, transparent 40%, rgba(0,0,0,.55) 100%)' }} />

      <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', paddingBottom: 40 }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: 9, color: EKT.coral, marginBottom: 22 }}>
          <span style={{ fontSize: 15 }}>♥</span>
          <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 12, letterSpacing: '.32em', textTransform: 'uppercase' }}>Enzo &amp; Katy</span>
          <span style={{ fontSize: 15 }}>♥</span>
        </div>

        <h1 className="dsp" style={{ fontStyle: 'italic', fontWeight: 800, fontSize: 62, lineHeight: .98, margin: 0,
          letterSpacing: '-.01em', textShadow: '0 4px 40px rgba(232,93,117,.35)' }}>
          WhatsApp<br />Wrap
        </h1>

        <div style={{ marginTop: 26, display: 'flex', alignItems: 'center', gap: 14, color: EKT.sub,
          fontFamily: '"Roboto Mono", monospace', fontSize: 16, letterSpacing: '.1em' }}>
          <span style={{ width: 26, height: 1, background: EKT.hair }} />
          2020 — 2026
          <span style={{ width: 26, height: 1, background: EKT.hair }} />
        </div>

        <p style={{ marginTop: 30, color: EKT.sub, fontSize: 14.5, lineHeight: 1.55, maxWidth: 250 }}>
          Seis años de conversación, día por día.<br />Esta es su historia en números.
        </p>

        <button style={{ marginTop: 36, border: 'none', cursor: 'pointer', color: '#0a0a0a', fontWeight: 700,
          fontFamily: 'Inter, sans-serif', fontSize: 15.5, padding: '16px 30px', borderRadius: 40,
          background: 'linear-gradient(180deg, #f07189, #e85d75)', boxShadow: '0 10px 34px rgba(232,93,117,.45)',
          display: 'flex', alignItems: 'center', gap: 10 }}>
          Ver nuestra historia
          <span style={{ fontSize: 17 }}>→</span>
        </button>
      </div>

      {/* scroll cue */}
      <div style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, color: EKT.faint }}>
        <span style={{ fontFamily: '"Roboto Mono", monospace', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase' }}>desliza</span>
        <span style={{ fontSize: 17, animation: 'ekBob 1.8s ease-in-out infinite' }}>↓</span>
      </div>
    </Phone>
  );
}

Object.assign(window, { HeroScreen });
