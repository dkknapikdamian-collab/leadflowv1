# Visual Stage 16 - Today HTML reset + work_items hotfix

## Cel

Ten etap restartuje wdrażanie wizualne w bezpieczniejszy sposób:

1. nie przepisuje całych komponentów regexem,
2. nie usuwa logiki biznesowej,
3. robi widoczną zmianę globalnego shellu i zakładki `Dziś`,
4. dodaje SQL naprawiający `PGRST204` dla `work_items.due_at` i `work_items.client_id`.

## Zakres

- `src/styles/visual-stage16-today-html-reset.css`
- `scripts/check-visual-stage16-today-html-reset.cjs`
- `supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql`
- import CSS w `src/index.css`
- skrypt kontrolny w `package.json`

## Poza zakresem

- Nie przepisywać jeszcze `Leady`, `Klienci`, `Sprawy` ani kart szczegółowych.
- Nie zmieniać routingu.
- Nie zmieniać działania Supabase/Firebase poza dodaniem SQL pod brakujące kolumny.
- Nie usuwać obecnych etapów i testów.

## Dlaczego tak

Poprzednie paczki zbyt mocno polegały na markerach i testach, a za mało na realnym, widocznym efekcie w DOM. Ten etap zaczyna od twardego, widocznego CSS resetu z HTML-a, bez ryzyka rozwalenia komponentów.

## Weryfikacja

Po wdrożeniu uruchomić:

```powershell
npm.cmd run check:visual-stage16-today-html-reset
npm.cmd run check:polish
npm.cmd run build
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
```

Dodatkowo w Supabase SQL Editor uruchomić:

```text
supabase/sql/2026-04-29_work_items_due_at_client_id_hotfix.sql
```

## Kryterium zakończenia

- Build przechodzi.
- Lint przechodzi.
- Quiet verify przechodzi.
- Dodawanie zadania nie zwraca `PGRST204: due_at` ani `PGRST204: client_id`.
- Zakładka `Dziś` i shell aplikacji wizualnie odbiegają od starego wyglądu.
