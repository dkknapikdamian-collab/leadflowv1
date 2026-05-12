# CLOSEFLOW STAGE14D REPAIR3 REAL CASE HISTORY

Cel: zamienić sekcję „Najważniejsze działania” w `CaseDetail` na prawdziwą historię sprawy opartą o dane aplikacji.

Zakres:
- `src/pages/CaseDetail.tsx`
- `src/styles/visual-stage13-case-detail-vnext.css`
- guard: `scripts/check-stage14d-real-case-history-repair3.cjs`

Repair3 usuwa pozostałości po nieudanych Stage14D/Repair1/Repair2, unika template-string trap w generatorze i wymaga realnego diffu w źródle oraz CSS.

Nie zmienia API, backendu, statusów sprawy ani nie tworzy nowych rekordów aktywności.
