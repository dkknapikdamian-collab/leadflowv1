# Stage — Quick Lead Capture / szybki lead z notatki

## Cel

Dodać większy etap produktowy: użytkownik może wpisać albo podyktować notatkę systemowym mikrofonem telefonu, dostać szkic leada, poprawić dane i dopiero po potwierdzeniu zapisać leada oraz zadanie follow-up.

## Co wdrożono

- parser regułowy `src/lib/quick-lead-capture.ts`, działający bez płatnego AI,
- modal `src/components/quick-lead/QuickLeadCaptureModal.tsx`,
- przycisk `Szybki lead` na ekranie `Dziś`,
- przycisk `Szybki lead` na ekranie `Leady`,
- tworzenie leada po zatwierdzeniu szkicu,
- tworzenie zadania, jeśli notatka zawiera akcję lub termin,
- zapis lekkiej aktywności bez surowego tekstu dyktowania,
- usuwanie `rawText` po zatwierdzeniu albo anulowaniu szkicu,
- testy parsera, dat, walidacji i prywatności.

## Decyzje zgodne z V1

- brak nagrywania rozmów telefonicznych,
- brak automatycznego zapisu przez AI,
- brak kluczy Gemini / Cloudflare w frontendzie,
- brak ciężkiego AI chatu,
- użytkownik zawsze zatwierdza szkic przed zapisem.

## Jak działa flow

1. Użytkownik klika `Szybki lead`.
2. Wpisuje albo dyktuje notatkę do pola tekstowego.
3. Klika `Przetwórz notatkę`.
4. Aplikacja pokazuje szkic.
5. Użytkownik poprawia pola.
6. Klika `Zatwierdź i zapisz`.
7. Tworzy się lead.
8. Jeśli jest akcja/termin, tworzy się task.
9. Tekst dyktowania jest usuwany ze szkicu.

## Testy

```bash
npm run test:quick-lead
npm run lint
```

## Czego nie ruszano

- nie zmieniano routingu,
- nie zmieniano głównego layoutu,
- nie dodawano płatnych providerów AI,
- nie ruszano billingu ani access flow poza respektowaniem `hasAccess` przy zapisie.
