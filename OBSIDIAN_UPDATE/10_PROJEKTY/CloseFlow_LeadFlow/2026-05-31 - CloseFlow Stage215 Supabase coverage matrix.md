# 2026-05-31 - CloseFlow Stage215 Supabase coverage matrix

## FAKTY

- Stage215 tworzy macierz pokrycia Supabase dla CloseFlow / LeadFlow.
- Nie zmienia kodu aplikacji runtime.
- Nie wykonuje SQL.
- Nie zmienia RLS.
- Nie zmienia GRANT.
- Nie dotyka danych Supabase.
- Generator przeskanowal lokalne pliki repo i przygotowal raport Stage215.

## DECYZJE DAMIANA

- Kierunek: sprawdzic funkcjonalnie cala migracje Supabase, a nie uznawac jej za zakonczona po pojedynczym buildzie.
- Cleanup backupow nie jest teraz priorytetem.

## HIPOTEZY AI

- Najwieksze ryzyko po Stage213C to martwe endpointy albo relacje, nie juz sam query budget.
- Macierz coverage jest najbezpieczniejszym sposobem zamykania migracji bez zgadywania.

## MACIERZ - SKROT

- modules total: 12
- structural pass: 5
- structural gap: 7
- api files: 12
- page files: 28

## DO POTWIERDZENIA

- Ktore testy manualne Damian wykona na produkcji, a ktore lokalnie.
- Czy portal/storage testujemy teraz, czy po core CRM flow.
- Czy billing testujemy w dry-run, czy z realnym providerem.

## TESTY

```powershell
node tools/stage215-generate-supabase-coverage-matrix.cjs
node scripts/check-stage215-supabase-coverage-matrix.cjs
npm run build
```

## RYZYKA

- Build nie potwierdza, ze endpoint API zwraca poprawny JSON.
- Structural pass nie oznacza functional pass.
- Testy manualne musza objac hard refresh, CRUD, relacje i workspace scope.

## NASTEPNY KROK

Stage216-A: leads/clients/cases CRUD + detail pages, tylko po uzupelnieniu wynikow manual QA z Stage215.

## Status zapisu

- status: przygotowano przez Stage215 generator
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
