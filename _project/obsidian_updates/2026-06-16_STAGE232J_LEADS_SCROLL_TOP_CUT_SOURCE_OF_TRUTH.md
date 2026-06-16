---
typ: obsidian_update_payload
status: prepared
scope: CloseFlow / LeadFlow
stage: STAGE232J_LEADS_SCROLL_TOP_CUT_SOURCE_OF_TRUTH
data_i_godzina: 2026-06-16 Europe/Warsaw
---

# STAGE232J_LEADS_SCROLL_TOP_CUT_SOURCE_OF_TRUTH

## Problem

Na `/leads` po lekkim scrollu w dół góra widoku zostaje ucięta i użytkownik nie może normalnie wrócić na początek.

## Decyzja

Zapisać osobny etap runtime:

```txt
STAGE232J_R1_LEADS_SCROLL_TOP_CUT_RUNTIME_FIX
```

## Kontrakt

- scroll owner musi być jawny,
- użytkownik zawsze może wrócić do pozycji 0,
- góra listy nie może być ucięta,
- fix nie może tworzyć drugiego scroll ownera,
- jeśli fix dotyka `Layout.tsx`, trzeba testować też `/clients`, `/cases`, `/today`.

## Pliki do audytu

```txt
src/components/Layout.tsx
src/pages/Leads.tsx
src/styles/closeflow-unified-page-canvas-stage211c.css
src/styles/closeflow-canvas-source-truth-stage211e.css
src/styles/closeflow-record-list-source-truth.css
src/styles/closeflow-compact-top-shell-source-truth.css
src/styles/closeflow-operator-top-trim-source-truth.css
```

## Test ręczny

1. Wejść na `/leads`.
2. Przewinąć lekko w dół.
3. Wrócić do samej góry.
4. Potwierdzić, że header/filtry/karty nie są ucięte.
5. Sprawdzić sidebar i prawy rail.
6. Jeśli ruszony globalny shell, sprawdzić `/clients`, `/cases`, `/today`.

## Status

Dodane do repo jako payload. Runtime niezmieniony.
