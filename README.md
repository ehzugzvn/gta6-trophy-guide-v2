# gta6-trophy-guide-v2

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/ehzugzvn/gta6-trophy-guide-v2/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/ehzugzvn/gta6-trophy-guide-v2/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

**VICE ROUTE** — a roadmap-first GTA VI platinum guide, tracker and session planner for the
make.fun bounty [gta6-trophy-guide-01](https://make.fun/bounty/gta6-trophy-guide-01). The app
opens on the journey, not the list: a 7-stage route (Opening → Chapter 1–4 → Final + Strands →
Post-game grind) with every missable window pinned at the stage where it closes. No Rockstar
logos, artwork or game screenshots anywhere — the look is original CSS only.

## What the app does

- **Route tab (home)** — vertical timeline of 7 stages; each stage card lists its trophies in
  play order with inline checkboxes, stage totals, the collectible counts to sweep in that
  stage, and hot-pink MISSABLE WINDOW alerts (the Chapter 1 meditation spot, the 500-choice
  counter, the fail-then-succeed trophy, and the at-risk strand finals).
- **Tracker tab** — a dense table of all 55 trophies with the OFFICIAL name, description and
  grade, kind, missable verdict + window, target count, and citation markers [n] in every row.
  Filters: All, Story, Missable, Collectibles, Activities, Co-op/Online, plus search.
- **Guide drawer** — click any trophy for its official description, an own-words guide, steps
  where every specific step carries citation markers, a Sources box, a missable banner, and an
  honest disagree/unconfirmed note wherever sources conflict or a method is not yet confirmed.
- **Session tab** — "Tonight's session" planner: pick a stage and get its ordered checklist
  (story first, then the collectible sweep) with a per-stage session progress bar.
- **Tracker essentials** — progress is saved in localStorage, with Export / Import of progress
  as JSON, an overall progress-to-platinum bar, and a spoiler shield that masks hidden story
  trophies' names and descriptions until earned.
- **Audit strip** — "55/55 official ✓ · 55/55 cited ✓ · 9 missable windows pinned · 0 external
  requests — offline", visible on the Route home screen.

Sources cited throughout: PowerPyx, PSNProfiles, Exophase, GTA Wiki (Fandom) and
PlayStationTrophies.org — full names and URLs are listed inside the app.

## How it runs

The app is plain static files under `app/` (no build step, no network — it works offline in
desktop Chrome). To try it locally with Node 22:

```
node serve.ts          # serves app/ on http://localhost:8080
```

To hand the entry in the way the scorer runs it:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=$PWD/out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output
directory and writes `dossier.json` there via the vendored make.fun library. The first
screenshot is the Route home screen — the roadmap itself is the cover. The remaining
screenshots show the Tracker with the Missable filter on and a guide drawer open, the
Positive Mental Attitude guide with its Chapter 1 window banner, and the Session planner
with the spoiler shield switched on.
