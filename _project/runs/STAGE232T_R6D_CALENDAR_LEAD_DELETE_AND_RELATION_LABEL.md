# STAGE232T_R6D_CALENDAR_LEAD_DELETE_AND_RELATION_LABEL

Status:
IMPLEMENTED / VERIFY_REQUIRED / PROD_SMOKE_REQUIRED

Fix:
- Completes partial R6 commit a45391d2.
- Calendar relation line now renders the linked record name as the link:
  - Lead: <name>
  - Klient: <name>
  - Sprawa: <title>
- Generic visible links "Otwórz lead/klienta/sprawę" are removed from Calendar relation UI.
- Calendar enriches schedule entries with lead/client labels from loaded records.
- Delete on retained completed lead-shadow removes the matching durable completed task/work_item.
- Delete on task clears completed lead-shadow retention.
- Lead is not deleted.
