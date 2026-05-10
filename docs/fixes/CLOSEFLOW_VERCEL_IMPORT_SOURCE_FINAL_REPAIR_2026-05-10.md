# CloseFlow Vercel Import Source Final Repair — 2026-05-10

## Cel

Naprawić build na Vercel dla czystego commita `dev-rollout-freeze`, gdzie `Leads.tsx` nadal importował `useState` z `lucide-react`.

## Problem

Lokalny build mógł przejść na niestagowanych zmianach, ale Vercel buduje czysty commit z GitHub. W commicie `d36f3e5` nadal były importy symboli z błędnych modułów, np.:

- React hooks z `lucide-react`,
- router helpers z innych modułów,
- normalne ikony z `ui-system`,
- entity icons poza `ui-system`.

## Zasada naprawy

Kanonizujemy wyłącznie importy w aktywnych ekranach, bez zmian logiki biznesowej i bez zmian JSX.

Mapa źródeł:

- React hooks/types -> `react`
- router -> `react-router-dom`
- normalne ikony -> `lucide-react`
- entity icons / operator metric -> `../components/ui-system`
- quick actions -> `../components/GlobalQuickActions`
- calendar bundle -> `../lib/calendar-items`

## Bramki

- `npm run check:closeflow-vercel-import-source-final`
- `npm run check:closeflow-api0-vercel-hobby-functions`
- `npm run check:closeflow-case-settlement-panel`
- `npm run check:closeflow-fin5-import-boundaries-final`
- `npx tsc --noEmit --pretty false`
- `npm run build`

## Nie ruszać

Nie stage'ować luźnych `docs/release` i `docs/ui` wygenerowanych przez wcześniejsze audyty.
