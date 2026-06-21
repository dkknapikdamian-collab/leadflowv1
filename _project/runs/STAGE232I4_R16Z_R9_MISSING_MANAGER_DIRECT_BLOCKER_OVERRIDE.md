# STAGE232I4_R16Z_R9_MISSING_MANAGER_DIRECT_BLOCKER_OVERRIDE

Data: 2026-06-21 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: TECH_APPLIED_LOCAL / OWNER_SMOKE_REQUIRED

## Audyt przyczyny

Damian potwierdzil realny runtime bug: w LeadDetail -> Zobacz wszystkie braki odznaczenie checkboxa Blokuje znika na chwile, ale po silent refresh/F5 wraca jako zaznaczone mimo komunikatu, ze brak nie blokuje.

R8 poprawil zapis status, priority i payload w handlerze LeadDetail, ale nie domknal warstwy odczytu w samym wspolnym managerze. MissingItemsManagerDialog.isManagerItemBlocker nadal liczyl blokade przez OR: status === blocking_missing_item || priority === high || direct, wiec stare
aw.status albo
aw.priority z activity bridge moglo nadpisac swieze locksProgress=false.

## Zmiana

MissingItemsManagerDialog traktuje teraz jawne item.isBlocker / item.blocksProgress jako zrodlo prawdy przed fallbackiem
aw/payload/status/priority. To znaczy: jesli LeadDetail po toggle przekazuje locksProgress=false, stary raw/status nie moze ponownie zaznaczyc checkboxa.

## Testy automatyczne

- check-stage232i4-r16z-r9-missing-manager-direct-blocker-override.cjs
- stage232i4-r16z-r9-missing-manager-direct-blocker-override.test.cjs
- R16Z_R8 regression
- R16Z_R5 close regression
- npm run build
- npm run verify:closeflow:quiet
- git diff --check

## Manual smoke wymagany

LeadDetail -> Zobacz wszystkie braki:
1. Odznacz Blokuje.
2. Poczekaj na komunikat.
3. Checkbox ma zostac odznaczony.
4. F5.
5. Checkbox nadal ma byc odznaczony.
6. Zaznacz ponownie.
7. F5.
8. Checkbox ma byc zaznaczony.

## Zakres nietkniety

Nie ruszano SQL, RLS, finansow, Google Calendar, billing/trial, Owner Control runtime, CaseDetail runtime ani layoutu modala.
