# FAZA 4 - Etap 4.4B - Today live refresh listener

**Data:** 2026-05-04  
**Branch:** `dev-rollout-freeze`  
**Zakres:** live refresh dla widoku `Dziś`.

## Cel

Po Etapie 4.4A mamy wspólny event bus:

```text
closeflow:data-mutated
```

Ten etap podpina do niego `TodayStable`, czyli aktualny stabilny widok operatora.

## Co robimy

1. `src/pages/TodayStable.tsx` importuje `subscribeCloseflowDataMutations`.
2. `TodayStable` nasłuchuje zmian danych z innych ekranów.
3. Po zmianach typu:
   - `task`,
   - `event`,
   - `lead`,
   - `case`,
   - `client`,
   - `aiDraft`,
   - `activity`,
   - `payment`

   odpala kontrolowany `refreshData()`.
4. Refetch jest debounce’owany krótkim timerem, żeby kilka mutacji pod rząd nie zrobiło serii równoległych pobrań.
5. Nadal nie używamy `window.location.reload()`.

## Dlaczego

Problem z audytu i ręcznych testów:

```text
dodajesz task/event/lead i czasem widzisz zmianę dopiero po ręcznym odświeżeniu lub przejściu między ekranami
```

To w produkcie płatnym wygląda jak brak zapisu. Ten etap zamyka najważniejszy element: `Dziś` jako centrum pracy musi odświeżać się po mutacjach.

## Czego nie robimy

Nie przebudowujemy Today UI.
Nie ruszamy logiki sekcji.
Nie zmieniamy kontraktu task/event.
Nie dokładamy ciężkiego realtime Supabase.

To jest lekki, lokalny refresh bus, tani i bezpieczny.

## Kryterium zakończenia

Static gate:

```text
npm.cmd run check:faza4-etap44b-today-live-refresh-listener
node --test tests/faza4-etap44b-today-live-refresh-listener.test.cjs
npm.cmd run build
```

Manualnie po deployu:

1. Otwórz `/today`.
2. W drugim tabie albo z globalnej akcji dodaj task.
3. Today ma odświeżyć dane bez F5.
4. Dodaj wydarzenie.
5. Today ma zaktualizować liczniki i listy.
6. Zatwierdź albo anuluj szkic AI.
7. Today ma zaktualizować liczbę szkiców.

## Następny etap

```text
FAZA 4 - Etap 4.4C - mutation bus coverage smoke / manual live refresh evidence
```
