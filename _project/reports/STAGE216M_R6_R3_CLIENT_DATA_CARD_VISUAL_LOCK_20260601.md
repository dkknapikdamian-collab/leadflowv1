# STAGE216M_R6_R3_CLIENT_DATA_CARD_VISUAL_LOCK_20260601

## Cel
Dopiąć wizualnie kartę `Dane klienta` do wzoru `Dane leada` po feedbacku Damiana:
- przycisk `Edytuj dane` w klient/leada ma być niebieski,
- przycisk nie może robić białego/pełnego pasa,
- karta klienta ma trzymać szerokość i rytm lewego raila jak LeadDetail.

## Zakres
- CSS-only.
- Dotyczy tylko kart danych LeadDetail/ClientDetail.
- Bez API, Supabase, płatności, danych i prawej szyny.

## Pliki
- `src/styles/stage216m-r6-r3-client-data-card-visual-lock.css`
- `src/styles/page-adapters/page-adapters.css`
- `tests/stage216m-r6-r3-client-data-card-visual-lock-contract.test.cjs`

## Testy
- `node tests/stage216m-r6-r3-client-data-card-visual-lock-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Czego nie ruszano
- `api/*`
- `src/lib/supabase-fallback.ts`
- prawa szyna klienta
- Stage216D
- dane/Supabase/płatności

## Następny krok
Po pushu i deployu sprawdzić wyłącznie kartę `Dane klienta` względem `Dane leada`.
