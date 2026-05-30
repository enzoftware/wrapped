# Enzo & Katy Wrap · 2020–2026

A personal WhatsApp Wrapped — a Spotify-style web app that visualizes 6 years of conversation between Enzo and Katy (132,105 messages, June 2020–May 2026).

## What it is

Three sections, all static, no backend:

1. **Hero** — Animated landing with floating hearts and a staggered title entrance.
2. **Stats** — Eight full-screen panels of global stats: message counts, topics, hourly activity, yearly bar chart, plans & outings breakdown, fun facts (laughs, night messages, compliments, food talks), and the "te amo" battle.
3. **Wrap** — Year selector + Spotify-style story slides for each year (2020, 2022, 2023, 2024, 2025, 2026). 2021 is missing — the export failed that year. Each year has 7 slides (8 for 2026), with swipe on mobile and arrow keys on desktop.

## Stack

| Layer | Choice |
|---|---|
| Framework | [Astro](https://astro.build) 6 + React islands |
| Animations | [Framer Motion](https://www.framer.com/motion/) 12 |
| Styles | Tailwind CSS v4 + CSS custom properties |
| Fonts | Playfair Display (display) · Inter (UI) · Roboto Mono (labels) |
| Package manager | [Bun](https://bun.sh) |
| Language | TypeScript (strict) |

All data is hardcoded in `src/data/stats.ts`. The raw WhatsApp export (`data/_chat.txt`) was parsed externally and the computed numbers are baked in.

## Running the project

```bash
# Install dependencies
bun install

# Start dev server
npx astro dev

# Build for production
npx astro build

# Preview production build
npx astro preview
```

The app runs at `http://localhost:4321` by default.

## Project structure

```
src/
├── components/
│   ├── Hero.tsx               # Landing section
│   ├── Bokeh.tsx              # Ambient background blobs
│   ├── FloatingHearts.tsx     # Animated hearts
│   ├── CountUp.tsx            # Animated number counter (viewport-triggered)
│   └── stats/
│       ├── GeneralStats.tsx   # Stats section container (8 panels)
│       ├── StatCard.tsx       # Individual metric card
│       ├── TopicsChart.tsx    # Animated horizontal bar chart
│       ├── HourlyActivity.tsx # Vertical activity bars by hour
│       ├── YearlyBarChart.tsx # Grouped bars: Enzo vs Katy per year
│       ├── PlansPanel.tsx     # Outings breakdown + plans timeline + day-of-week
│       └── FunFactsPanel.tsx  # Laughs, night messages, compliments, food
│   └── wrap/
│       ├── WrapSection.tsx    # Year selector + story container
│       ├── YearWrap.tsx       # Story shell (progress bars, nav, swipe)
│       └── WrapSlide.tsx      # All 8 slide layouts (cover → closing)
├── data/
│   └── stats.ts               # All hardcoded stats (source of truth)
├── lib/
│   └── types.ts               # TypeScript interfaces
├── pages/
│   └── index.astro            # Root page
└── styles/
    └── global.css             # Design tokens + keyframes + Tailwind
```

## Design

**Light romantic theme** — cream background (`#fdf6f0`), rose accent (`#d4687a`), wine ink (`#2d1a1f`). Each year has its own pastel gradient identity. Chat bubbles appear throughout to reinforce the WhatsApp origin. Framer Motion handles all animations: count-up on scroll, staggered entrance, slide transitions with custom cubic-bezier easing.

## Stats verified from raw data

| Metric | Value | Source |
|---|---|---|
| Total messages | 132,105 | Line count in `data/_chat.txt` |
| Photos | 4,886 | `grep "image omitted"` |
| Stickers | 6,735 | `grep "sticker omitted"` |
| Audios | 2,224 | `grep "audio omitted"` |
| Laughs (jajaja/xd) | 6,311 | grep with narrow NBSP-aware parser |
| Night messages (12–3am) | 8,143 | timestamp parser |
| Compliments | 233 | keyword grep |

> The timestamp format uses U+202F (narrow no-break space) between time and AM/PM — standard Python `re` with a regular space won't match it. Always open `_chat.txt` as UTF-8.
