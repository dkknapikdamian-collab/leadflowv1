# CloseFlow LeadFlow - STAGE231A Google auth entry consistency

Date: 2026-06-09
Project: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze

## FAKTY
- Login/rejestracja korzysta z Supabase Auth.
- Google OAuth na loginie mógł utworzyć nowe konto i workspace trial przez /api/me.
- Rejestracja nie miała widocznego Google entry.
- Settings nadal wymaga migracji z Firebase Auth do Supabase Auth dla zmiany hasła/e-maila.

## DECYZJE
- STAGE231A ujednolica wejścia auth bez blokowania public trial.
- STAGE231B/C/D/E zostają ustawione jako pilny auth backlog.

## TESTY
- Stage231A guard/test.
- Build.
- git diff --check.

## NASTĘPNY KROK
- STAGE231B Supabase-only Settings security.
