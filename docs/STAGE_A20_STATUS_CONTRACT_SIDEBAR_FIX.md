# A20 - status contract and sidebar critical fix

## Goal

One contract for statuses and schemas across UI, API, Supabase and docs.

## Implemented

- `src/lib/domain-statuses.ts` is the source of truth.
- `src/lib/statuses.ts` re-exports the domain contract for legacy imports.
- `src/lib/options.ts` derives lead status options from the domain contract.
- `src/lib/data-contract.ts` normalizes lead, case, task, event, portal item, AI draft and billing statuses through the domain contract.
- `api/leads.ts`, `api/cases.ts` and `api/work-items.ts` validate status writes through canonical normalizers.
- Supabase migration adds check constraints where matching tables exist.
- `firebase-blueprint.json` is moved to `docs/legacy/firebase-blueprint.legacy.json`.
- Sidebar first group remains dark and clickable on Today route.

## Not changed

- Voice notes.
- Lead -> client -> case flow.
- Billing logic.
- Layout outside the sidebar bug fix.

## Manual check

1. Open Today after login.
2. The first sidebar group must not become white or gray.
3. `Leady`, `Klienci`, `Sprawy` must be clickable directly from Today.
4. Change lead status in Leads and LeadDetail.
5. Change task status in Tasks, Today and Calendar.
6. Check `/api/me`, billing screen and AI drafts still load normally.

## Finish criteria

No status soup. UI, API, Supabase migration and docs point to the same status contract.