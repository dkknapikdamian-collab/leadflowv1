# CloseFlow / LeadFlow - Stage216M-R14 clean copy and finance mojibake

## FAKTY
- Po R13 finanse klienta sa widoczne w prawej karcie, ale czesc etykiet miala zepsute polskie znaki.
- W LeadDetail i ClientDetail zostaly opisowe mikro-copy, ktore Damian wskazal do usuniecia.

## DECYZJE DAMIANA
- Usunac teksty pomocnicze typu: historia pojawi sie po dodaniu..., robocze notatki..., ten lead moze wypasc..., 5 najblizszych zadan...
- Poprawic polskie znaki w finansach klienta.

## ZAKRES
- Clean copy w LeadDetail i ClientDetail.
- Mojibake repair w inline finansach klienta.
- Defensywny CSS hide dla starych opisow.

## TESTY
- `node tests/stage216m-r14-clean-copy-and-finance-mojibake-contract.test.cjs`
- `git diff --check`
- `npm run build`

## NASTĘPNY KROK
- Po deployu sprawdzic LeadDetail i ClientDetail: czy helper-copy zniknelo i czy finanse klienta maja poprawne polskie znaki.
