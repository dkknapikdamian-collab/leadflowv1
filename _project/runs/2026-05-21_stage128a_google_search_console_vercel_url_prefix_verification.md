# 2026-05-21 - Stage128A Google Search Console Vercel URL-prefix verification

## Routing

- canonical_name: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- local path: C:\Users\malim\Desktop\biznesy_ai\2.closeflow
- public app: https://closeflowapp.vercel.app
- Obsidian folder: 10_PROJEKTY/CloseFlow_Lead_App
- entity_id/workspace_id/project_id: DO_POTWIERDZENIA

## Cel

Potwierdzić właścicielstwo URL-prefix dla `https://closeflowapp.vercel.app/` w Google Search Console bez kupowania własnej domeny na tym etapie.

## Fakty

- Google Auth Platform Branding zgłosił: `The website of your home page URL https://closeflowapp.vercel.app/ is not registered to you.`
- Damian zdecydował, że na razie nie chce własnej domeny.
- Wybrany wariant tymczasowy: Google Search Console `URL prefix`, nie `Domain`.
- Otrzymany plik weryfikacyjny: `googlee2039c1e7e1639cf.html`.
- Treść pliku: `google-site-verification: googlee2039c1e7e1639cf.html`.
- Damian potwierdził publiczny dostęp przez PowerShell: `Invoke-WebRequest` zwrócił oczekiwaną treść z produkcyjnego URL-a.
- Damian potwierdził w Google Search Console komunikat `Własność zweryfikowana`, metoda: `Plik HTML`.

## Zmiana w repo

Dodano publiczny plik weryfikacyjny:

- `public/googlee2039c1e7e1639cf.html`

## Decyzje Damiana

- Nie kupujemy teraz własnej domeny.
- Próbujemy URL-prefix verification dla `https://closeflowapp.vercel.app/`.
- Nie ruszamy importu leadów ani innych integracji przed domknięciem Google Calendar smoke.

## Testy automatyczne

Nie uruchomiono lokalnie w tym kroku, bo zmiana dotyczy wyłącznie statycznego pliku publicznego.

## Test ręczny po deployu

### Potwierdzone przez Damiana - publiczny plik

```powershell
$url = "https://closeflowapp.vercel.app/googlee2039c1e7e1639cf.html"
(Invoke-WebRequest -Uri $url -UseBasicParsing).Content
```

Wynik:

```text
google-site-verification: googlee2039c1e7e1639cf.html
```

Status: OK, plik jest dostępny publicznie z produkcji Vercel.

### Potwierdzone przez Damiana - Search Console

Google Search Console pokazało:

```text
Własność zweryfikowana
Metoda weryfikacji: Plik HTML
```

Status: OK, URL-prefix property dla `https://closeflowapp.vercel.app/` jest zweryfikowane.

## Czego nie ruszano

- Google Calendar runtime code
- Supabase schema/env
- import leadów
- Stripe
- Resend
- AI
- Supabase Storage
- landing/legal copy

## Ryzyka

- Google Auth Branding może nadal wymagać ponownego przetworzenia po kliknięciu `I have fixed the issues`.
- Jeżeli Google Auth Branding nie przyjmie URL-prefix dla `vercel.app`, trzeba wrócić do wariantu z własną domeną.

## Następny krok

1. Wrócić do Google Auth Platform Branding.
2. Wybrać `I have fixed the issues`.
3. Kliknąć `Proceed`.
4. Po akceptacji albo odświeżeniu statusu wykonać Stage128B: Google Calendar smoke po zmianie Supabase.
