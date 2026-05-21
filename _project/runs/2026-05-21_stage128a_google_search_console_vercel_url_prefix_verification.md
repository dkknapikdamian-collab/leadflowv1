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
- Po re-submit Google Auth Platform nadal zgłaszał ten sam problem: homepage URL `https://closeflowapp.vercel.app/` is not registered to you.
- W Authorized domains widoczne są: stary Supabase project ref `ydntsbkiqwkabhjjlkew.supabase.co`, `closeflowapp.vercel.app`, nowy Supabase project ref `amrxiaetdocrywnnkoct.supabase.co`.
- Screenshot z błędem `Invalid supabaseUrl` dotyczył innej aplikacji i nie jest dowodem problemu CloseFlow.
- Damian wskazał, że przed zmianą Supabase verification działało, więc priorytetem jest powtórzenie verification właściwym kontem Google, nie zmiana domeny ani kodu.
- Na poprawnym koncie Google / kolejnej próbie otrzymano drugi plik weryfikacyjny: `google0065f9274e496286.html`.
- Drugi plik weryfikacyjny został dodany do repo jako `public/google0065f9274e496286.html`.
- Google Auth Platform pokazał status: `Your branding has been verified, but is not yet being shown to users. Publish it before the verified result expires in 7 days.`

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

### Potwierdzone przez Damiana - Google Auth Platform Branding

Google Auth Platform pokazał:

```text
Your branding has been verified, but is not yet being shown to users. Publish it before the verified result expires in 7 days.
```

Status: OK, branding jest zweryfikowany. Pozostał krok publikacji.

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

- Jeśli branding nie zostanie opublikowany w ciągu 7 dni, zweryfikowany wynik może wygasnąć.
- Supabase authorized domains zostają na razie bez zmian do pełnego smoke, żeby nie popsuć callbacków / OAuth flow.

## Następny krok

1. Kliknąć `Publish branding` w Google Auth Platform.
2. Po publikacji wykonać Stage128B: Google Calendar smoke po zmianie Supabase.
3. Smoke minimum:
   - `/settings` Google Calendar status,
   - connect/reconnect,
   - CloseFlow -> Google Calendar,
   - Google Calendar -> CloseFlow,
   - update/delete tylko jeśli obecna implementacja wspiera.
4. Wynik Stage128B zapisać do `_project/runs` i Obsidiana.