# FAZA 3 - Etap 3.2D - Plan-based UI visibility

**Data:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Zakres:** pierwsze realne ukrywanie funkcji z wyższych planów w normalnym flow.

## Decyzja

Niższy plan nie widzi funkcji z wyższego planu w normalnej pracy.

```text
Free nie widzi AI w menu, global actions ani /ai-drafts.
Basic widzi lekkie szkice, ale nie pełnego asystenta AI.
Pro widzi lekkie szkice i integracje, ale nie pełnego asystenta AI.
AI i Trial widzą pełny AI.
```

## Dlaczego

Nie chcemy paywallowego labiryntu. Użytkownik ma widzieć proste narzędzie, a nie dziesięć martwych przycisków.

## Co robi ten etap

Ten etap blokuje najgłośniejsze powierzchnie AI w UI:

```text
src/components/Layout.tsx
src/components/GlobalQuickActions.tsx
src/components/QuickAiCapture.tsx
src/pages/AiDrafts.tsx
```

## Reguły wdrożone

### Sidebar / menu

```text
Szkice AI widoczne tylko, gdy plan ma lightDrafts albo fullAi.
```

### Global quick actions

```text
Pełny asystent AI widoczny tylko, gdy plan ma fullAi.
Szybki szkic widoczny tylko, gdy plan ma lightDrafts/lightParser/fullAi.
Link do Szkiców AI widoczny tylko, gdy plan ma lightDrafts/fullAi.
Nie pokazujemy locked AI button w normalnym flow.
```

### Quick AI Capture

```text
Komponent zwraca null poza planami z lightDrafts/lightParser/fullAi.
```

### /ai-drafts direct route

```text
Jeśli użytkownik wejdzie bezpośrednio w /ai-drafts bez uprawnienia:
- nie widzi funkcjonalnego ekranu,
- widzi jeden prosty komunikat,
- ma link do Billing.
```

## Czego etap NIE robi

Nie zmienia backendu. Backend gates zostały dodane w Etapie 3.2A.

Nie zmienia Billing plan comparison.

Nie rusza jeszcze całego Settings/Digest UI. To ma być osobny etap, bo Settings jest ciężkim ekranem i nie warto ryzykować kolejnego runtime crash.

## Kryterium zakończenia

```text
Free: brak AI w sidebar/global actions, /ai-drafts pokazuje route blocker.
Basic: brak pełnego asystenta AI, ale Szybki szkic i Szkice AI mogą być widoczne.
Pro: brak pełnego asystenta AI, Szkice AI widoczne.
AI/Trial: pełny asystent AI widoczny.
```

## Następny etap

```text
FAZA 3 - Etap 3.2E - Settings/Digest/Billing plan visibility smoke
```
