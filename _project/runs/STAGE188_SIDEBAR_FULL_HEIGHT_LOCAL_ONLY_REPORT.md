# STAGE188_SIDEBAR_FULL_HEIGHT_LOCAL_ONLY_REPORT

FAKTY:
- Sidebar kończył się przed dołem ekranu i zostawiał jasne tło pod menu.
- Problem dotyczy shellu Layout.tsx: aside.sidebar oraz main obok.
- Dodano src/styles/closeflow-sidebar-full-height-stage188.css.
- Dodano import CSS w src/components/Layout.tsx.
- Nie wykonano git add, commita ani pusha.

DECYZJA DAMIANA:
- Sidebar ma być rozciągnięty do końca ekranu.

TESTY:
- npm run build
- Ręcznie: /settings i /, sprawdzić pełną wysokość sidebara.
- Sprawdzić, że mobile/drawer nie dostał złej wysokości.

RYZYKA:
- Jeżeli jakiś starszy CSS wymusza height auto z późniejszego importu, trzeba będzie przenieść import jeszcze niżej w kaskadzie.

NASTĘPNY KROK:
- Po akceptacji zebrać lokalne poprawki w jedną paczkę, nadal bez pusha.
