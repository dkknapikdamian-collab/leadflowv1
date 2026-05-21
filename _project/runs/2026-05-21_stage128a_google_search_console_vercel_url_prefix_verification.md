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

Po deployu Vercel sprawdzić:

```text
https://closeflowapp.vercel.app/googlee2039c1e7e1639cf.html
```

Oczekiwany tekst:

```text
google-site-verification: googlee2039c1e7e1639cf.html
```

Następnie wrócić do Google Search Console i kliknąć `Verify` dla URL-prefix property `https://closeflowapp.vercel.app/`.

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

- Google może nadal preferować własną domenę przy finalnym branding verification, mimo poprawnego URL-prefix verification.
- Jeżeli Vercel nie zdeployuje brancha `dev-rollout-freeze` na produkcję, plik nie będzie dostępny pod publicznym URL-em.

## Następny krok

1. Poczekać na deploy Vercel.
2. Otworzyć publiczny URL pliku.
3. Kliknąć `Verify` w Google Search Console.
4. Po sukcesie wrócić do Google Auth Platform Branding i kliknąć `I have fixed the issues`.
5. Potem wykonać Stage128B: Google Calendar smoke po zmianie Supabase.
