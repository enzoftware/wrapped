# Prompt: Enzo & Katy — WhatsApp Wrap Web App
> **v2 — implementación actual** (actualizado mayo 2026)

## Contexto del proyecto

Una web app llamada **"Enzo & Katy Wrap"** que sintetiza 6 años de conversación de WhatsApp entre dos personas. Tres secciones principales:

1. **Hero** — landing animado
2. **Estadísticas generales** — 8 paneles con datos globales
3. **Wrap por año** — historias deslizables estilo Spotify Wrapped

---

## Stack técnico (implementado)

```
Astro 6 + React islands   ← framework principal (no Next.js)
TypeScript (strict)
Tailwind CSS v4
motion (motion.dev) 13     ← layout, presencia, gestos, reveals
anime.js 4                 ← animaciones temáticas, partículas, texto, SVG
CSS custom properties      ← design tokens en :root
Bun                        ← package manager (no npm)
```

> Arrancar con `bun install && npx astro dev`. No hay backend ni base de datos.

---

## Estructura del proyecto

```
src/
  components/
    Hero.tsx
    Bokeh.tsx
    FloatingHearts.tsx
    CountUp.tsx              ← count-up via requestAnimationFrame + useInView
    stats/
      GeneralStats.tsx       ← contenedor de 8 paneles
      StatCard.tsx
      TopicsChart.tsx
      HourlyActivity.tsx
      YearlyBarChart.tsx
      PlansPanel.tsx         ← NUEVO: outings + planes/año + día de semana
      FunFactsPanel.tsx      ← NUEVO: risas, nocturnos, cumplidos, comida
    wrap/
      WrapSection.tsx        ← selector de año + contenedor
      YearWrap.tsx           ← story shell: progress bars, nav, swipe, teclado
      WrapSlide.tsx          ← 8 layouts de slide
  data/
    stats.ts                 ← ÚNICA fuente de verdad — todo hardcodeado aquí
  lib/
    types.ts
  pages/
    index.astro
  styles/
    global.css               ← tokens + keyframes + Tailwind import
```

---

## Diseño — tema claro romántico

**Cambio de v1:** la paleta pasó de oscura (Spotify negro) a **crema y rosa** (carta de amor).

```css
:root {
  --bg:        #fdf6f0;   /* crema cálida */
  --bg-card:   #fff8f5;   /* blush */
  --ink:       #2d1a1f;   /* vino oscuro */
  --sub:       rgba(45,26,31,0.55);
  --faint:     rgba(45,26,31,0.30);
  --hair:      rgba(45,26,31,0.10);
  --accent:    #d4687a;   /* rosa */
  --accent-hi: #b5286a;   /* rosa oscuro */
  --enzo:      #5b7fd4;   /* azul suave */
  --katy:      #c84080;   /* rosa fuerte */
}
```

Tipografía: **Playfair Display** italic 800/900 para títulos + **Inter** para UI + **Roboto Mono** para etiquetas y números.

Cada año tiene su **gradiente pastel propio** (campo `grad` en `yearStats`):
- 2020: rosa `#fdf0f3 → #fce4ea`
- 2022: durazno `#fdf5ee → #fdecd8`
- 2023: lavanda `#f5f0fe → #ede0fd`
- 2024: fucsia `#fdf0f7 → #fcdff0`
- 2025: celeste `#f0fafd → #dcf4fa`
- 2026: menta `#f0fdf6 → #dcfbec`

---

## Paneles de estadísticas (8 en total)

| Panel | Contenido |
|---|---|
| 2.1 Intro | Título "6 años. Una conversación.", fechas, días totales/activos |
| 2.2 Métricas | Grid 2×4 de StatCards con count-up |
| 2.3 Temas | TopicsChart — barras horizontales animadas |
| 2.4 Por hora | HourlyActivity — 24 barras verticales, peak 10am–7pm en rosa |
| 2.5 Por año | YearlyBarChart — barras agrupadas Enzo (azul) vs Katy (rosa) |
| 2.6 Planes | PlansPanel — outings por tipo + línea de tiempo de planes + día de semana |
| 2.7 Fun facts | FunFactsPanel — risas (6,311), nocturnos (8,143), cumplidos (233), comida (1,033) |
| 2.8 Te amo | Versus Enzo 1,869 vs Katy 1,423 + barra proporcional + bubbles de WhatsApp |

---

## Datos — stats nuevos (v2)

Añadir a `GlobalStats` e implementar:

```typescript
risas: 6311,              // mensajes con jajaja/xd/jeje
mensajesNocturnos: 8143,  // mensajes entre 12am–3am
cumplidos: 233,           // hermosa/bonita/guapo/lindo/bella
outingTypes: [
  { emoji: '✈️', name: 'Viajes y escapadas',    count: 712 },
  { emoji: '🍕', name: 'Restaurantes y comida', count: 329 },
  { emoji: '🛍️', name: 'Mall y compras',        count: 383 },
  { emoji: '🎬', name: 'Cine y series',          count: 314 },
  { emoji: '☕', name: 'Cafés y meriendas',      count: 189 },
],
planesPerYear: [20, 42, 158, 213, 263, 108],  // por año 2020→2026
dayActivity: { Lun:18252, Mar:16795, Mié:19195, Jue:17883, Vie:17602, Sáb:21517, Dom:20891 },
```

---

## Slides del Wrap (por año)

Cada año tiene 7 slides (2026 tiene 8). Navegación: progress bar segmentada arriba, puntos abajo, flechas en desktop, swipe + tap-zones en mobile, teclado ←/→.

| Slide | Layout |
|---|---|
| 1 cover | Emoji + año grande (Playfair italic, color del año) + tema + total |
| 2 messages | Número total animado + bubbles de chat Enzo/Katy + barra proporcional |
| 3 love | Corazón pulsante + count-up «te amo» + ratio diario |
| 4 media | Barras: fotos, audios, stickers, videos con count-up |
| 5 topics | TopicsChart con top 5 temas globales (color del año) |
| 6 topDay | Fecha destacada en Playfair + count-up de mensajes en bubble de chat |
| 7 highlight | Emoji + highlight narrativo + funFact + bubble de cierre |
| 8 closing | Solo 2026: total global + fecha inicio + frase de cierre |

---

## Temas por año (campo `theme`)

| Año | Tema |
|---|---|
| 2020 | El inicio — pandemia, encierro y amor a distancia |
| 2022 | De septiembre en adelante — cada mensaje contó |
| 2023 | El año récord — su conversación en modo explosivo |
| 2024 | El año del equilibrio — Katy toma la delantera |
| 2025 | El año de las llamadas — conectados más allá del texto |
| 2026 | En curso — la historia continúa |

---

## Animaciones

| Elemento | Animación |
|---|---|
| StatCards | fadeInUp + count-up al entrar en viewport (IntersectionObserver vía useInView) |
| Barras de temas | `width: 0 → %` con Framer Motion + ease [0.22,1,0.36,1] |
| Barras de horas | `height: 0 → %` con delay escalonado por hora |
| Slide entrance | `x: 100% → 0`, ease [0.22,1,0.36,1], 420ms |
| Slide exit | `x: 0 → -100%`, 320ms |
| Número grande | scale(0.7) + opacity 0 → 1, delay 0.2–0.3s |
| Corazón slide 3 | `scale: 1 → 1.12 → 1` loop infinito |
| Hero title | stagger por letra, delay 0.05s/char |
| Corazones flotantes | CSS `ekFloat` keyframe con translateY + rotate |

---

## Notas importantes

- **2021 no existe** — no se pudo exportar el chat de ese año. El selector de año simplemente lo omite.
- **Los datos son estáticos** — todo en `src/data/stats.ts`. No crear parsers, loaders ni llamadas a APIs.
- **El timestamp de WhatsApp usa U+202F** (narrow no-break space) entre la hora y AM/PM. Si se re-parsea `_chat.txt`, usar un parser UTF-8 que maneje ese caracter.
- **Arrancar con** `bun install && npx astro dev`.
