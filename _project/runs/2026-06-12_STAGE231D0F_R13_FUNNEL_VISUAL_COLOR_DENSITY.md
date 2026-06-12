# 2026-06-12 — STAGE231D0F-R13 Funnel visual color density

Status: READY_TO_APPLY

## Scan report

Repo files read:
- `AGENTS.md`
- `src/pages/SalesFunnel.tsx`
- `src/styles/closeflow-metric-tiles.css`
- `src/styles/sales-funnel-stage231d0f-visual-alignment.css`

Obsidian:
- direct local Obsidian vault access unavailable in this chat.
- update payload prepared in `_project/obsidian_updates/2026-06-12_STAGE231D0F_R13_FUNNEL_VISUAL_COLOR_DENSITY.md`.

## FAKTY Z KODU

- R12 marker exists in `SalesFunnel.tsx`.
- Funnel owner tiles already use explicit tone map.
- `FunnelDecisionSignal` did not yet have `data-cf-signal-tone`.
- Open button width was `132px`.
- Metric CSS had tone variables and R12 rules, but tile surface was still too subtle visually.

## DECYZJE DAMIANA

- Layout frozen.
- Add color density without rainbow.
- Do not change filters, routing, data, SQL, Supabase, kanban, drag/drop.

## R13 implementation

- Add signal tones for decision records.
- Add record data attributes.
- Add stronger but subtle metric tile surface/accent in `closeflow-metric-tiles.css`.
- Change open button width to `156px`.
- Add nowrap and icon flex guard.

## Superseded guard note

R4 shared filter guard is superseded for this color-density stage. R13 validates the active visual color contract directly.

## Risk audit

- Visual QA required after deploy.
- Local tree contains older untracked artifacts; push must remain selective.
