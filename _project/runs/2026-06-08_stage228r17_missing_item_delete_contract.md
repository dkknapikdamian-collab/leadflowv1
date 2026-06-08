# Stage228R17 - missing_item delete contract

Data: 2026-06-08 20:45 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Scan

Repo files read before implementation:
- AGENTS.md
- _project/00_PROJECT_STATUS.md
- _project/03_CURRENT_STAGE.md
- package.json
- src/pages/LeadDetail.tsx
- src/lib/supabase-fallback.ts
- src/server/task-route-stage124f.ts
- src/server/_supabase.ts
- api/system.ts
- src/components/ContextActionDialogs.tsx
- src/lib/work-items/normalize.ts

Obsidian files read: brak bezposredniego dostepu w tej rozmowie. Przygotowano update do skopiowania.

## Problem

Klikniecie Usuń przy Braku dawalo poprawny natychmiastowy efekt UI, ale po refetchu/odswiezeniu wpis wracal. To wskazuje na niespojny kontrakt optimistic UI -> backend soft-delete -> refetch.

## Zmiana

- LeadDetail: delete missing_item uzywa softDeleteTaskInSupabase, usuwa wpis optymistycznie przez filter, cofa UI przy bledzie backendu i odswieza dane silent refresh bez pelnego loadera.
- task-route-stage124f: task PATCH/POST nie promuje missing_item ani closed/deleted taskow do lead next action; deleted task czysci matching lead.next_action_item_id.
- Dodano guard i test Stage228R17.
- Zaktualizowano _project i przygotowano Obsidian update.

## Testy do uruchomienia

- node scripts/check-stage228r17-missing-item-delete-contract.cjs
- node --test tests/stage228r17-missing-item-delete-contract.test.cjs
- npm run build
- git diff --check

## Test reczny

Lead -> dodaj Brak -> refresh -> Usuń -> znika natychmiast -> poczekaj -> hard refresh -> wpis nie wraca. Sprawdzic tez, ze Następny krok nie wskazuje na usuniety Brak.

## Audyt ryzyk

- Nie robiono twardego DELETE, bo obecny kierunek repo ma soft-delete taskow.
- Zmiana dotyka tylko kontraktu Brak/task next_action, nie UI layoutu.
- Potencjalny edge case: stare rekordy z missing_item jako next_action bez klikniecia delete nadal moga wymagac osobnego cleanupu danych.
