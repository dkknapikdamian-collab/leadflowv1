# Google Calendar OAuth Setup - CloseFlow

## Publiczny endpoint

UI oraz Google OAuth uzywaja publicznego adresu:

```text
/api/google-calendar
```

Technicznie na Vercel Hobby endpoint jest skonsolidowany:

```text
/api/google-calendar -> /api/system?kind=google-calendar
```

Nie zmieniaj redirect URI na `/api/system`. Publiczny redirect ma zostac na `/api/google-calendar?route=callback`.

## Production redirect URI

```text
https://closeflowapp.vercel.app/api/google-calendar?route=callback
```

## Preview redirect URI

Dla preview trzeba dodac osobny redirect URI z dokladna domena preview, jezeli testujesz OAuth na preview.

Przyklad:

```text
https://twoj-preview-url.vercel.app/api/google-calendar?route=callback
```

## ENV

```text
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
GOOGLE_REDIRECT_URI
GOOGLE_TOKEN_ENCRYPTION_KEY
GOOGLE_OAUTH_STATE_SECRET
```

## Status w aplikacji

Panel Ustawienia -> Google Calendar pokazuje:

- brakujace ENV,
- gotowosc do polaczenia,
- polaczenie aktywne,
- opcje rozlaczenia.

## Typowy blad

`redirect_uri_mismatch`

Oznacza, ze Google Cloud ma inny redirect URI niz Vercel ENV.

## Bezpieczenstwo

Tokeny OAuth sa przechowywane po stronie backendu jako ciphertext.

Nie przenosic tokenow do frontendu.
Nie dodawac Google Client Secret jako `VITE_*`.
