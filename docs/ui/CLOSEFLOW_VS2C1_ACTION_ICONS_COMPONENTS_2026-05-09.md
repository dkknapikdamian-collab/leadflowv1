# CloseFlow VS-2C-1 — Action icons in global components — 2026-05-09

## Status

Small migration stage after VS-2C-mini.

## Cel

Przepiąć wybrane globalne komponenty i dialogi na `ActionIcon` / aliasy z `ui-system`, bez ruszania aktywnych stron.

## Zakres plików

- `src/components/EntityConflictDialog.tsx`
- `src/components/GlobalQuickActions.tsx`
- `src/components/lead-picker.tsx`
- `src/components/topic-contact-picker.tsx`

## Zmienione akcje

- `ExternalLink` -> `OpenActionIcon`
- `RotateCcw` -> `RestoreActionIcon`
- `Trash2` -> `DeleteActionIcon`
- `Plus` -> `AddActionIcon`
- `Search` -> `SearchActionIcon`
- `X` -> `CancelActionIcon`

## Nie zmieniaj

- Nie przepinaj stron `src/pages/*`.
- Nie przepinaj `Today`, `Calendar`, `Leads`, `Clients`.
- Nie ruszaj ikon encji z VS-2B.
- Nie ruszaj ikon statusu / informacji typu `AlertTriangle`, `Check`, `ClipboardList`.

## Check

```bash
npm run check:closeflow-action-icon-registry
npm run check:closeflow-vs2c1-action-icons-components
npm run check:closeflow-entity-icon-registry
npm run build
```

## Kryterium zakończenia

- Cztery komponenty używają aliasów akcji z `ui-system`.
- Nie ma bezpośredniego importu migrowanych ikon akcji z `lucide-react` w tych komponentach.
- Build przechodzi.
