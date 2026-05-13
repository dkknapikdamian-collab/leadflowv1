# CLOSEFLOW FIN-15 MASS REPAIR12 — Lead bez finansowych duchów

## Cel

Lead ma być źródłem pozyskania i historią kontaktu. Po rozpoczęciu obsługi dalsza praca operacyjna, edycja wartości, prowizje i płatności mają być prowadzone w sprawie.

## Zakres

- `src/pages/LeadDetail.tsx`
- `scripts/check-fin15-lead-finance-ghosts.cjs`
- `tests/fin15-lead-finance-ghosts.test.cjs`
- `tools/audit-fin15-lead-finance-ghosts-mass-repair12.cjs`
- `tools/patch-fin15-lead-finance-ghosts-mass-repair12.cjs`

## Decyzje

- Lead nie pobiera płatności przez `fetchPaymentsFromSupabase`.
- Lead nie tworzy płatności przez `createPaymentInSupabase`.
- Lead nie ma lokalnego modala płatności.
- Lead po handoffie wymusza kierunek do `/case/:id`.
- Zostają kontrakty `leadOperationalArchive`, `handleCreateQuickTask`, `handleCreateQuickEvent` oraz blokady dodawania dalszych zadań/wydarzeń na leadzie po przejściu do sprawy.

## Guard

Dodany audit masowy sprawdza naraz:

- brak finansowych tokenów leada,
- redirect do `/case/:id`,
- brak redirectu do `/cases/:id`,
- zachowanie kontraktów lead-service-mode,
- zachowanie kopii „Ten temat jest już w obsłudze” oraz „Otwórz sprawę”.
