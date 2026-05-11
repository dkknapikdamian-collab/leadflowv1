import type { ReactNode } from 'react';
import type { CloseFlowPageHeaderContent, CloseFlowPageHeaderKey } from '../lib/page-header-content';
import '../styles/closeflow-page-header-v2.css';

type CloseFlowPageHeaderV2Props = {
  pageKey: CloseFlowPageHeaderKey;
  actions?: ReactNode;
};

const CLOSEFLOW_PAGE_HEADER_COPY: Record<CloseFlowPageHeaderKey, CloseFlowPageHeaderContent> = {
  today: {
    kicker: 'CENTRUM DNIA',
    title: 'Priorytety i najbliższe ruchy',
    description: 'Szybki przegląd tego, co wymaga reakcji teraz i co warto zaplanować dalej.',
  },
  leads: {
    kicker: 'LISTA SPRZEDAŻOWA',
    title: 'Leady',
    description: 'Lista aktywnych tematów sprzedażowych. Tu zapisujesz kontakty, pilnujesz wartości i szybko widzisz, które leady wymagają ruchu.',
  },
  clients: {
    kicker: 'BAZA RELACJI',
    title: 'Klienci',
    description: 'Baza osób i firm w tle. Klient łączy kontakt, leady, sprawy i historię relacji.',
  },
  cases: {
    kicker: 'CENTRUM OBSŁUGI',
    title: 'Sprawy',
    description: 'Tematy już prowadzone operacyjnie. Tutaj pilnujesz obsługi, blokad, checklist i kolejnych działań po pozyskaniu klienta.',
  },
  tasks: {
    kicker: 'ZADANIA',
    title: 'Lista zadań',
    description: 'Konkretne rzeczy do wykonania. Zadania mają pilnować ruchu, a nie leżeć jako martwe notatki.',
  },
  calendar: {
    kicker: 'TERMINY',
    title: 'Kalendarz',
    description: 'Tydzień, spotkania i deadline’y w jednym miejscu. Terminy mają być widoczne bez szukania po modułach.',
  },
  templates: {
    kicker: 'SZABLONY SPRAW',
    title: 'Szablony spraw i checklist',
    description: 'Gotowe checklisty do powtarzalnych spraw. Szablon ma skrócić start obsługi, nie zastępować decyzji operatora.',
  },
  responseTemplates: {
    kicker: 'ODPOWIEDZI',
    title: 'Biblioteka odpowiedzi',
    description: 'Własne gotowce do follow-upów, przypomnień i wiadomości do klientów. Źródłem prawdy jest Twoja biblioteka.',
  },
  activity: {
    kicker: 'AKTYWNOŚĆ',
    title: 'Aktywność',
    description: 'Historia ruchów w aplikacji. Tu sprawdzasz, co zostało zrobione i gdzie coś mogło wypaść z procesu.',
  },
  aiDrafts: {
    kicker: 'SZKICE DO SPRAWDZENIA',
    title: 'Szkice AI',
    description: 'Sprawdź, popraw i zatwierdź szkice przed zapisem.',
  },
  notifications: {
    kicker: 'POWIADOMIENIA',
    title: 'Powiadomienia',
    description: 'Przypomnienia, zaległe rzeczy i alerty, których nie możesz przegapić.',
  },
  billing: {
    kicker: 'ROZLICZENIA',
    title: 'Rozliczenia',
    description: 'Status dostępu i planu. Sprawdzasz trial, limity i funkcje dostępne w obecnym pakiecie.',
  },
  support: {
    kicker: 'POMOC',
    title: 'Pomoc',
    description: 'Zgłoszenia i status. Tu sprawdzasz problemy, notatki z testów i rzeczy wymagające naprawy.',
  },
  settings: {
    kicker: 'USTAWIENIA',
    title: 'Ustawienia',
    description: 'Konfiguracja konta, workspace i sposobu pracy aplikacji. Zmieniaj tylko rzeczy, które realnie wpływają na działanie systemu.',
  },
  adminAi: {
    kicker: 'AI ADMIN',
    title: 'Konfiguracja AI',
    description: 'Diagnostyka Quick Lead Capture i operatora AI. Ekran techniczny, bez providerów i kluczy dla użytkownika końcowego.',
  },
};

export function CloseFlowPageHeaderV2({ pageKey, actions }: CloseFlowPageHeaderV2Props) {
  const content = CLOSEFLOW_PAGE_HEADER_COPY[pageKey] || CLOSEFLOW_PAGE_HEADER_COPY.today;

  return (
    <header className="cf-page-header-v2" data-cf-page-header-v2={pageKey}>
      <div className="cf-page-header-v2__copy">
        <span className="cf-page-header-v2__kicker">{content.kicker}</span>
        <h1 className="cf-page-header-v2__title">{content.title}</h1>
        <p className="cf-page-header-v2__description">{content.description}</p>
      </div>

      {actions ? <div className="cf-page-header-v2__actions">{actions}</div> : null}
    </header>
  );
}
