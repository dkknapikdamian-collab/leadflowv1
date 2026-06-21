# STAGE232I4_R16Z_R4_MISSING_MANAGER_FINAL_VISUAL_FIT_NO_ZIP

Date/time: 2026-06-20 Europe/Warsaw
Project: CloseFlow / LeadFlow
Branch: dev-rollout-freeze

Scope:
- MissingItemsManagerDialog visual fit only.
- Preserve R16Y_R2 source truth: missing blocker = priority high.
- Make Blokuje label readable.
- Make Usun action visible.
- Avoid clipped fixed grid.

Not touched:
- SQL
- backend
- task status mapper
- ClientDetail source truth logic beyond guard read
- Calendar
- CaseDetail
- finance

Manual smoke required:
- Blokuje readable.
- Usun visible.
- checkbox updates main tile.
- F5 keeps state.
- no horizontal scroll.