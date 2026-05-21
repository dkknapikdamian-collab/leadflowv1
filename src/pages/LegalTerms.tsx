import './legal-public-pages.css';

export function LegalTerms() {
  const updatedAt = '21 maja 2026';

  return (
    <main className="cf-legal-page">
      <section className="cf-legal-card">
        <p className="cf-legal-kicker">CloseFlow</p>
        <h1>Warunki korzystania</h1>
        <p className="cf-legal-muted">Ostatnia aktualizacja: {updatedAt}</p>

        <p>
          Niniejsze warunki opisujÄ… podstawowe zasady korzystania z aplikacji CloseFlow. KorzystajÄ…c
          z aplikacji, uĹĽytkownik potwierdza, ĹĽe bÄ™dzie uĹĽywaÄ‡ jej zgodnie z prawem, przeznaczeniem
          systemu i zasadami bezpieczeĹ„stwa.
        </p>

        <h2>Opis usĹ‚ugi</h2>
        <p>
          CloseFlow jest aplikacjÄ… operacyjnÄ… do zarzÄ…dzania leadami, klientami, sprawami, zadaniami,
          kalendarzem, powiadomieniami, historiÄ… aktywnoĹ›ci i wybranymi integracjami, w tym Google
          Calendar.
        </p>

        <h2>Konto uĹĽytkownika</h2>
        <p>
          UĹĽytkownik odpowiada za bezpieczeĹ„stwo swojego konta, poprawnoĹ›Ä‡ danych logowania oraz
          dziaĹ‚ania wykonywane z uĹĽyciem konta. Nie naleĹĽy udostÄ™pniaÄ‡ dostÄ™pu osobom nieuprawnionym.
        </p>

        <h2>Integracja Google Calendar</h2>
        <p>
          UĹĽytkownik moĹĽe dobrowolnie poĹ‚Ä…czyÄ‡ konto Google w celu synchronizacji wydarzeĹ„ kalendarza.
          Zakres dostÄ™pu zaleĹĽy od uprawnieĹ„ zaakceptowanych na ekranie zgody Google. UĹĽytkownik moĹĽe
          odĹ‚Ä…czyÄ‡ integracjÄ™ w ustawieniach CloseFlow albo w ustawieniach konta Google.
        </p>

        <h2>Dozwolone korzystanie</h2>
        <ul>
          <li>nie wolno wykorzystywaÄ‡ aplikacji do dziaĹ‚aĹ„ niezgodnych z prawem,</li>
          <li>nie wolno prĂłbowaÄ‡ omijaÄ‡ zabezpieczeĹ„, limitĂłw, rĂłl ani uprawnieĹ„,</li>
          <li>nie wolno wprowadzaÄ‡ danych, do ktĂłrych uĹĽytkownik nie ma prawa,</li>
          <li>nie wolno zakĹ‚ĂłcaÄ‡ dziaĹ‚ania aplikacji ani infrastruktury dostawcĂłw.</li>
        </ul>

        <h2>Dane i odpowiedzialnoĹ›Ä‡ uĹĽytkownika</h2>
        <p>
          UĹĽytkownik odpowiada za treĹ›ci i dane wprowadzane do aplikacji. CloseFlow ma pomagaÄ‡ w pracy
          operacyjnej, ale nie zastÄ™puje samodzielnej kontroli danych, decyzji biznesowych ani weryfikacji
          poprawnoĹ›ci informacji.
        </p>

        <h2>DostÄ™pnoĹ›Ä‡ i zmiany</h2>
        <p>
          Aplikacja moĹĽe byÄ‡ rozwijana, aktualizowana i czasowo niedostÄ™pna z powodĂłw technicznych,
          konserwacyjnych lub bezpieczeĹ„stwa. Funkcje mogÄ… siÄ™ zmieniaÄ‡ wraz z rozwojem produktu.
        </p>

        <h2>Ograniczenie odpowiedzialnoĹ›ci</h2>
        <p>
          Aplikacja jest dostarczana jako narzÄ™dzie wspierajÄ…ce pracÄ™. W maksymalnym zakresie dozwolonym
          przez prawo odpowiedzialnoĹ›Ä‡ za decyzje biznesowe, dziaĹ‚ania operacyjne i poprawnoĹ›Ä‡ danych
          pozostaje po stronie uĹĽytkownika albo organizacji korzystajÄ…cej z systemu.
        </p>

        <h2>Kontakt</h2>
        <p>
          W sprawach dotyczÄ…cych dziaĹ‚ania aplikacji, warunkĂłw korzystania lub dostÄ™pu do danych naleĹĽy
          kontaktowaÄ‡ siÄ™ z administratorem aplikacji pod adresem e-mail wskazanym w ekranie zgody Google OAuth.
        </p>
      </section>
    </main>
  );
}

export default LegalTerms;

