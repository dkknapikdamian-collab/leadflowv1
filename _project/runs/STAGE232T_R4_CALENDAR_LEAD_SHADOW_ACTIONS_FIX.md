# STAGE232T_R4_CALENDAR_LEAD_SHADOW_ACTIONS_FIX

Status:
PACKAGE_PREPARED / LOCAL_APPLY_REQUIRED / VERIFY_REQUIRED / PROD_SMOKE_REQUIRED

Problem:
- Calendar displays lead shadow entries derived from `leads.next_action_at`.
- These rows are not `work_items` tasks/events.
- UI rendered action buttons, but complete/delete were not connected to the lead source of truth.
- Clicking actions could become a no-op.

Source of truth:
- Lead shadow entry = projection of:
  - `leads.next_action_at`
  - `leads.next_action_title`
  - `leads.next_action_item_id`
- If `next_action_item_id` points to a task/event, the task/event is canonical and the lead shadow must be hidden/deduped.
- If no task/event covers it, the lead itself is canonical.

Implemented by package:
- `api/leads.ts`
  - PATCH accepts `nextActionItemId` / `next_action_item_id`.
  - Null/empty clears `next_action_item_id`.
- `calendar-operational-entry-contract.ts`
  - Lead actions include `complete` and `delete`.
- `calendar-lead-shadow-entry-policy.ts`
  - Lead allowed actions match UI contract.
  - Existing dedupe by covered task/event remains.
- `Calendar.tsx`
  - Lead complete:
    - does not delete the lead
    - stamps `lastContactAt`
    - clears `nextActionAt`, `nextActionTitle`, `nextActionItemId`
    - logs `calendar_lead_next_action_completed`
  - Lead delete:
    - does not delete the lead
    - clears planned next-action fields
    - logs `calendar_lead_next_action_deleted`
  - Lead shift:
    - PATCHes lead `nextActionAt`
    - updates local lead state immediately
- Guard/test added:
  - `scripts/check-stage232t-r4-calendar-lead-shadow-actions.cjs`
  - `tests/stage232t-r4-calendar-lead-shadow-actions.test.cjs`

Out of scope:
- SQL/RLS
- billing/finance/commission
- Obsidian
- CSS/display/localStorage tombstones
- route rollback

Required local verification:
```powershell
node scripts/check-stage232t-r4-calendar-lead-shadow-actions.cjs
node --test tests/stage232t-r4-calendar-lead-shadow-actions.test.cjs
node scripts/check-stage232t-r3-operational-entry-state-machine.cjs
node --test tests/stage232t-r3-operational-entry-state-machine.test.cjs
node scripts/check-cf-runtime-00-source-truth.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

Production smoke after deploy:
1. Create/select a lead with next action visible in Calendar.
2. Click `+1H`; verify `/api/leads` PATCH 200 and visible time changes.
3. Click `+1D`; verify date changes and survives refresh.
4. Click `Zrobione`; verify the calendar shadow disappears and the lead still exists.
5. Create/select another lead with next action.
6. Click `Usuń`; verify only planned next action is removed, lead still exists.
7. Hard refresh; no ghost lead shadow should return.
