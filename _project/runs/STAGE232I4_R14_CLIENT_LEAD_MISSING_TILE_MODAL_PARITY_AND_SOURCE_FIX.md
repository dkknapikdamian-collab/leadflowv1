# STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX

Date: 2026-06-19 09:00 Europe/Warsaw
canonical_name: CloseFlow / LeadFlow
project_id: closeflow_lead_app
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
status: PACKAGE_PREPARED / APPLY_PENDING / MANUAL_SMOKE_PENDING

## Cel

Naprawa regresji Braków / Blokad przed kontynuacją STAGE232I3:

- ClientDetail: `Dodaj brak` ma otwierać tryb dodawania, a nie automatycznie okno wszystkich braków.
- ClientDetail: zapisany brak ma być widoczny w kafelku od razu i po odświeżeniu.
- ClientDetail: filtr relacji ma czytać direct, snake_case i payload IDs.
- LeadDetail: `Zobacz wszystkie braki` ma otwierać manager dialog, nie tylko scroll do akordeonu.
- Guard/test mają blokować powrót starego zachowania.

## MAPA WEJŚĆ BRAKÓW/BLOKAD

### LeadDetail

- Kafelek `Blokada`: `src/pages/LeadDetail.tsx`, top decision card `data-stage227e3-blocker-card`.
- `Dodaj brak`: `openLeadContextAction('blocker')`, shared ContextActionDialogs.
- `Zobacz wszystkie braki`: po R14 otwiera `MissingItemsManagerDialog`, nie wykonuje `scrollIntoView('#lead-actions')` jako jedynej akcji.
- Akordeon `Braki i blokady`: zostaje jako lista operacyjna w `Działania leada`.
- Resolve/delete: istniejące `handleResolveLeadMissingItemStage228R13` i `handleDeleteLeadMissingItemStage228R15`.
- Toggle blocker: nowy `handleToggleLeadMissingBlockerStage232I4R14` aktualizuje źródłowy task.

### ClientDetail

- Kafelek `Braki / Blokady`: `ClientMissingBlockerTopTile`, nadal wizualnie oparty o LeadDetail blocker card.
- `Dodaj brak`: po R14 otwiera `MissingItemQuickActionModal`, nie manager wszystkich braków.
- `Zobacz wszystkie braki`: jawnie otwiera manager/listę wszystkich braków.
- `closeflow:context-action-saved`: po R14 dopisuje/odświeża rekord, ale nie otwiera managera samoczynnie.
- Filtr `clientTasks`: po R14 czyta direct, snake_case i payload relation ids: client/lead/case/sourceEntityId/recordId/entityId.
- Zapis/optimistic task: po R14 dostaje pełne pola `sourceEntityType`, `sourceEntityId`, `recordType`, `recordId`, `clientId`, `blocksProgress`, `status` także w payload.
- Martwy panel `{false && clientMissingListOpenStage232I6}`: zostaje nieaktywny jako archived legacy block; aktywny manager to Dialog.

### CaseDetail

- Nie ruszane runtime w R14.
- Do manual smoke: sprawdzić, że I1 Braki/Blokady nadal działa i nie dubluje wpisów.

### Owner Control

- Nie wdrażane w R14.
- R14 nie ma przebudowywać STAGE232I3.
- Do regresji: sprawdzić, czy Today / Owner Control nie dubluje braków po zmianach w źródłowych rekordach.

## Pliki zmieniane przez paczkę

- `src/pages/ClientDetail.tsx`
- `src/pages/LeadDetail.tsx`
- `src/components/detail/MissingItemsManagerDialog.tsx`
- `src/styles/visual-stage12-client-detail-vnext.css`
- `scripts/check-stage232i4-r14-client-lead-missing-tile-modal-parity.cjs`
- `tests/stage232i4-r14-client-lead-missing-tile-modal-parity.test.cjs`
- `_project/runs/STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX.md`
- `_project/obsidian_updates/2026-06-19_STAGE232I4_R14_CLIENT_LEAD_MISSING_TILE_MODAL_PARITY_AND_SOURCE_FIX.md`

## Testy / guardy do uruchomienia

```powershell
node scripts/check-stage232i4-r14-client-lead-missing-tile-modal-parity.cjs
node --test tests/stage232i4-r14-client-lead-missing-tile-modal-parity.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## Manual smoke dla Damiana

### Client

1. Wejdź w klienta.
2. Kliknij `Dodaj brak` w kafelku Braki / Blokady.
3. Dodaj `brak test klient`.
4. Po zapisie pełna lista wszystkich braków nie ma otworzyć się sama.
5. Kafelek ma od razu pokazać aktywny brak.
6. Zrób F5.
7. Kafelek dalej ma pokazywać aktywny brak.
8. Kliknij `Zobacz wszystkie braki`.
9. Otwiera się manager.
10. Wiersz ma nazwę, checkbox `Blokuje`, `Uzupełnione`, `Usuń`.
11. Zaznacz checkbox.
12. Kafelek pokazuje blokadę.
13. Kliknij `Uzupełnione`.
14. Zrób F5.
15. Brak nie wraca.

### Lead

1. Wejdź w leada z aktywnym brakiem.
2. Kliknij `Zobacz wszystkie braki`.
3. Ma otworzyć się manager dialog, nie sam scroll do akordeonu.
4. Wiersz ma nazwę, checkbox, `Uzupełnione`, `Usuń`.
5. Checkbox zmienia blokadę.
6. `Uzupełnione` usuwa z aktywnych.
7. `Usuń` usuwa z aktywnych po F5.

## Ryzyka i audyt skutków ubocznych

- Największe ryzyko: stary ContextAction listener mógł otwierać manager bez decyzji użytkownika. R14 usuwa ten side-effect.
- Drugie ryzyko: rekord z Supabase mógł wrócić jako `client_id` albo tylko w `payload`, więc kafelek pokazywał `Czysto`. R14 rozszerza filtr relacji.
- LeadDetail dostaje nowy manager dialog, ale akordeon zostaje. Nie usuwamy starego widoku, tylko zmieniamy akcję `Zobacz wszystkie braki`.
- CaseDetail i Owner Control nie są przebudowywane.
- SQL/RLS nie są ruszane.

## Wynik lokalny

PACKAGE_PREPARED. Testy do uruchomienia po apply w lokalnym repo Damiana.

## R5 duplicate recordType cleanup - 2026-06-19 Europe/Warsaw
- Cleaned duplicate top-level `recordType: 'client'` warning in `src/pages/ClientDetail.tsx`.
- Reason: R4 passed guard/test/build, but Vite/esbuild reported duplicate key in the optimistic missing-item object.
- Scope: ClientDetail source object cleanup only; no SQL, no Owner Control I3, no Calendar, no finance.
- Verification to run after cleanup: R14 guard, R14 node test, build, git diff --check, manual smoke.

