# CloseFlow Stage14D Repair1 — real CaseDetail history

Cel: naprawić nieudany Stage14D, który wywalił się przez nieucieczony template string w skrypcie naprawczym przed zapisem `CaseDetail.tsx`.

Zakres:
- `src/pages/CaseDetail.tsx`
  - dodaje `CaseHistoryItem`, helpery mapowania historii i `caseHistoryItems`,
  - mapuje realne dane: aktywności, notatki, zadania, wydarzenia, wpłaty, checklisty i statusy,
  - zastępuje sekcję `Najważniejsze działania` sekcją `Historia sprawy`,
  - nie tworzy nowych rekordów aktywności i nie zmienia API.
- `src/styles/visual-stage13-case-detail-vnext.css`
  - dodaje jednowierszowy layout historii z ellipsis i tooltipem w JSX.

Akceptacja:
- `npm.cmd run build`
- `node scripts/check-stage14d-real-case-history-repair1.cjs`
