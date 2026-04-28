# Stage 16 - Supabase-first readiness guard

Status: PENDING_SUPABASE_AUTH_MIGRATION

Ten etap jest lekkim straznikiem kierunku Supabase-first. Nie migruje logowania i nie udaje, ze Firebase Auth jest juz usuniety.

## Pilnuje

- Brak osobnych funkcji Vercel dla ai-drafts oraz assistant-context.
- Asystent i szkice AI ida przez api/system.ts oraz src/server.
- Szkice AI maja wspolne helpery Supabase.
- Firebase Auth zostaje do osobnego etapu migracji.

## Nie robi

- Nie usuwa Firebase Auth.
- Nie zmienia logowania.
- Nie dotyka Stripe.
- Nie wymaga SQL.
