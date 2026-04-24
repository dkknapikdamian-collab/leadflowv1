# Client relation command center — 2026-04-24

## Cel

Domknąć praktyczną ścieżkę pracy użytkownika na poziomie V1:

```text
Lead -> Klient -> Sprawa -> Rozliczenia
```

Klient ma być centrum relacji, ale nie głównym miejscem codziennej pracy. Główna praca nadal dzieje się na aktywnych leadach i sprawach.

## Co zostało wdrożone

- `ClientDetail` pobiera leady, sprawy i płatności klienta przez API z filtrem `clientId`.
- Ekran klienta pokazuje liczby aktywnych leadów i aktywnych spraw.
- Ekran klienta pokazuje oś „Ścieżka klienta”.
- Każdy lead klienta ma jasną akcję `Otwórz lead`.
- Każda sprawa klienta ma jasną akcję `Otwórz sprawę`.
- Jeśli lead ma `linkedCaseId`, można przejść z klienta bezpośrednio do sprawy.
- Jeśli sprawa ma `leadId`, można przejść ze sprawy na kliencie bezpośrednio do leada.
- Zostaje edycja danych klienta i zapis przez obecne API.

## Czego ten etap nie zmienia

- Nie zmienia `/api/me`.
- Nie zmienia schematu Supabase.
- Nie zmienia flow tworzenia leada.
- Nie zmienia flow tworzenia sprawy.
- Nie usuwa istniejących funkcji klienta.

## Kryterium zakończenia

Po wdrożeniu użytkownik może wejść w klienta i od razu zobaczyć:

```text
ile ma leadów
ile ma spraw
ile ma rozliczeń
co jest aktualne
którą kartę roboczą otworzyć dalej
```

To zamyka praktyczny etap `Lead -> Klient -> Sprawa` na poziomie UI.
