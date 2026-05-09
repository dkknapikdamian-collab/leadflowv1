# CloseFlow Lead Company NOT NULL Repair v2

Status: runtime repair.

## Problem

Dodanie leada bez firmy mogło kończyć się błędem Supabase/Postgres:

`null value in column "company" of relation "leads" violates not-null constraint`

## Zasada

Pole `company` w rekordzie leada nie może być zapisywane jako `null` podczas tworzenia leada.

Jeśli użytkownik nie poda firmy, backend zapisuje pusty string.

## Dlaczego

W bazie produkcyjnej kolumna `leads.company` może mieć `NOT NULL`. Pusty brak firmy to wartość tekstowa `''`, nie `null`.

## Check

```powershell
npm run check:closeflow-lead-company-not-null-repair-v2
npm run build
```
