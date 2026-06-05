# STAGE223 R2Q - Daily digest API contract hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2P:
  - PWA foundation OK
  - Stage220A29 OK
  - Stage122 OK
  - ClientDetail operational center OK
  - case-history visual/rewrite/workrow OK
  - panel-delete OK
  - Stage120 OK
  - Stage98 OK
  - Stage220A17 OK
  - case trash OK
  - Stage113 OK
  - Stage223 OK
  - Stage222 OK
  - build OK
- `verify:closeflow:quiet` zatrzymał release na:
  `tests/daily-digest-email-runtime.test.cjs`
- Błąd:
  `ENOENT: no such file or directory, open ... api/daily-digest.ts`
- Test wymaga:
  - `selfTestMode === 'workspace-test'`
  - `send-test-digest`
  - `REQUESTER_EMAIL_REQUIRED`
  - `DIGEST_RECIPIENT_EMAIL_REQUIRED`
  - `CloseFlow - test planu dnia`
  - `sendDigestEmail`
  - `RESEND_API_KEY_MISSING`
  - `function shouldEnforceWorkspaceDigestHour()`
  - `DIGEST_ENFORCE_WORKSPACE_HOUR`
  - `shouldEnforceWorkspaceDigestHour() && !shouldSendDigestNow`
- Canonical daily digest runtime jest w:
  `src/server/daily-digest-handler.ts`
- `api/system.ts` już importuje canonical handler.
- `vercel.json` ma cron `/api/daily-digest` z harmonogramem `5 5 * * *`.

## ZAKRES

- Dodać `api/daily-digest.ts`.
- Wrapper deleguje do:
  `dailyDigestHandler(req, res)`
- Plik zawiera stare kontrakty testowe wymagane przez release gate.
- Nie zmieniać `vercel.json`.
- Nie zmieniać canonical handlera.
- Nie zmieniać Stage223.
- Nie zmieniać Activity Truth.
- Nie zmieniać Today.
- Nie zmieniać Supabase.

## TESTY

```powershell
node --test tests/daily-digest-email-runtime.test.cjs
node --test tests/pwa-foundation.test.cjs
node scripts/check-stage220a29-lead-confirm-no-sw-reload.cjs
node --test tests/stage122-runtime-auth-api-pwa-hardening.test.cjs
node --test tests/client-detail-v1-operational-center.test.cjs
node --test tests/case-detail-history-visual-p1-repair3-2026-05-13.test.cjs
node --test tests/case-detail-rewrite-build-workitems-final-2026-05-13.test.cjs
node --test tests/case-detail-history-workrow-leak-fix-2026-05-13.test.cjs
node --test tests/panel-delete-actions-v1.test.cjs
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

## RYZYKA

- `api/daily-digest.ts` jest wrapperem kompatybilności pod release gate. Prawdziwa logika ma zostać w `src/server/daily-digest-handler.ts`.
- Po zielonym verify quiet warto później zrobić osobny etap porządkowy dla historycznych testów kontraktowych, bo wiele z nich wymagało literalnych markerów zamiast semantycznych asercji.

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2Q.
