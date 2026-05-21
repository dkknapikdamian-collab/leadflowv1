import { Link } from 'react-router-dom';
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
          Niniejsze warunki opisują podstawowe zasady korzystania z aplikacji CloseFlow. Korzystając
          z aplikacji, użytkownik potwierdza, że będzie używać jej zgodnie z prawem, przeznaczeniem
          systemu i zasadami bezpieczeństwa.
        </p>

        <h2>Opis usługi</h2>
        <p>
          CloseFlow jest aplikacją operacyjną do zarządzania leadami, klientami, sprawami, zadaniami,
          kalendarzem, powiadomieniami, historią aktywności i wybranymi integracjami, w tym Google
          Calendar.
        </p>

        <h2>Konto użytkownika</h2>
        <p>
          Użytkownik odpowiada za bezpieczeństwo swojego konta, poprawność danych logowania oraz
          działania wykonywane z użyciem konta. Nie należy udostępniać dostępu osobom nieuprawnionym.
        </p>

        <h2>Integracja Google Calendar</h2>
        <p>
          Użytkownik może dobrowolnie połączyć konto Google w celu synchronizacji wydarzeń kalendarza.
          Zakres dostępu zależy od uprawnień zaakceptowanych na ekranie zgody Google. Użytkownik może
          odłączyć integrację w ustawieniach CloseFlow albo w ustawieniach konta Google.
        </p>

        <h2>Dozwolone korzystanie</h2>
        <ul>
          <li>nie wolno wykorzystywać aplikacji do działań niezgodnych z prawem,</li>
          <li>nie wolno próbować omijać zabezpieczeń, limitów, ról ani uprawnień,</li>
          <li>nie wolno wprowadzać danych, do których użytkownik nie ma prawa,</li>
          <li>nie wolno zakłócać działania aplikacji ani infrastruktury dostawców.</li>
        </ul>

        <h2>Dane i odpowiedzialność użytkownika</h2>
        <p>
          Użytkownik odpowiada za treści i dane wprowadzane do aplikacji. CloseFlow ma pomagać w pracy
          operacyjnej, ale nie zastępuje samodzielnej kontroli danych, decyzji biznesowych ani weryfikacji
          poprawności informacji.
        </p>

        <h2>Dostępność i zmiany</h2>
        <p>
          Aplikacja może być rozwijana, aktualizowana i czasowo niedostępna z powodów technicznych,
          konserwacyjnych lub bezpieczeństwa. Funkcje mogą się zmieniać wraz z rozwojem produktu.
        </p>

        <h2>Ograniczenie odpowiedzialności</h2>
        <p>
          Aplikacja jest dostarczana jako narzędzie wspierające pracę. W maksymalnym zakresie dozwolonym
          przez prawo odpowiedzialność za decyzje biznesowe, działania operacyjne i poprawność danych
          pozostaje po stronie użytkownika albo organizacji korzystającej z systemu.
        </p>

        <h2>Kontakt</h2>
        <p>
          W sprawach dotyczących działania aplikacji, warunków korzystania lub dostępu do danych należy
          kontaktować się z administratorem aplikacji pod adresem e-mail wskazanym w ekranie zgody Google OAuth.
        </p>

        <div className="cf-legal-actions">
          <Link to="/" className="cf-legal-back-link">Wróć do strony głównej</Link>
          <Link to="/privacy" className="cf-legal-secondary-link">Polityka prywatności</Link>
        </div>
      </section>
    </main>
  );
}

export default LegalTerms;
