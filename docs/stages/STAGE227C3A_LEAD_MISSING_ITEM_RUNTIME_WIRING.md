# STAGE227C3A - Lead Missing Item Runtime Wiring

Status: local-only patch.

Scope:
- LeadDetail quick action Brak opens the shared Stage227C2 MissingItemQuickActionModal.
- Saving creates a lightweight task with type/status missing_item.
- Saving also writes activity event missing_item_created.
- LeadDetail Braki i blokady now recognizes formal missing_item/blocker markers before fallback text heuristics.

Not touched:
- no SQL;
- no new table;
- no ClientDetail runtime wiring yet;
- no CaseDetail case_items wiring yet;
- no Supabase schema/migration.

Next:
- Stage227C3B should wire ClientDetail/CaseDetail using the same modal, with CaseDetail using case_items.
