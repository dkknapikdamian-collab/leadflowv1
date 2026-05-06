# STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1

Data: 2026-05-06  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`

## Cel

Domknąć bezpieczeństwo odpowiedzi AI po Stage3–Stage5:

- AI nie odpowiada z pustego prompta.
- AI nie zmyśla przy pustym kontekście aplikacji.
- Tryb odczytu zwraca dane tylko z aplikacji.
- Tryb zapisu nadal tworzy wyłącznie szkic do sprawdzenia.

## Problem

Po Stage5 build został naprawiony w Stage5B, ale sam operator AI nadal wymagał wyraźnej blokady jakościowej:

1. pusty prompt nie może przechodzić jako zwykłe pytanie,
2. pytanie odczytowe bez żadnych danych aplikacji nie może dostać odpowiedzi brzmiącej jak wiedza modelu,
3. odpowiedź musi mieć metadane potwierdzające politykę `app_data_only`.

## Zmienione pliki

- `src/server/ai-assistant.ts`
- `package.json`
- `scripts/check-stage6-ai-no-hallucination-data-truth.cjs`
- `tests/stage6-ai-no-hallucination-data-truth.test.cjs`
- `docs/release/STAGE6_AI_NO_HALLUCINATION_DATA_TRUTH_V1_2026-05-06.md`

## Zasada działania

Dla pustego prompta:

```text
Napisz pytanie albo komendę. Nie odpowiadam z pustego prompta.
```

Dla pytania odczytowego bez danych aplikacji:

```text
Nie mam jeszcze danych aplikacji do sprawdzenia. Dodaj albo zsynchronizuj leady, zadania, wydarzenia lub klientów.
```

Dla komend zapisu:

```text
AI nadal tworzy draft/pending_review, nie finalny rekord.
```

## Kryterium zakończenia

- `npm.cmd run check:stage6-ai-no-hallucination-data-truth-v1` przechodzi.
- `npm.cmd run test:stage6-ai-no-hallucination-data-truth-v1` przechodzi.
- `npm.cmd run build` przechodzi przed commitem i pushem.

## Ryzyko ograniczone

Ten etap ogranicza ryzyko, że asystent zabrzmi pewnie mimo braku danych. To jest ważniejsze niż efektowna odpowiedź, bo produkt ma być operatorem aplikacji, nie kreatywnym chatbotem.

## Stage6B — korekta dokumentu i gate

STAGE6B_STAGE6_DOC_AND_GATE_REPAIR_V1

- Nie odpowiada z pustego prompta.
- Nie zmyśla przy pustym kontekście.
- FAIL w checku blokuje dalsze wdrożenie przed buildem, commitem i pushem.
