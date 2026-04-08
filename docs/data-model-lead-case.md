# Data Model Lead -> Case

Ten dokument opisuje most miedzy sprzedaza i operacja.

## Encje

- contacts
- leads
- cases
- case_templates
- template_items
- case_items
- file_attachments
- approvals
- activity_log
- notifications
- client_portal_tokens

## Relacje

- contact ma wiele leadow i wiele cases
- lead moze utworzyc case
- case nalezy do workspace
- case_items naleza do case
- attachments i approvals naleza do case / case_item

## Pola mostowe

- lead.case_id (opcjonalne)
- lead.contact_id (opcjonalne)
- case.source_lead_id
- case.contact_id

## Przejscie Lead -> Case

- SQL funkcja `create_case_from_lead(workspace_id, lead_id, actor_user_id)` buduje most bez duplikowania kontaktu.
- Funkcja:
  - wpuszcza tylko lead ze statusem `won`,
  - reuzywa `contact` po emailu, telefonie albo parze `full_name + company`,
  - tworzy `case` z `source_lead_id`,
  - aktualizuje `lead.case_id` oraz `lead.contact_id`,
  - zapisuje wpisy do `activity_log` dla zakresu `sales` i `operations`.

## Statusy

- status sprzedazowy jest w leadzie (`leads.status`)
- status operacyjny jest w sprawie (`cases.operational_status`)

## Aktywnosc wspolna

`activity_log` zbiera:
- dzialania sprzedazowe
- dzialania operacyjne
- zmiany statusu
- uploady
- akceptacje
- przypomnienia

## Multi-tenant

Kazdy rekord domenowy jest przypisany do `workspace_id` i chroniony politykami RLS po workspace.
