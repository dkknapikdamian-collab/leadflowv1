# Stage 4 V21 - Calendar relation link guard repair

## Cel
Naprawiono paczkę V20, która miała błąd generatora testu: nieucieczone `${entry.raw.leadId}` było wykonywane przez Node podczas generowania pliku.

## Zakres
- tests/calendar-entry-relation-links.test.cjs
- tests/stage87-calendar-relation-link-guard.test.cjs

## Decyzja
Nie zmieniano logiki Calendar.tsx. Test sprawdza semantycznie, że Link pochodzi z react-router-dom i nie pochodzi z błędnego modułu.

## Weryfikacja
- node --check tools/fix-calendar-relation-guard-v21.cjs
- node tools/fix-calendar-relation-guard-v21.cjs --check
- node --test tests/calendar-entry-relation-links.test.cjs
- node --test tests/stage87-calendar-relation-link-guard.test.cjs
- npm run build
- npm run verify:closeflow:quiet

## Commit / push
Nie wykonywano. Ten pakiet działa lokalnie i kończy na statusie repo.
