# CloseFlow Action Icon Registry — VS-2C-mini — 2026-05-09

## Status

Foundation only.

Ten etap dodaje jedno źródło prawdy dla ikon akcji, ale **nie przepina jeszcze aktywnych ekranów**.

## Cel

Zmiana ikony akcji w jednym miejscu ma później umożliwić spójną zmianę w całej aplikacji.

## Dodane pliki

- `src/components/ui-system/action-icon-registry.ts`
- `src/components/ui-system/ActionIcon.tsx`
- `scripts/check-closeflow-action-icon-registry.cjs`
- `docs/ui/CLOSEFLOW_ACTION_ICON_REGISTRY_2026-05-09.md`

## Akcje minimum

- `add`
- `edit`
- `delete`
- `restore`
- `search`
- `save`
- `cancel`
- `back`
- `copy`
- `open`
- `archive`
- `filter`
- `settings`

## Eksporty

`src/components/ui-system/index.ts` eksportuje:

```ts
export * from './ActionIcon';
export * from './action-icon-registry';
```

## Nie robimy w tym etapie

- Nie przepinamy masowo ekranów.
- Nie usuwamy ikon akcji z `lucide-react`.
- Nie wymuszamy jeszcze migracji aktywnych plików.
- Nie dotykamy VS-2B entity registry.

## Kolejne etapy

- VS-2C-1: komponenty globalne i dialogi.
- VS-2C-2: listy lead/client/case.
- VS-2C-3: detale lead/client/case.
- VS-2C-4: Today/Calendar/Settings.

## Check

```bash
npm run check:closeflow-action-icon-registry
npm run check:closeflow-entity-icon-registry
npm run build
```

## Kryterium zakończenia

- Registry istnieje.
- `ActionIcon` istnieje.
- Wszystkie 13 akcji istnieją.
- Eksporty są w `ui-system/index.ts`.
- Build przechodzi.
