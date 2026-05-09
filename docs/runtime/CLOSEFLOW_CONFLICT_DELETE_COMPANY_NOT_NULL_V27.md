# CloseFlow conflict delete + company NOT NULL v27

Status: guard finalizer after v25 functional patch.

Cel:
- Nie resetować zmian v25.
- Naprawić tylko zatruty guard importów supabase-fallback.
- Nie traktować komentarzy w importach jako nazw eksportów.
- Nie mieszać importów React/lucide/date-fns z supabase-fallback.

Walidacja:

```powershell
npm run check:closeflow-conflict-delete-company-not-null-v25
npm run check:closeflow-conflict-delete-company-not-null-v27
npm run check:closeflow-supabase-fallback-named-exports-v1
npm run check:vercel-hobby-function-limit
npm run check:lead-client-conflict-resolution-v1
npx tsc --noEmit --pretty false
npm run build
```
