# CloseFlow admin feedback P1 follow-up repair - 2026-05-07

## Why

The previous P1 hotfix built and pushed, but its guard reported:

`Today still contains English waiting copy`

That means the code was not fully clean even though the build passed. This repair fixes the guard and adds the new P1 feedback from the second admin export.

## Changes

### 1. Today copy guard repair

- Replaces `waiting za długo` with Polish copy: `czeka za długo`.
- Keeps the lead status matching logic, but no longer exposes English copy in the UI/source guard.

### 2. Central semantic badge colors

Adds one central CSS token layer:

`src/styles/eliteflow-semantic-badges-and-today-sections.css`

Recommended color map:

| Type | Color intent | Example labels |
|---|---|---|
| Danger / trash / overdue | red | `Zaległe`, `Po terminie`, `Zablokowane`, `Kosz`, `Usuń`, `Ryzyko` |
| Event / calendar | blue | `Wydarzenie`, `Spotkanie`, `Kalendarz` |
| Task / active / done | green | `Zadanie`, `Zrobione`, `Gotowe`, `Aktywne`, `Brak blokerów` |
| Note / draft / waiting | amber | `Notatka`, `Szkic`, `Czeka`, `Do sprawdzenia` |
| Lead | indigo | `Lead`, `Leady` |
| Case | violet | `Sprawa`, `Sprawy` |
| Client | cyan | `Klient`, `Klienci` |
| Neutral | slate | fallback / unknown |

The goal is one visual source of truth. Later screens can reuse `cf-semantic-badge-*` or `data-cf-semantic-tone` instead of inventing colors per page.

### 3. Today sections collapsed by default

- Bottom Today sections start collapsed by default.
- Section headers still expand/collapse on click.
- Clicking a top metric tile opens the matching bottom section and scrolls to it.

## Verification

```powershell
node scripts/check-admin-feedback-p1-followup.cjs
npm run build
```
