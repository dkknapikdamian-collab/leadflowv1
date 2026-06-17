# 13_SQL_LEDGER_I_MIGRACJE - CloseFlow / LeadFlow repo bridge

Status: ACTIVE
Read policy: READ_IF_SQL_OR_DATABASE_TASK

## Cel

Ten plik jest repo-local bridge do centralnego Obsidian SQL ledger:

10_PROJEKTY/CloseFlow_Lead_App/13_SQL_LEDGER_I_MIGRACJE - DO_POTWIERDZENIA - CloseFlow LeadFlow.md

Pelny opis SQL, status wdrozen, testy i decyzje sa w Obsidianie.

## Zasada

SQL do wdrozenia musi byc osobnym blokiem albo osobnym plikiem .sql / .md.

Przy SQL podaj:
- gdzie uruchomic,
- po co,
- kolejnosc,
- test/guard,
- reakcje na blad,
- status wdrozenia.

## Znane obszary

- Supabase.
- clients, cases, leads, work_items, profiles.
- historyczny bloker: Supabase egress P0 / ciezkie select=* i powtarzane zapytania auth/user + profiles.

## Routing

UI-only task nie czyta SQL bez powodu.

SQL / RLS / migracje / funkcje / triggery czytaja ten plik, Obsidian 13 i konkretne migracje/funkcje.
