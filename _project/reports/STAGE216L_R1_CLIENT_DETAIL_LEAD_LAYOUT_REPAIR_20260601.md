# STAGE216L-R1 - ClientDetail layout repair after PowerShell parser failure

typ: run_report
status: prepared_zip
scope: CloseFlow / LeadFlow
repo: dkknapikdamian-collab/leadflowv1
branch: dev-rollout-freeze
local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow

## Cel

Naprawić paczkę Stage216L, która nie wystartowała przez błąd parsera PowerShell w skrypcie aplikującym. R1 przenosi JSX patching do skryptu Node.js, a PowerShell zostaje tylko wrapperem uruchamiającym patch, guardy i build.

## Fakty

- Poprzedni skrypt Stage216L zatrzymał się przed aplikacją zmian na błędzie parsera PowerShell.
- Przyczyną było umieszczenie JSX/TSX w podwójnie cudzysłowionych stringach PowerShell, gdzie znaki `"`, `{}`, `||`, `<` i `>` zostały zinterpretowane przez PowerShell zamiast jako tekst.
- R1 używa `PATCH_STAGE216L_R1_CLIENT_DETAIL_LAYOUT.cjs` do modyfikacji TSX i plików tekstowych.

## Decyzje Damiana

- Notatki klienta przenosimy do środka.
- ClientTopTiles schodzą do głównej kolumny.
- Awatar/inicjały klienta usuwamy.
- Nazewnictwo, ikonki i kolory zostają na późniejszy etap Stage216M.

## Zakres zmian

- `src/pages/ClientDetail.tsx`
- `src/styles/page-adapters/page-adapters.css`
- `src/styles/stage216l-client-detail-lead-layout-cumulative.css`
- `tests/stage216l-client-detail-lead-layout-cumulative-contract.test.cjs`
- `_project/reports/STAGE216L_R1_CLIENT_DETAIL_LEAD_LAYOUT_REPAIR_20260601.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_LeadFlow/STAGE216L_R1_CLIENT_DETAIL_LEAD_LAYOUT_REPAIR_20260601.md`

## Czego nie ruszano

- Supabase
- API
- migracje SQL
- płatności
- dane produkcyjne
- push/commit

## Testy

Skrypt uruchamia:

```powershell
node tests/stage216l-client-detail-lead-layout-cumulative-contract.test.cjs
git diff --check
npm run build
```

## Następny krok

Po wdrożeniu R1 zrobić screenshot `/clients/:clientId` i porównać z `/leads/:leadId`. Jeśli układ jest stabilny, kolejnym etapem jest Stage216M: słownik nazw, ikon i kolorów dla LeadDetail/ClientDetail/CaseDetail.
