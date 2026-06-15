# STAGE231H_R1D2_R12G_CASE_QUICK_NOTE_SCOPE_CLIENT_DEDUPE_FINISH

- data: 2026-06-15 08:45 Europe/Warsaw
- status: prepared
- cel: dokończyć częściowy lokalny stan po R12F bez ponownego ruszania zakończonych fragmentów.
- zakres:
  - CaseQuickActions: explicit `data-context-case-id` dla 4 akcji sprawy.
  - ContextNoteDialog: `savedRecord`/`activity` w evencie i `onSaved(savedRecord)` przed zamknięciem.
  - CaseDetail: szybka notatka dopinana lokalnie i odpala ten sam prompt follow-upu.
  - ClientDetail: dedupe po złączeniu tasków/eventów w prawym panelu najbliższych działań.
- testy: R11 guard, R12G guard, R12G node test, build, git diff --check.
- czego nie ruszano: SQL, Google Calendar, billing/trial, AI Drafts, R1E.
