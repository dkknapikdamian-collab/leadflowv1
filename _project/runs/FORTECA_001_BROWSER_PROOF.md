# FORTECA 001 — BROWSER PROOF

Reference: `docs/ui/reference/forteca-calm-light/001_today_main.webp` (1672x941, sha256 ad7f2d...)
Implementation commit: 5ad95188
Route: `/` (TodayStable) at 1440 desktop
Build: `npx tsc --noEmit` PASS, `vite build` PASS

Steps:
1. `npm run build` + `vite preview --port 4173` (local)
2. Navigate to `/` with authenticated workspace (dev lead/task/event fixtures)
3. Observe shell: dark sidebar #0f1b31, active pill rgba(255,255,255,.12), page shell width 1480, gutters 24-32
4. Header: kicker DZIŚ pill #E5EAF2 border, title Dziś 28px semibold -0.03em, description Twoje centrum dowodzenia...
5. Metrics: grid gap 13, tile radius 16, border #E5EAF2, shadow 0 8px 22px rgba(16,24,40,.05) (foundation/metrics owners)
6. Sections: 8 SectionHeader cards, toggle expand works, row actions Zrobione/Edytuj/Kosz wired

Comparison to WebP:
- Global shell/sidebar/page width TOP PASS
- Hierarchy/spacing/density PASS (8 sections retained vs hero grid in WebP — functional truth per contract §3 keeps 8 sections; hero grid decorative not required)
- Cards/typography/controls PASS (16 radius, 12 button radius, Inter)
- No horizontal scroll, no clipped buttons, modal N/A

Result: STRUCTURAL PASS with documented deviation (hero grid vs 8 sections) — functional truth wins.
