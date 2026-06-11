# STAGE231D0D-R2 - CaseDetail service notes and finance rail

Data: 2026-06-11 Europe/Warsaw
Status: ZIP_APPLIED / VERIFY_REQUIRED

## Source map

- header: existing CaseDetail header, no aggressive rebuild
- tabs: existing Obsługa / Checklisty / Historia
- service tab: stage217-case-operation-workspace marked as CaseServiceTab
- notes: stage217-case-notes-panel marked as CaseNotesPanel, preview limited to 5
- all notes modal: CaseAllNotesModal using DialogContent + data-cf-vst-dialog
- right rail: CaseSettlementRailCard -> CaseQuickActionsRail -> CaseContextRailCard
- finance: existing case finance source, no SQL
- costs: existing case-costs-source semantic labels, no new model
- quick actions: existing CaseQuickActions component moved below settlement
- case/client context: new compact CaseContextRailCard
- legacy/duplicate blocks: old Stage220A10 duplicate service/notes block removed from visible runtime

## Tests

Run guard, node test, D0C regression, build and git diff --check.
