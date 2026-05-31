# STAGE212A - Visual Foundation Reset + Polish Encoding Guard

## Cel
Utworzyć jeden runtime source truth dla tła aplikacji CloseFlow oraz zatrzymać mojibake w widocznych etykietach UI.

## Fakty z audytu
- Poprzednie etapy przechodziły build i guard, ale runtime nadal pokazywał rozjazd warstw.
- Runtime mapa pokazała konkurujące tła: #f8fafc, #f3f6fb, białe/półprzezroczyste karty i lokalne gradienty.
- Sidebar pokazał mojibake w etykietach, np. DziÅ› / AktywnoÅ›Ä‡ / ZgÅ‚oszenia.

## Decyzja
- Canvas aplikacji: #f1f5f9.
- Karty/surface: #ffffff.
- Soft surface: #f8fafc.
- Runtime style tag wygrywa z lazy CSS chunks.
- Sidebar zostaje ciemny; naprawiono aktywną ikonę nav przez ograniczony override.

## Zmienione pliki
- scripts/check-stage212a-visual-foundation-reset.cjs
- src/App.tsx
- src/components/Layout.tsx
- src/components/VisualFoundationRuntime.tsx
- src/hooks/useWorkspace.ts
- src/index.css
- src/styles/closeflow-calendar-selected-day-new-tile-v9.css
- src/styles/closeflow-visual-foundation-source-truth-stage212a.css

## Testy
- node scripts/check-stage212a-visual-foundation-reset.cjs
- npm run build

## Czego nie ruszano
- Supabase
- RLS
- routing
- dane
- formularze
- deployment
- push

## Następny krok
Restart dev servera, Ctrl+F5, kontrola tła i polskich znaków na: /, /calendar, /activity, /ai-drafts, /notifications, /billing, /help, /settings.
