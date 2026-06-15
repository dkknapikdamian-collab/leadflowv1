# STAGE232D_CASES_OPERATIONAL_TILES_SOURCE_OF_TRUTH - audit / run decision

Data: 2026-06-15 Europe/Warsaw
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Status: DOCS_PREPARED / DO_WDROZENIA
Tryb: audit-first / source-of-truth / no runtime changes in this package

## Scan proof

Przeczytane pliki repo:

- `src/App.tsx`
- `src/pages/Cases.tsx`
- `src/lib/case-lifecycle-v1.ts`
- `src/lib/owner-control/owner-risk-rules.ts`
- `src/lib/owner-control/next-move-contract.ts`
- `src/lib/work-items/planned-actions.ts`
- `src/lib/finance/case-finance-source.ts`
- `src/styles/closeflow-record-list-source-truth.css`
- `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`

Lokalnego Obsidiana nie aktualizowano bezpośrednio z tego pakietu. Payload do synchronizacji jest w `_project/obsidian_updates/`.

## Fakty z kodu

- `/cases` routuje do `src/pages/Cases.tsx`.
- `Cases.tsx` pobiera sprawy, leady, klientów, zadania i wydarzenia.
- `stats.waiting` liczy lifecycle `blocked` albo `waiting_approval`, a nie czysto czekanie na klienta.
- `Sprawy bez ruchu` w prawym railu używa `stats.waiting`.
- `Portal klienta` używa `stats.linked`, gdzie `linked` oznacza aktywne sprawy z `leadId`.
- `resolveCaseListLifecycle()` dostaje z listy tylko tasks/events, bez checklist/items.
- `missingRequiredCount` w lifecycle liczy items, ale lista ich nie przekazuje.
- `getCaseOwnerRiskBadges()` oczekuje kontekstu `nextMove`, `activityTruth`, `relatedRecords` albo `hasNextStep`.
- `Cases.tsx` przekazuje do `getCaseOwnerRiskBadges()` pola `lifecycle`, `nearestCaseAction`, `nextActionLabel`, `statusLabel`, `compactLifecycleLabel`, `compactLifecyclePill`, `percent`, `updatedAt`, których helper nie używa jako źródła next move.
- `buildNextMoveContract()` bez `nearestAction` zwraca `missing`, więc badge `Brak następnego ruchu` może być fałszywy.
- `Blokery i ryzyko` renderuje `filteredCases.slice(0, 4)`, nie sortuje po ryzyku.
- Wiersz ma etykietę `Najbliższy termin w sprawie`, ale fallback bez terminu pokazuje instrukcję operatora, a data pod spodem może pochodzić z `updatedAt`.

## Decyzja produktu

Zakładka `Sprawy` ma być centrum obsługi spraw, nie tylko listą statusów. Liczniki i ryzyka muszą być spójne z rzeczywistymi danymi:

- status sprawy,
- prawdziwy najbliższy task/event,
- realne blokady/braki,
- activity truth,
- portalReady,
- checklist/items, jeśli pokazujemy braki/akceptacje/postęp.

## Wdrożenie R1

Patrz etap `STAGE232D_CASES_OPERATIONAL_TILES_SOURCE_OF_TRUTH` w `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.

## Ryzyka

- Zmiana definicji `Czeka na klienta` obniży licznik względem obecnego mieszania blocked/approval.
- `Sprawy bez ruchu` może wymagać activity-truth dla spraw, inaczej trzeba go tymczasowo ukryć albo nazwać inaczej.
- `Portal klienta` może spaść do 0, jeśli dotąd liczono leadId zamiast portalReady.
- `Braki 0` może zniknąć z raila, jeśli lista nie ma checklist/items. To poprawne; lepiej nie pokazywać fałszywego zera.
- Trzeba uważać, żeby nie ruszyć zamrożonego CaseDetail layoutu.

## Guardy do dodania

- `scripts/check-stage232d-cases-operational-tiles.cjs`
- `tests/stage232d-cases-operational-tiles.test.cjs`

## Test ręczny

Zobacz sekcję etapu w `_project/04_ETAPY_ROZWOJU_APLIKACJI.md`.
