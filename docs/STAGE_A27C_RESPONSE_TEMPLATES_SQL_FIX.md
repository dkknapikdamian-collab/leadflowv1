# Stage A27C - Response templates SQL migration fix

## Cel

Naprawia migrację A27 dla `response_templates`.

## Błąd

Supabase zwracał:

```text
ERROR: 0A000: cannot use subquery in transform expression
```

Problem był w konwersji `jsonb -> text[]`:

```text
alter column tags type text[] using coalesce(array(select jsonb_array_elements_text(tags)), '{}'::text[])
```

PostgreSQL nie pozwala używać takiej podkwerendy bezpośrednio w `ALTER COLUMN ... USING`.

## Naprawa

Migracja używa teraz helpera:

```text
public.a27_jsonb_to_text_array(input_value jsonb)
```

i dopiero jego używa w `USING`.

## Po wdrożeniu

Skopiuj SQL z:

```text
supabase/migrations/20260501_a27_response_templates_supabase.sql
```

do Supabase SQL Editor i uruchom ponownie.

Migracja jest idempotentna, więc może być odpalona po częściowo nieudanej próbie.
