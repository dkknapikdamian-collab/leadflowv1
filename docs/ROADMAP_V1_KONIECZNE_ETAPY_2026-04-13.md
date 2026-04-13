# ROADMAP V1 — konieczne etapy

## Rdzeń produktu
To ma być jeden system do domykania i uruchamiania klienta:
- Lead Flow
- Case / kompletność / portal klienta
- jedna historia klienta
- jedna aplikacja

## Etapy konieczne

### 1. Domknąć runtime i spójność procesu
- snapshot
- sync
- repository
- API
- Today / Leads / Cases na jednym source of truth

### 2. Domknąć portal klienta
- aktywny / zły / wygasły / odwołany token
- upload
- decyzje
- akceptacje
- odpowiedzi
- brak duplikatów tasków i notyfikacji

### 3. Today jako ekran egzekucji
- leady do ruchu dziś
- overdue
- bez next stepu
- waiting too long
- blocked cases
- ready_to_start
- execution queue

### 4. Spójne widoki właścicielskie
- Today
- Leads
- Lead Detail
- Cases
- Tasks
- Calendar
- Activity
- Templates

### 5. Szablony spraw i checklisty
- required / optional
- typy usług
- automatyczny start checklisty po case

### 6. Billing i trial
- 7 dni trialu
- blokada po trialu bez płatności
- stany konta
- paywall

### 7. Gotowość wdrożeniowa
- przenośna architektura
- przewidywalny deploy
- env
- smoke scripts

### 8. Packaging sprzedażowy
- nazwa
- pozycjonowanie
- landing
- onboarding
- demo flow

## Mocno zalecane po rdzeniu
- Contacts / Klienci jako pełny widok
- intake maili i dokumentów
- podstawowe metryki operatora

## Na później, nie blokuje sensownego V1
- team i role
- rozbudowane AI
- outbound / Lead Opportunity Radar
- monitoring sociali
- cięższy CRM enterprise
