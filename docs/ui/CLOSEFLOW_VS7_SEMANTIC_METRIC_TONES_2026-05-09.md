# CloseFlow VS-7 — semantic metric tones source of truth

Data: 2026-05-09
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Cel

Domknąć jeden system kolorów dla kafelków, ikon, liczb i kart sekcji.

Nie naprawiamy tego przez ręczne przepisywanie kolorów w każdej zakładce. Źródłem prawdy jest semantyczny klucz metryki: label, id albo status.

## Problem z feedbacku admina

Feedback P1 pokazał rozjazdy na ekranach:

- `/notifications`
- `/ai-drafts`
- `/activity`
- `/response-templates`
- `/templates`
- `/cases`
- `/clients`
- `/leads`
- `/`

Wspólny wzorzec błędu: kafelek albo sekcja miały kolor wynikający z lokalnego ekranu, a nie z jednego znaczenia biznesowego.

## Decyzja

Kolor jest przypisany do sensu, nie do miejsca renderowania.

| Sens / etykieta | Ton |
|---|---|
| Wszystkie, razem, total | neutral |
| Leady, aktywne, aktywni, dzisiaj, w realizacji, pozycje | blue |
| Klienci, wartość, płatności, przychód, zrobione, akceptacje | green |
| Czekające, leady czekające, waiting, bez sprawy, kosz, obowiązkowe, tagi | amber |
| Zaległe, zagrożone, ryzyko, bez ruchu, bez działań, blokery | red |
| Sprawy, historia, szablony, odpowiedzi, szkice AI, nadchodzące, najbliższe 7 dni | purple |

## Co wdrażamy

### Nowe źródło prawdy

`src/components/ui-system/operator-metric-tone-contract.ts`

Zawiera:

- `resolveOperatorMetricTone()`
- `normalizeOperatorMetricKey()`
- mapę semantycznych labeli i statusów
- listę labeli zgłoszonych w admin feedbacku

### Renderer kafelków

`src/components/ui-system/OperatorMetricTiles.tsx`

Zmiana:

- nie ufa ślepo lokalnemu `tone`, jeśli `id` albo `label` mają znane znaczenie,
- ustawia ten sam ton dla wrappera, liczby i ikony,
- dodaje `data-cf-semantic-tone` oraz `data-cf-semantic-key`.

### Adapter runtime dla starych kart

`src/components/ui-system/OperatorMetricToneRuntime.tsx`

Cel:

- przechwycić karty Today i inne legacy elementy, które jeszcze nie są `OperatorMetricTiles`,
- nadać im `data-cf-semantic-tone`,
- utrzymać zgodność po zmianie zakładki, filtrowaniu i rerenderze.

### CSS bridge

`src/styles/closeflow-operator-semantic-tones.css`

Cel:

- wymusić zgodność liczby i ikony,
- nadać ton legacy kartom sekcji,
- nie ruszać logiki danych.

### Guard

`npm run check:vs7-semantic-metric-tones`

Sprawdza:

- obecność jednego źródła prawdy,
- eksporty,
- runtime,
- CSS,
- mount w Layout,
- pokrycie labeli z feedbacku admina.

## Nie zmieniaj

- nie zmieniaj modeli danych,
- nie zmieniaj routingów,
- nie zmieniaj tekstów biznesowych,
- nie zmieniaj statusów leadów/spraw,
- nie rób ręcznych map kolorów w każdym ekranie.

## Test ręczny po wdrożeniu

Sprawdź klikane elementy z feedbacku:

1. `/notifications`: `Wszystkie`, `Nadchodzące`
2. `/ai-drafts`: `Leady`
3. `/activity`: `Leady`, `Sprawy`
4. `/response-templates`: `Szablony`
5. `/templates`: `Szablony`, `Pozycje`
6. `/cases`: `W realizacji`
7. `/clients`: `Aktywni`, `Bez sprawy`
8. `/leads`: `Wszystkie`, `Historia`
9. `/`: `Najbliższe 7 dni`, `Szkice AI do sprawdzenia`, `Leady czekające`

## Kryterium zakończenia

- ta sama etykieta/status ma ten sam kolor w każdej zakładce,
- liczba i ikona w kafelku mają ten sam ton,
- sekcje Today nie dostają przypadkowych kolorów z lokalnych klas,
- w jednej sekcji nie dublujemy zielonego jako ogólnego pozytywnego koloru tam, gdzie elementy mają różne znaczenie,
- guard i build przechodzą.
