# ClientPilot — konfiguracja maili

## Rozdzielenie maili

W projekcie są dwa osobne tory:

1. **Maile auth**
   - potwierdzenie e-mail
   - reset hasła
   - ponowne wysłanie potwierdzenia
   - wychodzą z **Supabase Auth**
   - wymagają ustawienia **custom SMTP w panelu Supabase**

2. **Maile statusowe konta**
   - trial kończy się za 3 dni
   - trial kończy się jutro
   - konto aktywne do dnia X
   - plan wygasł
   - płatność nieudana
   - wychodzą z **aplikacji ClientPilot** przez **Resend**

## 1. Supabase Auth — custom SMTP

W panelu Supabase ustaw własny SMTP zamiast domyślnego.

Do panelu Supabase wpisujesz dane z `.env`:
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_SECURE`
- `MAIL_FROM`

To jest konfiguracja **panelowa**, nie kodowa.

## 2. Maile statusowe — konfiguracja aplikacji

Uzupełnij env aplikacji:

- `MAIL_FROM`
- `RESEND_API_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `CRON_SECRET`

## 3. Migracje SQL

Uruchom kolejno:

```text
supabase/001_init.sql
supabase/002_workspace_access_model.sql
supabase/003_access_status_bonus.sql
supabase/004_system_email_events.sql
```

## 4. Endpoint do statusowych maili

Endpoint:

```text
GET /api/system/account-status-emails
POST /api/system/account-status-emails
```

Autoryzacja:
- `Authorization: Bearer <CRON_SECRET>`
- albo `x-cron-secret: <CRON_SECRET>`
- albo testowo `?key=<CRON_SECRET>`

## 5. Jak przetestować ręcznie

### Trial za 3 dni
1. ustaw w `access_status`:
   - `access_status = trial_active`
   - `trial_end` = dziś + 3 dni
2. wywołaj endpoint cron
3. sprawdź, czy mail został wysłany
4. sprawdź wpis w `system_email_events`

### Trial jutro
1. ustaw `trial_end` = jutro
2. wywołaj endpoint cron
3. sprawdź mail i `system_email_events`

### Plan aktywny do dnia X
1. ustaw `access_status = paid_active`
2. ustaw `paid_until` w przyszłości
3. wywołaj endpoint cron

### Plan wygasł
1. ustaw `access_status = trial_expired`
   albo
   `paid_active` z `paid_until` w przeszłości
2. wywołaj endpoint cron

### Płatność nieudana
1. ustaw `access_status = payment_failed`
2. wywołaj endpoint cron

## 6. Deduplikacja

Wysłane maile trafiają do `system_email_events` z `dedupe_key`.
Dzięki temu ten sam mail statusowy nie poleci drugi raz po kolejnym uruchomieniu cron.

