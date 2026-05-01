# Stage A26 - Activity delete hotfix + AI Drafts / Quick Capture / Voice capture in Supabase

## Cel

Ten etap robi dwie rzeczy:

1. Naprawia błąd:

```text
Błąd usuwania notatki: METHOD_NOT_ALLOWED
405 Method Not Allowed
```

2. Domyka kontrakt `ai_drafts` pod Supabase dla AI Drafts / Quick Capture / Voice capture.

## Przyczyna błędu notatki

Frontend wołał:

```text
DELETE /api/activities?id=...
```

ale endpoint `api/activities.ts` obsługiwał tylko:

```text
GET
POST
```

Dlatego serwer zwracał `METHOD_NOT_ALLOWED`.

## Zmiana w API aktywności

`api/activities.ts` obsługuje teraz:

- `GET`,
- `POST`,
- `PATCH`,
- `DELETE`.

Dodatkowo `GET` obsługuje filtr `leadId`, żeby historia leada nie mieszała się z przypadkowymi aktywnościami.

## A26 - AI Drafts w Supabase

Dodana migracja:

```text
supabase/migrations/20260501_a26_ai_drafts_supabase.sql
```

Tabela `ai_drafts` ma kontrakt:

```text
id
workspace_id
user_id
type
raw_text
parsed_data
provider
status
source
expires_at
confirmed_at
cancelled_at
linked_record_id
linked_record_type
created_at
updated_at
```

Zostaje też `converted_at` jako pole kompatybilności z obecnym UI, ale canonical status po zatwierdzeniu w bazie to `confirmed`.

## Prywatność raw_text

Po statusach:

```text
confirmed
cancelled
expired
archived
```

`raw_text` jest ustawiane na `null`.

## Ważne o AI i pełnym dostępie do danych

Ten etap nie rozszerza jeszcze swobodnego odczytu danych przez AI.

A26 stabilizuje bezpieczny workflow zapisu:

```text
AI/głos -> szkic w Supabase -> użytkownik sprawdza -> dopiero finalny rekord
```

Pełny swobodny dostęp AI do danych użytkownika powinien wejść jako następny etap:

```text
A27 - AI Application Context Operator Supabase Snapshot
```

Zakres A27:

- AI pobiera pełny snapshot workspace użytkownika,
- widzi leady, klientów, sprawy, zadania, wydarzenia, szkice i powiązania,
- zna wszystkie pola potrzebne do odpowiedzi,
- odpowiada wyłącznie na podstawie danych aplikacji,
- bez komendy zapisu nic nie tworzy,
- komenda zapisu nadal tworzy tylko szkic.

## Weryfikacja

Skrypt wdrożeniowy odpala:

```text
node scripts/check-a26-activities-ai-drafts-supabase.cjs
npm.cmd run check:polish-mojibake
npm.cmd run test:critical
npm.cmd run build
```
