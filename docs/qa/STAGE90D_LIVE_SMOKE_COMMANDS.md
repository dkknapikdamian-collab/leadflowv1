# Stage90D - LIVE SMOKE COMMANDS

Status: READY_TO_RUN_AFTER_DEPLOY  
Date: 2026-05-05  
Package: CUMULATIVE_STAGE90F

## Cel

Dodać bezpieczny runner środowiskowy dla Etapów 13/14/15.

Ten runner nie zastępuje ręcznego testu browser notification i nie odpala mailowego digestu domyślnie. To celowe. Nie chcemy przypadkiem wysłać maili tylko dlatego, że test robi ping.

## Kiedy uruchomić

Po tym, jak Vercel skończy deploy commita ze Stage90D.

## Komenda z URL preview/production

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
$env:RELEASE_PREVIEW_URL="https://TWOJ-ADRES-VERCEL"
npm.cmd run stage90d:live-smoke
```

## Co sprawdza automatycznie

- root aplikacji odpowiada,
- manifest/PWA endpoint jest dostępny, jeśli istnieje,
- service worker jest dostępny, jeśli istnieje,
- portal bez tokenu nie daje dostępu,
- storage upload bez tokenu nie daje dostępu,
- wynik zapisuje do `docs/qa/STAGE90D_LIVE_SMOKE_RESULT.latest.md`.

## Czego nie robi automatycznie

- nie klika w przeglądarce zgody na powiadomienia,
- nie sprawdza browser notification wizualnie,
- nie uruchamia daily digest mailowego domyślnie,
- nie uploaduje prawdziwego pliku,
- nie używa żadnych sekretów.

## Manualne punkty po runnerze

Etap 13:

- sprawdź toast w aplikacji,
- sprawdź browser notification po zgodzie,
- sprawdź PWA/service worker w DevTools,
- sprawdź Vercel Cron logs dla `/api/daily-digest`,
- sprawdź Resend delivery albo bezpieczny testowy dry-run.

Etap 14:

- otwórz portal bez tokenu: ma blokować,
- otwórz portal z tokenem: ma działać,
- zrób upload poprawnego pliku,
- zrób upload złego pliku: ma blokować,
- potwierdź brak publicznego listowania bucketu.

Etap 15:

- wypełnij `docs/qa/CHECKLISTA_QA_PRZYCISKOW_CLOSEFLOW_2026-05-05.md`,
- każde FAIL/PENDING z priorytetem zamień w osobny etap naprawczy.


## Stable safety markers for guards

```text
DIGEST_ROUTE_NOT_CALLED_BY_DEFAULT=True
NO_SECRET_VALUES_WRITTEN=True
NO_REAL_UPLOAD_PERFORMED=True
NO_AUTH_TOKEN_USED=True
```

Te markery są celowo po angielsku/ASCII, żeby guardy nie łamały się na odmianie polskiego tekstu albo kodowaniu.
