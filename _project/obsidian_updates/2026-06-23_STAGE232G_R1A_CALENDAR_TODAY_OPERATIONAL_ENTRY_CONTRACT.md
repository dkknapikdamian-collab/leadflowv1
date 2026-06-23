# 2026-06-23 - STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT

Data: 2026-06-23 06:35 Europe/Warsaw
Status: R1A_READY_TO_APPLY / LOCAL_SYNC_PENDING
Canonical name: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Do zapisania w Obsidianie

R1A wprowadza wspólny kontrakt operacyjnego wpisu Calendar/Today.

Wynik:

```txt
STAGE232G_R1A_CALENDAR_TODAY_OPERATIONAL_ENTRY_CONTRACT
STATUS: READY_TO_APPLY_ZIP / CONTRACT_FOUNDATION
CALENDAR_SOURCE_TRUTH_STATUS: PARTIAL_AFTER_R1A
NEXT: STAGE232G_R1B_TODAY_USES_OPERATIONAL_ENTRY_CONTRACT
LOCAL_SYNC_PENDING
```

Zakres:

- `src/lib/calendar-operational-entry-contract.ts`.
- eksport kontraktu z `src/lib/scheduling.ts`.
- guard/test R1A.
- aktualizacja centralnych plików `_project` i `00_START`.

Decyzja:

- R1A nie rozwiązuje jeszcze całej różnicy Today/Calendar.
- R1A blokuje false-success dla lead shadow complete/restore/delete na poziomie kontraktu akcji.
- Kolejny etap powinien podpiąć Today do wspólnego adaptera momentu/dayKey.

Czego nie ruszać bez osobnego etapu:

- SQL/RLS,
- finanse/prowizje,
- Owner Control runtime,
- Google OAuth/sync,
- masowe czyszczenie DOM normalizerów.

Testy do zapisania po aplikacji:

```powershell
node scripts/check-stage232g-r1a-calendar-today-operational-entry-contract.cjs
node --test tests/stage232g-r1a-calendar-today-operational-entry-contract.test.cjs
npm run verify:closeflow:quiet
git diff --check
```

Obsidian GitHub sync: pending until push.
Obsidian local sync: LOCAL_SYNC_PENDING.
