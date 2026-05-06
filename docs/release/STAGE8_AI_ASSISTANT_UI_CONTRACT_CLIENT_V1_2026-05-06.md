# STAGE8_AI_ASSISTANT_UI_CONTRACT_CLIENT_V1

Data: 2026-05-06  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`

## Cel

Spiąć UI asystenta z jednym kontraktem `/api/assistant/query`, zamiast zostawiać logikę odpowiedzi w komponencie.

## Zmienione elementy

- Dodano `src/lib/assistant-query-client.ts` jako jeden klient kontraktu API.
- `TodayAiAssistant.tsx` używa `askAssistantQueryApi()` zamiast własnego `fetch('/api/assistant/query')`.
- UI pokazuje politykę odpowiedzi `app_data_only`, żeby użytkownik widział, że odpowiedź pochodzi z danych aplikacji.
- Pusty prompt jest obsługiwany po stronie klienta bez wysyłania pustego requestu.
- Draft dalej zapisuje się wyłącznie jako szkic do sprawdzenia.

## Nie zmieniaj

- Nie przenosić finalnego zapisu rekordów do UI.
- Nie robić keyword bota w komponencie.
- Nie zdejmować bramki `pending_review` dla komend zapisu.

## Kryterium zakończenia

- `npm.cmd run check:stage7-ai-assistant-query-api-contract-smoke-v1` przechodzi.
- `npm.cmd run test:stage7-ai-assistant-query-api-contract-smoke-v1` przechodzi.
- `npm.cmd run check:stage8-ai-assistant-ui-contract-client-v1` przechodzi.
- `npm.cmd run test:stage8-ai-assistant-ui-contract-client-v1` przechodzi.
- `npm.cmd run build` przechodzi przed commitem i pushem.

## Gate

FAIL w checku blokuje commit/push. UI ma mówić językiem kontraktu backendu, nie własnym dialektem.
