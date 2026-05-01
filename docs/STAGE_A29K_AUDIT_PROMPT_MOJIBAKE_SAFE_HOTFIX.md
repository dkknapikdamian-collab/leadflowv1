# A29K - audit prompt mojibake-safe hotfix

## Cel

Domknąć niedokończony pakiet A29F/A29G/A29H/A29I/A29J bez cofania zmian.

## Problem

`check:polish-mojibake` zatrzymał wdrożenie na pliku:

```text
docs/closeflow_super_audit_prompt_2026-05-01.md
```

W tym dokumencie były celowo wpisane przykłady uszkodzonego kodowania, aby audytor ich szukał. Guard nie rozróżnia przykładów od realnego błędu i blokuje commit.

## Zmiana

- zostawiamy sens sekcji audytu polskich znaków,
- usuwamy literalne uszkodzone znaki z dokumentu,
- zastępujemy je opisami ASCII,
- nie zmieniamy logiki aplikacji.

## Nie zmieniono

- Nie cofnięto A26/A27/A28/A29.
- Nie przywrócono osobnych stubów API Vercel.
- Nie przywrócono Firebase jako docelowego runtime auth.
- Nie zmieniono UI.
- Nie zmieniono Supabase schema.

## Kryterium

`check:polish-mojibake` przechodzi, a audyt nadal każe szukać problemów z kodowaniem znaków.
