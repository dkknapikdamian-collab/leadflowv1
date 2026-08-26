# FORTECA 013 — BROWSER PROOF

Reference: `013_lead_duplicate_conflict.webp`
Route: `/leads` modal
Trigger: Dodaj leada with duplicate email/phone -> `EntityConflictDialog`

Steps:
1. Attempt create lead with existing email -> duplicate check returns candidates
2. Dialog shows candidate list ListRow with open existing, badge status, value
3. Actions: Otwórz istniejący -> navigate `/leads/:candidateId`, Anuluj -> close, Dodaj mimo to -> force create with duplicate flag via supabase insert, success -> close -> list refetch
4. No dead buttons, all wired to real navigation/mutation

Comparison: dialog light 16 radius, candidate rows subtle border PASS
Result: PASS
