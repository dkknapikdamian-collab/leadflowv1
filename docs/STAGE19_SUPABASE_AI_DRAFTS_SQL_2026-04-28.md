# Stage 19 - Supabase AI drafts SQL

Ten etap dodaje plik SQL wymagany do wspolnych szkicow AI miedzy telefonem i komputerem.

## Co robi paczka

- Kopiuje SQL do `sql/2026-04-28_ai_drafts_supabase_ready.sql`.
- Dodaje test kontraktu SQL.
- Nie wykonuje SQL automatycznie, bo to ma byc uruchomione w Supabase SQL Editor.

## Co musisz zrobic recznie

W Supabase wejdz w SQL Editor i uruchom caly plik:

```sql
sql/2026-04-28_ai_drafts_supabase_ready.sql
```

## Po co to jest

Bez tabeli `ai_drafts` aplikacja moze wracac do lokalnego fallbacku. Wtedy telefon i komputer moga miec rozne szkice. Po SQL wspolnym zrodlem prawdy jest Supabase.

## Bezpieczenstwo

SQL jest idempotentny. Mozna go uruchomic wiecej niz raz.
