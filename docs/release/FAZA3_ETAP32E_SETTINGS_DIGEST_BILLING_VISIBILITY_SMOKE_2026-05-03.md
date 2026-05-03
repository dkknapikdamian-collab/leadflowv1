# FAZA 3 - Etap 3.2E - Settings/Digest/Billing plan visibility smoke

**Data:** 2026-05-03  
**Branch:** `dev-rollout-freeze`  
**Wersja:** v4 duplicate-declaration cleanup  
**Zakres:** ustawienia, digest i billing po wdrożeniu plan-based UI visibility.

## Co poprawia v4

V3 doprowadził logikę prawie do końca, ale po wcześniejszych nieudanych patchach lokalny `Settings.tsx` dostał zdublowaną deklarację:

```text
const canUseGoogleCalendarByPlan = ...
const canUseGoogleCalendarByPlan = ...
```

Guard tego nie złapał, ale build złapał prawidłowo.

V4:

```text
usuwa wszystkie deklaracje canUseGoogleCalendarByPlan / canUseDigestByPlan / digestUiVisibleByPlan
wstawia dokładnie jeden czysty blok gate'ów
dodaje guard "exactly one" dla tych deklaracji
zostawia DISABLED_BY_PLAN i ukrycie sekcji Google Calendar
```

## Decyzja produktowa

Normalny flow aplikacji nie pokazuje funkcji z wyższego planu.

Billing może pokazywać porównanie planów, bo to jest właściwe miejsce na informację sprzedażową.

## Reguły

### Settings

```text
Google Calendar w Settings jest widoczny tylko dla planów z googleCalendar.
Free i Basic nie widzą funkcjonalnych sekcji Google Calendar.
Jeśli plan nie ma googleCalendar, Settings nie odpala statusu Google Calendar w tle.
```

### Digest

```text
Digest jest funkcją od Basic.
Jeśli UI digestu jest globalnie wyłączone, zostaje ukryte.
Jeśli kiedyś UI digestu zostanie włączone, musi respektować access.features.digest.
```

### Billing

```text
Billing może pokazywać wszystkie plany i różnice między planami.
Billing nie może udawać, że Google Calendar / digest / AI działają bez konfiguracji.
Billing ma być miejscem upsellu, nie Settings ani global action bar.
```

## Kryterium zakończenia

```text
npm.cmd run check:faza3-etap32e-settings-digest-billing-visibility-smoke
node --test tests/faza3-etap32e-settings-digest-billing-visibility-smoke.test.cjs
npm.cmd run build
```

## Następny etap

```text
FAZA 3 - Etap 3.2F - backend entity limits smoke
```
