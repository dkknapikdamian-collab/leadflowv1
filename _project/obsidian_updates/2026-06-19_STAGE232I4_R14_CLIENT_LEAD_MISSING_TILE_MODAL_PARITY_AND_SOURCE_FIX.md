# Obsidian update payload — STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX

Date: 2026-06-19 09:00 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
project_id: closeflow_lead_app
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
status: DO_ZAPISU_DO_OBSIDIANA / LOCAL_SYNC_PENDING

## Target files in Obsidian

- `10_PROJEKTY/CloseFlow_Lead_App/04_KIERUNEK_DO_WDROZENIA - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`
- `10_PROJEKTY/CloseFlow_Lead_App/08_HISTORIA_ZMIAN - DO_POTWIERDZENIA - CloseFlow LeadFlow.md`
- `10_PROJEKTY/CloseFlow_Lead_App/09_TESTY_DO_WYKONANIA_I_WYNIKI - DO_POTWIERDZENIA - CloseFlow LeadFlow.md` albo centralny odpowiednik 09
- `10_PROJEKTY/CloseFlow_Lead_App/11_RYZYKA_BUGI_I_DLUG_TECHNICZNY - DO_POTWIERDZENIA - CloseFlow LeadFlow.md` albo centralny odpowiednik 11
- `10_PROJEKTY/CloseFlow_Lead_App/10_ZIPY_WDROZENIA_PUSH - DO_POTWIERDZENIA - CloseFlow LeadFlow.md` albo centralny odpowiednik 10

## Entry to append

### 2026-06-19 09:00 Europe/Warsaw — STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX

Status: PACKAGE_PREPARED / APPLY_PENDING / MANUAL_SMOKE_PENDING

Decyzja: nie przechodzimy jeszcze w normalne `STAGE232I3`, dopóki regresja Braków / Blokad na ClientDetail i LeadDetail nie zostanie naprawiona.

Zakres:

- ClientDetail: `Dodaj brak` w kafelku ma otwierać szybkie dodawanie, a nie listę wszystkich braków.
- ClientDetail: listener `closeflow:context-action-saved` nie może samoczynnie otwierać managera wszystkich braków.
- ClientDetail: filtr `clientTasks` ma czytać direct, snake_case i payload IDs: `clientId/client_id`, `leadId/lead_id`, `caseId/case_id`, `payload.sourceEntityId`, `payload.recordId`, `payload.entityId`.
- ClientDetail: saved/optimistic missing item ma pełne pola source-of-truth: `sourceEntityType`, `sourceEntityId`, `recordType`, `recordId`, `clientId`, `blocksProgress`, `status`.
- LeadDetail: `Zobacz wszystkie braki` ma otwierać manager dialog, nie tylko scroll do akordeonu.
- Dodany wspólny komponent managera: `src/components/detail/MissingItemsManagerDialog.tsx`.
- Dodany guard: `scripts/check-stage232i4-r14-client-lead-missing-tile-modal-parity.cjs`.
- Dodany test: `tests/stage232i4-r14-client-lead-missing-tile-modal-parity.test.cjs`.

Nie ruszać w tym etapie:

- SQL / RLS,
- finanse / prowizje,
- Google Calendar,
- billing / trial,
- scroll shell,
- CaseDetail I1 runtime poza smoke,
- Owner Control I3 runtime.

Testy po apply:

```powershell
node scripts/check-stage232i4-r14-client-lead-missing-tile-modal-parity.cjs
node --test tests/stage232i4-r14-client-lead-missing-tile-modal-parity.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

Manual smoke: Client i Lead zgodnie z run reportem `_project/runs/STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX.md`.

Ryzyko: jeżeli istnieją inne stare wejścia Braków/Blokad poza `ContextActionDialogs`, `MissingItemQuickActionModal`, LeadDetail i ClientDetail, wymagają osobnej mapy przed kolejnym etapem. R14 celowo nie przebudowuje Owner Control.

Next:

- Po PASS i manual smoke: domknąć `STAGE232I4_R14`.
- Potem wrócić do statusu `STAGE232I3` albo `STAGE232K_CASE_COMMISSION_PAID_SOURCE_OF_TRUTH`, zależnie od aktualnego routera i smoke.

## R5 duplicate recordType cleanup - 2026-06-19 Europe/Warsaw
- Cleaned duplicate top-level `recordType: 'client'` warning in `src/pages/ClientDetail.tsx`.
- Reason: R4 passed guard/test/build, but Vite/esbuild reported duplicate key in the optimistic missing-item object.
- Scope: ClientDetail source object cleanup only; no SQL, no Owner Control I3, no Calendar, no finance.
- Verification to run after cleanup: R14 guard, R14 node test, build, git diff --check, manual smoke.

