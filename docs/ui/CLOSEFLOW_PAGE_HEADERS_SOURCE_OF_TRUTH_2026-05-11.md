# CloseFlow — Page Headers Source of Truth — 2026-05-11

## Cel

Wdrożyć jedno źródło prawdy dla nagłówków zakładek:
- tytuł,
- kicker/pigułka,
- opis,
- kolory przycisków w nagłówku.

## Zakres

Dotyczy:
- Leady
- Klienci
- Sprawy
- Zadania
- Kalendarz
- Szablony spraw
- Szablony odpowiedzi
- Aktywność
- Szkice AI
- Powiadomienia
- Rozliczenia
- Pomoc
- Ustawienia
- Admin AI

## Decyzja wizualna

- Główne CTA: niebieski / indigo.
- AI: fioletowo-indygo.
- Neutralne akcje: jasne, slate.
- Danger/kosz: czerwony.
- Zielony nie jest kolorem CTA. Zostaje tylko dla statusu sukcesu / gotowe / wykonane.

## Jedno źródło prawdy

### Treść

`src/lib/page-header-content.ts`

### Runtime podpinający nagłówki

`src/components/CloseFlowPageHeaderRuntime.tsx`

### Wygląd nagłówków

`src/styles/closeflow-page-header.css`

### Kolory przycisków

`src/styles/closeflow-action-tokens.css`

## Dlaczego runtime, a nie ręczna podmiana każdego nagłówka

Obecne ekrany mają różne struktury nagłówków:
- `.page-head`
- `header.support-header`
- `header.billing-header`
- `section.cf-page-hero`
- lokalne header flexy z Tailwind

Runtime podpina opis i klasy akcji bez dotykania logiki ekranów, przycisków, formularzy, route’ów ani pozycji elementów.

## Nie ruszać

- nie zmieniać logiki przycisków,
- nie zmieniać routingu,
- nie zmieniać położenia modali ani nagłówków,
- nie zmieniać danych,
- nie zmieniać flow zapisu,
- nie robić zielonego CTA.

## Weryfikacja ręczna

Po wdrożeniu przejść:
- `/leads`
- `/clients`
- `/cases`
- `/tasks`
- `/calendar`
- `/templates`
- `/response-templates`
- `/activity`
- `/ai-drafts`
- `/notifications`
- `/billing`
- `/help`
- `/settings`
- `/settings/ai`

Sprawdzić:
1. Czy header ma naturalny opis.
2. Czy przyciski mają spójne kolory.
3. Czy zielony nie występuje jako główne CTA.
4. Czy położenie nagłówków i modali nie zostało przesunięte.
5. Czy akcje przycisków działają jak wcześniej.
