# A15 - Email verification nieegzekwowane

## Cel

Email verification jest egzekwowane dla kont e-mail/hasło, jeśli Supabase zwraca sesję bez potwierdzonego adresu.

Google OAuth nie jest blokowany, jeżeli Supabase zwraca zweryfikowany e-mail (`email_verified`) albo potwierdzony adres (`email_confirmed_at` / `confirmed_at`).

## Co zostało wdrożone

- Dodano ekran `Potwierdź e-mail`.
- Dodano przycisk `Wyślij ponownie`.
- Dodano przycisk `Sprawdziłem, odśwież`.
- Backend blokuje mutacje kodem `EMAIL_CONFIRMATION_REQUIRED`.
- Odczyty nie są blokowane, jeśli nie trzeba.
- Google OAuth z verified email nie jest blokowany.

## Czego nie zmieniano

- Nie zmieniano billingów.
- Nie zmieniano modelu planów.
- Nie budowano rozbudowanego onboardingu.
- Nie dodawano migracji Supabase, bo email verification jest częścią Supabase Auth.

## Ręczne sprawdzenie

1. W Supabase Auth włącz email confirmations dla email/password.
2. Załóż nowe konto e-mail/hasło.
3. Oczekiwane: aplikacja pokazuje `Potwierdź e-mail`.
4. Kliknij `Wyślij ponownie`.
5. Potwierdź link w skrzynce.
6. Kliknij `Sprawdziłem, odśwież`.
7. Oczekiwane: użytkownik wchodzi normalnie do aplikacji.
8. Przed potwierdzeniem spróbuj wykonać mutację przez API.
9. Oczekiwane: API zwraca `EMAIL_CONFIRMATION_REQUIRED`.
10. Zaloguj się Google OAuth z verified email.
