# CLOSEFLOW_RECORD_LIST_SOURCE_TRUTH_2026-05-12

## Cel

Ujednolicić listę Leadów i listę Klientów jednym wizualnym kontraktem CSS, żeby karty rekordów nie rozlewały się pionowo i nie miały dwóch konkurujących układów.

## Problem wejściowy

Na `/leads` karta leada była zbyt wysoka: nazwa, kontakt, status, wartość, najbliższa akcja i przyciski spadały pionowo pod siebie.

Na `/clients` istniał już kierunek inline, ale wcześniejsze reguły `clients-next-action-layout.css` nadal definiowały osobny pełnoszeroki blok najbliższej akcji i układ wielowierszowy. To tworzyło ryzyko walki kaskady CSS.

## Decyzja

Nie dokładamy kolejnego lokalnego hacka tylko do leadów.

Wprowadzamy jedno źródło prawdy:

```text
src/styles/closeflow-record-list-source-truth.css
```

Importują je oba ekrany:

```text
src/pages/Leads.tsx
src/pages/Clients.tsx
```

## Zakres zmiany

- desktop: jedna kompaktowa pozioma karta rekordu,
- kolumny: indeks / główne dane / wartość lub relacje / najbliższa akcja / akcje,
- mobile: kontrolowane przejście do czytelnego układu 2-kolumnowego,
- bez zmiany danych, API, routingu i logiki biznesowej.

## Kryterium zakończenia

- `/leads` i `/clients` mają ten sam rytm listy,
- karta nie robi pustej pionowej studni,
- najbliższa akcja jest informacją w rzędzie, a nie osobnym wielkim panelem,
- stare CSS-y nie są kasowane, ale są nadpisane przez jeden późniejszy import.
