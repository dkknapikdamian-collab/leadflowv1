# STAGE9_AI_ASSISTANT_UI_SMOKE_PROMPTS_V1

Data: 2026-05-06  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`

## Cel

Dodać do UI asystenta szybki smoke panel, żeby ręcznie sprawdzić najważniejsze ścieżki AI bez wpisywania tych samych pytań od nowa.

## Zakres

- `TodayAiAssistant.tsx` dostaje quick smoke prompts.
- Prompty pokrywają wymagane testy użytkownika z AI Application Brain V1:
  - `Co mam jutro?`
  - `Czy jutro o 17 coś mam?`
  - `Czy w przeciągu 4 godzin mam spotkanie?`
  - `Na kiedy mam najbliższy akt notarialny?`
  - `Znajdź numer do Marka.`
  - `Zapisz zadanie jutro 12 rozgraniczenie.`
- UI pokazuje tryb odpowiedzi: read / draft / no-data.
- UI pokazuje licznik rekordów w snapshotcie aplikacji.
- UI nadal używa jednego klienta Stage8: `askAssistantQueryApi()`.

## Czego nie zmieniać

- Nie tworzyć finalnych rekordów z AI bez zatwierdzenia użytkownika.
- Nie przywracać bezpośredniego `fetch('/api/assistant/query')` w komponencie.
- Nie zmieniać backendowego kontraktu Stage7.

## Gate

FAIL w checku blokuje commit/push. Build musi przejść przed buildem, commitem i pushem.

## Kryterium zakończenia

- `npm.cmd run check:stage9-ai-assistant-ui-smoke-prompts-v1` przechodzi.
- `npm.cmd run test:stage9-ai-assistant-ui-smoke-prompts-v1` przechodzi.
- Stage6 / Stage6B / Stage6D / Stage7 / Stage8 nadal przechodzą.
- `npm.cmd run build` przechodzi.
