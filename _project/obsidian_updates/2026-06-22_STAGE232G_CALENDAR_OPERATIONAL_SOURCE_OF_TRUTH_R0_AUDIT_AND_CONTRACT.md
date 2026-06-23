# Obsidian update payload - STAGE232G R0 Calendar Operational Source of Truth Audit

Data: 2026-06-22 23:35 Europe/Warsaw
Status: R0_AUDIT_COMPLETED / REVIEW_REQUIRED / LOCAL_SYNC_PENDING
Canonical name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Wpis do 02_AKTUALNY_STAN

STAGE232G_R0_CALENDAR_OPERATIONAL_SOURCE_OF_TRUTH_R0_AUDIT_AND_CONTRACT został wykonany jako audyt docs-only. Runtime Calendar/Today/Lead/Case/Client nie był modyfikowany.

Wynik:

```txt
CALENDAR_SOURCE_TRUTH_STATUS: PARTIAL
TODAY_CALENDAR_PARITY_STATUS: PARTIAL
LEAD_SHADOW_ENTRY_STATUS: PARTIAL
GOOGLE_CALENDAR_BACKGROUND_SYNC_STATUS: PASS_WITH_RUNTIME_RISK
RUNTIME_TOUCHED: NIE
```

Główny wniosek: Calendar ma centralny model `ScheduleEntry`, ale Today nadal ma osobną logikę dat/list i nie używa tego samego adaptera. Kalendarz nie powinien być jeszcze zamykany jako pełne źródło prawdy.

## Wpis do 04_KIERUNEK_DO_WDROZENIA

Następny rekomendowany etap:

```txt
STAGE232G_R1_CALENDAR_RUNTIME_SOURCE_TRUTH_FIX
```

Powód: R0 pokazał `PARTIAL`, nie `PASS`.

Zakres R1 ma być wąski:

- wspólny adapter/kontrakt Calendar + Today dla task/event/lead moments,
- blokada albo naprawa `Zrobione/Przywróć` dla lead entries,
- pełny payload task edit/complete,
- parity guard Calendar/Today po F5,
- bez SQL, bez finansów, bez Braków/Blokad, bez Google OAuth.

## Wpis do 09_TESTY_DO_WYKONANIA_I_WYNIKI

Testy R0 do uruchomienia po paczce:

```powershell
node scripts/check-stage232g-calendar-operational-source-truth-r0-audit.cjs
node --test tests/stage232g-calendar-operational-source-truth-r0-audit.test.cjs
npm run verify:closeflow:quiet
git diff --check
git status --short --branch
```

Wymagany PASS przed commit/push.

## Wpis do 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

Ryzyka po R0:

1. Today i Calendar mają różne selektory/logikę dat.
2. Lead shadow entry jest operacyjny, ale `Zrobione/Przywróć` dla lead entry nie ma jasnej gałęzi update źródła.
3. Month view ma aktywne DOM normalizatory i `replaceChildren()` po renderze.
4. Task shift ma pełny payload dat, ale task edit/complete jest mniej kompletny.
5. Obsidian vault main jest stale wobec app repo/payloadu i wymaga synchronizacji.

## Wpis do 10_ZIPY_WDROZENIA_PUSH

ZIP/paczka: `STAGE232G_R0_ACTUAL_CALENDAR_AUDIT_2026_06_22.zip`
Tryb: local apply, docs/guard/test only.
Runtime: nie ruszać.
Commit/push: dopiero po PASS i akceptacji Damiana.

## Obsidian sync

Obsidian GitHub sync: DO_WYKONANIA po zatwierdzeniu.
Obsidian local sync: LOCAL_SYNC_PENDING.

PowerShell po przyszłym sync/push Obsidiana:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\00_OBSIDIAN_VAULT"
git status --short --branch
git pull --ff-only origin main
git status --short --branch
```
