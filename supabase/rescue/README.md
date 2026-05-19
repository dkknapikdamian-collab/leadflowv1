# CloseFlow Supabase Rescue

Ten folder przechowuje bezpieczne artefakty ratunkowe Supabase.

## Zasady

- snippets/ zawiera pobrane Private SQL snippets z Supabase SQL Editor.
- Nie każdy plik .sql wolno uruchamiać.
- Zawsze czytaj _CLASSIFICATION.md przed użyciem.
- Pliki oznaczone NOT_SQL_POWERSHELL_SNIPPET mają status DO_NOT_RUN.
- Pliki oznaczone DATA_SPECIFIC_WORKSPACE_FIX nie są migracją dla nowego projektu.
- Pełna migracja wymaga jeszcze supabase db pull oraz dumpu remote schema.

## Sekrety

Do repo nie wolno commitować:
- SUPABASE_SERVICE_ROLE_KEY
- RESEND_API_KEY
- GOOGLE_CLIENT_SECRET
- GOOGLE_TOKEN_ENCRYPTION_KEY
- STRIPE_SECRET_KEY
- CRON_SECRET
- tokenów Supabase/Vercel/GitHub

Secret scan dla tego etapu wykrył tylko nazwę roli SQL service_role, nie klucz.
