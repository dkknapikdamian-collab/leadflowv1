# 04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW__FOUND_PROBLEMS_ADDENDUM

Data: 2026-06-12 20:31 Europe/Warsaw  
Status: ACTIVE  
Typ: addendum do protokolu audytu etapow  
Powiazany plik: `_project/04_STAGE_AUDIT_PROTOCOL_CLOSEFLOW.md`  
Centralny rejestr: `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`

## Decyzja Damiana

Od 2026-06-12 kazdy audyt przed etapem i po etapie ma obowiazkowo obslugiwac centralny rejestr:

`_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`

To jest nowy wpis obok plikow etapow/kierunku. Nie jest to lista etapow do automatycznego wdrozenia. To jest lista przyszlych potencjalnych etapow do decyzji Damiana.

## Zasada dla audytora / developera

Przy kazdym etapie developer ma:

1. Przeczytac `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md` przed planowaniem i wdrozeniem.
2. Sprawdzic, czy ruszany ekran/modul ma juz wpisy `NOWE`, `DO_ANALIZY_DAMIANA` albo `PRZYJETE_DO_ETAPU`.
3. Podczas audytu przed etapem i po etapie zapisywac realne problemy znalezione poza zatwierdzonym zakresem.
4. Nie naprawiac takich problemow po cichu, chyba ze blokuja etap albo Damian wlaczyl je do zakresu.
5. W run report zawsze wpisac: `Znalezione problemy: brak nowych` albo podac ID nowych wpisow.

## Co trafia do rejestru

Do rejestru trafiaja realne problemy, niedociagniecia i niedopiete miejsca, np.:

- przyciski tej samej akcji maja inne kolory, rozmiary, etykiety albo komponent,
- ten sam wzorzec UI ma dwa zrodla prawdy,
- kafelek wyglada jak wspolny wzorzec, ale ma lokalny styl,
- akcja jest podpieta do innego zrodla danych niz reszta modulu,
- funkcja jest czesciowo wdrozona albo niedokonczona,
- trasa jest publiczna, chociaz powinna byc za auth gate,
- guard sprawdza pojedynczy string, a nie klase bledu,
- dokumentacja mowi co innego niz kod,
- komentarz/TODO/FIXME wskazuje obejscie lub niedokonczony modul,
- UI jest mniej czytelne niz zaakceptowany wzorzec,
- dane moga wrocic po refetchu albo odswiezeniu.

## Czego nie robic

- Nie wpisywac spekulacji bez dowodu.
- Nie robic losowego polowania po calym repo.
- Nie mieszac znalezionych problemow z aktywnym etapem bez decyzji Damiana.
- Nie tworzyc od razu nowego etapu z kazdego wpisu.
- Nie naprawiac przy okazji obcego modulu bez zakresu.

## Wymagany fragment w run report

Kazdy run report musi zawierac:

```txt
ZNALEZIONE PROBLEMY
- sprawdzono centralny rejestr: TAK/NIE
- wpisy powiazane z ruszanym modulem:
- nowe problemy znalezione:
- ID nowych wpisow w `_project/04_ZNALEZIONE_PROBLEMY_DO_ANALIZY.md`:
- problemy nie ruszone i dlaczego:
- czy wymagaja decyzji Damiana:
```

## Relacja do etapow

Przeplyw:

1. Problem znaleziony przy audycie trafia do `04_ZNALEZIONE_PROBLEMY_DO_ANALIZY`.
2. Damian decyduje, czy to naprawiamy.
3. Dopiero po decyzji powstaje etap w roadmapie/plikach etapow.
4. Po wdrozeniu wpis zostaje oznaczony jako `ZAMKNIETE` i powiazany z run reportem.

## Obsidian payload

- data i godzina: 2026-06-12 20:31 Europe/Warsaw
- typ wpisu: nowy rejestr znalezionych problemow + addendum do protokolu audytu
- project: CloseFlow / LeadFlow
- repo: dkknapikdamian-collab/leadflowv1
- branch: dev-rollout-freeze
- docelowy wpis spisu tresci Obsidiana: `04_ZNALEZIONE_PROBLEMY_DO_ANALIZY`
- status: zapisane w repo; Obsidian lokalny DO_SYNCHRONIZACJI
