# STAGE220A35-A39 - Production readiness and beta roadmap

## Routing

- project: CloseFlow / LeadFlow
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- Obsidian folder: DO_POTWIERDZENIA
- source of truth: repo for technical stages, guards, reports and implementation evidence; Obsidian for project dashboard and decisions

## Decision

CloseFlow is not yet production-ready as a broad paid public product.
It can be treated as a beta / release-candidate project after the stages below are completed.

Confidence: 8/10.

Reason: the repo has many guards and the build can pass, but recent work exposed production-grade risks: unsaved state loss after tab return, fragile modal/UI regressions, finance wording/logic ambiguity, AI drafts weakness, and unverified auth/billing/access flows.

## Product thesis

Do not position CloseFlow as a generic CRM.

Preferred positioning:

> System pilnowania leadów, spraw i follow-upów dla małych firm, które gubią sprzedaż między telefonem, WhatsAppem, mailem i kalendarzem.

The product should sell:

- fewer lost leads,
- fewer forgotten follow-ups,
- one owner-level view of what must be handled today,
- transition from lead to client to case,
- operational visibility over tasks, events, notes, money and risk.

## Production gate

No broad public production launch until these are green:

- new-account auth E2E,
- Google login E2E,
- email/password login E2E,
- reset password E2E,
- workspace isolation E2E with two users / two workspaces,
- Stripe checkout + webhook + plan activation E2E,
- trial/Free/Basic/Pro/AI access gating E2E,
- lead -> client -> case workflow E2E,
- task/event/note creation and relation assignment E2E,
- finance flow E2E: transaction value, commission, payment, correction, delete payment,
- tab-return state preservation E2E,
- AI/manual drafts flow E2E,
- mobile viewport smoke,
- landing/start page copy and naming cleanup,
- no test/sandbox naming in production UI,
- no unsupported features sold as ready.

## STAGE220A35 - Production readiness audit / GO-NO-GO

### Goal

Create a full release-readiness audit for the current app and produce a GO/NO-GO report.

### Scope

- Verify environment and deployment assumptions:
  - Vercel production env variables,
  - Supabase URL/anon key,
  - Supabase Auth redirect URLs,
  - Stripe env and webhook endpoint,
  - Google OAuth configuration,
  - AI provider/env status,
  - service worker / cache policy.
- Verify core app flows manually and with smoke scripts.
- Check whether production UI still contains sandbox/test names or internal wording.

### Must test manually

1. Register new user.
2. Verify email, if required.
3. Login with email/password.
4. Login with Google.
5. Reset password.
6. Create / enter workspace.
7. Add lead.
8. Add note.
9. Add task.
10. Add event.
11. Convert or connect lead to client.
12. Create/open case.
13. Add transaction value: 100000 PLN.
14. Set commission: 3 percent.
15. Confirm commission due: 3000 PLN.
16. Add payment.
17. Correct payment.
18. Delete payment.
19. Open modal, type data, switch browser tab, return and verify state is preserved.
20. Logout and login again.
21. Verify data persists.

### Outputs

- `_project/reports/STAGE220A35_PRODUCTION_READINESS_AUDIT_YYYY-MM-DD.md`
- evidence table: pass/fail/blocked/needs fix,
- screenshots or exact manual notes where useful,
- list of blockers split into P0/P1/P2,
- next implementation stage.

### Guard/test requirement

Add a static guard that confirms the audit report contains:

- auth checklist,
- billing checklist,
- plan gating checklist,
- AI/manual drafts checklist,
- tab return checklist,
- workspace isolation checklist,
- production GO/NO-GO decision.

## STAGE220A36 - AI drafts and manual drafts rebuild

### Goal

Make drafts a reliable work inbox, not a confusing AI feature.

### Product rule

Szkice = robocza skrzynka do zatwierdzenia.

Sources:

- manual draft,
- pasted text,
- dictation,
- parser/rule draft,
- AI draft,
- import.

Every draft must follow one consistent flow:

`raw input -> detected type -> preview -> edit -> approve as lead/task/event/note -> write to history -> archive/converted state`

### Problems to fix

- AI drafts and ordinary drafts are not clear enough.
- User cannot confidently see what will be created before approval.
- Errors and archived/converted states need cleaner presentation.
- Drafts must not silently disappear.
- Production cannot rely on localStorage fallback except for dev/debug.
- Plan limits for drafts and AI must be clear and enforced.

### Required UX

- One inbox: `Szkice do sprawdzenia`.
- Clear source chip: `Ręczny`, `Wklejony tekst`, `Dyktowanie`, `Parser`, `AI`.
- Clear target type selector: lead/task/event/note.
- Editable fields before approval.
- Warnings panel: missing date, missing relation, low confidence, unsupported data.
- Approval button creates real record and attaches relation/history.
- Cancel/archive action preserves audit info.
- Converted draft links to created record.

### E2E tests

- manual draft -> task,
- pasted text -> lead,
- AI/parser draft -> note,
- draft with missing date warns before event creation,
- converted draft is not editable as pending,
- archived draft does not count as active draft,
- Free plan draft limit works,
- AI plan gating works.

## STAGE220A37 - Landing/start page, naming and onboarding cleanup

### Goal

Make the app credible for first-time users and remove sandbox/test wording.

### Must fix

- Remove sandbox/test names such as `piaskownica`, `bezrobotyn`, temporary internal naming and old placeholder copy.
- Replace generic CRM wording with lead/follow-up/case-control positioning.
- Do not claim unfinished features as ready.
- Show the first aha moment quickly.

### Landing direction

Main claim:

> Nie zgub już żadnego leada ani follow-upu.

Support copy:

- Leads, clients, cases, tasks, calendar and notes in one operational flow.
- Today view tells the owner what must be moved now.
- Case finance tracks transaction value, commission and payments.
- Draft inbox turns rough notes into approved records.

### Onboarding required

- Demo workspace/sample data option.
- Setup checklist:
  - add first lead,
  - add first follow-up,
  - convert to client,
  - create/open case,
  - add payment/commission,
  - review Today.

### Guard/test requirement

- No forbidden copy in production UI:
  - `piaskownica`,
  - `bezrobotyn`,
  - `mock`,
  - `testowy`, unless in dev-only docs or tests,
  - unsupported AI/Google/automation claims.

## STAGE220A38 - Auth, billing and plan gating E2E

### Goal

Prove that login, payment, plan activation and feature access behave correctly in production-like conditions.

### Must test

Auth:

- Google login on desktop,
- Google login mobile/browser,
- blocked embedded webview path,
- email registration,
- email login,
- reset password,
- logout/login persistence.

Billing:

- checkout session starts for Basic,
- checkout session starts for Pro,
- checkout session starts for AI,
- Stripe webhook activates paid plan,
- failed payment sets restricted state,
- canceled plan restricts writes while keeping read access,
- trial expired blocks writes but keeps data.

Plan gating:

- Free: limits active leads/tasks/events/drafts, no full AI.
- Basic: core workflow available, no full AI/Google Calendar if not included.
- Pro: full workflow and case finance available.
- AI: AI features only if provider/env configured.

### Output

- `_project/reports/STAGE220A38_AUTH_BILLING_PLAN_E2E_YYYY-MM-DD.md`
- table of each plan and feature gate result,
- Stripe webhook evidence,
- known blockers.

## STAGE220A39 - Automated production smoke and beta launch gate

### Goal

Add a repeatable smoke path before every release.

### Minimum automated smoke

- route loads: `/login`, `/today`, `/leads`, `/clients`, `/cases`, `/calendar`, `/billing`, `/ai-drafts`,
- authenticated test session if available,
- add lead,
- add task,
- add event,
- create/open case,
- add payment,
- tab-return/modal preservation smoke if browser automation supports it,
- no console fatal errors,
- no production forbidden wording.

### Beta launch gate

Only after A35-A39 are green:

- release as controlled beta,
- invite a small number of real users,
- monitor errors and support issues,
- do not sell broad public production yet.

## Backlog if tab-return issue persists

If A34 still does not preserve modal state in production, create `STAGE220A35B_CASE_DETAIL_DRAFT_PERSISTENCE`:

- persist open modal state to sessionStorage,
- persist finance payment draft while modal is open,
- restore modal after remount/reload,
- clear persisted draft only after save/cancel,
- add guard and manual test.

## What not to do now

- Do not add more random features before readiness audit.
- Do not market unfinished AI, Google Calendar or automation as ready.
- Do not broaden to generic CRM positioning.
- Do not launch widely before auth/billing/workspace isolation are tested.
- Do not treat build success as production readiness.

## Next step

Prepare and run `STAGE220A35_PRODUCTION_READINESS_AUDIT` as the next implementation stage.
