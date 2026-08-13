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

## Current final revalidation (LF-UI-SOT-007 closeout worktree)

Run timestamp: 2026-08-12T23:02:00+02:00
Source HEAD at run boundary: `f2b3ff5c84e303c85043a0d2a35c9b607fa52650`
Provider: isolated headless Chromium `C:\Program Files\Google\Chrome\Application\chrome.exe`, CDP desktop `9222`, touch-mobile `9223`; no credentials, auth bypass, environment-file changes, or external provider calls.
Runtime: fresh Vite production preview from the current worktree build at `http://127.0.0.1:4175/`; `dist/index.html` SHA-256 `03BCB2EAD953BF759F86B17C67608D7B40513C01F9471E66A1EFEB5A0D94339F`.

Current source fingerprints:

- `src/styles/closeflow-visual-source-truth.css` — `0F534C7721F973ECD6D7F48C022EFCD971C8FE1CAFBDD9A1107CF55E15B237C5`
- `src/App.tsx` — `83907CF32FE3BE012B400859F76643E47D47CBB995395DBA295CD71EF2C02EAC`
- `src/index.css` — `6A904A1AD615330B1510C8A1922AAF3B929A4C4CC757FF836A4B9D521C0E7BAF`

The bounded anonymous matrix covered `/`, `/login`, `/leads`, `/clients`, `/cases`, `/tasks`, `/calendar`, `/billing`, `/settings`, `/ui-preview-vnext`, and `/ui-preview-vnext-full` at desktop `1440x1100` and touch-mobile `500x748`.

- `BROWSER_DESKTOP_FINAL=PASS`: 11/11 routes reached `document.readyState=complete` with non-empty `#root`; protected and dev-only preview routes correctly resolved to `/login`; no Vite overlay, console errors, uncaught exceptions, failed requests, or HTTP responses >=400; `scrollWidth=clientWidth=1425` after the browser scrollbar on the final settled shell.
- `BROWSER_MOBILE_FINAL=PASS`: 11/11 routes reached `document.readyState=complete` with non-empty `#root`; the same auth boundary was preserved; no Vite overlay, console errors, uncaught exceptions, failed requests, or HTTP responses >=400; `scrollWidth=clientWidth=500`.
- The first desktop navigation was observed during initial preview hydration (`readyState=interactive`, empty root) and was explicitly re-run after 3.5 seconds; the settled root was 19,498 HTML characters and 1,322 body-text characters on both viewports. This transient hydration observation is not used as a failure.
- Authenticated populated views, details, modals, search, right rails, and data-backed states remain `NOT_CHECKED`; no safe existing owner-auth mechanism was available in this environment and no credentials or bypass were introduced.
- Production preview correctly redirects the dev-only `/ui-preview-vnext*` routes to `/login`; this is expected production behavior, not a preview failure.

### Current bundle duplication remeasure

The current Vite asset `dist/assets/index-DWa_0q7d.css` is 1,463,758 bytes (177.64 kB gzip from the build receipt). A PostCSS AST walk found 7,052 rule nodes, 7,000 unique selector/context/declaration keys, and 52 exact duplicate occurrences totalling 6,018 bytes (0.411% of the CSS asset). This is an exact textual duplicate measure, not a claim that every similar selector is a defect. The semantic owner rescan simultaneously reports `HISTORICAL_STAGE_RUNTIME_OWNERS=0`, `canonicalMarkerTokens=0`, and `ACTIVE_RUNTIME_PATCH_LAYERS=0`; therefore no historical CSS is counted as an active owner. The remaining CSS size and non-exact implementation-hook tokens are recorded as proportional performance/debt follow-up, not silently reclassified as architecture failure.

## Fresh authenticated-shell revalidation (2026-08-13)

This is the latest bounded browser evidence. It supersedes older browser receipts for this stage; it does not claim populated-data acceptance.

- Local runtime: `http://127.0.0.1:3000/`, existing dev/test session only; no credential, OTP, environment-file change, auth bypass, or production provider call was introduced.
- Desktop: the signed-in shell rendered its visual system (navy rail, light main canvas, white surfaces, semantic icons, and action controls). `/`, `/leads`, `/clients`, `/cases`, `/tasks`, `/calendar`, `/billing`, and `/settings` rendered the shell and the access gate `Brak dostępu`.
- Mobile: viewport `390x844`; no horizontal overflow (`scrollWidth=375`, `bodyScrollWidth=360`). The responsive menu opened, and the Tasks `Nowe zadanie` flow opened a styled modal with title, priority, and save controls.
- `BROWSER_DESKTOP=PASS` for the styled shell and route matrix.
- `BROWSER_MOBILE=PASS` for the responsive shell, menu, modal, and overflow boundary.
- `AUTHENTICATED_POPULATED_DATA=BLOCKED_EXTERNAL_OWNER_ACTION`: the available local account is stopped at `Brak dostępu` / trial gate, and the Vite-only runtime returns source text for backend `/api` requests (`PROFILE_API_BOOTSTRAP_FAILED` and `APPEARANCE_PROFILE_READ_FAILED`). This is an environment/owner-access blocker, not a visual SSOT failure.
- No claim is made for populated lists, detail datasets, search results, right-rail data, or data-backed modal persistence until an owner-only trial/credential path is supplied.
