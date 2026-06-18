# 2026-06-18 - STAGE232L_DELETE_LINKED_NOTE_REFERENCE_SWEEP

- data i godzina: 2026-06-18 03:05 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- problem: CaseDetail task delete wołał niezdefiniowany helper getLinkedNoteForTaskStage231H_R1D2_R15C.
- audyt: istnieje zdefiniowany helper findCaseNoteForFollowUpTaskStage231H_R1D2_R15C; to jego powinien używać delete handler.
- zakres: CaseDetail task delete, guard cross-detail na undefined helper.
- SQL: NIE.
- ryzyko: osobne delete API task/event może wymagać osobnego etapu, jeśli wystąpi METHOD_NOT_ALLOWED.
