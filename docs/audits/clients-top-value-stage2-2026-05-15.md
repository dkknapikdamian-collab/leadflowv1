# CloseFlow /clients — Stage 81 top value clients card

Status: local patch trace / guard artifact.
Date: 2026-05-15
Commit: skipped by request.

## Cel

Na ekranie `/clients` prawy rail ma pokazywać kafel `Najcenniejsi klienci` zamiast starego kafla leadowego `Leady do spięcia`.

## Zakres

Weryfikowany zakres:
- `src/pages/Clients.tsx`
- `src/components/operator-rail/TopValueRecordsCard.tsx`
- istniejące źródło wartości klienta `clientValueByClientId`

## Kryteria guardu

Test `tests/stage81-clients-top-value-records-card.test.cjs` sprawdza, że:
- `Clients.tsx` używa `TopValueRecordsCard`,
- istnieje `mostValuableClients`,
- używane jest istniejące źródło `clientValueByClientId`,
- pojawia się tytuł `Najcenniejsi klienci`,
- pojawia się opis `5 klientów z największą wartością.`,
- istnieje `dataTestId="clients-top-value-records-card"`,
- wartości są formatowane przez `formatClientMoney(value)`,
- nie wróciły stare markery i copy kafla `Leady do spięcia`.

## Ręczny test

Na `/clients` prawy rail ma pokazywać:

1. `Filtry proste`
2. `Najcenniejsi klienci`

Nie może być widoczne:

- `Leady do spięcia`
- `Brak klienta albo sprawy przy aktywnym temacie`
- `Lead do spięcia`
- `Brak klienta`
- `Brak sprawy`
