# STAGE232T_R4_CALENDAR_LEAD_SHADOW_ACTIONS_AUDIT

Status:
AUDIT_CONFIRMED / FIX_REQUIRED / NOT_IMPLEMENTED_IN_THIS_COMMIT

Production symptom:
- Calendar entry with type label `Lead` stays unchanged when clicking action buttons.
- User reports `Zrobione`, `+1H/+1D/+1W` do not visibly change the entry.
- Delete not fully tested by user at report time.

Source truth:
- Lead calendar rows are shadow/projection rows derived from `leads.next_action_at` / `nextActionAt`.
- They are not `work_items` task rows and not event rows.

Confirmed code gap:
1. `src/lib/calendar-operational-entry-contract.ts` allows lead entries only:
   - edit
   - shift
   - open-related
2. `src/pages/Calendar.tsx` renders action buttons unconditionally for all ScheduleEntry kinds:
   - Edytuj
   - +1H
   - +1D
   - +1W
   - Zrobione/Przywróć
   - Usuń
3. `handleCompleteEntry()` checks action policy and returns early for lead entries because complete is not allowed.
4. Even if policy allowed it, `handleCompleteEntry()` currently implements only event/task persistence branches.
5. `handleDeleteEntry()` checks action policy and then explicitly blocks non-event/non-task entries.
6. Lead shift branch exists and calls `updateLeadInSupabase({ nextActionAt })`, but production needs Network verification for `/api/leads` PATCH because user reports no visible result.

Required R4 implementation decision:
- Do not delete the lead record when pressing delete on a lead calendar shadow.
- Calendar delete for a lead shadow should mean: remove the planned next action from calendar by clearing lead `next_action_at`, `next_action_title` if appropriate, and `next_action_item_id`.
- Calendar complete for a lead shadow should mean: mark the planned next action as handled by stamping `last_contact_at` / activity and clearing the planned next action from calendar.
- If product wants completed lead actions to remain struck-through, they must be persisted as real task/work_item rows, not local UI retention of lead shadows.

Recommended fix:
1. Add explicit lead action semantics in `Calendar.tsx`:
   - complete lead shadow:
     - PATCH `/api/leads` through `updateLeadInSupabase`
     - `lastContactAt = now`
     - `nextActionAt = null`
     - `nextActionTitle = ''`
     - possibly payload/action marker: `calendar_lead_next_action_completed`
     - remove lead row from local calendar state by clearing next action fields
     - log activity `calendar_lead_next_action_completed`
   - delete lead shadow:
     - PATCH `/api/leads`
     - `nextActionAt = null`
     - `nextActionTitle = ''`
     - `nextActionItemId = null` if API accepts it
     - do not delete the lead
     - log activity `calendar_lead_next_action_deleted`
   - shift lead shadow:
     - keep existing branch, but add source-level guard and visible local state update after PATCH
     - verify Network `/api/leads` PATCH status
2. Update shared action contract if complete/delete are intentionally supported for lead shadows:
   - lead actions: edit, shift, complete, delete, open-related
3. Or, if complete/delete are not supported, hide those buttons for lead rows. Do not keep clickable no-op buttons.

Required tests:
- Lead row action policy and rendered buttons are aligned.
- Lead `Zrobione` does not no-op.
- Lead `Usuń` clears next action without deleting the lead.
- Lead `+1H/+1D/+1W` uses latest `nextActionAt` and updates visible UI after refresh.
- Lead calendar shadow disappears after complete/delete because next action is cleared.
- No CSS/display/localStorage tombstone fix.

Manual production retest after R4:
1. Create/select a lead with `next_action_at` visible in Calendar.
2. Click +1H and verify `/api/leads` PATCH 200 and visible time changes.
3. Click +1D and verify date changes.
4. Click Zrobione and verify lead calendar shadow disappears or is handled according to chosen product contract.
5. Refresh and hard refresh.
6. Verify the lead record still exists.
7. Verify the lead next action is cleared or moved to the new time as expected.

Out of scope:
- SQL/RLS
- billing/finance/commission
- Obsidian
- CSS/UI hiding patches
