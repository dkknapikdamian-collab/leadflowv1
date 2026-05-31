# STAGE195_SIDEBAR_INLINE_LAYOUT_CONTRACT_LOCAL_ONLY_REPORT

FAKTY:
- Stage188-Stage194 nie rozwiązały problemu, bo działały jako zewnętrzne CSS-patche.
- Właściwy właściciel układu sidebara to src/components/Layout.tsx.
- Stage195 usuwa aktywne importy i pliki patchy Stage188-Stage194.
- Stage195 ustawia kontrakt bezpośrednio na realnym aside.sidebar:
  - height/minHeight/maxHeight: 100dvh
  - display: grid
  - gridTemplateRows: auto minmax(0, 1fr) auto
  - overflow: hidden
- Stage195 ustawia nav-scroll jako środkowy obszar przewijania.
- Stage195 ustawia sidebar-footer na dole panelu.
- Stage195 nie zmienia szerokości sidebara.
- Nie wykonano git add, commita ani pusha.

DECYZJA DAMIANA:
- Ma być rozciągnięty właściwy panel boczny, nie tło za panelem.
- Nie chcemy zwężania sidebara.
- Nie chcemy kolejnych warstw CSS, jeśli źródłowy layout jest wadliwy.

TESTY:
- npm run build
- npm run dev
- Ctrl+F5
- Ręcznie: /, /leads, /settings
- Sprawdzić, czy lewy panel dochodzi do dołu ekranu.
- Sprawdzić, czy footer sidebara jest na dole panelu.
