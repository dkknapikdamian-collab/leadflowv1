# A15 â€” Email verification nieegzekwowane

## Decyzja

Email verification jest egzekwowane dla kont e-mail/hasĹ‚o, jeĹ›li Supabase zwraca sesjÄ™ bez potwierdzonego adresu.

Google OAuth nie jest blokowany, jeĹĽeli Supabase zwraca zweryfikowany e-mail (`email_verified`) albo potwierdzony adres (`email_confirmed_at` / `confirmed_at`).

## Co zostaĹ‚o wdroĹĽone

- `src/lib/supabase-auth.ts`
  - mapuje `email_confirmed_at`, `confirmed_at`, `email_verified`, provider i providers z Supabase Auth,
  - dodaje `isSupabaseEmailVerificationRequiredForUser`,
  - dodaje `resendEmailConfirmation`,
  - dodaje `reloadSupabaseUser`.

- `src/components/EmailVerificationGate.tsx`
  - pokazuje ekran `PotwierdĹş e-mail`,
  - ma przycisk `WyĹ›lij ponownie`,
  - ma przycisk `SprawdziĹ‚em, odĹ›wieĹĽ`,
  - pozwala wylogowaÄ‡ siÄ™ i uĹĽyÄ‡ innego konta.

- `src/App.tsx`
  - nie odpala `/api/me` dla niepotwierdzonej sesji e-mail/hasĹ‚o,
  - pokazuje gate zanim uĹĽytkownik przejdzie do peĹ‚nej aplikacji.

- `src/server/_supabase-auth.ts`
  - weryfikuje Supabase user na backendzie,
  - wylicza status potwierdzenia e-maila,
  - dodaje `assertSupabaseEmailVerifiedForMutation`,
  - zwraca `EMAIL_CONFIRMATION_REQUIRED` dla mutacji bez potwierdzonego maila.

- `src/server/_access-gate.ts`
  - blokuje mutacje na poziomie write access, jeĹ›li request pochodzi z niepotwierdzonego konta e-mail/hasĹ‚o.

- `api/*.ts`
  - wywoĹ‚ania `assertWorkspaceWriteAccess(...)` przekazujÄ… `req`, ĹĽeby backend mĂłgĹ‚ sprawdziÄ‡ email confirmation.

- `api/me.ts`
  - nie bootstrapuje workspace/profile dla niepotwierdzonego e-maila,
  - zwraca status `email_unconfirmed` i payload `emailVerification`.

## Czego nie zmieniono

- Nie mieszano tego z billingiem.
- Nie zmieniano modelu planĂłw.
- Nie blokowano odczytĂłw API przez `assertWorkspaceWriteAccess`; blokada dotyczy Ĺ›cieĹĽek mutacji.
- Nie budowano onboardingu.
- Nie dodawano migracji Supabase, bo email verification jest czÄ™Ĺ›ciÄ… Supabase Auth.

## RÄ™czne sprawdzenie

1. W Supabase Auth wĹ‚Ä…cz email confirmations dla email/password.
2. ZaĹ‚ĂłĹĽ nowe konto e-mail/hasĹ‚o.
3. Oczekiwane: aplikacja pokazuje `PotwierdĹş e-mail`.
4. Kliknij `WyĹ›lij ponownie`.
5. PotwierdĹş link w skrzynce.
6. Kliknij `SprawdziĹ‚em, odĹ›wieĹĽ`.
7. Oczekiwane: uĹĽytkownik wchodzi normalnie do aplikacji.
8. Przed potwierdzeniem sprĂłbuj wykonaÄ‡ mutacjÄ™ przez API.
9. Oczekiwane: `403` i `EMAIL_CONFIRMATION_REQUIRED`.
10. Zaloguj siÄ™ Google OAuth z verified email.
11. Oczekiwane: brak gate.

## Guard

```powershell
npm.cmd run check:a15-email-verification
```