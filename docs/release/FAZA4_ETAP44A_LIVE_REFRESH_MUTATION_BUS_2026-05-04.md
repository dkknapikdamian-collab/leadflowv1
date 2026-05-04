# FAZA 4 - Etap 4.4A - Live refresh mutation bus

**Data:** 2026-05-04  
**Branch:** `dev-rollout-freeze`  
**Zakres:** fundament live refresh bez ręcznego odświeżania.

## Cel

Po mutacji API aplikacja ma wiedzieć, że dane się zmieniły.

Ten etap dodaje lekki event bus po stronie klienta:

```text
closeflow:data-mutated
```

i podpina go do ekranów, które najczęściej gubią świeżość danych:

```text
Tasks
Calendar
```

## Co robimy

1. `src/lib/supabase-fallback.ts` po każdym udanym zapisie/edycji/usunięciu:
   - czyści GET cache,
   - emituje `closeflow:data-mutated`,
   - przekazuje `path`, `method`, `entity`, `occurredAt`.

2. `src/pages/Tasks.tsx` nasłuchuje mutacji i odpala kontrolowany refetch:
   - task,
   - event,
   - lead,
   - case,
   - client,
   - aiDraft.

3. `src/pages/Calendar.tsx` nasłuchuje mutacji i odpala kontrolowany refetch bundle:
   - task,
   - event,
   - lead,
   - case,
   - client.

## Czego nie robimy w tym podetapie

Nie ruszamy jeszcze całego Today. Today jest największym ekranem i wymaga osobnego, ostrożnego podpięcia, żeby nie zrobić pętli pobrań.

To będzie:

```text
FAZA 4 - Etap 4.4B - Today live refresh listener
```

## Kryterium zakończenia 4.4A

Static gate:

```text
npm.cmd run check:faza4-etap44a-live-refresh-mutation-bus
node --test tests/faza4-etap44a-live-refresh-mutation-bus.test.cjs
npm.cmd run build
```

Manualnie po deployu:

1. Otwórz `/calendar`.
2. Otwórz drugi tab `/tasks`.
3. Dodaj zadanie w `/tasks`.
4. Kalendarz ma odświeżyć dane bez full reload po powrocie/tabie, gdy event dotrze w tej samej sesji.
5. Dodaj wydarzenie w `/calendar`.
6. `/tasks` ma odświeżyć listę bez ręcznego F5, jeśli ekran jest aktywny w tej samej sesji.

## Następny etap

```text
FAZA 4 - Etap 4.4B - Today live refresh listener
```
