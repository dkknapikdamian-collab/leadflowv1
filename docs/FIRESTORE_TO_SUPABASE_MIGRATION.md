# CloseFlow - Firestore -> Supabase migration

## Decyzja A23

Na ten etap przyjmujemy decyzję:

**B: stare dane traktujemy jako testowe i startujemy czysto w Supabase.**

Powód: po A22 Supabase ma już fundament prywatnych danych, workspace, membership i RLS. Rozsądniej jest zamknąć hybrydę i nie mieszać testowych rekordów z docelowym modelem SaaS.

## Co zostaje przygotowane

Repo nadal dostaje bezpieczny tor migracyjny, gdyby później okazało się, że część danych Firestore trzeba przenieść:

- `DRY_RUN` - analiza pliku eksportu i raport bez zapisu do Supabase,
- `IMPORT` - import do Supabase tylko po świadomym potwierdzeniu.

## Zakaz

Nie kasujemy Firestore bez backupu.

Nie importujemy danych produkcyjnych bez wcześniejszego `DRY_RUN`.

Nie dopisujemy nowych funkcji do Firestore.

## Tryb czystego startu

Dla obecnej decyzji używamy:

```powershell
$env:A23_DECISION="CLEAN_START"
npm.cmd run data:migration:a23:dry-run
```

To generuje raport, ale nie importuje danych.

## Tryb migracji, jeżeli kiedyś będzie potrzebny

Najpierw eksport Firestore do pliku JSON:

```powershell
npm.cmd run data:firestore:export
```

Następnie DRY_RUN importu:

```powershell
$env:A23_MODE="DRY_RUN"
$env:A23_DECISION="MIGRATE_FIRESTORE"
$env:A23_INPUT_FILE="data/firestore-export.json"
npm.cmd run data:supabase:import
```

Dopiero po sprawdzeniu raportu można użyć IMPORT:

```powershell
$env:A23_MODE="IMPORT"
$env:A23_DECISION="MIGRATE_FIRESTORE"
$env:A23_IMPORT_CONFIRM="IMPORT_FIRESTORE_TO_SUPABASE"
$env:A23_INPUT_FILE="data/firestore-export.json"
npm.cmd run data:supabase:import
```

## Wymagane zmienne dla IMPORT

```text
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
```

`IMPORT` używa service role, więc odpala się tylko lokalnie lub w bezpiecznym środowisku operatorskim. Nie wolno wystawiać service role jako `VITE_*`.

## Mapowania

| Firestore / legacy | Supabase |
|---|---|
| `ownerId` | `user_id` |
| `workspaceId` | `workspace_id` |
| `leadId` | `lead_id` |
| `caseId` | `case_id` |

## Obsługiwane kolekcje / domeny

| Dane | Supabase |
|---|---|
| leads | `leads` |
| clients | `clients` |
| cases | `cases` |
| tasks | `work_items` z `kind = task` |
| events | `work_items` z `kind = event` |
| aiDrafts | `ai_drafts` |
| responseTemplates | `response_templates` |
| activities | `activities` |

## Raport

Importer tworzy raport w:

```text
migration-reports/a23-last-report.json
```

Raport zawiera:

- decyzję,
- tryb,
- liczby rekordów wejściowych,
- planowane rekordy wyjściowe,
- duplikaty,
- brakujące relacje,
- mapowanie ID,
- listę tabel docelowych,
- status importu.

## Duplikaty

Duplikaty są logowane, nie ukrywane.

Importer wykrywa duplikaty po parach:

- `collection + id`,
- `targetTable + sourceId`,
- dla leadów także `workspace_id + email + phone`, jeżeli dane są dostępne.

## Kryterium zakończenia

A23 jest zakończone, gdy repo jasno mówi:

- albo dane są w Supabase po `DRY_RUN` i `IMPORT`,
- albo świadomie startujemy od czystej bazy Supabase.

Dla obecnego etapu obowiązuje wariant **czysty start**.
