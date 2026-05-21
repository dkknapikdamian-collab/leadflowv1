# 2026-05-21 - Stage129 storage manual test

## Cel

Potwierdzić, że po migracji na nowy Supabase `amrxiaetdocrywnnkoct` portalowy upload plików działa przez prywatny bucket `portal-uploads`.

## Testy automatyczne lokalnie

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
node scripts/check-stage129-supabase-storage-contract.cjs
npm run check:p15-portal-storage-bucket
npm run build
```

## Supabase Dashboard

- [ ] Projekt: `amrxiaetdocrywnnkoct`
- [ ] SQL `supabase/migrations/20260502_portal_uploads_storage_bucket.sql` uruchomiony
- [ ] Storage bucket `portal-uploads` istnieje
- [ ] Bucket nie jest publiczny
- [ ] Limit pliku 10 MB
- [ ] MIME: PDF, JPG, PNG, WEBP, TXT, DOCX
- [ ] Brak publicznych policy anon/authenticated

## Vercel env

- [ ] `SUPABASE_URL=https://amrxiaetdocrywnnkoct.supabase.co`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` z nowego projektu, server-only
- [ ] `SUPABASE_PORTAL_BUCKET=portal-uploads`
- [ ] `PORTAL_UPLOAD_MAX_BYTES=10485760`
- [ ] `PORTAL_UPLOAD_ALLOWED_MIME_TYPES=application/pdf,image/jpeg,image/png,image/webp,text/plain,application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- [ ] `PORTAL_STORAGE_HEALTH_SECRET` ustawiony

## Health endpoint

```powershell
$Secret="WKLEJ_PORTAL_STORAGE_HEALTH_SECRET"
Invoke-RestMethod -Method GET "https://closeflowapp.vercel.app/api/storage-upload-health" -Headers @{"x-closeflow-storage-check-secret"=$Secret}
```

Oczekiwane:

```json
{"ok":true,"bucket":"portal-uploads","public":false}
```

## Portal upload

- [ ] Otwórz portal klienta dla sprawy z itemem typu plik
- [ ] Wgraj plik TXT albo PDF < 1 MB
- [ ] Item pokazuje nazwę pliku
- [ ] Supabase Storage pokazuje obiekt pod `portal/<caseId>/<itemId>/...`
- [ ] Bucket nie pozwala na publiczne listowanie

## Status

- wynik:
- data testu:
- kto potwierdził:
- uwagi:
