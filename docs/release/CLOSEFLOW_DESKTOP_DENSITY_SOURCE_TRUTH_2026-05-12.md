# CLOSEFLOW_DESKTOP_DENSITY_SOURCE_TRUTH_2026-05-12

## Cel

Wprowadzić kontrolowany desktopowy tryb zagęszczenia UI, żeby widok na komputerze miał spokojniejszy rytm podobny do użycia przeglądarki na 80%, ale bez wymagania od użytkownika ręcznego zoomu.

## Decyzja

Nie używać `transform: scale()` ani stałego browser-zoom hacka.

Używamy desktopowego kontraktu CSS:

```text
src/styles/closeflow-desktop-density-source-truth.css
```

Import globalny jest w:

```text
src/components/Layout.tsx
```

## Dlaczego tak

Prawdziwe aplikacje nie projektują osobnego widoku przez wymuszanie zoomu przeglądarki. Robią to przez:

- breakpointi,
- density tokens,
- mniejsze desktopowe spacingi,
- kontrolowaną szerokość treści,
- inne reguły dla desktopu i mobile,
- brak mieszania mobile z desktopem.

## Zakres

Desktop od `1280px` i urządzenia z precyzyjnym wskaźnikiem:

- root font-size: `14px`,
- spokojniejsze odstępy shell/content,
- mniejsze paddingi kart i wierszy,
- zachowana maksymalna szerokość treści,
- mniejsza wysokość wierszy list Leadów i Klientów,
- mobile/tablet pozostaje bez zmian.

## Nie zmieniono

- danych,
- API,
- routingu,
- logiki biznesowej,
- mobile layoutu.

## Kryterium zakończenia

Na desktopie widok jest mniej przytłaczający, bliższy odczuciu 80% zoomu, ale nadal działa jako normalny responsywny layout aplikacji.
