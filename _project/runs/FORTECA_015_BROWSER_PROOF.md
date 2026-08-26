# FORTECA 015 — BROWSER PROOF
Reference: 015_lead_add_note.webp
Route: /leads/:leadId modal
Trigger: Notatka quick action -> ContextNoteDialog
Steps: Click Notatka -> Dialog TextareaField + relation picker, Save -> insertActivityToSupabase note_added with leadId -> refetch activities, cancel closes
Visual: Textarea 14 radius border #E5EAF2 PASS
