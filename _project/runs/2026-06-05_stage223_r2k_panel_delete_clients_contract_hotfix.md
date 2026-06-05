# STAGE223 R2K - Panel delete clients contract hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2J:
  - Stage122 OK
  - Stage120 OK
  - Stage98 OK
  - Stage220A17 OK
  - case trash actions OK
  - Stage113 OK
  - Stage223 OK
  - Stage222 OK
  - build OK
- `verify:closeflow:quiet` zatrzymał release na:
  `tests/panel-delete-actions-v1.test.cjs`
- Failing assertions:
  - brak literalnego `archivedAt: new Date().toISOString()`,
  - brak literalnego `\n\nTen klient ma powiązania`.
- `src/pages/Clients.tsx` miało semantycznie soft-delete przez ternary:
  `archivedAt: mode === 'archive' ? new Date().toISOString() : null`
- Stary test kontraktowy wymaga jawnych tokenów.

## ZAKRES

- W `src/pages/Clients.tsx`:
  - archive branch zapisuje `archivedAt: new Date().toISOString()`,
  - restore branch zapisuje `archivedAt: null`,
  - opis powiązań klienta zaczyna się od escaped `\n\nTen klient ma powiązania`.
- Nie dodawać hard delete.
- Nie używać `deleteClientFromSupabase`.
- Nie ruszać Stage223 Activity Truth.
- Nie ruszać Today.
- Nie ruszać Supabase schema.

## TESTY

```powershell
node --test tests/panel-delete-actions-v1.test.cjs
node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
node --test tests/stage120-calendar-local-first-sync-and-focus-contract.test.cjs
node --test tests/stage98-polish-mojibake-calendar-guard.test.cjs
node scripts/check-stage220a17-case-detail-vst-wiring.cjs
node scripts/check-closeflow-case-trash-actions.cjs
node --test tests/stage113-closeflow-logo-source-contract.test.cjs
node scripts/check-stage223-owner-movement-risk-system.cjs
node --test tests/stage223-owner-risk-runtime-contract.test.cjs
node scripts/check-stage222-owner-risk-rules-foundation.cjs
node --test tests/stage222-owner-risk-rules-foundation.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2K.
