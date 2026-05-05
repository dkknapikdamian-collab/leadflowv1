# READ FIRST - Stage90 QA smoke plan: PWA/Digest/Portal/Button Matrix

Status: QA_SMOKE_REQUIRED  
Date: 2026-05-05  
Branch: dev-rollout-freeze  
Package: CUMULATIVE_STAGE90C

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
