# 04_DECISIONS - CloseFlow / LeadFlow

- Pracujemy na branchu dev-rollout-freeze.
- Nie tworzymy nowych branchy.
- AGENTS.md jest dopisywany, nie nadpisywany.
- Obsidian jest dashboardem i indeksem, a repo + _project sa zrodlem prawdy.
- AI confirm-first: AI tworzy szkic, uzytkownik zatwierdza.
- UI ma mowic prawde o funkcjach, integracjach, billingu i gotowosci release.
- Aktywne pliki Obsidiana maja miec czytelne nazwy z kontekstem CloseFlow_LeadFlow.

<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_DECISION_START -->
## 2026-06-04 — decyzja po deep research CRM: CloseFlow jako owner control system, nie tani CRM

FAKTY:
- Rynek tanich i darmowych CRM jest zatłoczony.
- CloseFlow ma już kierunek operacyjny: leady, follow-upy, zadania, wydarzenia, sprawy, Today, szkice AI i finanse spraw.
- Repo i README potwierdzają pozycjonowanie wokół pilnowania leadów i tematów, które mogą uciec.

DECYZJA:
- Nie pozycjonować CloseFlow jako tańszej kopii CRM.
- Główna przewaga produktowa: owner control nad ruchem sprzedażowym, ciszą, brakiem następnego kroku, sprawami i pieniędzmi.
- Najpierw budować A35/A35B/A41/A46/A42/A45/A44, potem A36 szkice i A47 playbooki/oferta.
- Model komercyjny: SaaS jako furtka + wdrożenie procesu + monthly review/cleanup jako renta.

NIE ROBIĆ TERAZ:
- ERP, KSeF, fakturowanie, magazyn, własny VoIP, ciężkie BI, rozbudowany automation builder, 10 branż jednocześnie.

DO POTWIERDZENIA:
- dokładny segment pierwszego testu sprzedażowego,
- finalna cena Control Sprint,
- czy A35 będzie najpierw ekranem wewnętrznym, czy płatnym mini-audytem.
<!-- STAGE221_OWNER_CONTROL_ROADMAP_AFTER_CRM_RESEARCH_DECISION_END -->

<!-- STAGE222_R4_V3_LEAD_CLIENT_OPERATIONAL_BADGES -->
## 2026-06-05 - STAGE222 R4 V3 lead/client operational badges robust fix

FAKTY:
- R4 V1/V2 zatrzymały się na kruchych anchorach w Clients.tsx.
- V3 używa elastycznych regexów i naprawia częściowy lokalny stan.
- Docelowy wzór: [Oferta wysłana] [Sprawa] [14+ dni bez ruchu] [brak akcji].
- Nie ruszano Today i nie dodano nowego CSS.

TESTY:
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs
- npm run build
- git diff --check

<!-- STAGE222_R2B_SETTINGS_CASES_HOTFIX -->
## 2026-06-05 - STAGE222 R2B Settings/Cases hotfix

FAKTY:
- Commit 7ff0bc08 został wypchnięty mimo czerwonego guard/test Stage222 R2.
- Przyczyna: apply script nie wykonał patcha Settings/Cases, więc helper i guard weszły bez sekcji ustawień i bez case badges.
- R2B dopina brakujące elementy: Settings threshold section i Cases owner risk badges.
- Build wcześniej przechodził, ale Stage222 guard/test nie.

DECYZJE:
- Nie robimy rollbacku, bo build przechodzi i zakres da się domknąć hotfixem.
- R2B ma być osobnym commitem naprawczym.
- Bez `git add .`.

TESTY:
- node scripts/check-stage222-owner-risk-rules-foundation.cjs
- node --test tests/stage222-owner-risk-rules-foundation.test.cjs
- node scripts/check-stage222-r4-lead-client-operational-badges.cjs, jeśli plik istnieje
- node --test tests/stage222-r4-lead-client-operational-badges.test.cjs, jeśli plik istnieje
- npm run build
- git diff --check

NASTĘPNY KROK:
- Po zielonych testach commit/push R2B.
