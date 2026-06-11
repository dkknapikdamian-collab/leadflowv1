# 2026-06-11 STAGE231D0B-R9/R4 — CSS guard token alignment

- data i godzina: 2026-06-11 Europe/Warsaw
- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- typ wpisu: naprawa zgodności CSS source truth z guardem R9/R3
- status: przygotowane do lokalnego apply
- przyczyna: guard wymagał markerów CSS, których R9/R2 nie wstawił w exact literal form
- naprawa: dodany marker STAGE231D0B-R9_CLIENT_LIST_CARD_POLISH_SOURCE_TRUTH oraz max-width: max-content dla finance chipów
- testy: D0B guard, node test, git diff --check, build
- ryzyka: wizualny odbiór /clients nadal do ręcznej akceptacji
- czego nie ruszano: D0C, trial, top layout, filtry, SQL, Supabase, runtime leadów
