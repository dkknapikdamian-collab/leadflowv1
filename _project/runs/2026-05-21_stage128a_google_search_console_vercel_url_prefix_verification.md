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

### Stan Google Auth Platform Branding

Branding nadal pokazuje warning po weryfikacji Search Console i po re-submit. To oznacza, że sam URL-prefix verification nie wystarczył w Google Auth Platform.

Najbardziej prawdopodobne przyczyny:

1. Google Auth Platform wymaga, aby domenę zweryfikował account będący Owner/Editor projektu GCP, a weryfikacja Search Console mogła zostać wykonana innym kontem.
2. Google Auth Platform wymaga domeny, którą developer realnie posiada, a `closeflowapp.vercel.app` jest subdomeną cudzej domeny `vercel.app`.
3. Authorized domains zawierają domeny Supabase `*.supabase.co`, których developer nie posiada.

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

- Google Auth Branding może nie zaakceptować `vercel.app` mimo URL-prefix verification.
- Supabase authorized domains mogą blokować pełną verification, jeśli Google wymaga ownership wszystkich domen z Authorized domains.
- Wariant bez własnej domeny może skończyć się ślepą uliczką, jeśli konto Search Console Owner/Editor check nie rozwiąże problemu.

## Następny krok

1. Sprawdzić, czy konto użyte w Search Console jest Owner/Editor w projekcie GCP `LeadFlow Auth`.
2. Jeśli nie, zweryfikować `https://closeflowapp.vercel.app/` w Search Console kontem Owner/Editor projektu GCP albo dodać to konto jako verified owner.
3. Jeżeli dalej nie przejdzie, sprawdzić czy można tymczasowo usunąć `*.supabase.co` z Authorized domains bez łamania obecnego Google Calendar OAuth flow.
4. Jeżeli dalej nie przejdzie, formalny wniosek: potrzebna własna domena dla produkcyjnego brandingu Google Auth.
5. Po rozwiązaniu Stage128A wykonać Stage128B: Google Calendar smoke po zmianie Supabase.