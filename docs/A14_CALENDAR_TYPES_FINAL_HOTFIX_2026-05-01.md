# A14 - finalny hotfix typow kalendarza

## Cel

Domknac etap A14 business type hardening po wprowadzeniu typow biznesowych, bez cofania zmian i bez luzowania guardow.

## Zakres

- Usunieto zduplikowany typ `ScheduleRawRecord` z `src/lib/scheduling.ts`.
- Utrzymano jeden kontrakt `ScheduleRawRecord` dla wpisow kalendarza.
- Helpery task/event akceptuja legacy `id` jako string albo number na wejściu.
- `Calendar.tsx` nie czyta juz `type` i `priority` z payloadu pochodnego, tylko z bezpiecznego helpera tekstowego.

## Zasady

- Nie wlaczono `strict: true`.
- Nie zmieniono UI.
- Nie zmieniono logiki biznesowej.
- Firestore pozostaje poza aktywnym zapisem aplikacji.
