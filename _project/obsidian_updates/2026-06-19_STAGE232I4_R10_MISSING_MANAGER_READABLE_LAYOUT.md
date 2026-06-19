# STAGE232I4_R10_MISSING_MANAGER_READABLE_LAYOUT — Obsidian payload

- Data/czas: 2026-06-19 13:25 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local_path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
- stage: STAGE232I4_R10_MISSING_MANAGER_READABLE_LAYOUT

## 02_AKTUALNY_STAN

R9 potwierdził, że braki klienta zapisują się i pojawiają w kafelku/managerze. Pozostała poprawka wizualna managera `Braki / Blokady`: dialog ma być czytelny i spójny z aplikacją.

## 04_KIERUNEK_DO_WDROZENIA

Wspólny `MissingItemsManagerDialog` ma używać spójnego ciemnego stylu aplikacji, czytelnej hierarchii tekstu, oddzielonych sekcji formularz/lista/footer oraz osobnych kart dla braków. Akcje `Blokuje`, `Uzupełnione`, `Usuń` mają być w osobnym pasku z odstępami i zawijaniem.

## 08_HISTORIA_ZMIAN

2026-06-19 13:25 Europe/Warsaw — przygotowano STAGE232I4_R10: czytelny layout managera braków, bez zmian backendu i SQL.

## 09_TESTY_DO_WYKONANIA_I_WYNIKI

Do wykonania po wdrożeniu:

- `node scripts/check-stage232i4-r10-missing-manager-readable-layout.cjs`
- `node --test tests/stage232i4-r10-missing-manager-readable-layout.test.cjs`
- R14 guard/test
- R6 runtime guard
- R9 guard/test
- `npm run build`
- `git diff --check`
- manual smoke na kliencie i leadzie

## 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

Ryzyko: zmiana dotyka wspólnego dialogu klienta i leada. Trzeba sprawdzić oba widoki. Nie dotykać `.claude/`.

## 10_ZIPY_WDROZENIA_PUSH

ZIP: `STAGE232I4_R10_MISSING_MANAGER_READABLE_LAYOUT.zip`
Status: przygotowany do lokalnego apply/test/push.
