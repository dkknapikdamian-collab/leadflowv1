# CF-REF-001 — Kod polecający bez ograniczania triala i partnerzy usługowi

Data: 2026-06-04  
Status: decyzja produktowo-marketingowa + kierunek do wdrożenia  
Projekt: CloseFlow / LeadFlow / CaseFlow  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`  
Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`

---

## 1. Główna korekta

Nie robimy linku, który ogranicza wejście do triala.

Trial ma być zawsze dostępny normalnie dla każdego użytkownika.

Nie może powstać wrażenie:

> Żeby wejść do aplikacji, muszę mieć kod albo zapłacić, zanim wiem za co.

To byłoby złe sprzedażowo, bo trial jest główną furtką wejściową.

Finalna decyzja:

> Kod/link polecający nie zastępuje triala.  
> Trial zostaje zawsze otwarty.  
> Kod/link tylko przypisuje źródło polecenia i uruchamia nagrodę po przejściu poleconego na płatny plan.

---

## 2. Finalny mechanizm

Klient albo partner dostaje kod/link:

```text
https://closeflowapp.com/start?ref=CF-A7K92
```

Kod:

```text
CF-A7K92
```

Użytkownik może:

- kliknąć link i normalnie rozpocząć trial,
- wejść normalnie na stronę bez kodu i rozpocząć trial,
- wpisać kod przy rejestracji, jeśli dostał go od kogoś,
- wpisać kod później w ustawieniach, jeśli zapomniał podać go przy starcie.

Nagroda pojawia się dopiero, gdy polecony klient przejdzie na płatny plan.

---

## 3. Gdzie kod/link ma być widoczny

Kod polecający powinien być stale dostępny dla użytkownika.

Miejsca:

1. ustawienia konta,
2. ustawienia workspace'u, gdy będzie logika firm/workspace'ów,
3. po aktywacji triala,
4. po pierwszym realnym użyciu aplikacji,
5. w późniejszym etapie w panelu poleceń.

Najważniejsze MVP:

> Kod/link widoczny zawsze w ustawieniach.

Tekst w ustawieniach:

```text
Twój kod polecający CloseFlow:
[CF-A7K92]

Możesz wysłać go firmie, która też gubi follow-upy albo chce uporządkować obsługę leadów.
Jeśli przejdzie na płatny plan, dostaniesz kredyt CloseFlow.
```

---

## 4. Kod przy rejestracji

Przy rejestracji ma być opcjonalne pole:

```text
Masz kod polecający?
[__________]
```

Pole nie może blokować rejestracji.

Tekst nie może sugerować, że bez kodu użytkownik traci dostęp do triala.

Dobry tekst:

```text
Masz kod polecający?
Dodaj go teraz albo pomiń. Trial działa normalnie bez kodu.
```

Jeśli użytkownik wchodzi z linku `?ref=CF-A7K92`, kod powinien uzupełnić się automatycznie.

---

## 5. Kod po rejestracji / późniejsze przypisanie

Jeśli użytkownik dostał kod, ale nie wpisał go przy rejestracji, może dodać go później w ustawieniach.

Zasada:

- można dodać kod przed przejściem na płatny plan,
- po przejściu na płatny plan kod można dodać tylko ręcznie przez admina,
- nie można wielokrotnie zmieniać kodu polecającego,
- jeden nowy klient może mieć tylko jedno źródło polecenia.

Powód:

- nie blokujemy użytkownika,
- ale nie otwieramy nadużyć po płatności.

---

## 6. Nagroda

Nie dajemy gotówki w MVP.

Nie robimy prowizji pieniężnych w MVP.

Nagroda ma być wewnątrz CloseFlow.

Opcje:

- kredyt CloseFlow na kolejną płatność,
- bonus do bieżącego planu,
- miesiąc korzystania z wyższego planu w cenie obecnego,
- dodatkowy użytkownik / seat na określony czas,
- kredyt na konfigurację / wdrożenie / automatyzację.

Najlepszy model startowy:

```text
1 skuteczne polecenie = kredyt CloseFlow po przejściu poleconego na płatny plan.
```

Po kilku klientach:

```text
5 skutecznych poleceń = 1 miesiąc korzystania z wyższego planu w cenie obecnego.
```

To ma działać jako bonus za podziękowanie, nie jako agresywny program afiliacyjny.

---

## 7. Definicja skutecznego polecenia

Skuteczne polecenie to nie kliknięcie i nie pusta rejestracja.

Skuteczne polecenie:

> polecony użytkownik przeszedł na płatny plan.

Opcjonalnie później można dodać warunek aktywacji:

> płatny plan + minimum aktywności w aplikacji.

W MVP wystarczy płatny plan.

Brak nagrody za:

- kliknięcie,
- pustą rejestrację,
- trial bez płatności,
- konto testowe,
- anulowaną płatność,
- self-referral.

---

## 8. Odwrócona piramida skali

Wdrażamy model odwróconej piramidy: dużo prostych, lekkich punktów skali, ale bez przytłaczania użytkownika.

Nie robimy jednego wielkiego modułu poleceń od razu.

Zamiast tego:

1. kod/link w ustawieniach,
2. opcjonalne pole kodu przy rejestracji,
3. automatyczne przypisanie z linku,
4. krótki komunikat po realnym użyciu aplikacji,
5. partnerzy usługowi,
6. social share jako poboczny kanał,
7. dopiero później panel poleceń, workspace'y, partnerzy agencyjni i firmowa logika kont.

Zasada:

> Im większa próba skalowania, tym lepiej, ale bez przytłaczania użytkownika i bez dokładania mu pracy.

---

## 9. Skala wewnątrz firmy — kierunek późniejszy

Nie mamy jeszcze pełnej logiki firm/workspace'ów jako głównego modelu wzrostu.

Zapisujemy jako kierunek rozwoju:

> CloseFlow powinien w przyszłości skalować się także wewnątrz firmy przez zapraszanie zespołu, dodawanie użytkowników, role i workspace'y.

To jest dobre, ale nie zastępuje obecnego mechanizmu referral.

Przyszłe funkcje:

- zaproś pracownika,
- role w firmie,
- właściciel / manager / operator,
- konta zespołu,
- rozliczanie per seat,
- link zaproszenia do workspace'u,
- logika źródła: user invite vs referral zewnętrzny.

Status:

- backlog późniejszy,
- nie blokuje CF-REF-001,
- zapisać jako kierunek marketingowo-produktowy.

---

## 10. Partnerzy — rozszerzona lista

Partnerzy są bardzo ważnym kierunkiem skali.

Nie ograniczać tylko do agencji lead generation.

Potencjalni partnerzy:

- agencje lead generation,
- specjaliści Google Ads,
- specjaliści Meta Ads,
- twórcy stron www,
- twórcy landing page,
- konsultanci sprzedaży,
- wdrożeniowcy CRM,
- freelancerzy marketingowi,
- lokalne agencje reklamowe,
- firmy robiące automatyzacje no-code,
- call center,
- osoby obsługujące leady dla lokalnych firm,
- biura nieruchomości,
- pośrednicy nieruchomości,
- doradcy kredytowi,
- doradcy ubezpieczeniowi,
- firmy budowlane,
- ekipy remontowe,
- instalatorzy,
- architekci,
- projektanci wnętrz,
- firmy HVAC,
- fotowoltaika / pompy ciepła,
- lokalne usługi, które dostają zapytania i muszą oddzwaniać.

Zasada:

> Partnerem może być każdy, kto ma dostęp do firm lub klientów usługowych, które dostają zapytania i potrzebują pilnować kontaktu, follow-upu i następnego kroku.

Nie pisać partnerom: „sprzedawaj nasz CRM”.

Pisać:

> Jeśli Twoi klienci dostają leady, ale nie zawsze je dobrze obsługują, CloseFlow pomaga im pilnować odpowiedzi, follow-upów i kolejnych kroków.

---

## 11. Social share

Social share jest dozwolony jako poboczny kanał.

Nie jest głównym silnikiem.

Może działać u:

- partnerów,
- konsultantów,
- agencji,
- osób robiących content B2B,
- użytkowników, którzy chcą polecić narzędzie.

Przykład:

```text
Masz firmę, w której leady wpadają z kilku miejsc i łatwo zgubić follow-up?
Tu jest trial CloseFlow:
[LINK]

Kod polecający / materiał promocyjny.
```

Jeśli publikujący dostaje korzyść, materiał musi być oznaczony jako promocyjny / kod polecający / współpraca.

---

## 12. Minimalny model danych

```text
referral_code
partner_code
source_type: customer_referral / partner / social_share / internal_team_invite
owner_customer_id
owner_workspace_id
owner_email
referred_customer_id
referred_workspace_id
referred_email
trial_started_at
trial_activated_at
paid_at
status
reward_status
reward_type
reward_value
created_at
clicked_at
reward_granted_at
rejected_at
rejection_reason
```

Statusy:

```text
created
clicked
code_entered
trial_started
activated
paid
reward_pending
reward_granted
reward_used
rejected
expired
```

Reward type:

```text
closeflow_credit
higher_plan_month
extra_seat
setup_credit
premium_feature_month
manual_bonus
```

---

## 13. Guardy

- trial zawsze dostępny bez kodu,
- kod nie blokuje rejestracji,
- kod można wpisać przy rejestracji,
- kod można dodać później w ustawieniach przed płatnością,
- po płatności zmiana kodu tylko ręcznie przez admina,
- nagroda tylko po przejściu poleconego na płatny plan,
- brak nagrody za kliknięcie,
- brak nagrody za pustą rejestrację,
- brak nagrody za trial bez płatności,
- brak gotówki w MVP,
- brak prowizji pieniężnych w MVP,
- self-referral zablokowany,
- ten sam email / domena / karta wymaga ręcznej oceny,
- partner ma osobny kod,
- social share z benefitem ma być oznaczony jako promocyjny,
- wszystkie źródła zapisane w ledgerze.

---

## 14. Etap wdrożeniowy

Nazwa:

`CF-REF-001 — kod polecający bez ograniczania triala + reward ledger + partnerzy usługowi`

Zakres:

1. Trial zostaje zawsze dostępny bez kodu.
2. Kod/link przypisuje źródło, ale nie ogranicza wejścia.
3. Kod/link widoczny stale w ustawieniach.
4. Opcjonalne pole kodu przy rejestracji.
5. Automatyczne przypisanie kodu z URL.
6. Możliwość dodania kodu później w ustawieniach przed płatnością.
7. Ledger poleceń.
8. Reward ledger.
9. Nagroda po przejściu poleconego na płatny plan.
10. Bonus po kilku skutecznych poleceniach: np. 5 poleceń = miesiąc wyższego planu w cenie obecnego.
11. Osobne kody partnerów.
12. Social share jako poboczny kanał.
13. Backlog: workspace'y, zapraszanie zespołu, role i skala wewnątrz firmy.
14. Aktualizacja Obsidiana i `_project`.

---

## 15. Czego nie robić teraz

Nie robić:

- linku, który zastępuje trial,
- zamkniętego triala tylko dla osób z kodem,
- osobnego audytu leadów,
- gotówki,
- prowizji pieniężnych,
- wielkiego programu afiliacyjnego,
- panelu partnera w MVP,
- dużych popupów przytłaczających użytkownika,
- ukrywania triala za CTA z płatnością,
- logiki workspace'ów jako warunku CF-REF-001.

---

## 16. Test 14 dni

Hipoteza:

> Jeśli trial zostaje otwarty, a kod/link tylko przypisuje źródło i bonus po płatności, to nie ograniczamy klientów, a jednocześnie mierzymy polecenia i partnerów.

Zakres:

- 20 użytkowników / kontaktów,
- 10 partnerów usługowych,
- link/kod w ustawieniach,
- opcjonalny kod przy rejestracji,
- ręczne zatwierdzanie nagród.

Sukces minimalny:

- 5 użyć linku/kodu,
- 3 triale z przypisanym źródłem,
- 1 płatna aktywacja albo rozmowa sprzedażowa,
- minimum 2 partnerów zainteresowanych dalszym testem.

---

## 17. Decyzja końcowa

ROBIĆ.

Finalny model:

> Trial zawsze otwarty.  
> Kod/link nie ogranicza wejścia.  
> Kod/link tylko przypisuje źródło.  
> Po płatności polecający dostaje kredyt CloseFlow albo bonus produktowy.  
> Po kilku skutecznych poleceniach można dać miesiąc wyższego planu w cenie obecnego.  
> Partnerzy usługowi są szerokim kanałem skali.  
> Workspace'y i skala wewnątrz firmy zapisane jako późniejszy kierunek rozwoju.
