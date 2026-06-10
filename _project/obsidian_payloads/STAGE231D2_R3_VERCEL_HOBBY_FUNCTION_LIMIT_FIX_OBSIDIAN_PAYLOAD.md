# STAGE231D2_R3_VERCEL_HOBBY_FUNCTION_LIMIT_FIX — Obsidian payload

Data i godzina: 2026-06-10 19:25 Europe/Warsaw

## Zakres
D2-R3 naprawia deployment blocker Vercel Hobby: usuwa osobną funkcję api/case-costs.ts i przenosi obsługę kosztów sprawy do istniejącego api/cases.ts jako resource=costs.

## Decyzja
Nie kupować Pro tylko po to, aby ominąć limit. Konsolidować API i dodać guard budżetu Serverless Functions.

## Testy
D2 guard/test, Vercel function budget guard/test, D1/D0/D0A regression, Polish guard, build, git diff --check.

## audyt ryzyk
Po tej zmianie trzeba ponowić ręczny test Dodaj koszt po deployu, bo API path zmienia się z /api/case-costs na /api/cases?resource=costs.

## następny krok
Commit/push po PASS, potem deployment i test manualny kosztów w sprawie.
