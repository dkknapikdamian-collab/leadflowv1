# 2026-05-21 - Stage128B Google Calendar done, next Supabase Storage

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- public app: https://closeflowapp.vercel.app
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
- entity_id/workspace_id/project_id: DO_POTWIERDZENIA

## Status

DONE / POTWIERDZONE PRZEZ DAMIANA.

## Fakty

- Google Auth Branding został naprawiony i przeszedł verification po użyciu właściwego konta Google.
- CloseFlow `/settings` pokazuje sekcję Google Calendar.
- Damian potwierdził, że Google Calendar jest OK.
- Po migracji na nowy Supabase najbliższy etap Google Calendar uznajemy za domknięty.

## Decyzje Damiana

- Google Calendar uznajemy za zrobiony.
- Nie importujemy leadów jeszcze teraz.
- Następny etap: przepięcie / domknięcie Supabase Storage buckets i policies.

## Czego nie ruszano

- Import leadów ze starego Supabase
- Stripe / billing
- Resend / digest / outbox
- AI / Gemini / Cloudflare

## Następny krok

Stage129 - Supabase Storage buckets and policies after Supabase migration.

Zakres Stage129:

1. Skan repo i Obsidiana.
2. Ustalić, jakie storage buckets są wymagane przez CloseFlow.
3. Sprawdzić env nowego Supabase `amrxiaetdocrywnnkoct`.
4. Przygotować albo zweryfikować SQL/policies/storage setup.
5. Nie importować leadów.
6. Po Stage129 przejść do Resend/digest/outbox, potem Stripe, potem AI, a import leadów zostawić na końcu.
