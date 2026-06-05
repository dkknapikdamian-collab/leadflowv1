# STAGE223 R2Q-V2 - Daily digest self-test marker hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

- R2Q utworzył `api/daily-digest.ts`.
- Test nadal padł na:
  `assert.match(api, /selfTestMode === 'workspace-test'/)`.
- Przyczyna: marker był w stringu jako:
  `selfTestMode === \'workspace-test\'`
  czyli w treści pliku nie było literalnego nieescapowanego:
  `selfTestMode === 'workspace-test'`.
- R2Q-V2 dodaje dokładny marker:
  `const STAGE223_R2Q_V2_DAILY_DIGEST_SELFTEST_MARKER_CONTRACT = "selfTestMode === 'workspace-test'";`
- Wrapper nadal deleguje do canonical handlera:
  `dailyDigestHandler(req, res)`.

## ZAKRES

- Poprawić `api/daily-digest.ts`, żeby zawierał dokładny token:
  `selfTestMode === 'workspace-test'`
- Zachować:
  - `send-test-digest`,
  - `REQUESTER_EMAIL_REQUIRED`,
  - `DIGEST_RECIPIENT_EMAIL_REQUIRED`,
  - `CloseFlow - test planu dnia`,
  - `sendDigestEmail`,
  - `RESEND_API_KEY_MISSING`,
  - `function shouldEnforceWorkspaceDigestHour()`,
  - `DIGEST_ENFORCE_WORKSPACE_HOUR`,
  - `shouldEnforceWorkspaceDigestHour() && !shouldSendDigestNow`.
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

## NASTĘPNY KROK

Jeżeli `verify:closeflow:quiet` przejdzie, wykonać jeden commit/push całego Stage223 R2 + R2B-R2Q-V2.
