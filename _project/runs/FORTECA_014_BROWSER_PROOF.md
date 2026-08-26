# FORTECA 014 — BROWSER PROOF
Reference: 014_lead_add_task.webp
Route: /leads/:leadId modal Lead Dodaj zadanie
Trigger: Quick action Zadanie -> TaskCreateDialog
Steps: Click Zadanie quick action -> Dialog open receives leadId context, fields title* type relation leadId date time priority status reminder recurrence, footer Anuluj+Zapisz, ESC close, submit insertTaskToSupabase with leadId workspace scoped -> toast -> close -> linkedTasks refetch, cancel discards, no dead handler
Visual: light modal 16 radius 12 button radius, grouped fields, footer Cancel+Primary PASS
