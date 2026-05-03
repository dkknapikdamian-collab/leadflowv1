# FAZA 3 - Etap 3.2C HOTFIX v3 - Access gate runtime syntax

**Data:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Zakres:** finalny P0 hotfix po 500 / FUNCTION_INVOCATION_FAILED.

## Co poszło źle

Po Etapie 3.2A/3.2B backend zaczął zwracać 500 dla wielu endpointów, bo `_access-gate.ts` dostał osierocony fragment starej funkcji.

Hotfix v1/v2 miały dodatkowy problem: guard szukał tekstu:

```text
}, planInput?: unknown) {
```

Ten tekst może wystąpić także w poprawnej sygnaturze:

```text
workspaceInput: unknown = {}, planInput?: unknown
```

To dawało false-positive.

## Naprawa v3

V3 robi pełne czyszczenie:

1. przebudowuje cały blok `assertWorkspaceFeatureAccess` + `assertWorkspaceAiAllowed`,
2. ustawia `assertWorkspaceAiAllowed` w formie multiline, żeby guard nie mylił poprawnego default `{}` z osieroconym ogonem,
3. usuwa niedokończone artefakty hotfix v1/v2 z package/quiet,
4. dodaje precyzyjny guard v3.

## Docelowy kod

```text
assertWorkspaceFeatureAccess
assertWorkspaceAiAllowed
normalizeLimitKey
```

W tej kolejności, bez starego fragmentu:

```text
const row = asRecord(workspace)
status === 'paid_active' ... plan === 'pro'
```

## Kryterium zakończenia

- brak osieroconego ogona starej funkcji,
- dokładnie jedna funkcja `assertWorkspaceFeatureAccess`,
- dokładnie jedna funkcja `assertWorkspaceAiAllowed`,
- AI gate używa `fullAi`,
- Pro nie odblokowuje pełnego AI,
- build przechodzi,
- push przechodzi.
