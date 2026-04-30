# Stage 30A - Mobile contrast lock + TypeScript continuity hotfix

## Cel

Naprawia kontrast mobilny po stronie shella, globalnych szybkich akcji, dolnej nawigacji, prawego menu mobilnego, kafelków `Dziś`, dropdownów i dialogów.

## Zakres

- `src/styles/stage30a-mobile-contrast-lock.css`
- import tej warstwy na końcu `src/index.css`
- kompatybilne markery dla starych guardów `Leads` i `Today`
- drobny hotfix TypeScript dla wcześniejszych etapów:
  - `api/daily-digest.ts`: przywrócony helper `getDigestEnabledSetting`
  - `src/pages/NotificationsCenter.tsx`: przywrócone importy snooze

## Nie zmieniono

- routingu
- auth
- API danych
- cache PWA
- logiki AI
- powiadomień push natywnych

## Walidacja

Skrypt uruchamia:

- `node scripts/check-stage30a-mobile-contrast.cjs`
- `node scripts/check-stage30a-ts-continuity.cjs`
- guardy `Leads` i `Today`, jeśli istnieją
- `node scripts/check-polish-mojibake.cjs`, jeśli istnieje
- `npm.cmd run lint`
- `npm.cmd run build`

Commit i push wykonują się tylko po zielonych testach.
