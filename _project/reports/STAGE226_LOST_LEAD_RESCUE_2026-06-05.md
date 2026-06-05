# STAGE226 — Lost Lead Rescue / Leady do odzyskania

Data: 2026-06-05 19:34 Europe/Warsaw  
Repo: `dkknapikdamian-collab/leadflowv1`  
Branch: `dev-rollout-freeze`  
Local path: `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`

## FAKTY

- Stage226 dodaje helper `src/lib/owner-control/lost-lead-rescue.ts`.
- Helper używa `buildContactCadenceGrid` jako źródła prawdy dla ciszy kontaktu.
- Helper używa `buildRecordOperationalBadges` jako źródła oznaczeń operacyjnych.
- `/leads` dostaje tryb `Do odzyskania` bez dodawania nowego dużego modułu do menu.
- `Odłóż` i `Oznacz jako martwy` są w Stage226 celowo nieaktywne, dopóki nie istnieje bezpieczny model danych/statusów/audytu.
- `TodayStable.tsx` nie dostaje dużego panelu Lost Lead Rescue.
- Poprawka copy: `klientow` → `klientów` w `Clients.tsx`.

## DECYZJE

- Rescue jest trybem w `/leads`, nie osobnym dużym dashboardem.
- Brak daty kontaktu jest osobnym powodem `missing_contact_date`, a nie udawaną ciszą 14+ dni.
- Rescue nie liczy ciszy z pól technicznych typu generic timestamp.
- Rescue nie miesza się z filtrem siatki kontaktu; po wejściu w `Do odzyskania` cadence filter jest czyszczony.

## TESTY DO WYKONANIA

```powershell
cd "C:\Users\malim\Desktop\biznesy_ai\2.closeflow"
node scripts/check-stage226-lost-lead-rescue.cjs
node --test tests/stage226-lost-lead-rescue.test.cjs
node --test tests/stage225-contact-cadence-grid.test.cjs
node --test tests/stage223r3-last-contact-intake.test.cjs
npm run build
npm run verify:closeflow:quiet
git diff --check
git status --short
```

## AUDYT RYZYK PO ETAPIE

- Ryzyko: lista może wyglądać jak nowy dashboard, jeśli UI będzie zbyt rozbudowane. Mitigacja: Stage226 zostaje w `/leads` jako tryb/lista robocza.
- Ryzyko: brak daty kontaktu może zawyżać alarmy. Mitigacja: osobny powód `missing_contact_date`, severity `medium`.
- Ryzyko: akcje `Odłóż` i `Oznacz jako martwy` mogą udawać działanie bez backendu. Mitigacja: w Stage226 są disabled/DO POTWIERDZENIA.
- Ryzyko: `Do odzyskania` może walczyć z cadence filters. Mitigacja: rescue czyści `cadenceFilter` i nie nakłada cadence jako drugiego filtra.
- Ryzyko: `Today` stanie się przeładowane. Mitigacja: brak dużego panelu w `TodayStable.tsx`.

## CZEGO NIE RUSZANO

- Sales Funnel Movement View.
- Finance Watchlist.
- Owner Morning Digest.
- SMS/e-mail/WhatsApp automations.
- Trwały snooze system.
- Masowe oznaczanie jako martwy/przegrany.

## STATUS

Do wdrożenia lokalnie z paczki ZIP Stage226, testy wymagane przed push.
