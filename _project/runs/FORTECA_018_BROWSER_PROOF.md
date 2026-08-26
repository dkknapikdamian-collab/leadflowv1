# FORTECA 018 — BROWSER PROOF
Reference: 018_lead_missing_blockers_list.webp
Route: /leads/:leadId manager
Trigger: Zobacz wszystkie braki -> MissingItemsManagerDialog
Steps: Click Zobacz wszystkie -> Dialog lists active missing items from linkedTasks only (not activity history), rows with toggle Blokuje (priority high/medium writes), Resolve/Edit/Delete per row wired optimistic remove + soft-delete + silent refresh, summary top card Add Brak + link to all
Visual: ListRow + StatusPill amber missing tone same as group, no scroll trap PASS
