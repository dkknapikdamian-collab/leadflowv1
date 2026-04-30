# ETAP 28 - Poranny digest e-mail

## Zakres

Pakiet dodaje fundament porannego digestu e-mail oraz hotfix jasnej prawej kolumny w `Szkice AI`.

## Zmiany techniczne

- `api/daily-digest.ts`
  - buduje payload planu dnia,
  - uwzględnia taski, wydarzenia, zaległe, leady i szkice AI,
  - respektuje `daily_digest_enabled`,
  - respektuje strefę czasu,
  - blokuje duplikat wysyłki tego samego dnia przez `digest_logs`,
  - dodatkowo zapisuje `last_digest_sent_at` / fallback `lastDigestSentAt`,
  - wysyła przez Resend, jeśli konfiguracja jest dostępna.

- `src/styles/hotfix-ai-drafts-right-rail-stage28.css`
  - usuwa ciemny wrapper prawej kolumny w `Szkice AI`,
  - zostawia sidebar bez zmian.

## Testy

- `tests/stage28-daily-digest-email.test.cjs`
- `tests/hotfix-ai-drafts-right-rail-stage28.test.cjs`
- `npm.cmd run check:polish`
- `npm.cmd run build`

## Ręcznie sprawdzić

1. `/ai-drafts` desktop i mobile, prawa kolumna bez czarnego tła.
2. Ustawienia digestu w `Settings`, jeśli są widoczne w aktualnym UI.
3. Endpoint `/api/daily-digest` w trybie testowym po skonfigurowaniu `RESEND_API_KEY`.
4. Brak podwójnej wysyłki tego samego dnia.
