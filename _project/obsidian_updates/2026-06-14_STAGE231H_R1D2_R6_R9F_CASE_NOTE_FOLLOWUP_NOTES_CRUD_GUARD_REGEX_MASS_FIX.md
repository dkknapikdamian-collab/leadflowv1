# Obsidian update - STAGE231H_R1D2_R6_R9F_CASE_NOTE_FOLLOWUP_NOTES_CRUD_GUARD_REGEX_MASS_FIX

- data: 2026-06-14 22:40 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- status: DO_APPLY / MASS_GUARD_REGEX_FIX
- wpis: R9F naprawia klasę błędu guardów: JS string `replace(/\s+/g, ' ')` musi być w guardzie zapisany jako `replace(/\\s+/g, ' ')`, inaczej guard szuka błędnego `replace(/s+/g, ' ')`.
- ryzyko: poprzedni runtime był poprawny, ale guard był fałszywie czerwony.
- next: apply R9F, push po PASS, manualny test follow-up/notatki.
