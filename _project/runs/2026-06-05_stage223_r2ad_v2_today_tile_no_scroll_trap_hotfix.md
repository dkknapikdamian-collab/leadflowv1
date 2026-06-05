# STAGE223 R2AD V2 - Today tile no-scroll trap hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

R2AD V1 nie zaaplikował się lokalnie.

Błąd:

```text
TodayStable marker anchor missing
```

Przyczyna: patcher V1 szukał zbyt dokładnego anchora tekstowego w `TodayStable.tsx`. Lokalny plik różnił się od oczekiwanego układu.

## ZAKRES V2

- Wstawia marker po importach, bez kruchego anchora.
- Wyłącza automatyczne `scrollIntoView`.
- Wyłącza reordering DOM przez `insertBefore`.
- Kafelki Today robią expand/collapse w miejscu.
- Top tile ignorowany przez globalne click bridges.
- Dodaje/utrzymuje guard `scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`.

## TESTY

```powershell
node scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs
node scripts/check-stage223-owner-movement-risk-system.cjs
node --test tests/stage223-owner-movement-risk-system.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
```

## TEST RĘCZNY

- `/today`: kliknąć wszystkie kafelki górne.
- Sprawdzić, że ekran nie skacze w dół.
- Sprawdzić, że można normalnie wrócić na samą górę.
- Sprawdzić dolne nagłówki sekcji i strzałki rozwijania.
- Zmienić kartę przeglądarki i wrócić — bez agresywnego odświeżania/scroll trap.

## AUDYT RYZYK

- To naprawa behavioru Today, nie nowy etap funkcjonalny.
- Usuwamy wcześniejszy mechanizm „przenieś aktywną sekcję na górę”.
- Ręczny smoke `/today` jest obowiązkowy przed pushem.
