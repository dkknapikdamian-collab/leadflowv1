# CLOSEFLOW_CLIENTDETAIL_HOOK_ORDER_310_REPAIR_2026-05-12

## Cel

Naprawić runtime error na ekranie szczegółów klienta:

`Minified React error #310` w chunku `ClientDetail-*.js`, na `useMemo`.

## Diagnoza

To nie jest błąd Vercel ani ostrzeżenie `url.parse()`. `DEP0169` jest ostrzeżeniem Node i nie blokuje renderu.

Krytyczny problem to zmieniona kolejność hooków w `ClientDetail.tsx`. Ekran ma ścieżki loading / brak klienta / właściwy widok. W jednej z wcześniejszych przebudów doszły hooki poniżej warunkowego returnu. Pierwszy render wykonuje mniej hooków, a po dociągnięciu danych kolejny render próbuje wykonać dodatkowy `useMemo`, co daje React #310.

## Decyzja

Naprawa stabilizuje kolejność hooków w `src/pages/ClientDetail.tsx` dla warunkowych ścieżek loading/not-found, bez ruszania danych, Supabase, zapisu, layoutu ani routingu.

## Zakres

- `src/pages/ClientDetail.tsx`
- `scripts/check-closeflow-clientdetail-hook-order-310-repair.cjs`
- `tools/patch-closeflow-clientdetail-hook-order-310-repair-2026-05-12.cjs`
- `package.json`

## Nie zmieniamy

- danych klienta,
- relacji lead/sprawa,
- zapisu notatek,
- kasowania,
- stylu kafli,
- telefonu.

## Kryterium zakończenia

- `npm run check:closeflow-clientdetail-hook-order-310-repair` przechodzi.
- `npm run build` przechodzi.
- Wejście w `/clients/:id` nie wywala React #310.
