# Stage216M-R6 - ClientDetail Dane klienta 1:1 do Dane leada

## FAKTY
- Prace dotyczą CloseFlow / LeadFlow.
- Repo: `dkknapikdamian-collab/leadflowv1`
- Branch: `dev-rollout-freeze`
- Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`
- Poprzednio R5 jest w repo/deployu, ale prawa szyna wróci później.
- Teraz zakres zawężony do karty `Dane klienta`.

## DECYZJE DAMIANA
- `Dane klienta` ma być 1:1 jak `Dane leada`.
- Dane klienta mają być niżej w karcie danych, nie w headerze.
- Prawa strona/finanse wrócą później.

## ZAKRES
- TSX hard render karty danych klienta zamiast starego profilowego renderu.
- Przyciski kopiowania dla telefonu i e-maila.
- Wiersze: status relacji, źródło, telefon, e-mail, firma, wartość, ostatni kontakt.
- Przyciski i rowy wystylowane jak `Dane leada`.

## TESTY
- Stage216M-R6 guard
- `git diff --check`
- `npm run build`

## RYZYKA
- Jeżeli dane źródła klienta nie istnieją, wiersz pokaże `Brak źródła`.
- Wartość klienta bazuje na `clientFinanceSummary.caseValueTotal`.

## NASTĘPNY KROK
Po deployu porównać `Dane klienta` i `Dane leada` na jednym viewportcie.
