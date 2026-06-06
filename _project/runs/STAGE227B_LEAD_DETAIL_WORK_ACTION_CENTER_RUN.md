# STAGE227B — Lead Detail Work Action Center + Leads History Tile Cleanup — RUN NOTE

Data: 2026-06-06 15:45 Europe/Warsaw
Status: NOTATKA ETAPU / DO WDROŻENIA PO STAGE227A / LOCAL-ONLY FIRST

## SCAN-FIRST EVIDENCE

Źródła sprawdzone przed zapisaniem notatki:

- `src/pages/Leads.tsx`
  - znaleziono top stat card `Historia` (`label="Historia"`) jako filtr leadów przeniesionych do obsługi.
- `src/pages/LeadDetail.tsx`
  - znaleziono istniejące funkcje obsługi task/event: edycja, przesunięcie, zrobione, usunięcie.
  - wykryto, że pełniejsze akcje są w sekcji `Pozostałe działania`, a right rail `Najbliższe działania` pokazuje top 5 raczej jako read-only listę.
- screenshoty Damiana:
  - `/leads` pokazuje kafelek `Historia`.
  - `LeadDetail` pokazuje najbliższe działania, ale użytkownik nie ma wystarczająco wygodnego panelu jak w CaseDetail.
  - `CaseDetail` ma lepszy wzorzec operacyjny: `Działania sprawy`, `Najbliższe działania`, `Braki i blokady`, `Wszystkie aktywne`.

## DECYZJA

Dopisać etap Stage227B jako następny po lokalnym Stage227A. Nie przerywać aktualnego wdrażania lejka, ale nie zgubić problemu.

## ZAKRES DO WDROŻENIA

- Usunięcie/ukrycie top stat card `Historia` na `/leads`.
- Główny panel `Działania leada` w `LeadDetail`.
- Akcje na task/event w LeadDetail: `Edytuj`, `Zrobione`, `Jutro/+1D`, `Usuń`.
- Obserwacje jako szybka notatka operacyjna bez nowej tabeli.

## NIE RUSZAĆ

- Runtime Stage227A podczas wdrażania lokalnego, poza regresją.
- Supabase schema.
- RLS.
- Google Calendar timezone.
- Finanse A36.
- Konwersja lead -> sprawa.
- AI Drafts.

## STATUS ZAPISU

- Report utworzony: `_project/reports/STAGE227B_LEAD_DETAIL_WORK_ACTION_CENTER_REPORT.md`
- Run note utworzony: `_project/runs/STAGE227B_LEAD_DETAIL_WORK_ACTION_CENTER_RUN.md`
- Obsidian update: `_project/obsidian_updates/STAGE227B_LEAD_DETAIL_WORK_ACTION_CENTER_OBSIDIAN_UPDATE.md`

## NASTĘPNY KROK

Po zakończeniu i akceptacji lokalnego Stage227A wdrożyć Stage227B lokalnie, uruchomić guard/test/build/verify i dopiero po akceptacji Damiana robić selektywny commit/push.
