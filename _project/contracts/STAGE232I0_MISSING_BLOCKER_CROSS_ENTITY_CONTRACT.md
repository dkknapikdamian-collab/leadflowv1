# STAGE232I0_MISSING_BLOCKER_CROSS_ENTITY_CONTRACT

- data i godzina: 2026-06-17 17:05 Europe/Warsaw
- stage: STAGE232I0_CASE_CLIENT_MISSING_BLOCKER_CROSS_ENTITY_AUDIT_AND_CONTRACT
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ: AUDIT_AND_CONTRACT
- runtime: NIE W TYM ETAPIE
- SQL: NIE W TYM ETAPIE

## 1. Skan i routing

### Repo files read

- `AGENTS.md`
- `_project/CODEX_CONTEXT_INDEX.md`
- `10_PROJEKTY/CloseFlow_Lead_App/00_START - CloseFlow Lead App.md`
- `10_PROJEKTY/CloseFlow_Lead_App/07_SCIAGA_PLIKOW - CloseFlow Lead App.md`
- `10_PROJEKTY/CloseFlow_Lead_App/04_STAGE232D_I_OWNER_CONTROL_AND_BRAKI_CASE_CLIENT_SOURCE_OF_TRUTH.md`
- `_project/04_STAGE232D_R1_CLOSURE_AND_STAGE232I0_NEXT_SYNC_2026_06_17.md`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`
- `_project/06_GUARDS_AND_TESTS.md`
- `_project/09_TESTY_DO_WYKONANIA_I_WYNIKI.md`
- `_project/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY.md`
- `src/pages/LeadDetail.tsx`
- `src/pages/CaseDetail.tsx`
- `src/pages/ClientDetail.tsx`
- `src/components/ContextActionDialogs.tsx`
- `src/components/detail/MissingItemQuickActionModal.tsx`
- `src/lib/activity-timeline.ts`
- `src/lib/missing-items/stage227c2-missing-item-modal-contract.ts`
- `src/lib/supabase-fallback.ts`
- `src/lib/owner-control/owner-control-baseline.ts`
- `src/lib/owner-control/activity-truth.ts`
- `src/lib/owner-control/next-move-contract.ts`

### Missing expected files

- brak

## 2. Obecny stan kodu - token map

| file | missing_item | blocking_missing_item | blocksProgress | blockScope | missingKind | case_items | insertCaseItemToSupabase | insertTaskToSupabase | insertActivityToSupabase | emitCloseflowWorkItemNoFlickerMutation | activeMissingItemEntries | leadBlockerEntries |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `src/pages/LeadDetail.tsx` | 17 | 0 | 13 | 7 | 13 | 0 | 0 | 1 | 2 | 0 | 14 | 5 |
| `src/pages/CaseDetail.tsx` | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 2 | 9 | 0 | 0 | 0 |
| `src/pages/ClientDetail.tsx` | 33 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | 6 | 0 | 0 | 0 |
| `src/components/ContextActionDialogs.tsx` | 17 | 3 | 11 | 7 | 9 | 0 | 2 | 2 | 3 | 2 | 0 | 0 |
| `src/components/detail/MissingItemQuickActionModal.tsx` | 0 | 0 | 5 | 7 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/lib/activity-timeline.ts` | 3 | 0 | 3 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/lib/missing-items/stage227c2-missing-item-modal-contract.ts` | 2 | 0 | 9 | 7 | 7 | 2 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/lib/supabase-fallback.ts` | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 2 | 1 | 8 | 0 | 0 |
| `src/lib/owner-control/owner-control-baseline.ts` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/lib/owner-control/activity-truth.ts` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |
| `src/lib/owner-control/next-move-contract.ts` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 |

## 3. Mapa obecnego stanu

| Encja | Obecne źródło | Aktywna lista | Historia | Resolve | Blokada | Problem |
|---|---|---|---|---|---|---|
| Lead | LeadDetail linked tasks/work items; activeMissingItemEntries / leadBlockerEntries | work item/task missing_item po leadId | activity missing_item_created/resolved/deleted | task/work item status/payload | blocksProgress=true lub status blocking_missing_item | Lead jest najblizej modelu docelowego; pilnowac jednego zrodla prawdy i no-flicker |
| Case | ContextActionDialogs zapisuje case przez case_items + item_added activity | obecnie case_items status=missing jako legacy/compat; docelowo task/work item missing_item z caseId | activity item_added jako legacy; docelowo missing_item_created | case item/task source-dependent | brak docelowego spójnego modelu z lead/client | Nie kopiowac obecnego insertCaseItem jako glownego modelu bez decyzji |
| Client | Client path zapisuje task/work item missing_item z clientId; widok agregacji w ClientDetail do kontraktu | direct client missing items + agregacja lead/case | client activity + source entity diary | resolve tylko na zrodlowej encji | direct client blockers + lead/case blockers | ClientDetail potrzebuje agregacji z badge zrodla: Klient/Lead/Sprawa |

## 4. Kontrakt docelowy

### active missing item source

Aktywne Braki/Blokady muszą pochodzić z jednego aktywnego modelu pracy:

```txt
work item / task typu missing_item
jawne id encji: leadId / caseId / clientId
jawny status: missing_item / blocking_missing_item / resolved / deleted
jawne flagi: missingKind / blocksProgress / blockScope
```

### blocker rule

```txt
Brak = aktywny element pracy, który czegoś wymaga.
Blokada = Brak, który ma blocksProgress=true albo status blocking_missing_item.
Nie zgadujemy blokady po tytule ani po typie dokumentu.
```

### history is not source of active missing

Historia jest dziennikiem zdarzeń, a nie źródłem aktywnej listy. Activity może pokazywać, że coś dodano albo rozwiązano, ale aktywna lista nie może być odtwarzana z samej historii.

### case_items decision

```txt
case_items = legacy/compat albo checklisty/elementy sprawy.
Nie robić z case_items głównego źródła Braków/Blokad dla sprawy, jeśli lead/client używają task/work item missing_item.
STAGE232I1 ma zdecydować: nowe Braki w CaseDetail zapisujemy jako task/work item missing_item z caseId, a case_items zostaje dla checklist/dokumentów albo read-only legacy.
```

### client aggregation rule

ClientDetail docelowo pokazuje rozdzielone strumienie:

```txt
directClientMissingItems
leadMissingItems
caseMissingItems
directClientBlockers
leadBlockers
caseBlockers
```

Każdy wpis musi mieć badge źródła: [Klient], [Lead], [Sprawa]. Nie wolno mieszać wszystkiego w jedną płaską listę bez źródła.

### owner control impact rule

Owner Control może agregować Braki/Blokady dopiero po STAGE232I1/I2, kiedy źródła case/client są stabilne. STAGE232I0 nie przepina Owner Control runtime.

## 5. Reguła encji

Każdy rekord Braku/Blokady musi mieć jawne powiązanie: leadId, caseId, clientId, sourceEntityType, sourceEntityId, recordType, recordId. Brak ze sprawy nie udaje braku leada. Brak klienta nie udaje braku sprawy.

## 6. Zakresy docelowe

### Lead
Nie przenosić automatycznie: lead_next_action, lead-only status logic, lead-specific potencjał, lead-specific sales stage blockers.

### Case
Docelowe blockScope: case_start, case_progress, case_completion, client_decision, missing_document, payment, checklist, handover, other, none.
Docelowe missingKind: document, information, decision, payment, meeting, signature, access, case_data, other.

### Client
Docelowe blockScope: new_lead, case_start, case_completion, billing, contact, relationship, other, none.
Docelowe missingKind: contact_details, identity_data, decision, document, payment, consent, relationship, other.

## 7. Następne runtime stages

### STAGE232I1_CASE_DETAIL_MISSING_BLOCKER_RUNTIME
Nowe Braki/Blokady w sprawie jako task/work item missing_item z caseId; resolve/delete; top status blokady; historia jako dziennik; no-flicker; legacy case_items tylko jako read-only/compat albo osobno nazwane checklisty.

### STAGE232I2_CLIENT_DETAIL_MISSING_BLOCKER_AGGREGATION_RUNTIME
Direct client Braki/Blokady; agregacja leadów i spraw; badge źródła; filtry; resolve tylko na źródłowej encji.

### STAGE232I3_OWNER_CONTROL_MISSING_BLOCKER_CROSS_ENTITY_INTEGRATION
Today widzi blokady lead/case/client, deduplikacja, poprawny priorytet i źródło.

## 8. Czego nie robiono

Nie implementowano CaseDetail runtime. Nie implementowano ClientDetail runtime. Nie robiono SQL. Nie migrowano case_items. Nie usuwano danych. Nie przepinano Owner Control runtime. Nie zmieniano UI kafelków. Nie ruszano finansów/prowizji. Nie ruszano Google Calendar. Nie ruszano scroll shell.

## 9. Warunek zamknięcia STAGE232I0

Kontrakt, run report, guard diagnostyczny, test kontraktu, update centralnych plików _project i zielone testy.
