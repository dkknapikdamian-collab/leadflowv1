# Obsidian update - STAGE231D0C/R12 ClientDetail left rail measured axis fix

- data i godzina: 2026-06-11 HH:mm Europe/Warsaw
- project: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- marker: STAGE231D0C_R12_CLIENT_DETAIL_LEFT_RAIL_MEASURED_AXIS_FIX
- typ wpisu: measured visual CSS fix
- status: prepared by apply script, push after PASS

## Ustalenie
Poprzednie poprawki R7/R9 przechodziły technicznie, ale nie weryfikowały realnej osi DOM. Po poprawnym desktopowym pomiarze i usunięciu inline debug style ustalono:

- leftFirstTop: 173
- rightFirstTop: 200
- required delta: +27px
- computed previous margin-top: -36px
- measured final target margin-top: -9px

## Zakres
CSS-only override dla .client-detail-left-rail na desktopie. Reset na tablet/mobile.

## Czego nie ruszano
JSX, dane, SQL, koszty, wykresy, Google Calendar, CaseDetail, LeadListCard runtime, aktywna sprawa, top tiles.

## Testy
R12 guard/test, R9/R7 regressions, ClientDetail baseline, ClientListCard regression, diff check, build.

## Audyt ryzyk
Największe ryzyko: różnice wysokości przy innych szerokościach desktopu. Dlatego fix ograniczony do >=1180px, z resetem <=1179px. W razie dalszego rozjazdu następny krok to Playwright/DOM screenshot test, nie tokenowy CSS guard.
