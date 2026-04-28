# Stage 11 — Dziś: lejek wartości bez podwójnego liczenia

## Cel
Naprawić sekcję lejka w zakładce `Dziś`, żeby pokazywała wartość z leadów i klientów, ale bez podwójnego sumowania tej samej osoby, gdy lead został już zamieniony w klienta.

## Zmienione
- `src/pages/Today.tsx`
- `tests/today-funnel-dedup-stage11.test.cjs`

## Założenia
- Lead i klient są traktowani jako ta sama osoba, jeśli mają wspólny `clientId`, `leadId`, e-mail, telefon albo nazwę.
- Jeżeli ten sam kontakt ma wartość w leadzie i kliencie, do lejka wchodzi większa z tych wartości, a nie suma obu.
- Sekcja `Najcenniejsze` zostaje usunięta z UI.

## Kryterium zakończenia
- `npm.cmd run lint`
- `npm.cmd run verify:closeflow:quiet`
- `npm.cmd run build`
- `node tests/today-funnel-dedup-stage11.test.cjs`
