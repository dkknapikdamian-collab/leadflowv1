# Stage240R2 - AI Opportunity Finder roadmap insert ASCII runner repair

- data i godzina: 2026-06-09 18:45 Europe/Warsaw
- project_id: CloseFlow / LeadFlow
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- typ wpisu: roadmap update / future high-value module / runner repair
- status: prepared by ZIP runner

## Powód

Stage240R1 zatrzymał się na błędzie parsera PowerShell przez znaki nie-ASCII w zmiennej `$Heading`. Stage240R2 używa ASCII-only logiki PowerShell i zapisuje właściwą treść jako UTF-8 bez BOM z base64.

## Zakres

Dodano do `_project/07_NEXT_STEPS.md` blok:

`2026-06-09 16:00 Europe/Warsaw — LeadFlow AI Opportunity Finder`

## Decyzja kierunkowa

AI Opportunity Finder ma być przyszłym modułem LeadFlow / CloseFlow, nie osobną aplikacją i nie zwykłą bazą firm. Moduł ma wykrywać okazje sprzedażowe przez konkretny problem/sygnał/powód kontaktu.

## Testy

- node scripts/check-stage240r2-ai-opportunity-finder-roadmap.cjs
- node --test tests/stage240r2-ai-opportunity-finder-roadmap.test.cjs
- node scripts/check-stage230a-ai-draft-inbox-roadmap.cjs
- node --test tests/stage230a-ai-draft-inbox-roadmap.test.cjs
- git diff --check -- scoped allowlist
- git diff --cached --check

## Audyt ryzyk

- Nie wolno zmienić tego kierunku w osobną aplikację bez decyzji Damiana.
- Nie wolno pomylić modułu z generyczną bazą firm.
- Nie blokuje Stage230B/230C/230D ani pre-production backlogu.
