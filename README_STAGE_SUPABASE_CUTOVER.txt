ETAP: Supabase cutover dla case + portal + activity

Paczka zawiera:
- nowe API:
  - api/case-items.ts
  - api/activities.ts
  - api/client-portal-tokens.ts
- rozszerzenie api/cases.ts o POST/PATCH i poprawiony DELETE
- rozszerzenie src/lib/supabase-fallback.ts
- przepięcie na Supabase dla:
  - src/pages/CaseDetail.tsx
  - src/pages/ClientPortal.tsx
  - src/pages/Activity.tsx
- SQL:
  - SUPABASE_SQL_STEP_2.sql

Ważne:
- upload plików w portalu klienta nadal używa Firebase Storage
- ale metadata itemów, aktywność i tokeny portalu idą już przez Supabase API
- to jest etap cutover rdzenia operacyjnego, bez przebudowy UI
