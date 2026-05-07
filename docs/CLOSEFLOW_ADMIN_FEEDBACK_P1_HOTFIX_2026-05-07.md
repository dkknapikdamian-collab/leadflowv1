# CloseFlow admin feedback P1 hotfix - 2026-05-07

Scope based on admin feedback export:

- sidebar footer user card must not overlap navigation,
- lead search question mark artifact must disappear,
- lead metric tile label strips must be cleaned,
- lead metric tiles should fit one desktop row on /leads,
- lead detail note textarea must stay readable,
- lead detail note box should use the latest note activity when the lead field is empty,
- voice note dictation should avoid repeated transcript chunks,
- selected Today English copy is replaced with Polish/plain copy,
- Today refresh button is forced to manual refresh path where the old handler exists.

Verification:

```powershell
node scripts/check-admin-feedback-p1-hotfix.cjs
npm run build
```
