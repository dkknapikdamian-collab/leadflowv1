# P15 — Portal upload: Supabase Storage bucket

## Cel

Domknąć upload plików z portalu klienta tak, żeby:

- bucket istnieje w Supabase,
- bucket nie jest publiczny,
- brak publicznego listowania,
- upload idzie tylko przez backend z `SUPABASE_SERVICE_ROLE_KEY`,
- aplikacja ma limity rozmiaru i typów plików,
- da się sprawdzić konfigurację endpointem diagnostycznym.

## Co zmienia paczka

### Kod

- `src/server/_portal-storage.ts`
  - jedno źródło prawdy dla bucketu, limitu rozmiaru i typów plików,
  - domyślny bucket: `portal-uploads`,
  - domyślny limit: `10485760` bajtów,
  - domyślne typy:
    - PDF,
    - JPG,
    - PNG,
    - WEBP,
    - TXT,
    - DOCX.

- `api/storage-upload.ts`
  - dalej wymaga poprawnej sesji portalu,
  - dalej zapisuje wyłącznie przez backend/service role,
  - używa wspólnej konfiguracji z `_portal-storage.ts`.

- `api/storage-upload-health.ts`
  - test konfiguracji bucketu,
  - wymaga sekretu w nagłówku `x-closeflow-storage-check-secret`,
  - sprawdza, czy bucket istnieje i czy nie jest publiczny,
  - nie zwraca żadnych sekretów.

### Supabase

- `supabase/migrations/20260502_portal_uploads_storage_bucket.sql`
  - tworzy/aktualizuje bucket `portal-uploads`,
  - wymusza `public = false`,
  - ustawia `file_size_limit`,
  - ustawia `allowed_mime_types`,
  - nie tworzy publicznych policy.

## Zmienne środowiskowe

W Vercel ustaw jako server-only env:

```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_PORTAL_BUCKET=portal-uploads
PORTAL_UPLOAD_MAX_BYTES=10485760
PORTAL_UPLOAD_ALLOWED_MIME_TYPES=application/pdf,image/jpeg,image/png,image/webp,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document
PORTAL_STORAGE_HEALTH_SECRET=
```

`PORTAL_STORAGE_HEALTH_SECRET` może być osobnym losowym sekretem. Jeśli go nie ustawisz, endpoint health może użyć `CRON_SECRET`, ale lepiej dać osobny sekret.

Nie ustawiaj `SUPABASE_SERVICE_ROLE_KEY` ani sekretów storage jako `VITE_*`.

## Jak uruchomić SQL w Supabase

1. Wejdź w Supabase Dashboard.
2. Otwórz SQL Editor.
3. Uruchom plik:

```text
supabase/migrations/20260502_portal_uploads_storage_bucket.sql
```

4. Wejdź w Storage.
5. Sprawdź bucket:

```text
portal-uploads
```

Oczekiwane:

- bucket istnieje,
- `Public bucket` jest wyłączone,
- limit: 10 MB,
- typy plików zgodne z listą w SQL.

## Test endpointu na produkcji

Po wdrożeniu i ustawieniu env:

```powershell
$Secret="WKLEJ_PORTAL_STORAGE_HEALTH_SECRET"
Invoke-RestMethod -Method GET "https://TWOJA-DOMENA/api/storage-upload-health" -Headers @{"x-closeflow-storage-check-secret"=$Secret}
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

Jeśli zobaczysz:

```text
PORTAL_STORAGE_BUCKET_NOT_FOUND_OR_INACCESSIBLE
```

to bucket nie istnieje, nazwa bucketu w env jest inna albo service role key nie działa.

Jeśli zobaczysz:

```text
PORTAL_STORAGE_BUCKET_MUST_NOT_BE_PUBLIC
```

to bucket jest publiczny i trzeba natychmiast wyłączyć publiczny dostęp.

## Kryterium zakończenia

Etap jest skończony dopiero gdy:

- SQL został uruchomiony w Supabase,
- Vercel ma poprawne env,
- `/api/storage-upload-health` zwraca `ok: true`,
- upload pliku przez portal działa,
- pliku nie da się publicznie listować bez backendu.
