# FORTECA 012 — BROWSER PROOF

Reference: `012_lead_edit_modal.webp`
Route: `/leads/:leadId` modal
Trigger: Edytuj secondary button on LeadDetail header

Steps:
1. Click Edytuj -> Dialog opens prepopulated with existing lead values (name, source, value, etc) via `editLead` state
2. Modify field, Save -> `updateLeadInSupabase` with leadId, workspace scoped, error toast on fail, success -> close -> detail refetch shows updated
3. Cancel closes without mutation, focus returns

Comparison: same modal geometry as 011, populated PASS
Result: PASS
