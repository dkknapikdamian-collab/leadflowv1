# Obsidian update - STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

- data: 2026-06-14 22:50 Europe/Warsaw
- status: DO_APPLY / MASS_GUARD_FIX
- wpis do centralnych plików: 04/04 problemy/06/08/10/13
- audyt ryzyk: R9F pokazał fałszywie czerwony guard R9E przez zbyt wąskie sprawdzanie lokalnego `setTasks`; R9G naprawia klasę błędu guardów, żeby nie blokować poprawnego runtime.
