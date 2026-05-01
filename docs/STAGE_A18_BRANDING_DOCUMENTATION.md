# A18 — Branding i dokumentacja spójne

## Cel

Repo i aplikacja mają mówić jednym językiem:

- nazwa produktu: **CloseFlow**,
- architektura: **Supabase-first**,
- pozycjonowanie: **SaaS lead/case follow-up**.

## Zakres wdrożenia

- ujednolicono README,
- ujednolicono README wdrożeniowe,
- dodano alias `README_WDROZENIE.md`, żeby stare automaty nie trafiały w pusty plik,
- uporządkowano `.env.example` na sekcje public client env i server-only env,
- dopisano `docs/PRODUCTION_READINESS_STATUS.md`,
- poprawiono manifest PWA,
- poprawiono opis w `index.html`,
- dodano guard `check:a18-branding-docs`,
- poprawiono kontrast małych akcji w wierszach zadań na białym tle.

## Zasady

- Firebase / Firestore jest opisany wyłącznie jako legacy/decommission.
- AI jest opisane jako backend-only.
- Billing nie jest przedstawiany jako gotowy do sprzedaży bez testów providerów i webhooków.
- Nie obiecujemy niegotowych funkcji.

## Manual check

1. Otwórz aplikację i sprawdź title strony: `CloseFlow`.
2. Sprawdź PWA manifest w DevTools.
3. Otwórz README i `.env.example`.
4. Wejdź w Zadania i sprawdź kontrast małych przycisków akcji na białym tle.
