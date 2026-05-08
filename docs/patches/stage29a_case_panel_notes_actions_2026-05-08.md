# Stage29A — case panel light background + client note actions

## Źródło

Admin feedback `closeflow_admin_feedback_2026-05-08_09-34.json`.

## Zakres

### CaseDetail

- Usunięcie czarnego tła z `aside.case-detail-right-rail`.
- Usunięcie ciemnego tła za panelem `Dodaj do sprawy`.
- Wymuszenie jasnych kart i czytelnego tekstu w prawym panelu sprawy.

### ClientDetail

- Notatki klienta dostają ikonki:
  - pinezka,
  - podgląd,
  - edycja,
  - usuń.
- Przypięte notatki idą na górę.
- Edycja i usuwanie używają istniejących API activity:
  - `updateActivityInSupabase`,
  - `deleteActivityFromSupabase`.

## Uwaga

Pinezka jest lokalnym ustawieniem widoku przez `localStorage`, bo nie ma jeszcze osobnego pola `pinned` w kontrakcie activity.
