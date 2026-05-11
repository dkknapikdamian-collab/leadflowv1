# CLOSEFLOW CASE DETAIL NO PARTIAL LOADING CHECK BLOCK SCAN FIX V2 — 2026-05-11

Cel: naprawić fałszywy failure guarda `check:case-detail-no-partial-loading`.

Problem:
- poprzedni check skanował stałe okno tekstu po `if (loading)`;
- okno było za duże i wpadało w legalny główny render sprawy;
- przez to check błędnie uznawał, że loader renderuje `CaseSettlementPanel`.

Naprawa:
- check wyciąga teraz realny blok `if (loading) { ... }` przez dopasowanie klamry zamykającej;
- zabronione teksty/panele są sprawdzane wyłącznie w helperze loadera i w realnym bloku loadingu;
- check nadal pilnuje, żeby `if (loading)` był wewnątrz `CaseDetail` i przed głównym JSX return;
- check nadal pilnuje, żeby po głównym return nie było drugiego `if (loading)`;
- `verify:closeflow:quiet` pozostaje bez zmiany kontraktu w `package.json`.

Zakres:
- `scripts/check-closeflow-case-detail-no-partial-loading.cjs`
- dokumentacja tej poprawki

Nie zmienia:
- `src/pages/CaseDetail.tsx`
- logiki finansów
- layoutu sprawy
- `package.json`
