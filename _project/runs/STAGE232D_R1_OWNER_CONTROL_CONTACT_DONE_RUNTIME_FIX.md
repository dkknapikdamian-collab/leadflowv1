# STAGE232D_R1_OWNER_CONTROL_CONTACT_DONE_RUNTIME_FIX

- data i godzina: 2026-06-17 16:05 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- status: DO_APPLY_ZIP
- typ: runtime bugfix / Owner Control contact silence
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze

## Audyt

Screen Damiana pokazal niespojnosc:
- status lead: Skontaktowany,
- historia: Zmieniono status,
- kafelek: Cisza nadal 12 dni.

Root cause:
- status/historia nie byly rownoznaczne z contact truth,
- Owner Control liczy cisze z lastContactAt/contactedAt/contact activity.

## Zmiana

- updateLeadInSupabase: patch Skontaktowany/Kontakt wykonany dostaje lastContactAt.
- updateLeadInSupabase: best-effort manual_contact_done activity z leadId tej samej encji.
- activity-truth: status Skontaktowany/Kontakt wykonany/manual_contact_done jest explicit contact truth.
- activity-truth: future date guard blokuje przyszle follow-upy jako kontakt.

## Ryzyka

- Jesli backend /api/leads odrzuci lastContactAt, potrzebny bedzie R2 API/schema audit.
- Activity insert jest best-effort, aby nie blokowac zapisu statusu.
