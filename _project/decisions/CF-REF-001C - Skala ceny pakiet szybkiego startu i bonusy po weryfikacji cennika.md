# CF-REF-001C — Skala, ceny, pakiet szybkiego startu i bonusy po weryfikacji cennika

Data: 2026-06-04  
Status: korekta decyzji produktowo-marketingowej po weryfikacji cen w aplikacji  
Projekt: CloseFlow / LeadFlow / CaseFlow  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`  
Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`

---

## 1. Zweryfikowane ceny w aplikacji

Aktualny billing w kodzie pokazuje:

- Free: 0 zł / 0 zł rocznie
- Basic: 19 zł / 30 dni, 190 zł rocznie
- Pro: 39 zł / 30 dni, 390 zł rocznie
- AI: 69 zł / 30 dni, 690 zł rocznie

Rejestracja pokazuje 21 dni testu.

Wniosek:

> Przy takich cenach nie wolno opierać poleceń na dużych kredytach pieniężnych, bo rabat szybko zjada MRR.

---

## 2. Korekta strategiczna

Kod polecający nie może być głównie kodem rabatowym.

Finalnie kod polecający ma dawać:

1. poleconemu: pakiet szybkiego startu + ewentualny mały bonus produktowy po płatności,
2. polecającemu: mały kredyt CloseFlow albo bonus produktowy po tym, jak polecony przejdzie na płatny plan,
3. systemowi: źródło pozyskania klienta w ledgerze.

Trial zawsze zostaje otwarty i nie wymaga kodu.

---

## 3. Czym jest pakiet szybkiego startu

Pakiet szybkiego startu to nie usługa ręczna i nie rabat.

To gotowy zestaw w aplikacji, który pomaga użytkownikowi szybciej zrozumieć, jak używać CloseFlow.

MVP pakietu:

- krótka checklista startowa,
- przykładowy lead DEMO albo gotowy scenariusz do skopiowania,
- przykładowe zadanie follow-up,
- przykładowy status / kolejny krok,
- krótki wzór wiadomości follow-up,
- komunikat: „Dodaj 1 prawdziwy lead i ustaw 1 follow-up”.

Cel:

> Kod ma zwiększyć aktywację triala, nie rozdawać tani rabat.

---

## 4. Co oznacza „przykład”

Przykład nie ma być śmieciem w danych klienta.

Najbezpieczniejszy wariant:

- przykład pokazany jako onboarding / karta startowa,
- opcjonalny przycisk „Utwórz przykładowy lead”,
- przykład oznaczony jako DEMO,
- użytkownik może go usunąć jednym kliknięciem.

Przykład:

```text
Lead DEMO: Jan Kowalski — wycena usługi
Status: Nowy lead
Następny krok: oddzwonić jutro o 10:00
Zadanie: wysłać krótkie podsumowanie rozmowy
Follow-up: jeśli brak odpowiedzi, wrócić za 2 dni
```

Lepszy kierunek niż automatyczne tworzenie danych bez pytania.

---

## 5. Bonus dla poleconego

Przy cenach 19 / 39 / 69 zł miesięcznie duże bonusy finansowe odpadają.

Polecony może dostać:

- pakiet szybkiego startu od razu,
- po płatności: mały bonus produktowy, np. dodatkowy seat na krótki czas, funkcja premium na miesiąc, albo mały kredyt zależny od planu.

Nie dawać:

- dużego rabatu od razu,
- gotówki,
- darmowego miesiąca za samą rejestrację,
- bonusu bez płatności.

---

## 6. Bonus dla polecającego

Polecający dostaje benefit dopiero po płatnym planie poleconego.

Ze względu na niskie ceny miesięczne rekomendacja:

### Basic 19 zł

- nie dawać wysokiego kredytu pieniężnego,
- najlepiej: bonus produktowy / licznik skutecznych poleceń,
- ewentualnie symboliczny kredyt, np. 5 zł, tylko jeśli system billingowy to obsłuży bez chaosu.

### Pro 39 zł

- mały kredyt CloseFlow, np. 10 zł,
- albo lepiej: dodatkowy seat / funkcja premium / setup credit.

### AI 69 zł

- kredyt CloseFlow, np. 15 zł,
- albo bonus produktowy: AI feature month, owner report bonus, extra seat, setup/automation credit.

W MVP lepiej nie pokazywać klientowi drobnych kwot jako głównej obietnicy.

Komunikacyjnie:

> Jeśli ktoś z Twojego kodu przejdzie na płatny plan, dostaniesz bonus CloseFlow do wykorzystania w aplikacji.

---

## 7. Bonus po kilku skutecznych poleceniach

Poprzednia propozycja „5 poleceń = miesiąc wyższego planu” zostaje tylko jako warunkowa.

Finalna reguła:

```text
5 skutecznych poleceń = bonus specjalny zależny od aktualnego planu, zatwierdzany ręcznie w MVP.
```

Jeśli klient nie jest na najwyższym planie:

- może dostać 1 miesiąc wyższego planu w cenie obecnego.

Jeśli klient jest na najwyższym planie:

- nie dostaje automatycznego darmowego miesiąca,
- może dostać kredyt CloseFlow,
- dodatkowy seat,
- konfigurację,
- automatyzację,
- owner report bonus,
- manual owner-approved bonus.

---

## 8. Aktualny cennik a sens biznesowy

Ceny 19 / 39 / 69 zł są bardzo niskie jak na B2B narzędzie operacyjne.

Wniosek:

- dobre do testu i wejścia,
- słabe do finansowania hojnych poleceń,
- mocno ograniczają możliwość dawania kredytów,
- wymagają nacisku na aktywację, retencję i upgrade, nie na rabaty.

Długoterminowo rozważyć podniesienie lub przebudowę cennika, jeśli produkt ma być realnym B2B systemem, a nie tanią mikroapką.

Na teraz nie zmieniać cen bez osobnej decyzji.

---

## 9. Finalny model skali CloseFlow

- Trial zawsze dostępny dla każdego.
- Kod polecający nie blokuje triala.
- Kod można wpisać przy rejestracji albo dodać później przed płatnością.
- Kod/link ma być widoczny w ustawieniach.
- Kod daje poleconemu pakiet szybkiego startu.
- Kod przypisuje źródło w ledgerze.
- Nagroda dla polecającego dopiero po płatności poleconego.
- Nagroda głównie produktowa, nie pieniężna.
- Bonus po kilku poleceniach zależny od planu i ręcznie zatwierdzany w MVP.
- Partnerzy usługowi są szerokim kanałem skali.
- Workspace'y, role i zapraszanie zespołu są backlogiem późniejszym.

---

## 10. Guardy

- brak gotówki,
- brak dużych rabatów,
- brak nagrody za sam trial,
- brak nagrody za pustą rejestrację,
- nagroda dopiero po płatnym planie,
- kod nie ogranicza triala,
- pakiet szybkiego startu nie tworzy śmieciowych danych bez zgody,
- bonus finansowy, jeśli istnieje, musi być mały i zależny od planu,
- bonus po 5 poleceniach ręcznie zatwierdzany w MVP,
- najwyższy plan nie dostaje automatycznie darmowego miesiąca,
- wszystko zapisane w reward ledger.

---

## 11. Następny krok

Przyszły etap CF-REF-001 powinien wdrożyć:

1. referral_code / referral_link,
2. opcjonalne pole kodu przy rejestracji,
3. dodanie kodu w ustawieniach przed płatnością,
4. stałą widoczność własnego kodu w ustawieniach,
5. pakiet szybkiego startu,
6. reward ledger,
7. reguły bonusów zależne od planu,
8. guardy antynadużyciowe.
