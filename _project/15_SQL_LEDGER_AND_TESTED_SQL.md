# 15_SQL_LEDGER_AND_TESTED_SQL - CloseFlow / LeadFlow

Data utworzenia: 2026-06-14 08:55 Europe/Warsaw  
Status: ACTIVE / CANONICAL  
Typ: centralny spis SQL, migracji i testów SQL  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Canonical name: CloseFlow / LeadFlow  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Cel pliku

Ten plik jest spisem treści i ledgerem SQL dla CloseFlow.

Tutaj zapisujemy:

- SQL przygotowany do ręcznego uruchomienia,
- SQL faktycznie uruchomiony w Supabase,
- wynik guardów SQL,
- wynik testów ręcznych po SQL,
- ryzyka i następny krok.

Zasada:

```txt
SQL nie może ginąć w czacie. Każdy użyty SQL ma mieć wpis, wynik i test.
```

Nie ukrywać SQL-a w długich opisach. Każdy wpis ma mieć gotowy blok SQL albo jednoznaczne odniesienie do pliku/stage, wynik wykonania i status testu.

## Spis treści SQL

| Data | ID | Obszar | Status SQL | Status testu | Link / sekcja |
|---|---|---|---|---|---|
| 2026-06-14 08:55 Europe/Warsaw | SQL-20260614-001 | `case_items` kanoniczne kolumny, w tym `description` | WYKONANY / SUCCESS | TEST RĘCZNY ZALICZONY | [SQL-20260614-001](#sql-20260614-001---case_items-kanoniczne-kolumny-w-tym-description) |

---

## SQL-20260614-001 - `case_items` kanoniczne kolumny, w tym `description`

- data i godzina: 2026-06-14 08:55 Europe/Warsaw
- status SQL: WYKONANY / SUCCESS
- status guarda SQL: PASS
- status testu ręcznego: TEST RĘCZNY ZALICZONY
- potwierdzenie: Damian wkleił wynik Supabase SQL Editor i potwierdził, że test ręczny jest zaliczony.
- obszar aplikacji: sprawy / case items / checklisty / dokumenty / braki / opisy pozycji sprawy
- tabela: `public.case_items`
- powiązany etap: pakiet działań sprawy, finansów i czytelności UI, ID: DO_POTWIERDZENIA

### Problem

Aplikacja używa pozycji sprawy (`case_items`) jako elementów checklisty/dokumentów/braków/opisów. W bazie brakowało albo mogło brakować kanonicznych kolumn potrzebnych przez runtime, w tym `description`.

### Stan przed / wykryte kolumny

Z wyniku `information_schema.columns` wynikało, że tabela zawierała m.in.:

- `id`
- `workspace_id`
- `case_id`
- `title`
- `status`
- `type`
- `sort_order`
- `payload`
- `created_at`
- `updated_at`
- `description`
- `is_required`
- `due_date`
- `response`
- `file_url`
- `file_name`
- `approved_at`

Po migracji guard potwierdził także obecność pól ownership i kanonicznego sortowania:

- `user_id`
- `owner_user_id`
- `created_by_user_id`
- `order_index`

### SQL wykonany

```sql
begin;

create extension if not exists pgcrypto;

do $$
begin
  if not exists (
    select 1
    from information_schema.tables
    where table_schema = 'public'
      and table_name = 'case_items'
  ) then
    raise exception 'Tabela public.case_items nie istnieje. Najpierw trzeba sprawdzić właściwą nazwę tabeli albo utworzyć tabelę.';
  end if;
end $$;

alter table public.case_items
  add column if not exists id uuid default gen_random_uuid(),
  add column if not exists workspace_id uuid,
  add column if not exists case_id uuid,
  add column if not exists title text,
  add column if not exists description text,
  add column if not exists type text,
  add column if not exists status text,
  add column if not exists is_required boolean default false,
  add column if not exists due_date timestamptz,
  add column if not exists order_index integer default 0,
  add column if not exists response text,
  add column if not exists file_url text,
  add column if not exists file_name text,
  add column if not exists approved_at timestamptz,
  add column if not exists user_id uuid,
  add column if not exists owner_user_id uuid,
  add column if not exists created_by_user_id uuid,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

update public.case_items
set
  status = coalesce(nullif(status, ''), 'todo'),
  type = coalesce(nullif(type, ''), 'task'),
  is_required = coalesce(is_required, false),
  order_index = coalesce(order_index, 0),
  created_at = coalesce(created_at, now()),
  updated_at = coalesce(updated_at, now())
where
  status is null
  or status = ''
  or type is null
  or type = ''
  or is_required is null
  or order_index is null
  or created_at is null
  or updated_at is null;

create index if not exists idx_case_items_workspace_id
  on public.case_items(workspace_id);

create index if not exists idx_case_items_case_id
  on public.case_items(case_id);

create index if not exists idx_case_items_status
  on public.case_items(status);

create index if not exists idx_case_items_updated_at
  on public.case_items(updated_at desc);

commit;
```

### Guard SQL wykonany po migracji

```sql
with required_columns(column_name) as (
  values
    ('id'),
    ('workspace_id'),
    ('case_id'),
    ('title'),
    ('description'),
    ('type'),
    ('status'),
    ('is_required'),
    ('due_date'),
    ('order_index'),
    ('response'),
    ('file_url'),
    ('file_name'),
    ('approved_at'),
    ('user_id'),
    ('owner_user_id'),
    ('created_by_user_id'),
    ('created_at'),
    ('updated_at')
)
select
  r.column_name,
  case when c.column_name is not null then 'OK' else 'BRAK' end as status,
  c.data_type,
  c.is_nullable,
  c.column_default
from required_columns r
left join information_schema.columns c
  on c.table_schema = 'public'
  and c.table_name = 'case_items'
  and c.column_name = r.column_name
order by r.column_name;
```

### Wynik guarda

PASS. Wynik pokazał `OK` dla wymaganych kolumn:

- `approved_at`
- `case_id`
- `created_at`
- `created_by_user_id`
- `description`
- `due_date`
- `file_name`
- `file_url`
- `id`
- `is_required`
- `order_index`
- `owner_user_id`
- `response`
- `status`
- `title`
- `type`
- `updated_at`
- `user_id`
- `workspace_id`

### Test ręczny

Status: TEST RĘCZNY ZALICZONY.

Potwierdzenie Damiana: screen z Supabase SQL Editor pokazuje:

- migracja zakończona komunikatem `Success. No rows returned`,
- guard kolumn zakończony statusem `OK` dla wymaganych kolumn,
- test ręczny po migracji zaliczony.

### Ryzyka / dług techniczny

- Tabela ma jednocześnie historyczne `sort_order` i nowe `order_index`. Nie usuwać teraz żadnego z nich bez osobnego audytu mapperów runtime.
- Ten SQL nie dodawał pełnych FK/RLS. To była migracja odblokowująca kolumny i zapis runtime, nie pełna przebudowa bezpieczeństwa tabeli.
- Ownership (`user_id`, `owner_user_id`, `created_by_user_id`) istnieje, ale osobny etap musi pilnować, czy runtime realnie je uzupełnia przy tworzeniu pozycji.

### Następny krok

- Przy następnym etapie sprawy/klienta sprawdzić, czy zapis/edycja pozycji case item używa `description`, `order_index`, ownership i nie polega wyłącznie na `payload`.
- Dla każdego kolejnego SQL dopisywać wpis do tego pliku oraz wynik guarda/testu.
