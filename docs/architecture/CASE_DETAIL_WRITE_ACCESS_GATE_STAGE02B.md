# Stage02B - CaseDetail write access gate

Date: 2026-05-03
Branch: dev-rollout-freeze

## Purpose

Stage02B closes the last Stage02A warning for `src/pages/CaseDetail.tsx`.

The page may still read an existing case after access expiry, but write operations must be guarded by workspace access. This keeps the product behavior aligned with the access model: expired trial users can see historical data, but cannot create or mutate operational records.

## Contract

`CaseDetail.tsx` must include:

- `useWorkspace()` usage,
- `hasAccess`,
- `access.status`,
- local `guardCaseDetailWriteAccess(actionLabel)`,
- write handlers that call the guard before mutations,
- user-facing toast for blocked writes.

## Guard

The contract is checked by:

```powershell
npm.cmd run check:case-detail-write-access-gate-stage02b
```

The wider source-of-truth guard is checked by:

```powershell
npm.cmd run check:access-billing-source-of-truth-stage02a
```

Stage02A must report zero warnings after Stage02B.
