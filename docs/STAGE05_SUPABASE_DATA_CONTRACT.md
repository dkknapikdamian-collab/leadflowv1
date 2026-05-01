# ETAP 05 — Kontrakt danych Supabase dla głównych encji

## Status

Ten etap porządkuje kontrakt danych po stronie frontu i API. Legacy aliasy są obsługiwane centralnie w `src/lib/data-contract.ts`, a nowe użycie w kliencie powinno czytać pola kanoniczne.

## Zakres kodowy

Zmienione pliki:

```text
src/lib/data-contract.ts
src/lib/supabase-fallback.ts
src/lib/calendar-items.ts
package.json
scripts/check-stage05-supabase-data-contract.cjs
supabase/migrations/2026-05-01_stage05_supabase_data_contract.sql
```

## Kanoniczne encje

Kontrakt obejmuje:

- `Lead`
- `Client`
- `Case`
- `Task`
- `Event`
- `Activity`
- `Payment`
- `AiDraft`
- `ResponseTemplate`
- `CaseItem`

## Zasada

Legacy aliasy typu `scheduled_at`, `due_at`, `client_name`, `linked_case_id`, `created_at` są mapowane tylko w normalizatorach kontraktu:

```text
normalizeLeadContract
normalizeClientContract
normalizeCaseContract
normalizeTaskContract
normalizeEventContract
normalizeActivityContract
normalizePaymentContract
normalizeAiDraftContract
normalizeResponseTemplateContract
normalizeCaseItemContract
```

Widoki i moduły klienckie mają używać już pól kanonicznych, np.:

```text
task.scheduledAt
event.startAt
lead.linkedCaseId
case.completenessPercent
```

## Migracja SQL

Plik:

```text
supabase/migrations/2026-05-01_stage05_supabase_data_contract.sql
```

Migracja jest addytywna i bezpieczna:

- dodaje brakujące kolumny tylko jeśli tabela istnieje,
- nie usuwa danych legacy,
- nie zmienia UI,
- nie przenosi danych automatycznie między kolumnami.

### Jak odpalić

W Supabase SQL Editor:

1. Otwórz plik migracji.
2. Skopiuj zawartość.
3. Wklej w SQL Editor.
4. Uruchom.

Lub przez CLI:

```powershell
supabase db push
```

## Rollback

Kodowo:

```powershell
git revert <SHA_ETAPU_05>
git push origin dev-rollout-freeze
```

SQL jest addytywny. Bezpieczny rollback produkcyjny to zostawienie dodanych kolumn. Usuwanie kolumn nie jest zalecane, bo mogły już przyjąć dane.

## Test automatyczny

```powershell
npm.cmd run verify:data-contract-stage05
npm.cmd run lint
npm.cmd run build
```

## Test ręczny

Po migracji i wdrożeniu:

1. Lead dodany w `Leads` ma być widoczny w `Today` i `LeadDetail`.
2. Task dodany w `Tasks` ma być widoczny w `Today`, `Calendar`, `LeadDetail`, `CaseDetail`.
3. Event dodany w `Calendar` ma być widoczny w `Today`.
4. Case utworzony z leada ma pokazywać relację w obu stronach.
5. Nowe widoki nie powinny dodawać własnych fallbacków pól poza `data-contract.ts`.

## Kryterium zakończenia

Frontend nie zgaduje danych. Główne odpowiedzi z Supabase przechodzą przez jeden kontrakt normalizacji.
