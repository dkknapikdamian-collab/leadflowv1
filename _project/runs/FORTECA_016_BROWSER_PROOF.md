# FORTECA 016 — BROWSER PROOF
Reference: 016_lead_add_event.webp
Route: /leads/:leadId modal
Trigger: Spotkanie Wydarzenie -> EventCreateDialog
Steps: Click Wydarzenie -> Dialog fields Tytuł Typ Data Start Koniec Powiązanie Opis Status Cykliczność Przypomnienie + one calendar icon per date field, Save -> insertEventToSupabase with leadId -> refetch linkedEvents, cancel
Visual: single calendar icon clickable PASS per spec 3.2, modal 16 radius PASS
