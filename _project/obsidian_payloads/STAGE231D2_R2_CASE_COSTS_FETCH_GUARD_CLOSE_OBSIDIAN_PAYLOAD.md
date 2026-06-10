# STAGE231D2_R2_CASE_COSTS_FETCH_GUARD_CLOSE — Obsidian payload

Data i godzina: 2026-06-10 19:10 Europe/Warsaw

## Zakres
Domknięcie D2 po guard FAIL: CaseDetail ma ładować koszty przez fetchCaseCostsFromSupabase i zapisywać przez createCaseCostInSupabase.

## SQL
Bez nowego SQL. Obowiązuje plik: sql/2026-06-10_stage231d2_case_costs.sql.

## Testy
D2 guard/test, regresje D1/D0/D0A, Polish guard, build, git diff --check.

## audyt ryzyk
Bez wykonania SQL w Supabase panel może działać wizualnie, ale zapis kosztu zwróci błąd API. To jest oczekiwane i nie wolno tego ukrywać jako sukcesu.

## następny krok
Po PASS: SQL w Supabase, test ręczny Dodaj koszt, potem selektywny commit/push.
