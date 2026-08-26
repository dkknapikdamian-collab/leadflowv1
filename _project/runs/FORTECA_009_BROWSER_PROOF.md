# FORTECA 009 — BROWSER PROOF

Reference: `009_leads_trash.webp`
Route: `/leads` filter Kosz/archiwalne
Steps: Click Kosz -> shows archived soft-delete rows, per row Restore -> unarchive mutation + refetch, Hard delete -> confirm dialog -> delete, bulk Empty trash -> confirm
Comparison: archived state PASS, danger confirm separate, no fake delete
Result: PASS reuse
