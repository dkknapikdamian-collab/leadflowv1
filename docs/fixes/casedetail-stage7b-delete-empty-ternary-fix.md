# Stage 7B — CaseDetail delete empty ternary fix

## Co naprawiono

Usunięto pusty JSX ternary pozostawiony po przeniesieniu przycisku `Usuń sprawę`:

```tsx
{caseData?.id ? (

) : null}
```

## Wynik

- removals: 1
- details: empty caseData id ternary before main: 1
- deleteShortcutTokens: 0
- deleteActionTokens: 1
- confirmHandler: present

## Zakres

Nie zmieniano logiki usuwania, confirm dialogu, API ani routingu.
