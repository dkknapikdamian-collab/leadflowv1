# Obsidian update — STAGE231B0-R11

Project: CloseFlow / LeadFlow
Date: 2026-06-10

## Decyzja / fakt
Po R9 wykryto dwa problemy:
1. Runtime /cases: closedRecordStage231B0R8 is not defined.
2. ClientDetail jest za wąski względem CaseDetail.

## Zmiana
- Cases.tsx: JSX nie może używać wolnej zmiennej closedRecordStage231B0R8; używa isClosedCaseStatus(record?.status).
- ClientDetail CSS: szeroki layout jak CaseDetail, lewy alignment, breakpointy skalowania.
- Dodano guard/test R11.

## Ryzyka
- Ręczny test UI wymagany po deployu: /cases, client detail width, scaling, closed/open/all views.
- Warning duplicate savedRecord zostaje osobnym cleanupem.
