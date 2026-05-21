import { Link } from 'react-router-dom';
import './legal-public-pages.css';

export function LegalPrivacy() {
  const updatedAt = '21 maja 2026';

  return (
    <main className="cf-legal-page">
      <section className="cf-legal-card">
        <p className="cf-legal-kicker">CloseFlow</p>
        <h1>Polityka prywatności</h1>
        <p className="cf-legal-muted">Ostatnia aktualizacja: {updatedAt}</p>

        <p>
          CloseFlow to aplikacja do zarządzania leadami, sprawami, zadaniami, kalendarzem,
          klientami, komunikacją operacyjną i powiadomieniami. Ta strona opisuje, jakie dane
          mogą być przetwarzane przez aplikację i w jakim celu.
        </p>

        <h2>Administrator i kontakt</h2>
        <p>
          W sprawach dotyczących prywatności, dostępu do danych albo usunięcia danych możesz
          skontaktować się z administratorem aplikacji pod adresem e-mail wskazanym w ekranie
          zgody Google OAuth oraz w konfiguracji aplikacji.
        </p>

        <h2>Jakie dane przetwarzamy</h2>
        <ul>
          <li>dane konta użytkownika, takie jak adres e-mail, identyfikator użytkownika i podstawowe informacje profilowe,</li>
          <li>dane wprowadzane w aplikacji, w tym leady, klienci, sprawy, zadania, notatki, wydarzenia i historia aktywności,</li>
          <li>dane techniczne potrzebne do działania aplikacji, logowania, bezpieczeństwa, integracji i diagnostyki błędów,</li>
          <li>dane z integracji Google, jeżeli użytkownik sam połączy konto Google z CloseFlow.</li>
        </ul>

        <h2>Dane Google Calendar</h2>
        <p>
          Jeżeli użytkownik połączy konto Google, CloseFlow może uzyskać dostęp do danych Google
          Calendar wyłącznie w zakresie wymaganym do synchronizacji wydarzeń kalendarza.
          Aplikacja używa tej integracji do tworzenia, odczytu i aktualizacji wydarzeń związanych
          z pracą operacyjną użytkownika w CloseFlow.
        </p>
        <p>
          Dane Google Calendar nie są sprzedawane, udostępniane reklamodawcom ani używane do
          trenowania modeli AI. Dostęp do Google Calendar można odłączyć w ustawieniach aplikacji
          albo w ustawieniach bezpieczeństwa konta Google.
        </p>

        <h2>Cel przetwarzania danych</h2>
        <ul>
          <li>zapewnienie działania konta użytkownika i aplikacji,</li>
          <li>zarządzanie leadami, klientami, sprawami, zadaniami i kalendarzem,</li>
          <li>synchronizacja wydarzeń z Google Calendar po wyrażeniu zgody przez użytkownika,</li>
          <li>utrzymanie bezpieczeństwa, diagnostyka błędów i ochrona przed nadużyciami,</li>
          <li>obsługa komunikacji systemowej, powiadomień i potwierdzeń.</li>
        </ul>

        <h2>Przechowywanie i bezpieczeństwo</h2>
        <p>
          Dane są przechowywane w usługach backendowych skonfigurowanych dla aplikacji CloseFlow.
          Dostęp do danych jest ograniczany przez mechanizmy uwierzytelniania, role użytkowników,
          uprawnienia przestrzeni roboczej i zabezpieczenia dostawców infrastruktury.
        </p>

        <h2>Udostępnianie danych</h2>
        <p>
          Dane mogą być przekazywane dostawcom technicznym wyłącznie w zakresie potrzebnym do
          działania aplikacji, na przykład hostingowi, bazie danych, obsłudze e-maili, płatności,
          logowania lub integracji Google. Dane nie są sprzedawane.
        </p>

        <h2>Prawa użytkownika</h2>
        <p>
          Użytkownik może poprosić o dostęp do swoich danych, ich poprawienie, usunięcie albo
          ograniczenie przetwarzania, o ile pozwalają na to obowiązujące przepisy i wymagania
          bezpieczeństwa systemu.
        </p>

        <h2>Zmiany polityki</h2>
        <p>
          Polityka prywatności może być aktualizowana wraz z rozwojem aplikacji, integracji i
          wymagań prawnych. Aktualna wersja jest publikowana pod tym adresem.
        </p>

        <div className="cf-legal-actions">
          <Link to="/" className="cf-legal-back-link">Wróć do strony głównej</Link>
          <Link to="/terms" className="cf-legal-secondary-link">Warunki korzystania</Link>
        </div>
      </section>
    </main>
  );
}

export default LegalPrivacy;
