# 2026-05-21 - CloseFlow Stage130 RLS warnings public tables after Supabase migration

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- public app: https://closeflowapp.vercel.app
- new Supabase project ref: amrxiaetdocrywnnkoct
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
- entity_id/workspace_id/project_id: DO_POTWIERDZENIA

## FAKTY

Damian pokazał Supabase Security Advisor warning: `RLS Disabled in Public` dla tabel:

- public.support_requests
- public.service_profiles
- public.workspace_recovery_logs
- public.billing_webhook_events

To nie jest problem bucketu Storage `portal-uploads`. To osobny problem bezpieczeństwa tabel Postgres w public schema.

## DECYZJA / KIERUNEK

Dla obecnego modelu CloseFlow bezpieczny kierunek to server-only access:

- włączyć RLS na wskazanych tabelach,
- nie tworzyć publicznych policy dla `anon` ani `authenticated`,
- odebrać bezpośredni dostęp `anon` i `authenticated`,
- zostawić dostęp backendowi przez `service_role`,
- nie ruszać importu leadów, Google Calendar, Stripe, Resend ani AI w tym kroku.

## SQL do ręcznego uruchomienia

Uruchomić w Supabase SQL Editor dla projektu `amrxiaetdocrywnnkoct`:

```sql
do $$
declare
  table_name text;
  table_names text[] := array[
    'support_requests',
    'service_profiles',
    'workspace_recovery_logs',
    'billing_webhook_events'
  ];
begin
  foreach table_name in array table_names loop
    if to_regclass(format('public.%I', table_name)) is not null then
      execute format('alter table public.%I enable row level security', table_name);
      execute format('revoke all on table public.%I from anon', table_name);
      execute format('revoke all on table public.%I from authenticated', table_name);
      execute format('grant all on table public.%I to service_role', table_name);
      execute format('comment on table public.%I is %L', table_name, 'CloseFlow Stage130: RLS enabled after Supabase migration; server-only/service_role access; no public anon/authenticated table policies.');
      raise notice 'Stage130 RLS enabled and direct anon/authenticated access revoked for public.%', table_name;
    else
      raise notice 'Stage130 skip: public.% does not exist in this project', table_name;
    end if;
  end loop;
end $$;

select
  n.nspname as schema_name,
  c.relname as table_name,
  c.relrowsecurity as rls_enabled,
  c.relforcerowsecurity as force_rls
from pg_class c
join pg_namespace n on n.oid = c.relnamespace
where n.nspname = 'public'
  and c.relkind = 'r'
  and c.relname in (
    'support_requests',
    'service_profiles',
    'workspace_recovery_logs',
    'billing_webhook_events'
  )
order by c.relname;
```

## TESTY RĘCZNE PO SQL

1. Supabase Security Advisor: odświeżyć warningi.
2. Sprawdzić, czy `RLS Disabled in Public` zniknęło dla 4 tabel.
3. W aplikacji CloseFlow sprawdzić minimum:
   - `/settings`,
   - `/support` albo centrum pomocy, jeśli jest widoczne,
   - widoki korzystające z service_profiles / spraw / usług,
   - brak regresji logowania.

## RYZYKA

- Jeśli jakaś część aplikacji odpytywała te tabele bezpośrednio z przeglądarki przez anon/authenticated key, po RLS bez policy przestanie działać. Zgodnie z aktualnym kierunkiem CloseFlow dane biznesowe mają iść przez backend/API, więc to ryzyko jest akceptowalne, ale wymaga smoke testu.

## NASTĘPNY KROK

Uruchomić SQL, odświeżyć Supabase Security Advisor i wkleić wynik/screen, jeśli coś zostanie na czerwono.
