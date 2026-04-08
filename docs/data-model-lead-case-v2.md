# ClientPilot — wspólny model danych Lead → Case (ETAP 3)

## Cel
- Jeden spójny model od sprzedaży do operacji.
- Lead może przejść do sprawy bez utraty historii.
- Brak duplikowania klienta podczas przejścia lead → case.

## Zasada nadrzędna
- Status sprzedażowy i operacyjny są rozdzielone:
  - sprzedaż: `leads.status`
  - operacje: `cases.operational_status`
- Relacja mostowa:
  - `leads.case_id` (opcjonalne)
  - `cases.source_lead_id` (opcjonalne)

## Tabele domenowe
- `contacts`
- `leads`
- `cases`
- `case_templates`
- `template_items`
- `case_items`
- `file_attachments`
- `approvals`
- `activity_log`
- `notifications`
- `client_portal_tokens`

## Relacje
- `contact (1) -> (N) leads`
  - `leads.contact_id -> contacts.id`
- `contact (1) -> (N) cases`
  - `cases.contact_id -> contacts.id`
- `lead (0..1) -> (0..1) case`
  - `leads.case_id -> cases.id`
  - `cases.source_lead_id -> leads.id`
- `case (1) -> (N) case_items`
  - `case_items.case_id -> cases.id`
- `case (1) -> (N) file_attachments` i `case_item (1) -> (N) file_attachments`
- `case (1) -> (N) approvals` i `case_item (1) -> (N) approvals`
- `case (1) -> (N) client_portal_tokens`
- `workspace (1) -> (N) *`
  - każdy rekord biznesowy ma `workspace_id`

## Oś aktywności
`activity_log` zbiera wspólną historię:
- działania sprzedażowe
- działania operacyjne
- zmiany statusów
- uploady
- akceptacje
- przypomnienia / notyfikacje

## Deduplikacja kontaktu przy konwersji
Podczas przejścia lead → case:
1. szukaj kontaktu po `normalized_email`
2. jeśli brak: szukaj po `normalized_phone`
3. fallback: `name + company`
4. jeśli nadal brak: utwórz nowy `contact`

To eliminuje podwójne rekordy klienta przy uruchamianiu realizacji.

## Checklisty i szablony
- `case_templates` to zestawy startowe.
- `template_items` opisują pozycje wzorca.
- Przy utworzeniu case można skopiować `template_items` do `case_items`.
- `case_items` są źródłem kontroli realizacji, uploadów i akceptacji.

## Bezpieczeństwo i multi-tenant
- RLS włączone dla wszystkich nowych tabel.
- Dostęp oparty o członkostwo w `workspace_members`.
- Helper SQL: `public.is_workspace_member(workspace_id)`.

## Pliki implementacji
- migracja SQL: `supabase/011_lead_case_bridge.sql`
- typy domenowe: `lib/types.ts`
- mapowanie tabel repozytorium: `lib/repository/schema.ts`
- logika domenowa przejścia: `lib/domain/lead-case.ts`

## Warunki gotowości ETAPU
- lead może być źródłem sprawy (`cases.source_lead_id`)
- nie powstaje duplikat kontaktu przy przejściu lead → case
- case ma pełne relacje do checklist (`case_items`) i historii (`activity_log`)
