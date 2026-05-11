# CLOSEFLOW ETAP9 REPAIR5 — CaseDetail quick actions cleanup guarded

Data: 2026-05-11
Branch: dev-rollout-freeze

## Cel

Domknąć ETAP9 po błędnym założeniu w REPAIR4, gdzie patcher liczył każde wystąpienie tekstu `Szybkie akcje` w `CaseQuickActions.tsx`.

## Zakres

- `src/pages/CaseDetail.tsx`
  - usuwa tylko legacy prawy panel `Szybkie akcje / Dodaj brak`, jeżeli nadal istnieje,
  - zostawia checklisty i właściwe dodawanie braków,
  - wymaga dokładnie jednego renderu `<CaseQuickActions />`.
- `src/components/CaseQuickActions.tsx`
  - pozostaje właściwym panelem szybkich akcji,
  - może mieć więcej niż jedno tekstowe wystąpienie `Szybkie akcje`, jeżeli wynika to z dostępności/markup.
- `src/styles/visual-stage13-case-detail-vnext.css`
  - dopina jasny styl `CLOSEFLOW_ETAP9_CASE_DETAIL_QUICK_ACTIONS_LIGHT`,
  - usuwa czarne tło z panelu właściwych szybkich akcji.
- `scripts/check-closeflow-case-detail-quick-actions-cleanup.cjs`
  - sprawdza konkretny legacy panel, a nie każde wystąpienie tekstu `Dodaj brak`.

## Weryfikacja

- `npm.cmd run check:case-detail-quick-actions-cleanup`
- `npm.cmd run build`

## Kryterium

Na `/case/:id` nie zostaje osobny prawy panel `Szybkie akcje / Dodaj brak`, a właściwy panel `CaseQuickActions` jest jasny i spójny z prawymi kartami.
