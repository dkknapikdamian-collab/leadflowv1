# 2026-06-13_STAGE231F_R1_GOOGLE_CALENDAR_USER_SCOPE_SAFETY_LOCK

## FAKTY Z KODU

- Handler Google Calendar already resolves workspaceId and userId, checks user-specific connection, and returns `connectionScope: user | workspace_legacy | none`.
- OAuth state already carries `workspaceId + userId` and callback stores connection under that pair.
- Before this stage, lower inbound/outbound modules still imported `getGoogleCalendarConnection` from `google-calendar-sync.ts`, which has legacy workspace fallback.
- Before this stage, outbound fetched `work_items` by workspace only.

## DECYZJE DAMIANA

- End user must not configure Google Cloud or secrets.
- CloseFlow owns central Google OAuth configuration.
- Each user authorizes access only to their own Google Calendar.
- V1 direction: personal Google Calendar sync, not workspace-wide sync by default.
- Work is delivered as ZIP local-only and pushed only after local PASS.

## AUDYT PRZED ETAPEM

- Risk: user B could sync through user A/Damian workspace fallback if lower sync modules are called directly.
- Risk: member's private Google Calendar could receive calendar-visible items from the whole workspace.
- Similar places checked: handler, user-scope helper, legacy sync helper, inbound, outbound, found-problems ledger.

## CO ZMIENIONO

- `src/server/google-calendar-outbound.ts`: switched to `getGoogleCalendarUserConnection`, removed normal use of legacy fallback, added personal row ownership allowlist and fail-closed skip for rows not linked to current user.
- `src/server/google-calendar-inbound.ts`: switched to exact user-scoped connection, marks imported rows with user ownership fields where schema supports them, and avoids workspace-wide existing-record matching for external Google events.
- `scripts/check-stage231f-r1-google-calendar-user-scope-safety-lock.cjs`: new guard.
- `tests/stage231f-r1-google-calendar-user-scope-safety-lock.test.cjs`: new static regression test.
- `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`: added FOUND-20260613-01 for durable owner fields / personal sync data scope.

## TESTY / GUARDY DO URUCHOMIENIA

```powershell
node scripts/check-stage231f-r1-google-calendar-user-scope-safety-lock.cjs
node --test tests/stage231f-r1-google-calendar-user-scope-safety-lock.test.cjs
npm run test:google-calendar-gating
npm run test:google-calendar-sync-contract
npm run build
git diff --check
```

## TEST RECZNY

- User A connects Google Calendar.
- User B in same workspace without connection attempts sync: must not use user A/Damian token.
- User A sync outbound: only records owned/assigned/source-linked to user A should be pushed; unowned workspace records are skipped.
- Inbound imported events should be marked with user ownership fields when schema allows it.

## AUDYT PO ETAPIE

- Cause addressed for normal inbound/outbound modules: no silent legacy workspace fallback.
- Workspace-wide default blocked in outbound by fail-closed personal ownership check.
- Remaining risk: if `work_items` schema does not persist any user ownership fields, personal sync will skip records instead of syncing whole workspace. That is intentional safety behavior and is logged as FOUND-20260613-01.

## ZNALEZIONE PROBLEMY

- FOUND-20260613-01: durable work_items owner fields needed for full personal sync reliability.

## RYZYKA

- Some existing calendar-visible workspace records may not sync until ownership fields are confirmed/migrated.
- Existing tests are still static; real multi-user runtime test is required.
- UI copy/states are not changed in R1; planned for R2.

## OBSIDIAN PAYLOAD

- folder: 10_PROJEKTY/CloseFlow_Lead_App
- typ wpisu: backend safety lock / Google Calendar user scope / personal sync guard
- docelowa sciezka: 04_KIERUNEK_DO_WDROZENIA, 08_HISTORIA_ZMIAN, 09_TESTY_DO_WYKONANIA_I_WYNIKI, 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY
- status: payload prepared in ZIP, Obsidian local sync pending.

## NASTEPNY KROK

After local PASS and push, continue with `STAGE231F_R2_GOOGLE_CALENDAR_SETTINGS_UI_COPY_STATES`.
