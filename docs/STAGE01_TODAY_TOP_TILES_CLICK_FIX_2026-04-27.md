# Stage 01 — Today top tiles direct click fix

Cel: górne kafelki w zakładce `Dziś` mają działać jak prawdziwe skróty, niezależnie od hashy URL i brzmienia nagłówków.

## Zmienione pliki

- `src/pages/Today.tsx`
- `tests/today-top-tiles-click-contract.test.cjs`

## Zakres

- kafelki `Pilne leady`, `Bez działań`, `Bez ruchu`, `Zablokowane sprawy` dostają przechwytywanie kliknięcia,
- sekcje `Dziś` dostają jawne markery `data-today-shortcut-section`,
- karta sekcji ma `scroll-mt-28`, żeby po przewinięciu nie chowała się pod górnym paskiem,
- klik rozwija sekcję, jeśli była zwinięta,
- fallback nadal obsługuje stare hashe: `#pilne`, `#bez-dzialan`, `#bez-ruchu`, `#zablokowane`.

## Nie zmieniono

- logiki leadów,
- logiki spraw,
- logiki zadań/wydarzeń,
- Supabase,
- AI drafts,
- billing,
- Vercel API budget.

## Test ręczny

1. Wejdź w `Dziś`.
2. Kliknij `Pilne leady`.
3. Kliknij `Bez działań`.
4. Kliknij `Bez ruchu`.
5. Kliknij `Zablokowane sprawy`.
6. Każdy kafelek ma przewinąć do właściwej sekcji i rozwinąć ją, jeśli była zamknięta.
