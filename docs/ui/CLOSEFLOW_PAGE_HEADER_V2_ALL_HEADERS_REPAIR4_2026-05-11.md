# CloseFlow — Page Header V2 All Headers Repair 4

## Cel

Naprawić błędy po Repair3:
- Repair3 zatrzymał się na Settings, bo wymagał legacy headera tam, gdzie go nie znalazł.
- Część ekranów nadal renderowała stare headery i stare importy locków.
- Część zwykłych kart miała `data-cf-page-header-part`, przez co stare CSS-y traktowały je jak header.
- Duplikaty opisów dalej mogły wisieć pod kafelkiem.

## Co robi Repair4

1. Przepina top header na `CloseFlowPageHeaderV2` w ekranach:
   - Today
   - Leads
   - Clients
   - Cases
   - Tasks
   - Calendar
   - Templates
   - ResponseTemplates
   - Activity
   - AiDrafts
   - Notifications
   - Billing
   - Support
   - AdminAi

2. Settings:
   - nie wywala paczki, jeśli nie ma legacy headera,
   - czyści stare importy header-locków.

3. Czyści z target pages:
   - `data-cf-page-header="true"`
   - `data-cf-page-header-part=...`
   - `cf-page-header-row`
   - `cf-page-hero-layout`
   - stare importy `closeflow-page-header-*`

4. Ustawia jeden kolor labela/kickera:
   - text `#2563eb`
   - background `#eff6ff`
   - border `#bfdbfe`

5. Usuwa znane stare/dublujące copy:
   - stary długi opis Biblioteki odpowiedzi,
   - końcówkę `w CRM`,
   - stary długi opis Powiadomień,
   - stary długi opis Admin AI.

## Nie rusza

- backendu,
- API,
- modali,
- zapisu danych,
- list i metryk,
- działania przycisków.
