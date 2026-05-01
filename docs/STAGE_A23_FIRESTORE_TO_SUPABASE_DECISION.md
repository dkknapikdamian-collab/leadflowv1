# A23 - Firestore -> Supabase albo czysty start

## Decyzja

Wybrany wariant:

**B: dane są testowe i startujemy czysto w Supabase.**

## Cel

Zamknąć hybrydę po stronie decyzji i narzędzi.

A23 nie usuwa Firebase ani Firestore. Firestore zostaje tylko jako legacy/decommission, zgodnie z A21.

## Wdrożone

- dokument migracji:
  - `docs/FIRESTORE_TO_SUPABASE_MIGRATION.md`,
- eksporter:
  - `scripts/export-firestore-data.cjs`,
- importer:
  - `scripts/import-supabase-data.cjs`,
- guard:
  - `scripts/check-a23-firestore-supabase-migration.cjs`,
- raporty:
  - `migration-reports/a23-last-report.json`,
- skrypty npm:
  - `data:firestore:export`,
  - `data:supabase:import`,
  - `data:migration:a23:dry-run`,
  - `check:a23-firestore-supabase-migration`.

## Tryby

### DRY_RUN

Nie zapisuje nic do Supabase.

Tworzy raport i pokazuje:

- liczby rekordów,
- mapowania,
- potencjalne duplikaty,
- brakujące relacje.

### IMPORT

Wymaga:

```text
A23_MODE=IMPORT
A23_DECISION=MIGRATE_FIRESTORE
A23_IMPORT_CONFIRM=IMPORT_FIRESTORE_TO_SUPABASE
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

Bez tego importer kończy pracę bez zapisu.

## Nie zmieniono

- Nie kasowano Firestore.
- Nie usuwano Firebase dependency.
- Nie dotykano UI.
- Nie zmieniano flow lead -> klient -> sprawa.
- Nie importowano danych produkcyjnych.
- Nie uruchomiono migracji danych automatycznie.

## Check

```powershell
npm.cmd run check:a23-firestore-supabase-migration
```

## Kryterium zakończenia

Repo ma świadomą decyzję: czysty start w Supabase, a ewentualna migracja Firestore ma bezpieczną ścieżkę DRY_RUN -> IMPORT.
