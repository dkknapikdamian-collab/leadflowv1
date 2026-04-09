# ETAP 16 — FULL QA / MOBILE PASS / CONSISTENCY PASS

Cel: domknąć produkt jako **jeden spójny system** (bez dodawania nowych funkcji).

## 1) Automatyczny smoke (prod)

Wymaga zbudowania i uruchomienia wersji produkcyjnej lokalnie:

- `cmd /c "npm run smoke:prod:build"`

Co sprawdza:
- `next build` przechodzi
- `next start` wstaje bez crasha
- kluczowe route’y i API odpowiadają (200/3xx/401/403 akceptowalne dla widoków chronionych)

Po przejściu smoke uzupełnij raport: `docs/ETAP16_RAPORT_TEMPLATE.md`.

## 2) Manual smoke — flow end-to-end (operator)

Minimalny flow (bez rozbudowy):
1. lead wpada
2. lead ma next step
3. lead przechodzi na `won` / `ready to start`
4. tworzy się sprawa
5. sprawa ma checklistę
6. generuje się link klienta
7. klient wykonuje jedną akcję (upload/odpowiedź/akceptacja)
8. operator weryfikuje
9. sprawa dochodzi do `ready_to_start`

Widoki do kliknięcia (bez wyjątków i crashy runtime):
- `Today`
- `Leads` + `LeadDetail`
- `Cases` + case detail (checklista/blokery/aktywnosci/quick actions)
- `Templates`
- `Tasks`
- `Calendar`
- `Billing`
- `Settings`
- `Portal` (publiczny)

## 3) Mobile pass (czytelność + targety)

Sprawdź na telefonie (min: iPhone/Android):
- sidebar: otwieranie/zamykanie, aktywny stan, user card
- karty/listy: spacing, brak przełamań, scroll
- formularze/modale/drawery: CTA widoczne, zamykanie, focus
- portal klienta: zero sidebara, prosty język, szybkie wykonanie akcji
- date pickery / inputy: działają dotykiem
- badge statusów: czytelne kolory i kontrast

## 4) Consistency pass (jedna skórka)

Zasady:
- brak równoległej starej/nowej skórki na ekranach
- spójne nazewnictwo statusów i CTA
- spójne empty/loading/error states
- spójne komunikaty błędów (krótkie, konkretne)

## 5) Security pass (must-have)

- user A nie widzi danych usera B (workspace isolation)
- portal token: wygasanie + revoke działa
- pliki nie są publiczne bez podpisu / kontrolowanego dostępu
- rate limit na portal view/action/upload/acceptance działa sensownie

## Kryterium zakończenia

- smoke prod przechodzi (`npm run smoke:prod:build`)
- manualny flow end-to-end przechodzi
- mobile pass nie ma blockerów
- consistency pass: brak „ekranów z innej bajki”
- security pass: brak wycieków między workspace’ami i brak publicznych plików
