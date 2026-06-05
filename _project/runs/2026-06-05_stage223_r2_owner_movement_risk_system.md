# STAGE223 R2 - Owner Movement Risk System

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## Cel

Spinać w jeden system:
- następny ruch,
- brak następnego ruchu,
- zaległy ruch,
- cisza 7/14 jako prawdziwa cisza kontaktu,
- brak świeżego ruchu jako fallback aktywności,
- sprawy bez ruchu,
- pieniądze bez ruchu,
- badge leadów/spraw.

## FAKTY

- R2B Stage222 przeszedł zielono i working tree był clean/up-to-date.
- `getNearestPlannedAction` istnieje w `src/lib/work-items/planned-actions.ts` i jest źródłem znajdowania najbliższej akcji.
- Stage223 nie buduje trzeciego systemu wyszukiwania akcji. Dodaje kontrakt interpretacji wyniku.
- `owner-risk-rules.ts` przed Stage223 używał updatedAt/createdAt w fallbacku i mógł etykietować to jako ciszę.
- `activity-truth.ts` rozdziela kontakt od zwykłej aktywności.

## DECYZJE DAMIANA

- Podetapów A-D nie pchać osobno.
- Nie robić drugiego Today.
- Nie udawać, że `updatedAt` to kontakt.
- Testy mają uruchamiać runtime funkcje, nie tylko szukać napisów.

## HIPOTEZY AI

- Pełne UI LeadDetail/CaseDetail lepiej dopiąć po runtime contract, jako D2, jeśli obecny kontrakt jest stabilny.
- W tym etapie widoczne list badges działają przez istniejące `record-operational-badges.ts` i `Cases.tsx`.

## ZAKRES

- `src/lib/owner-control/next-move-contract.ts`
- `src/lib/owner-control/activity-truth.ts`
- update `src/lib/owner-control/owner-risk-rules.ts`
- update `src/lib/record-operational-badges.ts`
- `scripts/check-stage223-owner-movement-risk-system.cjs`
- `tests/stage223-owner-risk-runtime-contract.test.cjs`
- package scripts
- _project / Obsidian updates

## CZEGO NIE RUSZANO

- Nie dodano nowej sekcji Today.
- Nie robiono Finance Watchlist.
- Nie robiono AI scoringu.
- Nie pushowano.
- Nie przebudowywano LeadDetail/CaseDetail jako duże UI.

## TESTY

```powershell
node scripts/check-stage223-owner-movement-risk-system.cjs
node --test tests/stage223-owner-risk-runtime-contract.test.cjs
node scripts/check-stage222-owner-risk-rules-foundation.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## RYZYKA

- Runtime test używa esbuild do ładowania TS. Jeżeli esbuild nie jest dostępny poza Vite dependency, test padnie i trzeba dopisać mały loader fallback.
- LeadDetail/CaseDetail work center nie są jeszcze pełnym D2 UI.
- Today ranking ryzyk może wymagać osobnego R3, ale bez nowej sekcji.

## NEXT STEP

Po zielonym Stage223 R2: D2 work-center integration dla LeadDetail/CaseDetail albo Today risk ranking.
