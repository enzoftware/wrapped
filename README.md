# Enzo & Katy Wrap · 2015–2026

A personal WhatsApp Wrapped — a Spotify-style web app for Enzo and Katy's 11th anniversary (together since October 2, 2015). The surviving chat export covers June 2020–May 2026 (132,105 messages); the 2015–2020 chats were lost in a phone change.

Live at **https://katyenzo.com**.

## What it is

Static site, no backend. Two pages:

1. **`/` — Wrap** — A music intro splash, then full-screen Spotify-style story slides for each year (2020, 2022, 2023, 2024, 2025, 2026). 2021 is missing — the export failed that year. Each year has 7 slides (8 for the last year), with swipe on mobile and arrow keys on desktop. A floating Spotify player plays our playlist.
2. **`/stats` — Stats** — Eight full-screen panels of global stats: message counts, topics, hourly activity, yearly bar chart, plans & outings breakdown, fun facts (laughs, night messages, compliments, food talks), and the "te amo" battle.

## Stack

| Layer | Choice |
|---|---|
| Framework | [Astro](https://astro.build) 6 + React islands |
| Animations | [motion](https://motion.dev) 13 + [anime.js](https://animejs.com) 4 |
| Styles | Tailwind CSS v4 + CSS custom properties |
| Fonts | Playfair Display (display) · Inter (UI) · Roboto Mono (labels) |
| Package manager | [Bun](https://bun.sh) |
| Language | TypeScript (strict) |
| Hosting | GitHub Pages, custom domain on Squarespace DNS |

All data is hardcoded in `src/data/stats.ts`. The countable numbers are computed from the raw WhatsApp export with `scripts/parse-chat.ts`; the editorial ones (themes, highlights, topics…) are written by hand. See [Updating the content](#updating-the-content).

## Running the project

```bash
bun install        # install dependencies
bun run dev        # dev server at http://localhost:4321
bun run build      # production build into dist/
bun run preview    # serve the production build
```

## Deployment

Every push to `main` deploys automatically via `.github/workflows/deploy.yml` (build with Bun → upload `dist/` → GitHub Pages). You can also run it by hand from the repo's **Actions** tab → *Deploy to GitHub Pages* → *Run workflow*.

- `public/CNAME` holds `katyenzo.com` — don't delete it, or Pages drops the custom domain.
- DNS lives in Squarespace (Domains → katyenzo.com → DNS): four `A` records and four `AAAA` records on `@` pointing to GitHub Pages, and a `CNAME` on `www` → `enzoftware.github.io`.
- HTTPS is enforced in the repo's Settings → Pages.

## Updating the content

> ⚠️ **Never commit the chat export.** The repo is public. `data/_chat.txt` is in `.gitignore` — keep it that way, and double-check `git status` before every commit.

### 1. Export the chat from WhatsApp

On the phone: open the chat → tap the contact name → **Export Chat** → **Without Media**. You get a `.zip` with a `_chat.txt` inside.

The parser expects the **English, 12-hour** export format that iOS produces:

```
[6/18/20, 11:38:29 PM] Katy Pizan: Hola
```

If the phone is set to another language or 24-hour time, the lines will look different and the parser will find 0 messages — switch the phone to English/12-hour before exporting, or adjust the `HEADER` regex at the top of `scripts/parse-chat.ts`.

### 2. Drop it into `data/`

```bash
unzip ~/Downloads/WhatsApp\ Chat*.zip -d /tmp/chat
mkdir -p data && mv /tmp/chat/_chat.txt data/_chat.txt
git status   # data/_chat.txt must NOT show up here
```

### 3. Compute the numbers

```bash
bun scripts/parse-chat.ts > /tmp/stats.json
```

This prints the countable stats as JSON, in the same shape as `src/data/stats.ts`:

- **`globalStats`** — `startDate`, `endDate`, `totalDays`, `activeDays`, `totalMessages`, per-person totals and «te amo», `teExtrano`, `fotos`, `videos`, `audios`, `stickers`, `llamadas`, `videollamadas`, `hourly`, `mostActiveDay`, `risas`, `mensajesNocturnos`, `dayActivity`.
- **`yearStats`** — one entry per year with `total`, `enzo`, `katy`, `teAmo`, `teExtrano`, media and call counts, and `topDay`.

How things are counted:

| Stat | Rule |
|---|---|
| Messages (`total`, `enzo`, `katy`, `hourly`, days) | Text messages only — media, calls and system messages are excluded |
| `fotos` / `videos` / `audios` / `stickers` | Entries ending in `image/video/audio/sticker omitted` (captioned media included) |
| `llamadas` / `videollamadas` | `Voice call` / `Video call` entries (missed calls don't count) |
| `teAmo`, `teExtrano`, `risas` | Occurrences of `te amo`, `te extraño`, `jajaja…`/`xd` in text messages |
| `mensajesNocturnos` | Messages sent 12:00–3:59 am |

> The numbers currently on the site were computed before this script existed with slightly different rules. Re-running it on the same export gives the same media, call and top-day numbers, message totals about 0.6% lower, and fewer «te amo» (2,450 vs 3,292). Once you regenerate, just use the script's numbers everywhere so the site stays consistent.

### 4. Update `src/data/stats.ts`

Copy the numbers from `/tmp/stats.json` into `globalStats` and each `yearStats` entry. For a **new year**, add a new object to `yearStats` — besides the numbers it needs these hand-written fields:

| Field | What it is |
|---|---|
| `color` | Accent color for that year's slides |
| `grad` | Two pastel background colors `[from, to]` |
| `emoji` | Year icon. Also picks the ambient animation in `src/components/wrap/themes.ts` (🌹 petals, 🔥 embers, 🚀 stars, 💕 hearts, 📞 signal, 🌱 leaves — anything else falls back to hearts). Add a new entry there for a new emoji/theme. |
| `theme` | One-line subtitle for the year |
| `highlight` | The "El momento" slide text |
| `funFact` | A fun fact for the year |

The last entry in `yearStats` automatically gets the closing slide.

These `globalStats` fields are **not** computed by the script — update them by hand (or ask Claude to read the chat and count them, using `prompt/wrapped-propmt.md` for context):

- `topTopics` — the 12 conversation topics and their counts
- `apodos` — nicknames (`amor`, `bb`, `mi vida`…) and how often they're used
- `planes`, `planesPerYear`, `outingTypes` — plans and outings
- `cumplidos` — compliments

A quick way to count any keyword:

```bash
grep -oi "mi vida" data/_chat.txt | wc -l
```

`startDate`, `endDate` and `totalDays` in `globalStats` describe the **relationship** (2 octubre 2015 → 2 octubre 2026, 4,018 days), not the chat export. Don't overwrite them with the script's values, which only cover the export's date range.

### 5. Update hardcoded copy

A few strings mention the date range or totals directly. Find them with:

```bash
grep -rnE "2015|2026|11 años|Once años|132,105" src README.md
```

Currently: the page title in `src/pages/index.astro`, the intro splash in `src/components/music/IntroSplash.tsx`, the default description in `src/layouts/Base.astro`, "11 años" in `src/components/stats/GeneralStats.tsx` and `src/components/wrap/WrapSlide.tsx`, the message count in `src/pages/stats.astro`, and this README.

### 6. Check and ship

```bash
bun run dev      # click through every year and /stats
bun run build    # make sure it builds
git status       # confirm data/_chat.txt is not listed
```

Commit on a branch, open a PR, and merge to `main` — the site redeploys in about a minute.

## Project structure

```
.github/workflows/deploy.yml   # GitHub Pages deploy
data/_chat.txt                 # WhatsApp export — gitignored, never commit
scripts/parse-chat.ts          # _chat.txt → countable stats (JSON)
public/CNAME                   # custom domain for GitHub Pages
src/
├── components/
│   ├── Bokeh.tsx              # Ambient background blobs
│   ├── FloatingHearts.tsx     # Animated hearts
│   ├── CountUp.tsx            # Animated number counter (viewport-triggered)
│   ├── music/
│   │   ├── IntroSplash.tsx    # Opening splash that starts the music
│   │   └── MusicPlayer.tsx    # Floating Spotify player
│   ├── stats/
│   │   ├── GeneralStats.tsx   # Stats section container (8 panels)
│   │   ├── StatCard.tsx       # Individual metric card
│   │   ├── TopicsChart.tsx    # Animated horizontal bar chart
│   │   ├── HourlyActivity.tsx # Vertical activity bars by hour
│   │   ├── YearlyBarChart.tsx # Grouped bars: Enzo vs Katy per year
│   │   ├── PlansPanel.tsx     # Outings breakdown + plans timeline + day-of-week
│   │   └── FunFactsPanel.tsx  # Laughs, night messages, compliments, food
│   └── wrap/
│       ├── WrapSection.tsx    # Year selector + story container
│       ├── YearWrap.tsx       # Story shell (progress bars, nav, swipe)
│       ├── WrapSlide.tsx      # All 8 slide layouts (cover → closing)
│       ├── YearAmbient.tsx    # Per-year ambient animation
│       └── themes.ts          # Slide order + emoji → ambient theme
├── data/
│   └── stats.ts               # All stats (source of truth for the UI)
├── layouts/
│   └── Base.astro             # HTML shell
├── lib/
│   ├── types.ts               # TypeScript interfaces
│   ├── anim.ts                # Shared animation helpers
│   ├── music.ts               # Shared music state across islands
│   └── spotify.ts             # Spotify embed API
├── pages/
│   ├── index.astro            # Wrap (home)
│   └── stats.astro            # Global stats
└── styles/
    └── global.css             # Design tokens + keyframes + Tailwind
```

## Design

**Light romantic theme** — cream background (`#fdf6f0`), rose accent (`#d4687a`), wine ink (`#2d1a1f`). Each year has its own pastel gradient identity and ambient animation. Chat bubbles appear throughout to reinforce the WhatsApp origin.

> The export's timestamps use U+202F (narrow no-break space) between the time and AM/PM, and media/call lines are marked with U+200E (left-to-right mark). A regex with a plain space won't match — `scripts/parse-chat.ts` already handles both. Always read `_chat.txt` as UTF-8.
