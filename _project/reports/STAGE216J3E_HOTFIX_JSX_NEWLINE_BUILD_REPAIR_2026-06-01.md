---
typ: project_report
stage: STAGE216J3E_HOTFIX
status: build_repair
project: CloseFlow / LeadFlow
date: 2026-06-01
---

# STAGE216-J3E hotfix - JSX newline build repair

## FAKTY

- Commit 5ad4dbb7 został wypchnięty mimo build failure.
- Build padł na LeadDetail.tsx:1682.
- Przyczyną był dosłowny tekst PowerShella: `r`n w JSX.

## ZMIANY

- Usunięto literalne `r`n z warunku J3E.
- Zostawiono logikę J3E: środkowa sekcja działań jest overflow-only dla timeline.length > 5.
- Dodano guard przeciw literalnym ucieczkom PowerShella w JSX.

## TESTY

- node scripts/check-stage216j3e-duplicate-actions-cleanup.cjs
- node scripts/check-stage216j3e-hotfix-jsx-newline.cjs
- npm run build

## CZEGO NIE RUSZANO

- API.
- SQL/RLS/GRANT.
- Supabase dane.
- Storage.
- Google Calendar.