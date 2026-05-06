# STAGE15_CONTEXT_ACTION_EXPLICIT_TRIGGER_CONTRACT_V1

Data: 2026-05-06
Repo: `dkknapikdamian-collab/leadflowv1`
Branch: `dev-rollout-freeze`

## Cel

Utwardzic sciezke przyciskow akcji bez przebudowy wizualizacji. Ten etap dodaje explicit data-context-action-kind jako kontrakt dla przyszlych przyciskow task/event/note, ale zostawia istniejacy tekstowy fallback.

## Zmieniono

- `ContextActionDialogs.tsx` rozpoznaje jawne atrybuty:
  - `data-context-action-kind`
  - `data-context-record-type`
  - `data-context-record-id`
- Jezeli przycisk ma jawny kontrakt, host bierze akcje i kontekst z data-attributes.
- Jezeli nie ma atrybutow, dziala dotychczasowy fallback po tekscie przycisku.
- Wspolny host nadal otwiera jeden z trzech dialogow: task, event albo note.

## Nie zmieniaj

- Nie zmieniac wygladu przyciskow.
- Nie dodawac nowych funkcji w `api/`.
- Nie robic osobnych lokalnych formularzy dla task/event/note w detail pages.

## Kryterium zakonczenia

- `npm.cmd run check:stage15-context-action-explicit-trigger-contract-v1` przechodzi.
- `npm.cmd run test:stage15-context-action-explicit-trigger-contract-v1` przechodzi.
- `npm.cmd run build` przechodzi.

## Decyzja

To jest guard torow akcji. Ma zapobiec sytuacji, w ktorej jeden przycisk wydarzenia otwiera wspolny dialog, a drugi odpala alternatywny zapis lub inne okno.
