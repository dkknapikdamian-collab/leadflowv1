# STAGE186_THEME_ROLLBACK_DISABLE_SWITCH_LOCAL_ONLY_REPORT

FAKTY:
- Cofnięto aktywne eksperymenty motywów Stage181-Stage185.
- Usunięto aktywne pliki CSS nieudanych motywów i zachowano kopie w _project\archive\STAGE186_THEME_ROLLBACK_REMOVED_FILES.
- Zostawiono tylko jeden motyw w src/lib/appearance.ts: forteca-light / Klasyczny jasny.
- Usunięto UI wyboru motywu z Settings.tsx.
- Nie wykonano git add, commita ani pusha.

DECYZJA DAMIANA:
- Traktujemy temat tak, jakbyśmy nie walczyli o motywy.
- Zostaje tylko pierwszy, główny motyw.
- Opcja zmiany motywu ma zniknąć z menu/ustawień.

TESTY:
- npm run build
- Ręcznie: Ctrl+F5, /settings, /, /leads, /calendar.
- Sprawdzić, że nie ma wyboru motywu.
- Sprawdzić, że aplikacja wróciła do klasycznego jasnego wyglądu.

RYZYKA:
- Browser localStorage może mieć starą wartość forest-navy, ale isSkinId ją odrzuca i provider wróci do forteca-light po reloadzie.

NASTĘPNY KROK:
- Jeśli po Ctrl+F5 nadal widać ciemny motyw, ręcznie wyczyścić localStorage key forteca-appearance-skin w DevTools albo wkleić w konsoli:
  localStorage.removeItem('forteca-appearance-skin'); location.reload();
