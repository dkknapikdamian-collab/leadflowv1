# Obsidian update — STAGE231B0-R12-R7

Project: CloseFlow / LeadFlow
Date: 2026-06-10

## Fakt
Po R11 /cases miał runtime error. Poprzednie R12 poprawki były zbyt kruche.

## Decyzja
R12-R7 stabilizuje /cases przez jeden kontrakt źródła danych i runtime:
- useMemo dla activeCases/closedCases,
- record.status tylko w filtrach,
- osobny helper closed banner,
- brak closedRecordStage231B0R8,
- brak record?.status.

## Ryzyko
Po deployu wymagany test ręczny /cases, wejścia w sprawę i widoków open/closed/all.
