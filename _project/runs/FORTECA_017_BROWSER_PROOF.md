# FORTECA 017 — BROWSER PROOF
Reference: 017_lead_add_missing_blocker.webp
Route: /leads/:leadId modal
Trigger: Brak quick action -> AddCaseMissingItemDialog lead variant
Steps: Click Brak -> Dialog type/title/description/blocksProgress checkbox/ deadline optional, Save -> create missing_item task via supabase-fallback with lead relation -> refetch, cancel
Visual: form via closeflow-dialogs.css PASS
