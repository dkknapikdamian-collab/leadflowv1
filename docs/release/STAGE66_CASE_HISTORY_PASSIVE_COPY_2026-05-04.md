# STAGE66 — Case history passive copy

Data: 2026-05-04
Branch: dev-rollout-freeze

## Cel

Naprawić robotyczne i błędne językowo opisy w historii sprawy, np. `Ty dodał brak` oraz `Ty podjął decyzję w`.

## Zmiana

Historia sprawy używa teraz prostych, bezosobowych opisów:

- `Dodano brak: ...`
- `Dodano plik: ...`
- `Dodano decyzję: ...`
- `Dodano notatkę`
- `Dodano zadanie: ...`
- `Dodano wydarzenie: ...`
- `Zmieniono status ...`
- `Przełożono ...`

Metadane aktora zostają pod opisem jako `Operator` / `Klient`, więc nie tracimy informacji, kto wykonał akcję.

## Nie zmieniono

- brak zmian w modelu danych,
- brak migracji Supabase,
- brak zmian w zapisie aktywności,
- brak zmian w logice STAGE64 dedupe.

## Guardy

- `npm run check:stage66-case-history-passive-copy`
- `npm run test:stage66-case-history-passive-copy`
- `npm run check:stage64-case-detail-work-item-dedupe`
- `npm run build`

## Kryterium zakończenia

W historii sprawy nie pojawiają się teksty typu `Ty dodał`, `Ty podjął`, `Ty zmienił`. Zamiast tego użytkownik widzi proste opisy operacyjne.
