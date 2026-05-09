# CloseFlow VS-2D — Semantic Visual Registry — 2026-05-09

## Status

Foundation shipped. Runtime migration is intentionally not included in this stage.

## Cel

Kolory stanu mają mieć znaczenie semantyczne, a nie być losową klasą Tailwind w ekranie.

VS-2D dodaje jedno źródło prawdy dla czerwieni, amber i zieleni używanych w znaczeniu operacyjnym.

## Plik źródłowy

`src/components/ui-system/semantic-visual-registry.ts`

## Semantyki obowiązkowe

- `danger-delete`
- `session-logout`
- `alert-error`
- `alert-warning`
- `status-open`
- `status-done`
- `status-overdue`
- `entity-client`
- `entity-lead`
- `entity-case`
- `payment-paid`
- `payment-due`
- `commission-due`
- `commission-paid`

## Zasada użycia

Ekrany nie powinny wybierać `text-red-*`, `bg-amber-*` albo `text-emerald-*` tylko dlatego, że kolor wygląda dobrze.

Ekran ma wybrać semantykę, np.:

```ts
getCloseflowSemanticVisualClasses('status-overdue')
getCloseflowSemanticVisualClasses('payment-due')
getCloseflowSemanticVisualClasses('danger-delete')
```

Dopiero registry decyduje, jakie klasy wizualne reprezentują daną semantykę.

## Zakaz

Nie migrować legacy pages hurtowo.

Szczególnie nie ruszać ponownie masowo:

- `src/pages/Leads.tsx`
- `src/pages/Clients.tsx`
- `src/pages/Cases.tsx`

## Dlaczego nie ma runtime migration w tym etapie

Po VS-2C-2 wiadomo, że szerokie regexowe migracje importów w dużych stronach legacy są zbyt ryzykowne.

Ten etap daje fundament i check. Przepięcie ekranów ma iść później małymi etapami, maksymalnie jeden legacy page na etap.

## Check

```bash
npm run check:closeflow-semantic-visual-registry
```

## Kryterium zakończenia

- registry istnieje,
- wszystkie wymagane semantyki są opisane,
- registry jest eksportowany z `src/components/ui-system/index.ts`,
- package.json ma check,
- etap nie rusza VS-2C-2 ani dużych stron legacy.
