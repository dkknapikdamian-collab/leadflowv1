# STAGE216M_R6_CLIENT_DATA_CARD_1TO1_20260601

## Cel
Dopasować kartę `Dane klienta` do wzorca `Dane leada` kafelek po kafelku.

## Fakty
- LeadDetail ma kartę `Dane leada` jako prosty data panel z wierszami: status, źródło, telefon, e-mail, firma, wartość, ostatnia aktywność.
- ClientDetail nadal używał profilowego renderu danych klienta z innym rytmem, ikonami i pełnym niebieskim przyciskiem edycji.
- Prawa szyna wróci później, bo aktualnie priorytetem jest karta danych klienta.

## Decyzje Damiana
- Widok klienta ma iść 1:1 za LeadDetail.
- Teraz poprawiamy zakładkę/kartę `Dane klienta`.
- Finanse prawej szyny wrócą później.

## Zakres
- `src/pages/ClientDetail.tsx`
- `src/styles/page-adapters/page-adapters.css`
- `src/styles/stage216m-r6-client-data-card-1to1.css`
- `tests/stage216m-r6-client-data-card-1to1-contract.test.cjs`

## Testy
- `node tests/stage216m-r6-client-data-card-1to1-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Czego nie ruszano
- API
- Supabase
- płatności
- dane runtime
- prawa szyna
- Stage216D

## Następny krok
Sprawdzić UI: `Dane klienta` vs `Dane leada` na tym samym viewportcie.
