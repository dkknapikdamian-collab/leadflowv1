# P13 Digest / PWA / notification runtime QA

## Cel

Przypomnienia, digest e-mail, raport tygodniowy i PWA mają działać jako realne funkcje produkcyjne, a nie jako atrapy w UI.

## Zakres wdrożenia

- Daily digest zostaje blokowany dla planu `free` na poziomie backendu.
- Weekly report zostaje blokowany dla planu `free` na poziomie backendu.
- Daily digest domyślnie respektuje godzinę i timezone workspace przez `DIGEST_ENFORCE_WORKSPACE_HOUR=true` jako zachowanie domyślne w kodzie.
- Crony raportują `skippedPlan`, żeby było widać, ile workspace zostało pominiętych przez plan.
- Centrum Powiadomień nie pokazuje już komunikatu, że digest jest dopiero kolejnym etapem.
- Service worker ma jasny marker, że API, auth, REST i Storage idą network-only i nie są agresywnie cache'owane.
- Dodano guard `check:p13-digest-pwa-notifications-qa`.

## Pliki

- `src/server/daily-digest-handler.ts`
- `src/server/weekly-report-handler.ts`
- `src/pages/NotificationsCenter.tsx`
- `public/service-worker.js`
- `scripts/check-p13-digest-pwa-notifications-qa.cjs`
- `package.json`

## Vercel env do sprawdzenia

```env
RESEND_API_KEY=
DIGEST_FROM_EMAIL=
CRON_SECRET=
APP_URL=https://closeflowapp.vercel.app
DIGEST_ENFORCE_WORKSPACE_HOUR=true
```

## Testy

```bash
npm run check:p13-digest-pwa-notifications-qa
npm run check:a28-digest-notifications-pwa
npm run check:polish-mojibake
```

## Kryterium zakończenia

- Ustawienia digestu są widoczne w aplikacji.
- Test digestu działa tylko dla planów innych niż `free`.
- Cron digestu nie wysyła duplikatów dzięki `digest_logs`.
- Weekly report ma osobny `report_type = weekly`.
- PWA da się dodać do ekranu telefonu.
- Service worker nie cache'uje `/api/`, Supabase REST, auth ani Storage.
