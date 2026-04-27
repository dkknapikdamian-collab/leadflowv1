# Client Detail V85 - final tabs contract fix

Cel:
- domknąć kontrakt testów po finalnej przebudowie widoku klienta,
- zachować nowy model: klient jako kartoteka/relacje/historia/menu pomocnicze,
- nie przywracać starego centrum pracy klienta ani follow-upów w kokpicie klienta.

Zmiany:
- dodano stabilne markery modelu:
  - Kartoteka
  - Relacje
  - Historia
  - Więcej
  - Drugorzędne akcje / menu pomocnicze
  - Praca dzieje się w sprawie
- usunięto teksty, które mogły sugerować powrót starego workflow klienta:
  - Dodaj follow-up
  - Następny krok klienta

Po wdrożeniu:
- node tests/client-detail-final-operating-model.test.cjs
- node tests/client-detail-simplified-card-view.test.cjs
- node tests/client-relation-command-center.test.cjs
- node tests/client-detail-v1-operational-center.test.cjs
- npm.cmd run lint
- npm.cmd run verify:closeflow:quiet