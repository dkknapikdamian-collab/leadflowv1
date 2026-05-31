# STAGE192_SIDEBAR_FIT_HEIGHT_NO_SCROLL_LOCAL_ONLY_REPORT

FAKTY:
- Poprzednie poprawki mieszały trzy problemy: wysokość, szerokość i sztuczne tło.
- Stage192 usuwa aktywne patche Stage188-Stage191.
- Stage192 nie zmienia szerokości sidebara.
- Stage192 zagęszcza pionowo menu i footer, żeby na desktopie nie trzeba było przewijać sidebara.
- Nie wykonano git add, commita ani pusha.

DECYZJA DAMIANA:
- Panel boczny ma być przeciągnięty w dół.
- Nie chcemy przewijania sidebara na normalnym desktopowym ekranie.
- Nie chcemy odchudzonego sidebara ani tła za panelem.

TESTY:
- npm run build
- npm run dev
- Ctrl+F5
- Ręcznie: /leads, /settings, /
- Sprawdzić, czy sidebar nie wymaga przewijania na wysokości obecnego ekranu.
