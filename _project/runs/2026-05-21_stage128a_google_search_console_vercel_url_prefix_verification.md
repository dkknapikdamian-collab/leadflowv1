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
- Po powrocie do Google Auth Platform Branding status nadal pokazuje ostrzeżenie: `Your branding is not being shown to users. Resolve the following issues and verify again.`
- Po re-submit Google Auth Platform nadal zgłasza ten sam problem: homepage URL `https://closeflowapp.vercel.app/` is not registered to you.
- W Authorized domains widoczne są: stary Supabase project ref `ydntsbkiqwkabhjjlkew.supabase.co`, `closeflowapp.vercel.app`, nowy Supabase project ref `amrxiaetdocrywnnkoct.supabase.co`.
- Screenshot z błędem `Invalid supabaseUrl` dotyczył innej aplikacji i nie jest dowodem problemu CloseFlow.
- Damian wskazał, że przed zmianą Supabase verification działało, więc priorytetem jest powtórzenie verification właściwym kontem Google, nie zmiana domeny ani kodu.
- Na poprawnym koncie Google / kolejnej próbie otrzymano drugi plik weryfikacyjny: `google0065f9274e496286.html`.
- Drugi plik weryfikacyjny został dodany do repo jako `public/google0065f9274e496286.html`.

## Zmiana w repo

Dodano publiczne pliki weryfikacyjne:

- `public/googlee2039c1e7e1639cf.html`
- `public/google0065f9274e496286.html`

## Decyzje Damiana

- Nie kupujemy teraz własnej domeny.
- Próbujemy URL-prefix verification dla `https://closeflowapp.vercel.app/`.
- Nie ruszamy importu leadów ani innych integracji przed domknięciem Google Calendar smoke.
- Następna próba ma być wykonana na poprawnym koncie Google, które zarządza projektem OAuth / Google Cloud.
- Nie usuwamy pierwszego pliku weryfikacyjnego, bo może utrzymywać poprzednią własność Search Console.

## Testy automatyczne

Nie uruchomiono lokalnie w tym kroku, bo zmiana dotyczy wyłącznie statycznych plików publicznych.

## Test ręczny po deployu

### Potwierdzone przez Damiana - pierwszy publiczny plik

```powershell
$url = "https://closeflowapp.vercel.app/googlee2039c1e7e1639cf.html"
(Invoke-WebRequest -Uri $url -UseBasicParsing).Content
```

Wynik:

```text
google-site-verification: googlee2039c1e7e1639cf.html
```

Status: OK, pierwszy plik jest dostępny publicznie z produkcji Vercel.

### Do sprawdzenia po deployu - drugi publiczny plik

```powershell
$url = "https://closeflowapp.vercel.app/google0065f9274e496286.html"
(Invoke-WebRequest -Uri $url -UseBasicParsing).Content
```

Oczekiwany wynik:

```text
google-site-verification: google0065f9274e496286.html
```

### Potwierdzone przez Damiana - Search Console pierwsza próba

Google Search Console pokazało:

```text
Własność zweryfikowana
Metoda weryfikacji: Plik HTML
```

Status: OK, URL-prefix property dla `https://closeflowapp.vercel.app/` było zweryfikowane na pierwszym koncie / pierwszym kontekście.

### Stan Google Auth Platform Branding

Branding nadal pokazał warning po pierwszej weryfikacji Search Console i po re-submit. To oznaczało, że URL-prefix verification wykonany w pierwszym kontekście nie został uznany przez Google Auth Platform.

Najbardziej prawdopodobne przyczyny po korekcie kontekstu:

1. Google Auth Platform wymaga, aby domenę zweryfikował account będący Owner/Editor projektu GCP, a weryfikacja Search Console została wykonana innym kontem.
2. Google Auth Platform może czytać verification per konto / per project owner, więc trzeba powtórzyć Search Console URL-prefix verification na właściwym koncie Google.
3. Dopiero jeśli poprawne konto nie pomoże, wraca hipoteza, że `vercel.app` nie wystarczy dla finalnego brandingu.

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

- Google Auth Branding może nie zaakceptować `vercel.app` mimo URL-prefix verification, ale to nie jest jeszcze główny wniosek.
- Najpierw trzeba wykluczyć błąd konta Google.
- Supabase authorized domains zostają na razie bez zmian do pełnego smoke, żeby nie popsuć callbacków / OAuth flow.

## Następny krok

1. Poczekać na deploy Vercel z drugim plikiem.
2. Sprawdzić URL `https://closeflowapp.vercel.app/google0065f9274e496286.html`.
3. W Search Console na poprawnym koncie kliknąć `Verify` dla URL-prefix property `https://closeflowapp.vercel.app/`.
4. W tym samym koncie wrócić do Google Auth Platform Branding.
5. Kliknąć `View issues` -> `I have fixed the issues` -> `Proceed`.
6. Jeśli przejdzie, wykonać Stage128B: Google Calendar smoke po zmianie Supabase.
7. Jeśli nie przejdzie, dopiero wtedy rozważyć własną domenę albo czyszczenie Authorized domains.