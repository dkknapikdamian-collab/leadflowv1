# 2026-05-21 - Stage129 Supabase Storage buckets and policies after migration

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- public app: https://closeflowapp.vercel.app
- old Supabase project ref: ydntsbkiqwkabhjjlkew
- new Supabase project ref: amrxiaetdocrywnnkoct
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
- entity_id/workspace_id/project_id: DO_POTWIERDZENIA

## Status

PATCH / SQL / GUARD PRZYGOTOWANE.

Nie wykonano importu leadów. Nie ruszano Google Calendar, Stripe, Resend ani AI.

## Scan proof

Przeczytano / sprawdzono:

- `AGENTS.md`
- `package.json`
- `_project/runs/2026-05-21_stage128b_google_calendar_done_next_storage.md`
- `_project/runs/2026-05-21_stage128a_google_search_console_vercel_url_prefix_verification.md`
- `_project/00_PROJECT_STATUS.md`
- `_project/03_CURRENT_STAGE.md`
- `_project/04_DECISIONS.md`
- `_project/07_NEXT_STEPS.md`
- `src/pages/ClientPortal.tsx`
- `src/lib/supabase-fallback.ts`
- `src/server/_portal-storage.ts`
- `src/server/_portal-token.ts`
- `src/server/_supabase.ts`
- `api/case-items.ts`
- `scripts/check-p15-portal-storage-bucket.cjs`
- `docs/P15_PORTAL_STORAGE_BUCKET.md`
- `.env.example`
- `README.md`
- `src/firebase.ts`

Obsidian vault nie był dostępny bezpośrednio z tego środowiska. Wpis do Obsidiana przygotowano jako plik w `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_Lead_App/`.

## FAKTY

1. Stage128B zamknął Google Calendar i wskazał Stage129 jako następny etap: Supabase Storage buckets and policies po migracji na nowy Supabase.
2. CloseFlow realnie używa storage w portalu klienta. Flow: `ClientPortal.tsx` -> `uploadPortalFileInSupabase()` -> `/api/storage-upload` -> zapis ścieżki w `case_items.file_url` i nazwy w `case_items.file_name`.
3. W repo istnieje helper storage: `src/server/_portal-storage.ts`. Domyślny bucket to `portal-uploads`.
4. W repo istnieje dokumentacja P15 i guard `scripts/check-p15-portal-storage-bucket.cjs`, które wymagają endpointów `api/storage-upload.ts`, `api/storage-upload-health.ts`, migracji SQL i prywatnego bucketu.
5. W zdalnym branchu przed Stage129 wykryto lukę: dokumentacja/guard/README odwołują się do `api/storage-upload.ts`, `api/storage-upload-health.ts` i `supabase/migrations/20260502_portal_uploads_storage_bucket.sql`, ale te pliki nie były dostępne przez GitHub contents API w branchu `dev-rollout-freeze`.
6. `api/case-items.ts` ma starszy inline upload pliku do Supabase Storage, ale aktualny frontend portalu idzie przez `/api/storage-upload`. Ten inline fallback nie jest docelowym source of truth i powinien zostać później uporządkowany, nie w Stage129.
7. `src/firebase.ts` nadal eksportuje legacy `getStorage(app)`, ale komentarz mówi, że Firebase runtime jest tylko kompatybilnością legacy, a Supabase Auth/Postgres/Storage to docelowy stack.

## DECYZJE DAMIANA

- Nie importujemy jeszcze leadów.
- Google Calendar jest OK i nie ruszamy go w Stage129.
- Nie ruszamy Stripe, Resend ani AI w Stage129.
- Pracujemy na `dev-rollout-freeze`.
- Nie używamy `git add .`.
- Nie kasujemy starych plików verification Google.

## HIPOTEZY AI

- Jeżeli obecny deploy powstał z branchu bez `api/storage-upload.ts`, portalowy upload pliku najpewniej kończy się 404 albo błędem endpointu. Do potwierdzenia testem produkcyjnym po deployu Stage129.
- Inline upload w `api/case-items.ts` jest pozostałością po wcześniejszym wariancie. Nie usuwać go w Stage129; najpierw domknąć endpoint `/api/storage-upload`, health check i bucket.

## Miejsca w kodzie dotykające storage / upload / documents / attachments

### Aktywny flow portalu

- `src/pages/ClientPortal.tsx`
  - wybór pliku,
  - walidacja typu i rozmiaru,
  - base64 encode,
  - wywołanie `uploadPortalFileInSupabase`,
  - patch `submitPortalCaseItemInSupabase`.

- `src/lib/supabase-fallback.ts`
  - `uploadPortalFileInSupabase()` -> POST `/api/storage-upload`,
  - `submitPortalCaseItemInSupabase()` -> PATCH `/api/case-items`, zapis `fileUrl` / `fileName`.

- `api/storage-upload.ts`
  - dodany w Stage129 jako docelowy backend upload endpoint.
  - waliduje `caseId`, `itemId`, `portalSession`, plik, MIME, rozmiar.
  - zapisuje obiekt do Supabase Storage przez `SUPABASE_SERVICE_ROLE_KEY`.

- `api/storage-upload-health.ts`
  - dodany w Stage129 jako diagnostyka bucketu.
  - wymaga `x-closeflow-storage-check-secret`.
  - sprawdza bucket i wymusza `public=false`.

- `src/server/_portal-storage.ts`
  - jedno źródło prawdy dla bucketu, limitu, MIME i health secret.

- `src/server/_portal-token.ts`
  - walidacja sesji portalu przed uploadem.

- `api/case-items.ts`
  - legacy inline upload i docelowy zapis `file_url` / `file_name` w rekordzie case item.

### Dokumentacja / guardy / env

- `docs/P15_PORTAL_STORAGE_BUCKET.md`
- `.env.example`
- `README.md`
- `scripts/check-p15-portal-storage-bucket.cjs`
- `scripts/check-stage129-supabase-storage-contract.cjs`
- `supabase/migrations/20260502_portal_uploads_storage_bucket.sql`

### Legacy

- `src/firebase.ts`
  - legacy `getStorage(app)` tylko kompatybilność migracyjna. Nie rozwijać nowych funkcji na Firebase Storage.

## Wymagane buckets dla nowego Supabase `amrxiaetdocrywnnkoct`

### Bucket wymagany teraz

```text
portal-uploads
```

Ustawienia:

- `public = false`
- `file_size_limit = 10485760`
- `allowed_mime_types`:
  - `application/pdf`
  - `image/jpeg`
  - `image/png`
  - `image/webp`
  - `text/plain`
  - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`

### Buckets niewymagane w Stage129

Brak dowodu, że obecnie potrzebne są osobne buckety dla leadów, dokumentów wewnętrznych, AI, billing, Resend albo Google Calendar.

## Policies / RLS / Storage access model

Model Stage129 jest celowo backend-only:

1. Bucket `portal-uploads` jest prywatny.
2. Nie tworzymy publicznych policy dla `storage.objects`.
3. Nie dajemy `anon` ani `authenticated` bezpośredniego prawa do listowania/uploadu/readu storage.
4. Frontend nie używa `supabase.storage.from(...)`.
5. Frontend wysyła plik do `/api/storage-upload`.
6. Backend sprawdza `caseId + portalSession` przez `requirePortalSessionContext`.
7. Backend używa `SUPABASE_SERVICE_ROLE_KEY` i zapisuje obiekt do Storage.
8. W tabeli `case_items` zapisujemy tylko ścieżkę obiektu i nazwę pliku, nie publiczny URL.
9. Pobieranie/preview pliku w przyszłości powinno iść przez backend albo krótkie signed URL, a nie przez upublicznienie bucketu.

## Pliki dodane w Stage129

- `api/storage-upload.ts`
- `api/storage-upload-health.ts`
- `supabase/migrations/20260502_portal_uploads_storage_bucket.sql`
- `scripts/check-stage129-supabase-storage-contract.cjs`
- `_project/runs/2026-05-21_stage129_supabase_storage_buckets_policies_after_migration.md`
- `_project/tests/2026-05-21_stage129_storage_manual_test.md`
- `OBSIDIAN_UPDATE/10_PROJEKTY/CloseFlow_Lead_App/2026-05-21 - CloseFlow Stage129 Supabase Storage buckets policies after migration.md`

## Package script

Dodać do `package.json`:

```json
"check:stage129-supabase-storage-contract": "node scripts/check-stage129-supabase-storage-contract.cjs"
```

## Testy automatyczne

Po apply:

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
node scripts/check-stage129-supabase-storage-contract.cjs
npm run check:p15-portal-storage-bucket
npm run build
```

`npm run build` jest zalecany po patchu endpointów TypeScript.

## Test ręczny Supabase Dashboard

W nowym Supabase `amrxiaetdocrywnnkoct`:

1. SQL Editor -> uruchomić:
   `supabase/migrations/20260502_portal_uploads_storage_bucket.sql`
2. Storage -> bucket `portal-uploads` istnieje.
3. Bucket nie jest publiczny.
4. Limit pliku: 10 MB.
5. MIME types zgodne z SQL.
6. Brak publicznych policy dla anon/authenticated.

## Test ręczny produkcja / Vercel

Ustawić w Vercel Production env:

```env
SUPABASE_URL=https://amrxiaetdocrywnnkoct.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<NEW_PROJECT_SERVICE_ROLE_KEY>
SUPABASE_PORTAL_BUCKET=portal-uploads
PORTAL_UPLOAD_MAX_BYTES=10485760
PORTAL_UPLOAD_ALLOWED_MIME_TYPES=application/pdf,image/jpeg,image/png,image/webp,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document
PORTAL_STORAGE_HEALTH_SECRET=<LOSOWY_SEKRET>
```

Health check:

```powershell
$Secret="WKLEJ_PORTAL_STORAGE_HEALTH_SECRET"
Invoke-RestMethod -Method GET "https://closeflowapp.vercel.app/api/storage-upload-health" -Headers @{"x-closeflow-storage-check-secret"=$Secret}
```

Oczekiwany wynik:

```json
{
  "ok": true,
  "bucket": "portal-uploads",
  "public": false,
  "warnings": []
}
```

Następnie test portalu:

1. W aplikacji wygenerować / otworzyć link portalu sprawy.
2. Wejść w item typu plik.
3. Wgrać mały PDF albo TXT.
4. Sprawdzić, czy item pokazuje nazwę pliku.
5. W Supabase Storage sprawdzić obiekt pod `portal/<caseId>/<itemId>/...`.
6. Sprawdzić, że bucketu nie da się publicznie listować.

## Czego nie ruszano

- Import leadów ze starego Supabase.
- Google Calendar.
- Google verification HTML files.
- Stripe / billing.
- Resend / digest / outbox.
- AI / Gemini / Cloudflare.
- UI kalendarza.
- Dane klientów/leadów.

## Następny krok

1. Wdrożyć Stage129 z ZIP-a lokalnie.
2. Uruchomić guardy i build.
3. Uruchomić SQL w nowym Supabase `amrxiaetdocrywnnkoct`.
4. Ustawić Vercel env dla storage.
5. Zdeployować.
6. Sprawdzić `/api/storage-upload-health`.
7. Wykonać ręczny upload pliku w portalu klienta.
8. Dopiero po tym przejść do Resend/digest/outbox. Import leadów nadal zostaje na końcu.
