# Obsidian payload - CloseFlow SQL case_items manual PASS

Data: 2026-06-14 08:55 Europe/Warsaw  
Project: CloseFlow / LeadFlow  
Repo: dkknapikdamian-collab/leadflowv1  
Branch: dev-rollout-freeze  
Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App

## Do dopisania w spisie treści / mapie projektu

Dodać sekcję:

```md
## SQL / migracje / testy SQL

Centralny spis SQL, migracji i testów SQL:

- `15_SQL_LEDGER_AND_TESTED_SQL - CloseFlow / LeadFlow` - każdy użyty SQL, wynik wykonania, guard SQL i test ręczny.
```

## Do dopisania w 09_TESTY_DO_WYKONANIA_I_WYNIKI

```md
### 2026-06-14 08:55 Europe/Warsaw - SQL-20260614-001 case_items kanoniczne kolumny

- status SQL: WYKONANY / SUCCESS
- status guarda SQL: PASS
- status testu ręcznego: ZALICZONY
- potwierdzenie: Damian wkleił wynik Supabase SQL Editor; migracja zakończona `Success. No rows returned`, a guard kolumn zwrócił `OK` dla wymaganych kolumn.
- tabela: `public.case_items`
- kolumny potwierdzone przez guard: `id`, `workspace_id`, `case_id`, `title`, `description`, `type`, `status`, `is_required`, `due_date`, `order_index`, `response`, `file_url`, `file_name`, `approved_at`, `user_id`, `owner_user_id`, `created_by_user_id`, `created_at`, `updated_at`.
- wynik: test ręczny po SQL zaliczony.
```

## Do dopisania w 11_RYZYKA_BUGI_I_DLUG_TECHNICZNY

```md
### 2026-06-14 08:55 Europe/Warsaw - case_items sort_order/order_index równolegle

- status: OBSERWOWAĆ / NIE RUSZAĆ BEZ AUDYTU
- ryzyko: tabela `case_items` ma historyczne `sort_order` oraz kanoniczne `order_index`. Nie usuwać żadnej z tych kolumn bez sprawdzenia mapperów runtime i zapytań.
- decyzja: SQL-20260614-001 był migracją odblokowującą kolumny i zapis runtime, nie pełną przebudową FK/RLS.
- następny krok: przy kolejnym etapie sprawdzić, czy runtime faktycznie zapisuje `description`, `order_index`, `user_id`, `owner_user_id`, `created_by_user_id` i czy nie polega wyłącznie na `payload`.
```

## Do dopisania w 08_HISTORIA_ZMIAN

```md
### 2026-06-14 08:55 Europe/Warsaw - SQL ledger i case_items manual PASS

- utworzono centralny SQL ledger: `_project/15_SQL_LEDGER_AND_TESTED_SQL.md`.
- zapisano SQL-20260614-001: migracja kanonicznych kolumn `case_items`, w tym `description`.
- zapisano wynik SQL: SUCCESS.
- zapisano wynik guarda SQL: PASS.
- zapisano potwierdzenie testu ręcznego: ZALICZONY.
```
