/* app.jsx — assembles every screen onto the design canvas.
   NOTE: DCSection only recognises direct <DCArtboard> children (it filters by
   c.type === DCArtboard), so we must use DCArtboard inline — no wrapper comp. */

function App() {
  const W = EKT.W, H = EKT.H;
  return (
    <DesignCanvas>
      <DCSection id="foundations" title="Fundamentos" subtitle="Tokens, tipografía y paleta para el handoff">
        <DCArtboard id="tokens" label="Design tokens" width={760} height={760}><Foundations /></DCArtboard>
      </DCSection>

      <DCSection id="hero" title="1 · Hero / Landing" subtitle="Entrada con bokeh + corazones flotantes (stagger por letra, scroll cue)">
        <DCArtboard id="hero-1" label="Hero" width={W} height={H}><HeroScreen /></DCArtboard>
      </DCSection>

      <DCSection id="stats" title="2 · Estadísticas generales" subtitle="Seis paneles a pantalla completa · números con count-up al entrar en viewport">
        <DCArtboard id="s-intro"   label="2.1 · Intro" width={W} height={H}><StatsIntro /></DCArtboard>
        <DCArtboard id="s-metrics" label="2.2 · Métricas" width={W} height={H}><StatsMetrics /></DCArtboard>
        <DCArtboard id="s-topics"  label="2.3 · Temas" width={W} height={H}><StatsTopics /></DCArtboard>
        <DCArtboard id="s-hourly"  label="2.4 · Por hora" width={W} height={H}><StatsHourly /></DCArtboard>
        <DCArtboard id="s-yearly"  label="2.5 · Por año" width={W} height={H}><StatsYearly /></DCArtboard>
        <DCArtboard id="s-battle"  label="2.6 · Batalla «te amo»" width={W} height={H}><StatsBattle /></DCArtboard>
      </DCSection>

      <DCSection id="directions" title="3a · Dirección estética del Wrap" subtitle="Tres rumbos, misma portada 2023. A · Editorial es la del spec y la base de las slides de abajo. Elige uno y lo propago a las 8 plantillas.">
        <DCArtboard id="dir-a" label="A · Editorial (del spec)" width={W} height={H}><DirEditorial /></DCArtboard>
        <DCArtboard id="dir-b" label="B · Burbuja / chat" width={W} height={H}><DirBurbuja /></DCArtboard>
        <DCArtboard id="dir-c" label="C · Tipografía máxima" width={W} height={H}><DirTipo /></DCArtboard>
      </DCSection>

      <DCSection id="wrap2023" title="3b · Wrap 2023 — plantilla completa" subtitle="El año récord, como historia deslizable. Nav: barra segmentada arriba + flechas ‹ › / teclado en desktop + swipe en mobile. Transición x:100%→0, ease [0.22,1,0.36,1]. Esta secuencia se replica por año cambiando datos + color.">
        <DCArtboard id="w-cover"  label="Slide 1 · Portada" width={W} height={H}><W23Cover /></DCArtboard>
        <DCArtboard id="w-msg"    label="Slide 2 · Mensajes" width={W} height={H}><W23Messages /></DCArtboard>
        <DCArtboard id="w-love"   label="Slide 3 · «Te amo» — falta split por persona/año" width={W} height={H}><W23Love /></DCArtboard>
        <DCArtboard id="w-media"  label="Slide 4 · Compartieron" width={W} height={H}><W23Media /></DCArtboard>
        <DCArtboard id="w-topics" label="Slide 5 · Temas" width={W} height={H}><W23Topics /></DCArtboard>
        <DCArtboard id="w-day"    label="Slide 6 · Día más intenso" width={W} height={H}><W23TopDay /></DCArtboard>
        <DCArtboard id="w-high"   label="Slide 7 · Highlight" width={W} height={H}><W23Highlight /></DCArtboard>
      </DCSection>

      <DCSection id="covers" title="3c · Portadas por año + cierre" subtitle="Cada año con su color, gradiente y emoji. 2021 no existe (no se pudo exportar). El cierre solo aparece en 2026.">
        <DCArtboard id="c-2020" label="2020 · 🌹" width={W} height={H}><YearCover y={YEARS[0]} /></DCArtboard>
        <DCArtboard id="c-2022" label="2022 · 🔥" width={W} height={H}><YearCover y={YEARS[1]} /></DCArtboard>
        <DCArtboard id="c-2023" label="2023 · 🚀" width={W} height={H}><YearCover y={YEARS[2]} /></DCArtboard>
        <DCArtboard id="c-2024" label="2024 · 💕" width={W} height={H}><YearCover y={YEARS[3]} /></DCArtboard>
        <DCArtboard id="c-2025" label="2025 · 📞" width={W} height={H}><YearCover y={YEARS[4]} /></DCArtboard>
        <DCArtboard id="c-2026" label="2026 · 🌱" width={W} height={H}><YearCover y={YEARS[5]} /></DCArtboard>
        <DCArtboard id="c-close" label="Slide 8 · Cierre (solo 2026)" width={W} height={H}><ClosingSlide /></DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
