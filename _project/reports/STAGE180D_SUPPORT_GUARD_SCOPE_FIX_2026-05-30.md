# STAGE180D - Support guard scope fix

Date: 2026-05-30
Project: CloseFlow / LeadFlow
Mode: local-only ZIP

## Goal
Fix Stage180B/Stage180C support copy guard so it verifies visible support-request UI copy without failing on old unrelated mojibake artifacts in Layout.tsx comments or legacy strings.

## Facts
- Stage180C applied local support copy changes and the production build passed.
- Stage180B support copy guard failed because it scanned src/components/Layout.tsx too broadly and found existing mojibake-like Polish encoding artifacts outside the support-request copy scope.
- The failure was a guard-scope problem, not a Vite build failure.

## Changes
- Replaced scripts/check-stage180b-support-copy-polish.cjs with a scoped guard.
- Guard checks visible support UI strings in:
  - src/pages/SupportCenter.tsx
  - src/components/CloseFlowPageHeaderV2.tsx
  - src/components/Layout.tsx
- Guard verifies the removed helper paragraph does not return.
- Guard verifies required Polish support/request strings.
- Guard only scans support-related visible-copy lines for mojibake.

## Tests
Run:

```powershell
node scripts/check-stage180b-support-copy-polish.cjs
npm run build
```

## Not changed
- Supabase schema
- RLS
- API support request handlers
- deployment
- push

## Next step
Visually check http://localhost:3000/help and then decide whether a separate global mojibake sweep should be created for Layout/App legacy strings.