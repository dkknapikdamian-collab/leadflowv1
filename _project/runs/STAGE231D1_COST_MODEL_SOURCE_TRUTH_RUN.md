# STAGE231D1_COST_MODEL_SOURCE_TRUTH — run report

Data i godzina: 2026-06-10 Europe/Warsaw

## Scan

Repo files read:
- AGENTS.md
- _project/VISUAL_SOURCE_OF_TRUTH.md
- src/lib/finance/finance-types.ts
- src/lib/finance/finance-normalize.ts
- src/lib/finance/case-finance-source.ts
- src/pages/ClientDetail.tsx

Obsidian/project-memory files read:
- Brak bezpośredniego dostępu przez chat; payload przygotowany do repo i lokalnego vaulta.

## VISUAL SOURCE OF TRUTH

- D1 nie dodaje UI.
- Model etykiet finansowych jest centralny: CASE_COST_FINANCE_LABELS.
- Nie dodano lokalnych klas, kolorów ani ikon.

## FAKTY

- Dodano STAGE231D1_COST_MODEL_SOURCE_TRUTH.
- Dodano src/lib/finance/case-costs-source.ts.
- src/lib/finance/case-finance-source.ts eksportuje model kosztów przez jeden finance source.
- D1 nie dodaje SQL.
- D1 jest bez zmian runtime UI.

## TESTY

- npm run check:stage231d1-cost-model-source-truth
- npm run test:stage231d1-cost-model-source-truth
- npm run check:stage231d0-client-workspace-ux-cleanup
- npm run check:stage231d0a-visual-source-truth-consistency
- node scripts/check-stage231b0-r15-r3-polish-encoding.cjs
- npm run build
- git diff --check

## audyt ryzyk

- Bez D1 D2 mógłby dodać lokalną logikę kosztów w UI.
- D1 nie rozwiązuje jeszcze zapisu kosztów do bazy. SQL i RLS muszą wejść w D2.
- D1 nie pokazuje kosztów użytkownikowi; to celowe, żeby najpierw ustalić model.

## następny krok

STAGE231D2 — koszty w sprawie: SQL, źródło danych, UI w CaseDetail i guardy.
