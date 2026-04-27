# CloseFlow v101/v102 - Quick AI Capture jako jedno źródło prawdy

## Cel

Po usunięciu dubli `QuickAiCapture` nie powinien być już importowany bezpośrednio w `Today.tsx` ani `Leads.tsx`.
Jedynym miejscem renderowania jest `GlobalQuickActions.tsx`, widoczny u góry aplikacji przez `Layout.tsx`.

## Kontrakt produktu

- Asystent AI, Szybki szkic, Szkice AI, Lead, Zadanie i Wydarzenie mają jedno miejsce u góry aplikacji.
- Widoki nie dublują tych samych akcji w osobnych sekcjach.
- Jeżeli dana akcja ma dodatkową logikę ekranu, zostaje w ekranie, ale sam globalny widget nie jest kopiowany.
- Quick AI Capture dalej ma bramkę bezpieczeństwa: najpierw szkic, potem ręczne zatwierdzenie jako lead.
- Tekst źródłowy zostaje widoczny przed zapisem.

## Naprawa v102

v101 przepisał test z błędnym kodowaniem polskich znaków i zbyt starym założeniem, że `Today.tsx` ma bezpośrednio konsumować Quick Capture.
V102 ustawia kontrakt zgodnie z aktualnym modelem: globalny pasek jest jedynym źródłem tej akcji.

## Po wdrożeniu uruchom

```powershell
node tests/ai-quick-capture-voice-and-today.test.cjs
node tests/ai-quick-capture-foundation.test.cjs
node tests/global-quick-actions-no-duplicates.test.cjs
node tests/global-quick-actions-toolbar-a11y.test.cjs
node scripts/check-polish-mojibake.cjs --repo . --check
npm.cmd run lint
npm.cmd run verify:closeflow:quiet
```