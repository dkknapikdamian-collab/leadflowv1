import './legal-public-pages.css';

export function LegalPrivacy() {
  const updatedAt = '21 maja 2026';

  return (
    <main className="cf-legal-page">
      <section className="cf-legal-card">
        <p className="cf-legal-kicker">CloseFlow</p>
        <h1>Polityka prywatnoĹ›ci</h1>
        <p className="cf-legal-muted">Ostatnia aktualizacja: {updatedAt}</p>

        <p>
          CloseFlow to aplikacja do zarzÄ…dzania leadami, sprawami, zadaniami, kalendarzem,
          klientami, komunikacjÄ… operacyjnÄ… i powiadomieniami. Ta strona opisuje, jakie dane
          mogÄ… byÄ‡ przetwarzane przez aplikacjÄ™ i w jakim celu.
        </p>

        <h2>Administrator i kontakt</h2>
        <p>
          W sprawach dotyczÄ…cych prywatnoĹ›ci i dostÄ™pu do danych moĹĽesz skontaktowaÄ‡ siÄ™ z
          administratorem aplikacji pod adresem e-mail wskazanym w ekranie zgody Google OAuth.
        </p>

        <h2>Jakie dane przetwarzamy</h2>
        <ul>
          <li>dane konta uĹĽytkownika, takie jak adres e-mail, identyfikator uĹĽytkownika i podstawowe informacje profilowe,</li>
          <li>dane wprowadzane w aplikacji, w tym leady, klienci, sprawy, zadania, notatki, wydarzenia i historia aktywnoĹ›ci,</li>
          <li>dane techniczne potrzebne do dziaĹ‚ania aplikacji, logowania, bezpieczeĹ„stwa, integracji i diagnostyki bĹ‚Ä™dĂłw,</li>
          <li>dane z integracji Google, jeĹĽeli uĹĽytkownik sam poĹ‚Ä…czy konto Google z CloseFlow.</li>
        </ul>

        <h2>Dane Google Calendar</h2>
        <p>
          JeĹĽeli uĹĽytkownik poĹ‚Ä…czy konto Google, CloseFlow moĹĽe uzyskaÄ‡ dostÄ™p do danych Google
          Calendar wyĹ‚Ä…cznie w zakresie wymaganym do synchronizacji wydarzeĹ„ kalendarza.
          Aplikacja uĹĽywa tej integracji do tworzenia, odczytu i aktualizacji wydarzeĹ„ zwiÄ…zanych
          z pracÄ… operacyjnÄ… uĹĽytkownika w CloseFlow.
        </p>
        <p>
          Dane Google Calendar nie sÄ… sprzedawane, udostÄ™pniane reklamodawcom ani uĹĽywane do
          trenowania modeli AI. DostÄ™p do Google Calendar moĹĽna odĹ‚Ä…czyÄ‡ w ustawieniach aplikacji
          albo w ustawieniach bezpieczeĹ„stwa konta Google.
        </p>

        <h2>Cel przetwarzania danych</h2>
        <ul>
          <li>zapewnienie dziaĹ‚ania konta uĹĽytkownika i aplikacji,</li>
          <li>zarzÄ…dzanie leadami, klientami, sprawami, zadaniami i kalendarzem,</li>
          <li>synchronizacja wydarzeĹ„ z Google Calendar po wyraĹĽeniu zgody przez uĹĽytkownika,</li>
          <li>utrzymanie bezpieczeĹ„stwa, diagnostyka bĹ‚Ä™dĂłw i ochrona przed naduĹĽyciami,</li>
          <li>obsĹ‚uga komunikacji systemowej, powiadomieĹ„ i potwierdzeĹ„.</li>
        </ul>

        <h2>Przechowywanie i bezpieczeĹ„stwo</h2>
        <p>
          Dane sÄ… przechowywane w usĹ‚ugach backendowych skonfigurowanych dla aplikacji CloseFlow.
          DostÄ™p do danych jest ograniczany przez mechanizmy uwierzytelniania, role uĹĽytkownikĂłw,
          uprawnienia przestrzeni roboczej i zabezpieczenia dostawcĂłw infrastruktury.
        </p>

        <h2>UdostÄ™pnianie danych</h2>
        <p>
          Dane mogÄ… byÄ‡ przekazywane dostawcom technicznym wyĹ‚Ä…cznie w zakresie potrzebnym do
          dziaĹ‚ania aplikacji, na przykĹ‚ad hostingowi, bazie danych, obsĹ‚udze e-maili, pĹ‚atnoĹ›ci,
          logowania lub integracji Google. Dane nie sÄ… sprzedawane.
        </p>

        <h2>Prawa uĹĽytkownika</h2>
        <p>
          UĹĽytkownik moĹĽe poprosiÄ‡ o dostÄ™p do swoich danych, ich poprawienie, usuniÄ™cie albo
          ograniczenie przetwarzania, o ile pozwalajÄ… na to obowiÄ…zujÄ…ce przepisy i wymagania
          bezpieczeĹ„stwa systemu.
        </p>

        <h2>Zmiany polityki</h2>
        <p>
          Polityka prywatnoĹ›ci moĹĽe byÄ‡ aktualizowana wraz z rozwojem aplikacji, integracji i
          wymagaĹ„ prawnych. Aktualna wersja jest publikowana pod tym adresem.
        </p>
      </section>
    </main>
  );
}

export default LegalPrivacy;

