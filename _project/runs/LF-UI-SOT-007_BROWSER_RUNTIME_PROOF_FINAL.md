# LF-UI-SOT-007 — final browser runtime evidence

Status: EXECUTION_EVIDENCE_READY / CONTROLLER_CLOSEOUT_REQUIRED
Run timestamp: 2026-08-12T12:52:03+02:00
Stage: LF-UI-SOT-007
Working branch: `codex/closeflow-v1-e2e-roadmap`

## Provider and build identity

- Fresh local Vite preview: `http://127.0.0.1:4176/`.
- Preview listener: `127.0.0.1:4176`.
- The existing repository browser/CDP bindings were used; no package, credential, environment file, production login, or auth bypass was introduced.
- Source fingerprints at the run boundary:
  - `src/styles/closeflow-visual-source-truth.css`: `AAE36615B46B3F506DBCDE1BC99AF521B4843E37A8F8DE634906084EAC579ACF`
  - `src/App.tsx`: `222C15568EF6C693BE1AE7B3630977CFEAC6F52858A9D16C561AAA2A757AB409`
  - `src/index.css`: `ABA9B75F34FA85223453249D19D011C26BE3A61389BAE61BE1BE0DD0C5637ACC`

## Anonymous desktop route matrix

Viewport: `1440x1100`.

| Requested route | Observed route | Result |
| --- | --- | --- |
| `/` | `/` | non-empty login/landing shell |
| `/login` | `/login` | non-empty login/landing shell |
| `/leads` | `/login` | expected auth-boundary redirect, non-empty shell |
| `/clients` | `/login` | expected auth-boundary redirect, non-empty shell |
| `/cases` | `/login` | expected auth-boundary redirect, non-empty shell |
| `/tasks` | `/login` | expected auth-boundary redirect, non-empty shell |
| `/calendar` | `/login` | expected auth-boundary redirect, non-empty shell |
| `/billing` | `/login` | expected auth-boundary redirect, non-empty shell |
| `/settings` | `/login` | expected auth-boundary redirect, non-empty shell |

## Anonymous mobile route matrix

Effective touch viewport: `500x748`.

| Requested route | Observed route | Result |
| --- | --- | --- |
| `/` | `/` | non-empty login/landing shell |
| `/login` | `/login` | non-empty login/landing shell |
| `/leads` | `/login` | expected auth-boundary redirect, non-empty shell |
| `/clients` | `/login` | expected auth-boundary redirect, non-empty shell |
| `/cases` | `/login` | expected auth-boundary redirect, non-empty shell |
| `/tasks` | `/login` | expected auth-boundary redirect, non-empty shell |
| `/calendar` | `/login` | expected auth-boundary redirect, non-empty shell |
| `/billing` | `/login` | expected auth-boundary redirect, non-empty shell |
| `/settings` | `/login` | expected auth-boundary redirect, non-empty shell |

## Runtime assertions

- All 18 route probes reached `document.readyState=complete`.
- All 18 route probes had a non-empty `#root` and body.
- No Vite error overlay, React error boundary marker, uncaught exception, unhandled rejection, or in-page runtime error was observed.
- Desktop and mobile had no horizontal overflow.
- Fresh desktop and mobile screenshots of `/` were captured after dismissing the local PWA prompt; the prompt was not treated as an application error.
- Protected, populated views, detail datasets, modal flows, search, right rails, and backend authorization remain `NOT_CHECKED` because this run intentionally used an anonymous session.

## Known backendless warnings

The existing current-runtime evidence records two expected local-only `404` responses when backend-backed settings surfaces are exercised:

- `/api/system?kind=google-calendar&route=sync-inbound`
- `/api/billing-checkout?route=config`

These endpoints are absent from the local Vite-only preview. They are not CSS/runtime boot failures, were not hidden, and no secret or production endpoint was introduced. The anonymous 4176 route matrix did not reach those protected requests.

## Local development preview matrix

Fresh Vite development server: `http://127.0.0.1:4177/`, started with blank local auth configuration. The existing repository dev-only preview routes were used; no auth bypass, credential, environment file, or production login was introduced.

| View | Desktop `1440x1100` | Mobile `500x748` | Result |
| --- | --- | --- | --- |
| `/ui-preview-vnext` | 9,274 rendered HTML chars | 9,274 rendered HTML chars | non-empty, no in-page error alert, no horizontal overflow |
| `/ui-preview-vnext-full` | 93,844 rendered HTML chars | 93,844 rendered HTML chars | non-empty, no in-page error alert, no horizontal overflow |

The normal protected routes continued to redirect an anonymous session to `/login`; populated authenticated route data, details, modals, search, and right rails therefore remain `NOT_CHECKED`. The dev-only preview matrix provides fresh visual-system coverage without weakening the application auth boundary.

## Open Design boundary

Open Design was not claimed as an executed visual review: the local integration does not expose the required attributed brief/visual-run capability in this task context. This is recorded truthfully rather than replaced with a fabricated result.

This file is runtime evidence only. It is not a stage acceptance receipt, controller closeout, Vault write, or next-stage activation.
