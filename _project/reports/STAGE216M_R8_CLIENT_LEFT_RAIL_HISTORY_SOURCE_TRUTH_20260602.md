# STAGE216M-R8 — Client left rail and history source truth

## Cel
Dopiąć lewą szynę ClientDetail do wzoru LeadDetail:
- przesunąć lewą szynę klienta o jeden takt wyżej,
- ujednolicić dolny kafelek historii klienta z `Historia aktywności` leada,
- zachować własną historię klienta, ale użyć tego samego wzorca wizualnego.

## Zakres
- `src/pages/ClientDetail.tsx`
- `src/styles/page-adapters/page-adapters.css`
- `src/styles/stage216m-r8-client-left-rail-history-source-truth.css`
- `tests/stage216m-r8-client-left-rail-history-source-truth-contract.test.cjs`

## Fakty
- R7 dodał wspólny kontrakt dla kart `Dane leada` i `Dane klienta`.
- Po screenie Damiana karta danych klienta jest prawie poprawna, ale cała lewa szyna klienta wymaga przesunięcia w górę.
- Kafelek klienta `Ostatnie ruchy` ma być wizualnie jak `Historia aktywności` leada.

## Decyzje Damiana
- Poprawić pozycję lewej szyny klienta o jeden takt w górę.
- Pod spodem w kliencie ma być ten sam wzór co w leadzie: `Historia aktywności`, ta sama ikonka, ten sam fioletowy kolor, ale własna historia klienta.

## Hipotezy AI
- Najniższe ryzyko: CSS + mały TSX patch copy/ikonki, bez ruszania danych ani API.
- Jeśli po R8 dalej będzie rozjazd, następny etap powinien być wspólny komponent TSX dla lewego raila.

## Testy
- `node tests/stage216m-r8-client-left-rail-history-source-truth-contract.test.cjs`
- `git diff --check`
- `npm run build`

## Czego nie ruszano
- API
- Supabase
- płatności
- prawa szyna
- logika danych
- Stage216D/API dirty files

## Następny krok
Po deployu porównać lewą szynę klienta i leada: start karty danych, dolny kafelek historii, fioletowy styl i tekst.
