# P0 Workspace Write Access Hotfix — 2026-05-03

## Problem

Po ostatnim etapie zapis leada potrafił kończyć się błędem:

```text
WORKSPACE_WRITE_ACCESS_REQUIRED
/api/leads -> 500
```

To blokowało podstawowy CRUD, więc kolejny etap funkcjonalny byłby budowaniem na ruchomym lodzie.

## Decyzja

Przed następnym etapem produktowym domykamy P0: zgodność bramki zapisu workspace z realnymi stanami trial/free/paid i starszymi aliasami planów.

## Zmienione pliki

- `src/server/_access-gate.ts`
- `src/server/_supabase-auth.ts`
- `scripts/check-p0-workspace-write-access-runtime-hotfix.cjs`

## Co poprawia hotfix

- `trial_expired` / `inactive` przy przyszłym `trial_ends_at` nie blokuje już zapisu.
- `free`, `free_plan`, `free_user` mapują się na `free_active`.
- starsze wartości planów typu `basic`, `pro`, `ai`, `closeflow_*` są rozpoznawane przez gate.
- błędy gate z `status/statusCode` nie są już zwijane do 500 przez `writeAuthErrorResponse`.

## Ręczny test po deployu

1. Zaloguj się normalnym użytkownikiem.
2. Wejdź w `Leady`.
3. Dodaj nowego leada.
4. Oczekiwane: lead zapisuje się bez `WORKSPACE_WRITE_ACCESS_REQUIRED`.
5. Odśwież stronę.
6. Oczekiwane: lead nadal jest widoczny.
