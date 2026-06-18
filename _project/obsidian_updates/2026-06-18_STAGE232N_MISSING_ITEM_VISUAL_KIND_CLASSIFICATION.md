# 2026-06-18 - STAGE232N_MISSING_ITEM_VISUAL_KIND_CLASSIFICATION

- data i godzina: 2026-06-18 04:45 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: DO_APPLY_ZIP / WAITING_LOCAL_GUARD
- problem: nowe Braki w LeadDetail/CaseDetail były zapisywane jako task missing_item, ale LeadDetail renderował je jako "Zadanie".
- zmiana: LeadDetail używa helperów Brak/Blokada dla missing_item; ContextActionDialogs zachowuje displayKind/businessKind w no-flicker mutation.
- SQL: NIE.
- ryzyko: stare legacy case_items/checklist wymagają osobnego etapu, jeśli dalej przeszkadzają.
