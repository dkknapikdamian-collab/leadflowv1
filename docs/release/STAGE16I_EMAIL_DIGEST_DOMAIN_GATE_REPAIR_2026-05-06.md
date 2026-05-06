# STAGE16I_EMAIL_DIGEST_DOMAIN_GATE_REPAIR_2026-05-06

Cel:
- Naprawić czerwony gate `email-digest-domain-gate`.
- Ukryć UI mailowego digestu do czasu gotowości domeny nadawczej.
- Nie usuwać backend handlerów digestu ani test-send logic, bo mają zostać gotowe na późniejszą aktywację.

Zmiany:
- `src/pages/Settings.tsx`
  - `DAILY_DIGEST_EMAIL_UI_VISIBLE = false`
  - poprawka copy: `Na darmowym Vercel cron działa raz dziennie`

Nie zmienia:
- backendu mailowego,
- crona,
- Resend,
- billingu,
- AI,
- Google Calendar.

Weryfikacja:
- `verify:closeflow:quiet`
- `test:critical`
- `check:plan-access-gating`
- `check:polish-mojibake`
- `check:ui-truth-copy`
- `check:workspace-scope`
- `check:pwa-safe-cache`
- `audit:release-candidate`

NO_PUSH_PERFORMED=True
