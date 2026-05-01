# A21 - Supabase-first architecture lock

## Cel

Zablokować kierunek architektury w repo, żeby kolejne etapy nie wracały do Firestore jako źródła danych runtime.

## Wdrożone

- Dodano/utrwalono `docs/SUPABASE_FIRST_ARCHITECTURE.md`.
- Dodano/utrwalono `docs/DATA_SOURCE_MAP.md`.
- Wzmocniono `npm run verify:architecture:supabase-first`.
- Guard skanuje runtime `src/` i `api/` pod nowe użycia Firestore.
- Firebase Auth/legacy nie jest usuwany na siłę.
- Dodano wizualny lock sidebaru, żeby aktywne `Dziś` nie przyciemniało pozostałych ikon.

## Nie zmieniano

- UI ekranów poza odcieniem menu bocznego.
- Logiki danych.
- Supabase schema.
- Firebase dependency.
- Notatek głosowych.
- Flow lead -> klient -> sprawa.

## Check

```powershell
npm.cmd run verify:architecture:supabase-first
```

## Kryterium zakończenia

Repo ma twardą blokadę kierunku Supabase-first, a Firestore jest opisany jako legacy/decommission.
