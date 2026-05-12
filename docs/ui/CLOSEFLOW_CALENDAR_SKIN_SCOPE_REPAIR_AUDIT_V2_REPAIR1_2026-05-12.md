# CloseFlow — Calendar Skin Scope Repair V2 Repair1

## Co naprawia

Poprzedni audyt zatrzymał paczkę, bo znalazł tekst starego selektora w komentarzu CSS. To był fałszywy alarm testu, ale dobrze, że zatrzymał paczkę: guard ma gryźć, nie mruczeć.

Repair1 robi dwie rzeczy:

1. usuwa z komentarzy CSS literalny tekst starego broad selectora,
2. zmienia audyt tak, żeby sprawdzał wykonywalny CSS po usunięciu komentarzy.

## Zakres

Dotykamy tylko:

- `src/styles/closeflow-calendar-skin-only-v1.css`
- `src/pages/Calendar.tsx` markerem repair1
- `tools/audit-closeflow-calendar-skin-scope-repair-audit-v2-repair1.cjs`
- `scripts/check-closeflow-calendar-skin-scope-repair-audit-v2-repair1.cjs`

Nie zmieniamy struktury kalendarza, danych, API ani sidebaru.
