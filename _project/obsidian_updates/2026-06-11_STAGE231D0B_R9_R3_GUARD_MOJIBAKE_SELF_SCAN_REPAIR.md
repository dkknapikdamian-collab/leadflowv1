# 2026-06-11 STAGE231D0B-R9/R3 — Guard mojibake self-scan repair

- data i godzina: 2026-06-11 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ wpisu: poprawka guard/test po nieudanym R9/R2
- status: przygotowane do lokalnego apply
- przyczyna: guard skanował samego siebie i wykrywał literalne tokeny driftu encodingu użyte jako lista testowa
- naprawa: tokeny driftu budowane z code pointów, bez literalnych znaków w pliku guard
- testy: D0B guard, node test, build, git diff --check
- ryzyka: wizualny odbiór /clients nadal do ręcznej akceptacji
- czego nie ruszano: D0C, trial, top layout, filtry, SQL, Supabase, runtime leadów
