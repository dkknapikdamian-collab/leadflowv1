# Stage180F - Support sidebar/header/copy guard fix

## Cel
Naprawić realny brak zmiany widocznej po Stage180E: sidebar i nagłówek mają mówić `Zgłoszenia`, a nie `Pomoc`, oraz usunąć wskazany opis formularza.

## Fakty
- Pracujemy lokalnie na `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`.
- Branch: `dev-rollout-freeze`.
- Stage180E częściowo zmodyfikował `SupportCenter.tsx`, ale guard zatrzymał się na `layout_sidebar_not_zgloszenia`.

## Zakres
- `src/components/Layout.tsx`
- `src/components/CloseFlowPageHeaderV2.tsx`
- `src/pages/SupportCenter.tsx`
- `scripts/check-stage180f-support-sidebar-header-copy.cjs`

## Testy
- `node scripts/check-stage180f-support-sidebar-header-copy.cjs`
- `npm run build`

## Czego nie ruszano
- Supabase
- RLS
- API zgłoszeń
- deployment
- push

## Następny krok
Po wdrożeniu uruchomić dev server od nowa i sprawdzić `/help` po twardym odświeżeniu.
