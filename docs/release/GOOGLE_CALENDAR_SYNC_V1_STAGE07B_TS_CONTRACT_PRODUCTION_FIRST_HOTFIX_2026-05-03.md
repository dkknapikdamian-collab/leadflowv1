# Google Calendar Sync V1 - Stage 07b TS Contract + Production-First Hotfix v2

## Cel

NaprawiÄ‡ TypeScript contract Google Calendar po Stage 05/06 oraz zapisaÄ‡ zasadÄ™ production-first.

## Problem

Vercel pokazaĹ‚ bĹ‚Ä…d:

```text
api/work-items.ts(...): Type 'string' is not assignable to type 'GoogleReminderMethod'
```

PowĂłd: `googleReminderMethodFrom` zwracaĹ‚ surowy `string`, a `google-calendar-sync.ts` oczekuje unii:

```text
'default' | 'popup' | 'email' | 'popup_email'
```

## Naprawa

- `api/work-items.ts`
  - dodano lokalny typ `GoogleReminderMethod`,
  - `googleReminderMethodFrom` zwraca `GoogleReminderMethod | null`,
  - aliasy `popup+email` i `both` sÄ… normalizowane do `popup_email`,
  - brak metody zwraca `null`, nie pusty string.
- `scripts/check-google-calendar-stage06-reminder-method-ui.cjs`
  - guard Stage 06 zaktualizowany do nowego typed contract.
- `docs/architecture/PRODUCTION_FIRST_INTEGRATION_RULE_2026-05-03.md`
  - zapisano zasadÄ™ production-first,
  - dopisano wyjÄ…tek dla providerĂłw blokujÄ…cych publikacjÄ™ do czasu verification.

## RĂłĹĽnica v2

v1 naprawiaĹ‚ kod, ale stary guard Stage 06 nadal wymagaĹ‚ tekstu:

```text
googleReminderMethodFrom(row, body) || null
```

v2 aktualizuje ten guard do nowego typed contract:

```text
googleReminderMethodFrom(row, body)
```

## Bez zmian

- Brak nowego `api/*.ts`.
- Brak SQL.
- Brak zmiany statusu Google Calendar z `requires_config` na `active`.
