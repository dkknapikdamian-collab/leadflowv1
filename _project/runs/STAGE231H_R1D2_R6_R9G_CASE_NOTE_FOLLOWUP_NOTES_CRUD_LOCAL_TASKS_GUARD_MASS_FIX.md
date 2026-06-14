# STAGE231H_R1D2_R6_R9G_CASE_NOTE_FOLLOWUP_NOTES_CRUD_LOCAL_TASKS_GUARD_MASS_FIX

- data: 2026-06-14 22:50 Europe/Warsaw
- status: DO_APPLY / MASS_GUARD_FIX
- cel: naprawić klasę błędu w guardzie R9E, który wymagał nieistniejącej składni `setTasks((previousTasks)` zamiast realnej składni runtime `setTasks((current) => dedupeCaseTasks([normalizedCreated, ...current], caseId, caseData));`.
- zakres: guard/test/doc only plus utrzymanie pełnego runtime R9 przez whole-file replacement.
- bez SQL, bez Google Calendar backend, bez billing/trial, bez AI Drafts.
