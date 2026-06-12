# STAGE231E2_R4_TRIAL_CARD_ACCESS_SOURCE

## FAKTY Z KODU
- `src/components/Layout.tsx` renderowal sidebar TrialCard po samym `workspace?.subscriptionStatus === 'trial_active'`.
- Ten sam plik liczyl dni z `workspace.trialEndsAt` przez `differenceInDays` i hardcodowal progress jako `(safeDays / 21) * 100`.
- `src/lib/access.ts` ma juz centralne podsumowanie dostepu i liczy `trialDaysLeft` oraz `trialProgressPercent` z `TRIAL_DAYS`.
- Po zmianie produktu trial ma 14 dni, wiec sidebar nie moze miec starego mianownika 21 ani pokazywac `Trial 0 dni` dla nieaktywnego/wygaslego triala.

## DECYZJE DAMIANA
- Trial ma byc 14 dni wszedzie.
- Nie pushowac bez lokalnego PASS.
- Pracowac ZIP -> lokalny apply -> testy -> osobny selektywny push.

## HIPOTEZY
- Screenshot `TRIAL 0 DNI` wynika z tego, ze sidebar bral surowy `workspace.subscriptionStatus`, a nie finalny `access` model.
- Jezeli po tej poprawce swieze konto dalej nie pokazuje 14 dni, problem siedzi w danych `/api/me` lub `trial_ends_at` w bazie, a nie w samym komponencie sidebaru.

## AUDYT PRZED ETAPEM
- Problem widoczny dla Damiana: sidebar pokazuje `TRIAL 0 DNI`.
- Dotkniete miejsce: `src/components/Layout.tsx`.
- Powiazane zrodla: `src/lib/access.ts`, `src/lib/plans.ts`, `api/me.ts`, `src/hooks/useWorkspace.ts`.
- Zakres minimalny: tylko zrodlo danych karty trial w sidebarze + guard.
- Czego nie ruszamy: SQL, RLS, Google Calendar, billing webhook, Stripe, poprzednie Stage231D*, Visual Tile.

## CO ZMIENIONO
- Usunieto lokalne liczenie dni triala z `workspace.trialEndsAt` w `Layout.tsx`.
- Usunieto staly mianownik `21` z progress bara TrialCard.
- TrialCard dostaje teraz `trialDaysLeft`, `trialProgressPercent` i `ctaLabel` z finalnego `access` modelu.
- TrialCard renderuje sie tylko, gdy `access.isTrialActive` jest true, status to `trial_active` lub `trial_ending`, a `trialDaysLeft > 0`.
- Dodano guard `scripts/check-stage231e2-r4-trial-card-access-source.cjs`.

## TESTY / GUARDY
Do uruchomienia lokalnie:
- `node scripts/check-stage231e2-r4-trial-card-access-source.cjs`
- `node scripts/check-stage231e2-r2-trial-14d-lock.cjs`
- `node scripts/check-stage231e2-account-trial-bootstrap.cjs`
- `npm run build`
- `git diff --check`

## TEST RECZNY
- Po apply i build wejsc do aplikacji na koncie testowym.
- Oczekiwane: sidebar nie pokazuje juz `TRIAL 0 DNI`.
- Dla swiezego konta z aktywnym trialem oczekiwane: okolo 14 dni, zgodnie z `trial_ends_at`.
- Jezeli widoczny jest brak karty trial albo trial wygasl, trzeba sprawdzic response `/api/me` i wartosc `workspace.trialEndsAt`.

## AUDYT PO ETAPIE
- Przyczyna UI `Trial 0 dni` w sidebarze jest odcieta na poziomie komponentu.
- Etap nie naprawia ewentualnie blednych danych w bazie.
- Etap nie odnawia starych triali.

## RYZYKA
- Jezeli `/api/me` zwraca workspace z wygaslym albo pustym `trialEndsAt`, sidebar nie pokaze 14 dni. To bedzie poprawny sygnal, ze trzeba naprawic backend/dane, a nie zmyslac licznik w UI.
- Build nadal moze pokazywac istniejace ostrzezenie `Duplicate key savedRecord` w `ContextActionDialogs.tsx`; to osobny etap.

## OBSIDIAN PAYLOAD
- data i godzina: 2026-06-13 00:20 Europe/Warsaw
- nazwa / alias wejĹ›ciowy: STAGE231E2_R4_TRIAL_CARD_ACCESS_SOURCE
- canonical_name: CloseFlow / LeadFlow
- folder Obsidiana: 10_PROJEKTY/CloseFlow_Lead_App
- typ wpisu: hotfix UI/access source / trial 14d
- status zapisu: payload w repo `_project/runs`; Obsidian lokalny do synchronizacji

## NASTEPNY KROK
- Uruchomic guardy/build lokalnie.
- Sprawdzic konto testowe.
- Jezeli nadal nie ma 14 dni, pobrac `/api/me` response i wdrozyc R5 backend/data repair.
