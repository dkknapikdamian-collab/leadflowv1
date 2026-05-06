# STAGE7_AI_ASSISTANT_QUERY_API_CONTRACT_SMOKE_V1

Data: 2026-05-06  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`

## Cel

Domknac techniczny kontrakt endpointu `/api/assistant/query` po Stage3-Stage6D.

Ten etap nie dodaje kolejnej warstwy "magii AI". On ma dac szybki, powtarzalny smoke test, ze endpoint ma structured API contract i nie zamienia sie w luzny chatbotowy response.

## Zakres

- `/api/assistant/query` dalej przyjmuje tylko `POST`.
- Empty prompt zwraca jawny structured response z `mode: "unknown"`, `intent: "unknown"`, `items: []`, `draft: null` i `meta.dataPolicy: "app_data_only"`.
- Za duzy body payload zwraca `413` i `payload_too_large`.
- Normalne zapytanie dalej buduje kontekst przez `buildAssistantContextFromRequest()`.
- Wynik dalej przechodzi przez `runAssistantQuery()`.
- Seed testowy moze wejsc przez `snapshot` albo `data`.

## Nie zmienia

- Nie tworzy finalnych rekordow.
- Nie zmienia flow zatwierdzania szkicow.
- Nie dotyka billing/trial/plans.
- Nie podpina drogiego LLM.

## Kryterium zakonczenia

- `npm.cmd run check:stage6-ai-no-hallucination-data-truth-v1` przechodzi.
- `npm.cmd run test:stage6-ai-no-hallucination-data-truth-v1` przechodzi.
- `npm.cmd run check:stage6b-stage6-doc-and-gate-repair-v1` przechodzi.
- `npm.cmd run test:stage6b-stage6-doc-and-gate-repair-v1` przechodzi.
- `npm.cmd run check:stage6d-stage6b-gate-phrase-ascii-repair-v1` przechodzi.
- `npm.cmd run test:stage6d-stage6b-gate-phrase-ascii-repair-v1` przechodzi.
- `npm.cmd run check:stage7-ai-assistant-query-api-contract-smoke-v1` przechodzi.
- `npm.cmd run test:stage7-ai-assistant-query-api-contract-smoke-v1` przechodzi.
- `npm.cmd run build` przechodzi przed commitem i pushem.

## Powod

Po naprawieniu no-hallucination policy i bramek procesowych potrzebny jest maly kontrakt API, ktory lapie regresje na granicy frontend/backend. Bez tego UI moze wygladac dobrze, a endpoint moze zaczac zwracac odpowiedz bez `meta`, bez `dataPolicy`, albo bez twardej blokady empty prompt.
