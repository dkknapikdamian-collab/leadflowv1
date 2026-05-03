# CloseFlow Phase 0 — workspace write access runtime gate fix

Data: 2026-05-03
Zakres: naprawa runtime blokady zapisu leadów po deployu Vercel.

## Problem

Po zielonych testach statycznych produkcja nadal zwracała:

- `Błąd zapisu leada: WORKSPACE_WRITE_ACCESS_REQUIRED`
- `/api/leads` 500 przy próbie zapisu

Przyczyna: część endpointów wywołuje `assertWorkspaceWriteAccess(workspaceId, req)`. Poprzednia wersja helpera traktowała drugi argument `req` jak status planu. Obiekt requestu zamieniał się logicznie w niepoprawny status, przez co zapis był blokowany mimo poprawnego workspace.

## Zmiana

- `assertWorkspaceWriteAccess` rozpoznaje obiekt requestu i nie traktuje go jako statusu.
- Jeśli helper dostaje `workspaceId` jako string, próbuje odczytać row workspace z Supabase.
- Jeśli row workspace nie jest dostępny, używa bezpiecznego fallbacku `trial_active`, bo scoping workspace jest wykonywany wcześniej przez `_request-scope.ts`.
- Dodano aliasy limitów `lead -> activeLeads`, `task -> activeTasks`, itd.

## Czego nie zmieniamy

- Nie luzujemy auth/workspace scoping.
- Nie ruszamy UI.
- Nie zmieniamy struktury Supabase.
- Nie robimy pusha automatycznie bez parametru `-Push`.

## Manualny smoke po deployu

1. Twarde odświeżenie aplikacji i unregister service workera.
2. Login zwykłym użytkownikiem.
3. Utworzenie leada ręcznie.
4. Sprawdzenie `/api/leads` w Network.
5. Odświeżenie zakładki Leady i Today.
6. Potwierdzenie, że lead wraca po reloadzie.
