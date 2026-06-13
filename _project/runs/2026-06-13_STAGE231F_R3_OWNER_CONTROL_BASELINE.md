# STAGE231F_R3_OWNER_CONTROL_BASELINE

Data: 2026-06-13 09:11 Europe/Warsaw
Status: IMPLEMENTED_LOCAL_PASS_READY_FOR_SELECTIVE_PUSH
Projekt: CloseFlow / LeadFlow
Repo: dkknapikdamian-collab/leadflowv1
Branch: dev-rollout-freeze
project_id: closeflow_lead_app
entity_id / workspace_id: DO_POTWIERDZENIA

## FAKTY Z KODU / PLIKOW
- Jeden silnik `owner-control-baseline.ts` klasyfikuje aktywne leady, sprawy, zadania i wydarzenia.
- Silnik korzysta z `next-move-contract`, `activity-truth` i `owner-risk-rules`.
- `/today` pokazuje pelna kolejke `Co masz zrobic dzisiaj`, bez limitu pieciu pozycji i bez nowego panelu.
- Ustawienia workspace maja progi warning/critical/high value; localStorage jest fallbackiem przy niedostepnym API.
- Migracja Supabase dodaje trzy kolumny z walidacja 1-365 i critical > warning.
- Listy leadow, klientow i spraw korzystaja z tych samych progow.

## DECYZJE DAMIANA
- Domyslnie 7 dni = ostrzezenie, 14 dni = czerwony alert.
- Progi maja byc czytelne w 5 sekund w Ustawienia -> Aplikacja.
- Po pelnym PASS wykonac selektywny commit i push na `dev-rollout-freeze`.

## HIPOTEZY / PROPOZYCJE AI
- Brak nowych propozycji poza zakresem etapu.

## DO POTWIERDZENIA
- Produkcyjna migracja Supabase musi zostac zastosowana przez pipeline/deploy migracji.
- entity_id i workspace_id pozostaja DO_POTWIERDZENIA.

## AUDYT PRZED ETAPEM
- Istnialy czesciowe fundamenty Stage222/223/225, ale `/today` mial lokalne `getLeadRisk`, stale 7/14 i limit listy.
- Ekrany weryfikacji: `/settings` zakladka Aplikacja oraz `/today`.
- Podobne miejsca: listy `/leads`, `/clients`, `/cases`, LeadDetail i contact cadence.
- Ryzyka: drugie zrodlo prawdy, powrot alertu po refreshu, niezgodne progi na listach, operator zapisujacy ustawienia.

## ZNALEZIONE PROBLEMY
- FOUND-20260613-03: globalny `verify:closeflow:quiet` blokuje historyczny mojibake/BOM poza zakresem etapu.
- FOUND-20260613-04: build ostrzega o podwojnym kluczu `savedRecord` w `ContextActionDialogs.tsx`.

## TESTY AUTOMATYCZNE / GUARDY
- Dedykowany guard Stage231F R3: PASS.
- Dedykowane testy Stage231F R3: 5/5 PASS.
- Stage222: guard PASS, 3/3 PASS.
- Stage223: guard PASS, testy 3/3 i runtime 3/3 PASS.
- Stage225: guard PASS, 3/3 PASS, w tym progi 3/10.
- nearest action: 3/3 PASS.
- Today reschedule Stage227G1/G1R1/G2: guardy i testy PASS.
- `npm run build`: PASS z istniejacymi ostrzezeniami.
- `verify:closeflow:quiet`: FAIL na istniejacym globalnym Stage98 mojibake gate, nie na plikach Stage231F R3.
- `verify:migrations:supabase`: FAIL na dwoch starych migracjach portalu z 2026-05-02; jawny SKIP dla Stage231F R3.

## TESTY RECZNE
- TEST PRZEGLADARKOWY CODEX: PASS.
- `/settings`: karta znaleziona, zapis 3/10, twardy refresh zachowal 3/10.
- `/today`: 6 pozycji po zaladowaniu, pierwsza `Brak next step`, brak osobnego panelu `Kontrola sprzedazy`.
- `/today` po twardym refreshu: 6 pozycji i ten sam pierwszy rekord.
- TEST RECZNY DO WYKONANIA PRZEZ DAMIANA po deployu zgodnie z lista etapu.

## AUDYT PO ETAPIE
- Naprawiono przyczyne: jeden silnik i jedno ustawienie progow zamiast lokalnych stalych.
- Wykryty w browser QA brak trwalosci fallbacku zostal naprawiony; local preview czyta zapisane progi po refreshu.
- Sprawdzono listy leadow, klientow, spraw, LeadDetail, nearest action i reschedule.
- Nie ruszano zmian 231D ani globalnego dlugu mojibake.
- Ryzyko pozostale: migracja musi wejsc przed produkcyjnym zapisem workspace.

## WPLYW NA OBSIDIANA / PROJECT MEMORY
- Zaktualizowano wymagane pliki `_project` i przygotowano payload.
- Zaktualizowano lokalny Obsidian TOC 02-11.

## NASTEPNY KROK
- Selektywny commit/push Stage231F R3, nastepnie manualny test Damiana na wdrozonym srodowisku.

## GIT / ZIP STATUS
- Backup: `_local_backups/STAGE231F_R3_OWNER_CONTROL_BASELINE_20260613_085014/closeflow-backup-package.zip`.
- SHA256: `B5B01DAF24F21DB3A26588568A040898D8470AFFCC1054FBBE01610241DC6DEC`.
- App feature commit: `3139ee04` (`feat: add owner control baseline`) pushed to `origin/dev-rollout-freeze`.
- Obsidian commit: `7f01d16` (`docs: record owner control baseline`) pushed to `origin/main`.
