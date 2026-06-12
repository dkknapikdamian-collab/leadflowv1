# 2026-06-13 - STAGE231F_R1_GOOGLE_CALENDAR_USER_SCOPE_SAFETY_LOCK

- data i godzina: 2026-06-13 00:45 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ wpisu: Google Calendar user-scope safety lock
- status: ZIP_LOCAL_ONLY_DO_TESTU

## Decyzja

Google Calendar V1 ma byÄ‡ personal sync: user synchronizuje wĹ‚asny Google Calendar przez wĹ‚asne OAuth connection. Workspace-wide calendar nie jest domyĹ›lny i wymaga osobnego admin mode w przyszĹ‚oĹ›ci.

## Zmienione w etapie

- inbound/outbound sync uĹĽywa exact `workspaceId + userId` connection,
- normalny member sync nie uĹĽywa cichego workspace fallbacku,
- outbound nie wypycha caĹ‚ego workspace do prywatnego kalendarza,
- dodano guard i test user-scope,
- dodano FOUND-20260613-01 o potrzebie trwaĹ‚ych owner fields na work_items.

## Testy wymagane lokalnie

- `node scripts/check-stage231f-r1-google-calendar-user-scope-safety-lock.cjs`
- `node --test tests/stage231f-r1-google-calendar-user-scope-safety-lock.test.cjs`
- `npm run test:google-calendar-gating`
- `npm run test:google-calendar-sync-contract`
- `npm run build`
- `git diff --check`

## Ryzyko

JeĹ›li istniejÄ…ce `work_items` nie majÄ… pola wĹ‚aĹ›ciciela/uĹĽytkownika, outbound bÄ™dzie skipowaĹ‚ takie wpisy zamiast ryzykowaÄ‡ sync caĹ‚ego workspace. To jest Ĺ›wiadome fail-closed.
