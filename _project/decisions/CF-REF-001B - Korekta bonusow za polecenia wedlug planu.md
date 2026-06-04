# CF-REF-001B — Korekta bonusów za polecenia według planu

Data: 2026-06-04  
Status: korekta decyzji produktowo-marketingowej  
Projekt: CloseFlow / LeadFlow / CaseFlow  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`  
Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`

---

## 1. Problem

Wcześniejsza propozycja:

> 5 skutecznych poleceń = 1 miesiąc korzystania z wyższego planu w cenie obecnego

jest dobra tylko dla klientów, którzy nie są na najwyższym planie.

Dla klienta na najwyższym planie ten bonus nie ma sensu, bo nie ma planu wyżej.
Nie może też automatycznie oznaczać darmowego miesiąca bez limitu, bo to mogłoby zjadać MRR i tworzyć niekontrolowany koszt.

---

## 2. Korekta decyzji

Bonus za kilka skutecznych poleceń musi zależeć od aktualnego planu klienta.

Nie stosujemy jednej nagrody dla wszystkich.

Finalna zasada:

> Nagroda za polecenia ma być benefitowa, limitowana i zależna od planu.  
> Nie wypłacamy gotówki.  
> Nie dajemy nielimitowanych darmowych miesięcy.  
> Nie dajemy automatycznie „planu wyżej”, jeśli klient jest już na najwyższym planie.

---

## 3. Model bonusów według planu

### Klient na planie niższym

Możliwy bonus:

- 1 miesiąc wyższego planu w cenie obecnego,
- dodatkowy seat na miesiąc,
- kredyt CloseFlow na kolejną płatność,
- setup credit / konfiguracja / automatyzacja.

### Klient na planie średnim

Możliwy bonus:

- 1 miesiąc wyższego planu w cenie obecnego,
- dodatkowy seat,
- premium feature month,
- kredyt CloseFlow.

### Klient na najwyższym planie

Nie ma „planu wyżej”.

Możliwy bonus:

- kredyt CloseFlow do wykorzystania przy kolejnej płatności,
- dodatkowy seat na określony czas,
- pakiet konfiguracji / automatyzacji,
- priorytetowa konsultacja procesowa,
- rozszerzony raport właściciela / owner report,
- pakiet importu / porządkowania danych,
- kredyt na usługę wdrożeniową.

Darmowy miesiąc najwyższego planu nie jest domyślną nagrodą.
Może być tylko ręcznym bonusem zatwierdzonym przez ownera, nie automatem.

---

## 4. Prosta reguła MVP

Na start nie budujemy skomplikowanego katalogu benefitów.

MVP:

```text
1 skuteczne polecenie = kredyt CloseFlow po płatności poleconego.
5 skutecznych poleceń = bonus specjalny zależny od planu, zatwierdzany ręcznie.
```

Bonus specjalny może być:

```text
- upgrade planu na 1 miesiąc, jeśli istnieje wyższy plan,
- dodatkowy seat,
- kredyt CloseFlow,
- setup/automation credit,
- premium feature month,
- manual owner-approved bonus.
```

---

## 5. Guardy

- brak gotówki,
- brak nielimitowanych darmowych miesięcy,
- brak automatycznego darmowego miesiąca dla najwyższego planu,
- bonus zależny od planu,
- bonus po 5 poleceniach zatwierdzany ręcznie w MVP,
- każdy bonus zapisany w reward ledger,
- reward ledger ma przechowywać typ bonusu, wartość, plan klienta i decyzję admina,
- bonus nie może zjadać marży ani MRR bez kontroli.

---

## 6. Aktualizacja modelu reward_type

Dodać / uwzględnić typy:

```text
closeflow_credit
higher_plan_month
extra_seat
setup_credit
premium_feature_month
automation_credit
owner_report_bonus
manual_owner_approved_bonus
```

---

## 7. Decyzja końcowa

ROBIĆ, ale z korektą:

> Kod polecający daje kredyt CloseFlow po skutecznej płatnej aktywacji.  
> Bonus za 5 skutecznych poleceń nie jest zawsze miesiącem wyższego planu.  
> Jeśli klient ma niższy plan, może dostać upgrade na miesiąc.  
> Jeśli klient ma najwyższy plan, dostaje inny benefit: kredyt, seat, usługę, konfigurację, automatyzację albo bonus zatwierdzony ręcznie.

To zamyka ryzyko „a co jak ktoś ma najwyższy plan?” i nie tworzy nielimitowanego rozdawania darmowych miesięcy.
