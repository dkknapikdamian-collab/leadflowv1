# Stage115B V2 - CaseDetail write gate compatibility

## Status
DO WDROŻENIA / RELEASE GATE REPAIR.

## Cel
Naprawić blokadę quiet release gate po Stage115: `tests/case-detail-write-access-gate-stage02b.test.cjs` wymaga legacy async handlerów `handleAddTask`, `handleAddEvent`, `handleAddNote`, podczas gdy aktywny kod używał nowszych `openCaseTaskDialog`, `openCaseEventDialog`, `openCaseNoteDialog`.

## Fakty z logu lokalnego
- Stage115 import/runtime tests przeszły.
- `npm run build` przeszedł.
- `npm run verify:closeflow:quiet` zatrzymał się na `tests/case-detail-write-access-gate-stage02b.test.cjs`.
- Błąd: `handleAddTask is not guarded`.

## Decyzja
Nie wyłączać starego guardu. Dodać kompatybilne async wrappery, które przechodzą przez ten sam lokalny `guardCaseDetailWriteAccess`, a istniejące handlery UI delegują do nich.

## Zmienione pliki
- `src/pages/CaseDetail.tsx`
- `tools/patch-stage115b-case-detail-write-gate-compat.cjs`
- `_project/runs/2026-05-18_stage115b_v2_case_detail_write_gate_compat.md`

## Testy automatyczne
- `node --test tests/case-detail-write-access-gate-stage02b.test.cjs`
- `node --test tests/stage115-case-detail-useworkspace-import-contract.test.cjs`
- `node --test tests/stage115-case-detail-render-runtime-contract.test.cjs`
- `npm run build`
- `npm run verify:closeflow:quiet`

## Test ręczny po wdrożeniu
- Otworzyć `/cases`.
- Wejść w dowolną sprawę.
- Hard refresh na `/case/:id` albo `/cases/:id`, jeśli route istnieje.
- Konsola bez `p.useWorkspace is not a function`.
- Konsola bez `APP_ROUTE_RENDER_FAILED`.
- Akcje dodania zadania/wydarzenia/notatki nadal otwierają wspólny modal i są blokowane przy braku dostępu.

## Ryzyka
- Repo lokalne Damiana ma dużo wcześniejszych modyfikacji i plików untracked. Paczka dodaje do commita wyłącznie ścieżki Stage115B V2.
- Jeżeli quiet gate padnie dalej, to będzie następny niezależny blocker, nie ten sam błąd `useWorkspace`.

## Obsidian
Dodać notatkę: `10_PROJEKTY/CloseFlow_Lead_App/2026-05-18 - CloseFlow Stage115B V2 CaseDetail write gate compat.md`.

## Następny krok
Po przejściu Stage115B V2 zrobić test ręczny sprawy i dopiero potem wrócić do pozostałych zgłoszeń Stage113/114 oraz nowych UI bugów.
