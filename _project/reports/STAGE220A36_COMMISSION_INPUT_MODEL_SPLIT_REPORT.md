# STAGE220A36 — Commission Input Model Split — REPORT

Data: 2026-06-05 21:45 Europe/Warsaw

## FAKTY
- Poprzedni model nadal mieszał semantykę wartości transakcji i prowizji.
- Nowy model traktuje prowizję jako operacyjną wartość właściciela.
- Przy fixed użytkownik wpisuje prowizję bez podstawy transakcji.
- Przy percent użytkownik wpisuje podstawę transakcji i stawkę procentową.

## AUDYT RYZYK
- Ryzyko legacy: nazwa pola contractValue w kodzie pozostaje techniczna, ale UI nazywa je podstawą procentu.
- Ryzyko danych: stare rekordy percent nadal pokażą podstawę i wyliczoną prowizję.
- Ryzyko Stage227: lejek musi korzystać z prowizji, nie z ceny transakcji.

## STATUS
Do testu lokalnego i push po PASS.
