# FORTECA 011 — BROWSER PROOF

Reference: `011_lead_add_modal.webp`
Route: `/leads` modal overlay
Trigger: Dodaj leada primary button

Steps:
1. Click Dodaj leada -> Dialog open `ClientCreateDialog` lead variant, receives no entity context
2. Fields: nazwa*, źródło*, wartość/potencjał, status, ostatni kontakt, email, telefon, firma, notes — grouped, required validates
3. Footer Anuluj + Utwórz leada primary, close X, keyboard focus trapped
4. Submit invokes `createPayment`? actually `insertLeadToSupabase` via src/lib/supabase-fallback -> Supabase leads table workspace scoped, duplicate check -> 013 if conflict, success toast -> close -> list refetch shows new lead
5. Cancel/close discards, no console.log, no dead handler

Comparison: modal light 16 radius, header title, fields grouped, footer correct PASS
Result: PASS
