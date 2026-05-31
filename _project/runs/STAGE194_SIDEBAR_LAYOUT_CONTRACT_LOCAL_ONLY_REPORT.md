# STAGE194_SIDEBAR_LAYOUT_CONTRACT_LOCAL_ONLY_REPORT

FAKTY:
- Poprzednie próby myliły tło, szerokość i wysokość.
- Właścicielem sidebara jest realny aside.sidebar[data-shell-sidebar].
- Stage194 usuwa aktywne patche Stage188-Stage192.
- Stage194 nie zmienia szerokości panelu.
- Stage194 ustawia sidebar jako pionowy grid: brand / nav-scroll / sidebar-footer.
- Footer ma siedzieć na dole panelu.
- Nav-scroll ma wypełniać środek i przewijać tylko środkową część, jeśli fizycznie zabraknie miejsca.
- Nie wykonano git add, commita ani pusha.

DECYZJA DAMIANA:
- Panel boczny ma być przeciągnięty w dół.
- Nie chcemy sztucznego tła za panelem.
- Nie chcemy schudzenia sidebara.

TESTY:
- npm run build
- npm run dev
- Ctrl+F5
- Ręcznie: /, /leads, /settings.
- Sprawdzić, czy Trial, użytkownik i Wyloguj się są dostępne na dole panelu.
