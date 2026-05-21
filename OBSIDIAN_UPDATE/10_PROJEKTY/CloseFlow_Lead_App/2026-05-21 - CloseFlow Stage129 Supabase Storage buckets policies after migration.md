# 2026-05-21 - CloseFlow Stage129 Supabase Storage buckets policies after migration

## Routing

- canonical_name: CloseFlow / LeadFlow
- entity_id: DO_POTWIERDZENIA
- workspace_id: DO_POTWIERDZENIA
- project_id: DO_POTWIERDZENIA
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- public app: https://closeflowapp.vercel.app
- old Supabase project ref: ydntsbkiqwkabhjjlkew
- new Supabase project ref: amrxiaetdocrywnnkoct
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Status

PATCH / SQL / GUARD PRZYGOTOWANE.

## FAKTY

- Google Auth Branding naprawiony.
- Google Calendar w CloseFlow działa i Damian potwierdził, że jest OK.
- Stage128B zamknięty jako done.
- Nie importujemy jeszcze leadów.
- CloseFlow realnie używa storage w portalu klienta.
- Wymagany bucket po migracji: `portal-uploads`.
- Bucket ma być prywatny, bez publicznego listowania i bez publicznych policy.
- Upload ma iść przez backend `/api/storage-upload` z `SUPABASE_SERVICE_ROLE_KEY`.
- Wykryto lukę: dokumentacja i guard P15 oczekiwały `api/storage-upload.ts`, `api/storage-upload-health.ts` i migracji SQL, ale pliki nie były dostępne w branchu przez GitHub contents API.

## DECYZJE DAMIANA

- Nie ruszać importu leadów w Stage129.
- Nie ruszać Google Calendar.
- Nie ruszać Stripe.
- Nie ruszać Resend.
- Nie ruszać AI.
- Nie używać `git add .`.
- Nie kasować starych plików verification Google.

## HIPOTEZY AI

- Jeśli produkcja jest zbudowana z branchu bez `/api/storage-upload`, portalowy upload plików może kończyć się 404. Do potwierdzenia health checkiem i testem portalu po deployu Stage129.
- `api/case-items.ts` zawiera legacy inline upload i powinien być później uporządkowany, ale nie w Stage129.

## Zakres Stage129

Dodane/przygotowane:

- `api/storage-upload.ts`
- `api/storage-upload-health.ts`
- `supabase/migrations/20260502_portal_uploads_storage_bucket.sql`
- `scripts/check-stage129-supabase-storage-contract.cjs`
- `_project/runs/2026-05-21_stage129_supabase_storage_buckets_policies_after_migration.md`
- `_project/tests/2026-05-21_stage129_storage_manual_test.md`

## Wymagany bucket

```text
portal-uploads
```

Ustawienia:

- `public = false`
- `file_size_limit = 10485760`
- allowed MIME:
  - PDF
  - JPG
  - PNG
  - WEBP
  - TXT
  - DOCX

## Policies / access model

- Brak publicznych policy dla `storage.objects`.
- Brak bezpośredniego uploadu z przeglądarki do Supabase Storage.
- Frontend wysyła plik do backendu.
- Backend waliduje portal session.
- Backend używa service role key.
- W `case_items` zapisujemy tylko ścieżkę i nazwę pliku.
- Przyszły download ma iść przez backend albo signed URL, nie przez publiczny bucket.

## Testy

Automatyczne:

```powershell
node scripts/check-stage129-supabase-storage-contract.cjs
npm run check:p15-portal-storage-bucket
npm run build
```

Ręczne:

- Supabase Dashboard: bucket `portal-uploads`, private, limit i MIME.
- Vercel env dla nowego Supabase.
- `/api/storage-upload-health` z sekretem.
- Upload pliku w portalu klienta.

## Czego nie ruszano

- lead import
- Google Calendar
- Google verification HTML files
- Stripe
- Resend
- AI
- UI kalendarza
- dane klientów/leadów

## Następny krok

1. Zastosować ZIP lokalnie.
2. Uruchomić guardy i build.
3. Uruchomić SQL w Supabase `amrxiaetdocrywnnkoct`.
4. Ustawić env w Vercel.
5. Zdeployować.
6. Potwierdzić health endpoint.
7. Przetestować portal upload.
8. Potem przejść do Resend/digest/outbox. Import leadów nadal na końcu.
