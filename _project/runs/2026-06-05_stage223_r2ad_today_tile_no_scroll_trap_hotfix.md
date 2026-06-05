# STAGE223 R2AD - Today tile no-scroll trap hotfix

Data: 2026-06-05
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
Tryb: ZIP/local-only, bez commita i bez push

## FAKTY

Użytkownik zgłosił produkcyjnie problem na `/today`: po kliknięciu części kafelków widok skakał w dół i zostawał w stanie, w którym nie dało się normalnie wrócić do pełnej góry ekranu.

Audyt kodu wskazał ryzyko:

- `scrollToTodaySection` wykonywał `scrollIntoView({ behavior: 'smooth', block: 'start' })`,
- `moveTodaySectionToTop` wykonywał `parent.insertBefore(...)`,
- kliknięcie kafelka było obsługiwane kilkoma ścieżkami: onClick + root listener + window capture listener.

## ZAKRES

R2AD:

- wyłącza automatyczne `scrollIntoView` na Today,
- wyłącza reordering DOM sekcji przez `insertBefore`,
- zmienia top tile click na expand/collapse w miejscu,
- dodaje `data-cf-today-no-scroll-trap="true"`,
- ignoruje section headers w globalnym click bridge,
- dodaje guard `scripts/check-stage223-r2ad-today-tile-no-scroll-trap.cjs`,
- dodaje package script `check:stage223-r2ad-today-tile-no-scroll-trap`.

## CZEGO NIE RUSZANO

- Stage224.
- Redesign Today.
- Owner Movement Risk logic.
- Supabase.
- Daily digest.
- `/api/activities`.
- Calendar/Cases/Leads poza Today.

## TESTY AUTOMATYCZNE

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

- Usuwamy wcześniejsze zachowanie „przenieś aktywną sekcję na górę”. To jest świadoma decyzja po screenach, bo ten mechanizm powodował scroll-trap.
- Jeśli później ma wrócić szybkie przejście do sekcji, trzeba zrobić je bez reordera DOM i bez `scrollIntoView` na całej stronie.

## NASTĘPNY KROK

Po zielonych testach odpalić lokalnie `npm run dev`, sprawdzić `/today`, potem push po akceptacji.
