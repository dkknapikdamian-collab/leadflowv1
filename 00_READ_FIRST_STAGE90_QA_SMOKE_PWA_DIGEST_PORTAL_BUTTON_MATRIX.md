# READ FIRST - Stage90 QA smoke plan: PWA/Digest/Portal/Button Matrix

Status: QA_SMOKE_REQUIRED  
Date: 2026-05-05  
Branch: dev-rollout-freeze  
Package: CUMULATIVE_STAGE90F

## Zakres

Ten etap nie udaje testu live. Dodaje twardy pakiet kontrolny dla:

1. Powiadomienia / PWA / daily digest / Resend / Vercel cron.
2. Portal klienta / tokeny / storage upload / brak dostępu bez tokenu.
3. Button Matrix QA dla realnych przycisków.

## Zasada

Kod i guardy nie są dowodem, że mail, push i upload działają w środowisku.

Dowód dopiero wtedy, gdy powstanie evidence file z wynikiem środowiskowym oraz ręcznym smoke testem tam, gdzie browser/Supabase/Vercel wymagają realnej aplikacji.

## Naprawa Stage90C

Stage90B zatrzymał się na zbyt sztywnym guardzie:

- interval 60 sekund nie wykrywał zapisu `60_000`,
- storage/portal był szukany tylko w kilku plikach, a projekt może mieć rozproszone helpery.

Stage90C skanuje repo szerzej i akceptuje realne warianty zapisu bez udawania live-pass.

## Następny operator

Zanim uznasz Etap 13/14/15 za DONE, uruchom:

```powershell
npm.cmd run verify:stage90-env-portal-button-qa
```

Potem uzupełnij checklistę:

- `docs/qa/STAGE90_ENV_SMOKE_EVIDENCE.latest.md`
- `docs/qa/CHECKLISTA_QA_PRZYCISKOW_CLOSEFLOW_2026-05-05.md`

Nie oznaczaj live mail/push/upload jako DONE tylko na podstawie statycznego kodu.


## Stage90D live smoke runner

Dodano runner, który po deployu może wykonać bezpieczny smoke po publicznym URL bez sekretów.

Ważne:

- runner nie odpala daily digest domyślnie, żeby nie wysłać przypadkowego maila,
- digest/Resend nadal wymaga potwierdzenia w Vercel logs albo bezpiecznego dry-run endpointu,
- portal/storage smoke sprawdza brak dostępu bez tokenu i dostępność publicznego runtime,
- wynik zapisuje się do `docs/qa/STAGE90D_LIVE_SMOKE_RESULT.latest.md`.


Compatibility markers: CUMULATIVE_STAGE90C CUMULATIVE_STAGE90D CUMULATIVE_STAGE90E


## Stage90E guard compatibility

Stage90D nie przeszedł, bo stary guard Stage90C sprawdzał literalnie `CUMULATIVE_STAGE90C`, a read-first został podniesiony do `CUMULATIVE_STAGE90D`.

Stage90E naprawia ten błąd:

- read-first zachowuje markery kompatybilności C/D/E,
- guard akceptuje C/D/E,
- evidence writer zapisuje `CUMULATIVE_STAGE90E`,
- runner live smoke zostaje bez zmian funkcjonalnych.


## Stage90F digest doc guard fix

Stage90E przeszło Stage90 env guard, ale zatrzymało się na live smoke runner guardzie:

`commands doc must state digest is not auto-called`

Przyczyna: guard oczekiwał kruchego zdania po polsku. Stage90F dodaje stabilny marker:

`DIGEST_ROUTE_NOT_CALLED_BY_DEFAULT=True`

i zmienia guard na semantyczny, odporny na zmianę tekstu.
