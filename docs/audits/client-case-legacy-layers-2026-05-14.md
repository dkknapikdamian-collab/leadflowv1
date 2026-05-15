# Audyt ClientDetail / CaseDetail — stare warstwy, style i helpery

**Data wygenerowania:** 2026-05-14T17:44:18.541Z
**Repo root:** `C:\Users\malim\Desktop\biznesy_ai\2.closeflow`

## Werdykt techniczny

Ten raport jest tylko mapą audytową. Skrypt nie zmienia UI, logiki ani danych. Jego zadanie to pokazać, które stare warstwy mogą nadal wpływać na `ClientDetail` i `CaseDetail`, zanim zaczniemy kolejne poprawki.

## 1. Pliki objęte audytem

| Plik | Status |
| --- | --- |
| `src/pages/ClientDetail.tsx` | OK |
| `src/pages/CaseDetail.tsx` | OK |
| `src/styles/visual-stage12-client-detail-vnext.css` | OK |
| `src/styles/visual-stage13-case-detail-vnext.css` | OK |
| `src/styles/closeflow-case-history-visual-source-truth.css` | OK |
| `src/components/ContextActionDialogs.tsx` | OK |
| `src/components/entity-actions.tsx` | OK |
| `src/components/ui-system.tsx` | BRAK |
| `src/lib/finance/case-finance-source.ts` | OK |

**Uwaga:** brakuje 1 plików z listy wejściowej. To nie blokuje raportu, ale wymaga ręcznej oceny, czy ścieżki są stare, przeniesione albo usunięte.

## 2. Importy CSS w ClientDetail.tsx i CaseDetail.tsx

| Plik | Linia | Import CSS | Fragment |
| --- | --- | --- | --- |
| `src/pages/ClientDetail.tsx` | 118 | `../styles/visual-stage12-client-detail-vnext.css` | `import '../styles/visual-stage12-client-detail-vnext.css';` |
| `src/pages/CaseDetail.tsx` | 99 | `../styles/visual-stage13-case-detail-vnext.css` | `import '../styles/visual-stage13-case-detail-vnext.css';` |
| `src/pages/CaseDetail.tsx` | 100 | `../styles/closeflow-case-history-visual-source-truth.css` | `import '../styles/closeflow-case-history-visual-source-truth.css';` |

## 3. Klasy `client-detail-*`, `case-detail-*`, `right-card`

### 3.1. Podsumowanie tokenów klas

| Klasa / token | Liczba wystąpień |
| --- | --- |
| `client-detail-vnext-page` | 419 |
| `case-detail-vnext-page` | 279 |
| `case-detail-history-unified-panel` | 111 |
| `client-detail-summary-card` | 55 |
| `case-detail-section-card` | 43 |
| `case-detail-work-row` | 38 |
| `case-detail-history-row` | 35 |
| `case-detail-work-main` | 35 |
| `client-detail-note-card` | 29 |
| `client-detail-case-row` | 27 |
| `client-detail-top-tiles` | 25 |
| `case-detail-history-list` | 25 |
| `case-detail-work-date` | 25 |
| `client-detail-recent-moves-card` | 22 |
| `client-detail-case-row-wide` | 21 |
| `case-detail-history-summary-card` | 20 |
| `client-detail-right-card` | 19 |
| `client-detail-top-cards-side` | 19 |
| `case-detail-kind-pill` | 19 |
| `case-detail-row-actions` | 19 |
| `client-detail-card-title-row` | 18 |
| `case-detail-work` | 18 |
| `case-detail-right-rail` | 15 |
| `case-detail-right-card` | 15 |
| `client-detail-icon-button` | 14 |
| `client-detail-edit-field` | 13 |
| `client-detail-shell` | 13 |
| `client-detail-section-head` | 13 |
| `client-detail-left-rail` | 12 |
| `client-detail-next-action-tile-polish` | 12 |
| `client-detail-callout-danger` | 11 |
| `client-detail-callout-amber` | 11 |
| `client-detail-callout-green` | 11 |
| `client-detail-callout-blue` | 11 |
| `client-detail-callout-muted` | 11 |
| `client-detail-top-tile` | 11 |
| `client-detail-today-info-tile` | 11 |
| `client-detail-profile-card` | 11 |
| `right-card` | 11 |
| `client-detail-quick-actions-list` | 11 |
| `client-detail-edit-form` | 10 |
| `client-detail-section-card` | 10 |
| `client-detail-pill` | 10 |
| `client-detail-case-smart-delete-icon-button` | 10 |
| `client-detail-right-rail` | 10 |
| `case-detail-pill` | 10 |
| `case-detail-shell` | 10 |
| `case-detail-right-actions` | 10 |
| `client-detail-header-meta` | 9 |
| `client-detail-recent-move-row` | 9 |
| `client-detail-tabs` | 9 |
| `client-detail-relation-actions` | 9 |
| `case-detail-top-card` | 9 |
| `case-detail-section-head` | 9 |
| `client-detail-mini-button` | 8 |
| `client-detail-recent-moves-list` | 8 |
| `client-detail-relation-main` | 8 |
| `client-detail-case-smart-actions` | 8 |
| `case-detail-card-title-row` | 8 |
| `case-detail-note-follow-up-custom` | 8 |
| `case-detail-finance-payment-row` | 8 |
| `case-detail-tabs` | 8 |
| `case-detail-path-card` | 8 |
| `case-detail-work-icon` | 8 |
| `client-detail-action-grid` | 8 |
| `case-detail-create-action-card` | 8 |
| `client-detail-tab-panel` | 7 |
| `client-detail-completeness-card` | 7 |
| `client-detail-note-text` | 7 |
| `client-detail-notes-list-head` | 7 |
| `case-detail-checklist-row` | 7 |
| `client-detail-note-inline` | 7 |
| `case-detail-header-actions` | 7 |
| `case-detail-finance-stat` | 7 |
| `client-detail-history-row` | 6 |
| `client-detail-side-quick-actions-grid` | 6 |
| `client-detail-note-item-toolbar` | 6 |
| `case-detail-note-follow-up-head` | 6 |
| `client-detail-source-grid` | 6 |
| `case-detail-action-button` | 6 |

### 3.2. Wystąpienia z lokalizacją

| Plik | Linia | Token | Fragment |
| --- | --- | --- | --- |
| `src/pages/ClientDetail.tsx` | 70 | `client-detail-more-menu` | `const CLIENT_DETAIL_FINAL_MORE_MENU_GUARD = 'Dodatkowe client-detail-more-menu Drugorzędne akcje menu pomocnicze';` |
| `src/pages/ClientDetail.tsx` | 120 | `client-detail-vnext` | `import '../styles/visual-stage12-client-detail-vnext.css';` |
| `src/pages/ClientDetail.tsx` | 630 | `client-detail-next-action-context` | `<p className="client-detail-next-action-context" title={contextTitle}>` |
| `src/pages/ClientDetail.tsx` | 700 | `client-detail-pill-danger` | `if (['blocked', 'overdue'].includes(normalized)) return 'client-detail-pill-danger';` |
| `src/pages/ClientDetail.tsx` | 701 | `client-detail-pill-amber` | `if (['waiting_on_client', 'on_hold', 'to_approve'].includes(normalized)) return 'client-detail-pill-amber';` |
| `src/pages/ClientDetail.tsx` | 702 | `client-detail-pill-green` | `if (['completed', 'done', 'paid', 'ready_to_start'].includes(normalized)) return 'client-detail-pill-green';` |
| `src/pages/ClientDetail.tsx` | 703 | `client-detail-pill-muted` | `if (['canceled', 'cancelled', 'lost'].includes(normalized)) return 'client-detail-pill-muted';` |
| `src/pages/ClientDetail.tsx` | 704 | `client-detail-pill-blue` | `return 'client-detail-pill-blue';` |
| `src/pages/ClientDetail.tsx` | 707 | `client-detail-callout-danger` | `if (tone === 'red') return 'client-detail-callout-danger';` |
| `src/pages/ClientDetail.tsx` | 708 | `client-detail-callout-amber` | `if (tone === 'amber') return 'client-detail-callout-amber';` |
| `src/pages/ClientDetail.tsx` | 709 | `client-detail-callout-green` | `if (tone === 'emerald') return 'client-detail-callout-green';` |
| `src/pages/ClientDetail.tsx` | 710 | `client-detail-callout-blue` | `if (tone === 'blue') return 'client-detail-callout-blue';` |
| `src/pages/ClientDetail.tsx` | 711 | `client-detail-callout-muted` | `return 'client-detail-callout-muted';` |
| `src/pages/ClientDetail.tsx` | 867 | `client-detail-edit-field` | `<div className="client-detail-edit-field" data-client-contact-repeat={kind}>` |
| `src/pages/ClientDetail.tsx` | 868 | `client-detail-edit-label-row` | `<div className="client-detail-edit-label-row">` |
| `src/pages/ClientDetail.tsx` | 872 | `client-detail-mini-button` | `className="client-detail-mini-button"` |
| `src/pages/ClientDetail.tsx` | 880 | `client-detail-contact-repeat-list` | `<div className="client-detail-contact-repeat-list">` |
| `src/pages/ClientDetail.tsx` | 882 | `client-detail-contact-repeat-row` | `<div key={index} className="client-detail-contact-repeat-row" data-client-contact-repeat-row={kind}>` |
| `src/pages/ClientDetail.tsx` | 892 | `client-detail-mini-button` | `className="client-detail-mini-button client-detail-mini-button-muted"` |
| `src/pages/ClientDetail.tsx` | 892 | `client-detail-mini-button-muted` | `className="client-detail-mini-button client-detail-mini-button-muted"` |
| `src/pages/ClientDetail.tsx` | 908 | `client-detail-info-row` | `<div className="client-detail-info-row">` |
| `src/pages/ClientDetail.tsx` | 909 | `client-detail-info-icon` | `<span className="client-detail-info-icon">` |
| `src/pages/ClientDetail.tsx` | 917 | `client-detail-icon-button` | `<button type="button" className="client-detail-icon-button" onClick={onCopy} aria-label={copyLabel} title={copyLabel}>` |
| `src/pages/ClientDetail.tsx` | 926 | `client-detail-stat-cell` | `<div className="client-detail-stat-cell">` |
| `src/pages/ClientDetail.tsx` | 933 | `client-detail-top-tiles` | `const CLIENT_DETAIL_TOP_TILES_REPAIR6_GUARD = 'client-detail-top-tiles repair6 compact unified safe';` |
| `src/pages/ClientDetail.tsx` | 987 | `client-detail-top-tiles` | `<section className="client-detail-top-tiles entity-overview-tiles" data-client-top-tiles="true" aria-label="Szybkie podsumowanie klienta">` |
| `src/pages/ClientDetail.tsx` | 989 | `client-detail-top-tile` | `className={'client-detail-top-tile entity-overview-tile entity-overview-tile-action ' + nextActionToneClass(nextAction.tone)}` |
| `src/pages/ClientDetail.tsx` | 1007 | `client-detail-top-tile` | `<article className="client-detail-top-tile entity-overview-tile entity-overview-tile-finance" data-client-top-tile="finance-summary">` |
| `src/pages/ClientDetail.tsx` | 1029 | `client-detail-top-tile` | `<article className="client-detail-top-tile entity-overview-tile entity-overview-tile-cases" data-client-top-tile="cases-summary">` |
| `src/pages/ClientDetail.tsx` | 1633 | `client-detail-vnext-page` | `<main className="client-detail-vnext-page">` |
| `src/pages/ClientDetail.tsx` | 1634 | `client-detail-loading-card` | `<div className="client-detail-loading-card">` |
| `src/pages/ClientDetail.tsx` | 1658 | `client-detail-vnext-page` | `<main className="client-detail-vnext-page">` |
| `src/pages/ClientDetail.tsx` | 1659 | `client-detail-empty-card` | `<section className="client-detail-empty-card">` |
| `src/pages/ClientDetail.tsx` | 1675 | `client-detail-vnext-page` | `<main className="client-detail-vnext-page" data-client-detail-simplified-card-view="true">` |
| `src/pages/ClientDetail.tsx` | 1675 | `client-detail-simplified-card-view` | `<main className="client-detail-vnext-page" data-client-detail-simplified-card-view="true">` |
| `src/pages/ClientDetail.tsx` | 1676 | `client-detail-header` | `<header className="client-detail-header">` |
| `src/pages/ClientDetail.tsx` | 1677 | `client-detail-header-copy` | `<div className="client-detail-header-copy">` |
| `src/pages/ClientDetail.tsx` | 1678 | `client-detail-back-button` | `<button type="button" className="client-detail-back-button" onClick={() => navigate('/clients')}>` |
| `src/pages/ClientDetail.tsx` | 1682 | `client-detail-breadcrumb` | `<p className="client-detail-breadcrumb">Klienci / {getClientName(client)}</p>` |
| `src/pages/ClientDetail.tsx` | 1683 | `client-detail-kicker` | `<p className="client-detail-kicker">KARTOTEKA KLIENTA</p>` |
| `src/pages/ClientDetail.tsx` | 1685 | `client-detail-header-meta` | `<div className="client-detail-header-meta">` |
| `src/pages/ClientDetail.tsx` | 1691 | `client-detail-header-actions` | `<div className="client-detail-header-actions">` |
| `src/pages/ClientDetail.tsx` | 1693 | `client-detail-header-action-soft` | `<Button type="button" variant="default" className="client-detail-header-action-soft" asChild>` |
| `src/pages/ClientDetail.tsx` | 1703 | `client-detail-header-action-primary` | `<Button type="button" className="client-detail-header-action-primary" onClick={openMainCase} disabled={!mainCase?.id}>` |
| `src/pages/ClientDetail.tsx` | 1718 | `client-detail-shell` | `<div className="client-detail-shell">` |
| `src/pages/ClientDetail.tsx` | 1719 | `client-detail-left-rail` | `<aside className="client-detail-left-rail">` |
| `src/pages/ClientDetail.tsx` | 1721 | `client-detail-today-info-tiles` | `<section className="client-detail-today-info-tiles" data-client-left-management-tiles="true" data-client-today-style-info-tiles="true" aria-label="Informacje o kliencie">` |
| `src/pages/ClientDetail.tsx` | 1722 | `client-detail-today-info-tile` | `<article className={\`client-detail-today-info-tile ${nextActionToneClass(clientNextAction.tone)}\`} data-client-left-next-action-tile="true">` |
| `src/pages/ClientDetail.tsx` | 1723 | `client-detail-today-info-tile-icon` | `<div className="client-detail-today-info-tile-icon">` |
| `src/pages/ClientDetail.tsx` | 1726 | `client-detail-today-info-tile-body` | `<div className="client-detail-today-info-tile-body">` |
| `src/pages/ClientDetail.tsx` | 1736 | `client-detail-today-info-tile-action` | `className="client-detail-today-info-tile-action"` |
| `src/pages/ClientDetail.tsx` | 1761 | `client-detail-today-info-tile` | `<article className="client-detail-today-info-tile client-detail-today-info-tile-finance" data-client-left-finance-tile="true">` |
| `src/pages/ClientDetail.tsx` | 1761 | `client-detail-today-info-tile-finance` | `<article className="client-detail-today-info-tile client-detail-today-info-tile-finance" data-client-left-finance-tile="true">` |
| `src/pages/ClientDetail.tsx` | 1762 | `client-detail-today-info-tile-icon` | `<div className="client-detail-today-info-tile-icon">` |
| `src/pages/ClientDetail.tsx` | 1765 | `client-detail-today-info-tile-body` | `<div className="client-detail-today-info-tile-body">` |
| `src/pages/ClientDetail.tsx` | 1770 | `client-detail-today-info-tile-meta` | `<div className="client-detail-today-info-tile-meta">` |
| `src/pages/ClientDetail.tsx` | 1779 | `client-detail-profile-card` | `<section className="client-detail-profile-card client-detail-side-card" data-client-inline-contact-edit="true">` |
| `src/pages/ClientDetail.tsx` | 1779 | `client-detail-side-card` | `<section className="client-detail-profile-card client-detail-side-card" data-client-inline-contact-edit="true">` |
| `src/pages/ClientDetail.tsx` | 1780 | `client-detail-avatar-row` | `<div className="client-detail-avatar-row">` |
| `src/pages/ClientDetail.tsx` | 1781 | `client-detail-avatar` | `<div className="client-detail-avatar">{getInitials(client)}</div>` |
| `src/pages/ClientDetail.tsx` | 1791 | `client-detail-visible-edit-action` | `className="client-detail-visible-edit-action client-detail-edit-main-button"` |
| `src/pages/ClientDetail.tsx` | 1791 | `client-detail-edit-main-button` | `className="client-detail-visible-edit-action client-detail-edit-main-button"` |
| `src/pages/ClientDetail.tsx` | 1792 | `client-detail-visible-edit-action` | `data-client-detail-visible-edit-action="true"` |
| `src/pages/ClientDetail.tsx` | 1802 | `client-detail-edit-form` | `<div className="client-detail-edit-form">` |
| `src/pages/ClientDetail.tsx` | 1803 | `client-detail-edit-field` | `<div className="client-detail-edit-field">` |
| `src/pages/ClientDetail.tsx` | 1807 | `client-detail-edit-field` | `<div className="client-detail-edit-field">` |
| `src/pages/ClientDetail.tsx` | 1825 | `client-detail-edit-field` | `<div className="client-detail-edit-field">` |
| `src/pages/ClientDetail.tsx` | 1837 | `client-detail-edit-actions` | `<div className={formActionsClass('client-detail-edit-actions')}>` |
| `src/pages/ClientDetail.tsx` | 1848 | `client-detail-contact-list` | `<div className="client-detail-contact-list">` |
| `src/pages/ClientDetail.tsx` | 1858 | `client-detail-right-card` | `<section className="client-detail-right-card client-detail-recent-moves-card" data-client-recent-moves-panel="true">` |
| `src/pages/ClientDetail.tsx` | 1858 | `client-detail-recent-moves-card` | `<section className="client-detail-right-card client-detail-recent-moves-card" data-client-recent-moves-panel="true">` |
| `src/pages/ClientDetail.tsx` | 1859 | `client-detail-card-title-row` | `<div className="client-detail-card-title-row">` |
| `src/pages/ClientDetail.tsx` | 1864 | `client-detail-recent-moves-list` | `<div className="client-detail-recent-moves-list">` |
| `src/pages/ClientDetail.tsx` | 1866 | `client-detail-recent-move-row` | `<Link key={move.id} to="/activity" className="client-detail-recent-move-row">` |
| `src/pages/ClientDetail.tsx` | 1876 | `client-detail-light-empty` | `<p className="client-detail-light-empty">Brak ostatnich ruchów dla tego klienta.</p>` |
| `src/pages/ClientDetail.tsx` | 1878 | `client-detail-recent-moves-link` | `<Link to="/activity" className="client-detail-recent-moves-link">` |
| `src/pages/ClientDetail.tsx` | 1885 | `client-detail-main-column` | `<section className="client-detail-main-column">` |
| `src/pages/ClientDetail.tsx` | 1886 | `client-detail-tabs` | `<nav className="client-detail-tabs" aria-label="Zakładki klienta">` |
| `src/pages/ClientDetail.tsx` | 1899 | `client-detail-tab-active` | `className={activeTab === tab.key ? 'client-detail-tab-active' : ''}` |
| `src/pages/ClientDetail.tsx` | 1908 | `client-detail-tab-panel` | `<div className="client-detail-tab-panel">` |
| `src/pages/ClientDetail.tsx` | 1909 | `client-detail-top-cards` | `<div className="client-detail-top-cards">` |
| `src/pages/ClientDetail.tsx` | 1910 | `client-detail-hero-card` | `<section className="client-detail-hero-card" aria-label="Najbliższa zaplanowana akcja">` |
| `src/pages/ClientDetail.tsx` | 1911 | `client-detail-hero-kicker` | `<div className="client-detail-hero-kicker">NAJBLIŻSZA ZAPLANOWANA AKCJA</div>` |
| `src/pages/ClientDetail.tsx` | 1912 | `client-detail-hero-date` | `<div className="client-detail-hero-date">{nextAction.date \|\| formatDate(new Date())}</div>` |
| `src/pages/ClientDetail.tsx` | 1913 | `client-detail-hero-sub` | `<div className="client-detail-hero-sub">{nextAction.subtitle}</div>` |
| `src/pages/ClientDetail.tsx` | 1916 | `client-detail-hero-cta` | `className="client-detail-hero-cta"` |
| `src/pages/ClientDetail.tsx` | 1928 | `client-detail-top-cards-side` | `<div className="client-detail-top-cards-side">` |
| `src/pages/ClientDetail.tsx` | 1929 | `client-detail-completeness-card` | `<section className="client-detail-completeness-card" aria-label="Kompletność sprawy">` |
| `src/pages/ClientDetail.tsx` | 1930 | `client-detail-card-title-row` | `<div className="client-detail-card-title-row">` |
| `src/pages/ClientDetail.tsx` | 1936 | `client-detail-progress` | `{mainCase ? <div className="client-detail-progress"><span style={{ width: \`${mainCaseCompleteness}%\` }} /></div> : null}` |
| `src/pages/ClientDetail.tsx` | 1938 | `client-detail-completeness-note` | `<div className="client-detail-completeness-note">` |
| `src/pages/ClientDetail.tsx` | 1945 | `client-detail-summary-card` | `<section className="client-detail-summary-card client-detail-finance-card" aria-label="Finanse klienta">` |
| `src/pages/ClientDetail.tsx` | 1945 | `client-detail-finance-card` | `<section className="client-detail-summary-card client-detail-finance-card" aria-label="Finanse klienta">` |
| `src/pages/ClientDetail.tsx` | 1946 | `client-detail-card-title-row` | `<div className="client-detail-card-title-row">` |
| `src/pages/ClientDetail.tsx` | 1950 | `client-detail-finance-metrics` | `<div className="client-detail-finance-metrics">` |
| `src/pages/ClientDetail.tsx` | 1969 | `client-detail-section-card` | `<section className="client-detail-section-card">` |
| `src/pages/ClientDetail.tsx` | 1970 | `client-detail-section-head` | `<div className="client-detail-section-head">` |
| `src/pages/ClientDetail.tsx` | 1978 | `client-detail-relations-list` | `<div className="client-detail-relations-list">` |
| `src/pages/ClientDetail.tsx` | 1981 | `client-detail-relation-row` | `<article key={String(lead.id)} className="client-detail-relation-row">` |
| `src/pages/ClientDetail.tsx` | 1982 | `client-detail-relation-main` | `<div className="client-detail-relation-main">` |
| `src/pages/ClientDetail.tsx` | 1986 | `client-detail-pill` | `<span className="client-detail-pill client-detail-pill-muted">Lead</span>` |
| `src/pages/ClientDetail.tsx` | 1986 | `client-detail-pill-muted` | `<span className="client-detail-pill client-detail-pill-muted">Lead</span>` |
| `src/pages/ClientDetail.tsx` | 1987 | `client-detail-relation-actions` | `<div className="client-detail-relation-actions">` |
| `src/pages/ClientDetail.tsx` | 2001 | `client-detail-light-empty` | `<div className="client-detail-light-empty">Brak spraw przy tym kliencie. Po pozyskaniu tematu utwórz sprawę i prowadź tam dalszą obsługę.</div>` |
| `src/pages/ClientDetail.tsx` | 2004 | `client-detail-relation-row` | `<article key={caseRecord.id} className="client-detail-relation-row">` |
| `src/pages/ClientDetail.tsx` | 2005 | `client-detail-relation-main` | `<div className="client-detail-relation-main">` |
| `src/pages/ClientDetail.tsx` | 2009 | `client-detail-pill` | `<span className={\`client-detail-pill ${statusBadgeClass(caseRecord.status)}\`}>` |
| `src/pages/ClientDetail.tsx` | 2012 | `client-detail-relation-actions` | `<div className="client-detail-relation-actions">` |
| `src/pages/ClientDetail.tsx` | 2028 | `client-detail-section-card` | `<section className="client-detail-section-card" data-client-summary-source-lead-panel="true">` |
| `src/pages/ClientDetail.tsx` | 2029 | `client-detail-section-head` | `<div className="client-detail-section-head">` |
| `src/pages/ClientDetail.tsx` | 2040 | `client-detail-acquisition-line` | `<div className="client-detail-acquisition-line">` |
| `src/pages/ClientDetail.tsx` | 2058 | `client-detail-tab-panel` | `<div className="client-detail-tab-panel" data-client-cases-list-panel="true">` |
| `src/pages/ClientDetail.tsx` | 2059 | `client-detail-section-card` | `<section className="client-detail-section-card">` |
| `src/pages/ClientDetail.tsx` | 2060 | `client-detail-section-head` | `<div className="client-detail-section-head">` |
| `src/pages/ClientDetail.tsx` | 2068 | `client-detail-case-smart-list` | `<div className="client-detail-case-smart-list" data-client-case-smart-list="true">` |
| `src/pages/ClientDetail.tsx` | 2103 | `client-detail-case-smart-card` | `<article key={caseId \|\| title} className="client-detail-case-smart-card" data-client-case-smart-card="true">` |
| `src/pages/ClientDetail.tsx` | 2104 | `client-detail-case-smart-main` | `<div className="client-detail-case-smart-main">` |
| `src/pages/ClientDetail.tsx` | 2105 | `client-detail-case-smart-kicker` | `<span className="client-detail-case-smart-kicker">Sprawa</span>` |
| `src/pages/ClientDetail.tsx` | 2107 | `client-detail-case-smart-meta` | `<div className="client-detail-case-smart-meta">` |
| `src/pages/ClientDetail.tsx` | 2112 | `client-detail-case-smart-value` | `<div className="client-detail-case-smart-value">` |
| `src/pages/ClientDetail.tsx` | 2116 | `client-detail-case-smart-actions` | `<div className="client-detail-case-smart-actions">` |
| `src/pages/ClientDetail.tsx` | 2129 | `client-detail-case-smart-delete-icon-button` | `className="client-detail-case-smart-delete-icon-button"` |
| `src/pages/ClientDetail.tsx` | 2152 | `client-detail-case-smart-empty` | `<div className="client-detail-case-smart-empty">Brak aktywnej sprawy dla klienta.</div>` |
| `src/pages/ClientDetail.tsx` | 2156 | `client-detail-relations-list` | `<div className="client-detail-relations-list client-detail-relations-list-acquisition-only">` |
| `src/pages/ClientDetail.tsx` | 2156 | `client-detail-relations-list-acquisition-only` | `<div className="client-detail-relations-list client-detail-relations-list-acquisition-only">` |
| `src/pages/ClientDetail.tsx` | 2165 | `client-detail-relation-row` | `className="client-detail-relation-row client-detail-relation-row-acquisition-only"` |
| `src/pages/ClientDetail.tsx` | 2165 | `client-detail-relation-row-acquisition-only` | `className="client-detail-relation-row client-detail-relation-row-acquisition-only"` |
| `src/pages/ClientDetail.tsx` | 2168 | `client-detail-relation-main` | `<div className="client-detail-relation-main">` |
| `src/pages/ClientDetail.tsx` | 2179 | `client-detail-light-empty` | `<div className="client-detail-light-empty">` |
| `src/pages/ClientDetail.tsx` | 2188 | `client-detail-tab-panel` | `<div className="client-detail-tab-panel">` |
| `src/pages/ClientDetail.tsx` | 2189 | `client-detail-section-card` | `<section className="client-detail-section-card">` |
| `src/pages/ClientDetail.tsx` | 2190 | `client-detail-section-head` | `<div className="client-detail-section-head">` |
| `src/pages/ClientDetail.tsx` | 2196 | `client-detail-history-list` | `<div className="client-detail-history-list">` |
| `src/pages/ClientDetail.tsx` | 2198 | `client-detail-light-empty` | `<div className="client-detail-light-empty">Brak historii do pokazania.</div>` |
| `src/pages/ClientDetail.tsx` | 2201 | `client-detail-history-row` | `<article key={String(activity.id \|\| activity.eventType \|\| getActivityTime(activity))} className="client-detail-history-row">` |
| `src/pages/ClientDetail.tsx` | 2202 | `client-detail-history-dot` | `<span className="client-detail-history-dot"><EntityIcon entity="activity" className="h-4 w-4" /></span>` |
| `src/pages/ClientDetail.tsx` | 2216 | `client-detail-right-rail` | `<aside className="client-detail-right-rail" aria-label="Panel klienta">` |
| `src/pages/ClientDetail.tsx` | 2218 | `right-card` | `<section className="right-card client-detail-right-card client-detail-operational-center" aria-label="Centrum operacyjne klienta">` |
| `src/pages/ClientDetail.tsx` | 2218 | `client-detail-right-card` | `<section className="right-card client-detail-right-card client-detail-operational-center" aria-label="Centrum operacyjne klienta">` |
| `src/pages/ClientDetail.tsx` | 2218 | `client-detail-operational-center` | `<section className="right-card client-detail-right-card client-detail-operational-center" aria-label="Centrum operacyjne klienta">` |
| `src/pages/ClientDetail.tsx` | 2219 | `client-detail-card-title-row` | `<div className="client-detail-card-title-row">` |
| `src/pages/ClientDetail.tsx` | 2223 | `client-detail-quick-actions-list` | `<div className="client-detail-quick-actions-list">` |
| `src/pages/ClientDetail.tsx` | 2239 | `client-detail-stage35-removed-quick-actions` | `<div hidden data-client-detail-stage35-removed-quick-actions="true" />` |
| `src/pages/ClientDetail.tsx` | 2240 | `client-detail-stage35-retain-open-new-lead` | `<div hidden data-client-detail-stage35-retain-open-new-lead={String(Boolean(openNewLeadForExistingClient))} />` |
| `src/pages/ClientDetail.tsx` | 2245 | `right-card` | `<section className="right-card client-detail-right-card client-detail-side-quick-actions-card" data-client-side-quick-actions="true">` |
| `src/pages/ClientDetail.tsx` | 2245 | `client-detail-right-card` | `<section className="right-card client-detail-right-card client-detail-side-quick-actions-card" data-client-side-quick-actions="true">` |
| `src/pages/ClientDetail.tsx` | 2245 | `client-detail-side-quick-actions-card` | `<section className="right-card client-detail-right-card client-detail-side-quick-actions-card" data-client-side-quick-actions="true">` |
| `src/pages/ClientDetail.tsx` | 2246 | `client-detail-card-title-row` | `<div className="client-detail-card-title-row">` |
| `src/pages/ClientDetail.tsx` | 2250 | `client-detail-side-quick-actions-grid` | `<div className="client-detail-side-quick-actions-grid">` |
| `src/pages/ClientDetail.tsx` | 2308 | `right-card` | `<section className="right-card client-detail-right-card client-detail-note-card">` |
| `src/pages/ClientDetail.tsx` | 2308 | `client-detail-right-card` | `<section className="right-card client-detail-right-card client-detail-note-card">` |
| `src/pages/ClientDetail.tsx` | 2308 | `client-detail-note-card` | `<section className="right-card client-detail-right-card client-detail-note-card">` |
| `src/pages/ClientDetail.tsx` | 2309 | `client-detail-card-title-row` | `<div className="client-detail-card-title-row">` |
| `src/pages/ClientDetail.tsx` | 2313 | `client-detail-note-text` | `<p className="client-detail-note-text">` |
| `src/pages/ClientDetail.tsx` | 2321 | `client-detail-notes-list` | `<div className="client-detail-notes-list" data-client-notes-list="true">` |
| `src/pages/ClientDetail.tsx` | 2322 | `client-detail-notes-list-head` | `<div className="client-detail-notes-list-head">` |
| `src/pages/ClientDetail.tsx` | 2327 | `client-detail-notes-items` | `<div className="client-detail-notes-items">` |
| `src/pages/ClientDetail.tsx` | 2331 | `client-detail-note-item` | `className="client-detail-note-item"` |
| `src/pages/ClientDetail.tsx` | 2335 | `client-detail-note-item-toolbar` | `<div className="client-detail-note-item-toolbar" data-client-note-actions="true">` |
| `src/pages/ClientDetail.tsx` | 2345 | `client-detail-note-delete-button` | `<EntityActionButton type="button" tone="danger" iconOnly className="client-detail-note-delete-button" title="Usuń notatkę" aria-label="Usuń notatkę" onClick={() => handleDeleteClientNote(note)}>` |
| `src/pages/ClientDetail.tsx` | 2355 | `client-detail-note-list` | `<div className="client-detail-note-list" data-client-notes-list="true">` |
| `src/pages/ClientDetail.tsx` | 2358 | `client-detail-note-row` | `<article className="client-detail-note-row" key={String(note.id \|\| note.createdAt \|\| note.created_at \|\| getClientActivityBodyStage14A(note))}>` |
| `src/pages/ClientDetail.tsx` | 2371 | `right-card` | `<section className="right-card client-detail-right-card" data-client-finance-summary="true">` |
| `src/pages/ClientDetail.tsx` | 2371 | `client-detail-right-card` | `<section className="right-card client-detail-right-card" data-client-finance-summary="true">` |
| `src/pages/ClientDetail.tsx` | 2372 | `client-detail-card-title-row` | `<div className="client-detail-card-title-row">` |
| `src/pages/ClientDetail.tsx` | 2380 | `client-detail-quick-actions-list` | `<div className="client-detail-quick-actions-list">` |
| `src/pages/CaseDetail.tsx` | 99 | `case-detail-vnext` | `import '../styles/visual-stage13-case-detail-vnext.css';` |
| `src/pages/CaseDetail.tsx` | 597 | `case-detail-work-row` | `const CLOSEFLOW_CASE_HISTORY_WORKROW_LEAK_FIX_2026_05_13 = 'CaseActivity history entries must not render through case-detail-work-row';` |
| `src/pages/CaseDetail.tsx` | 611 | `case-detail-pill-green` | `if (['accepted', 'done', 'completed', 'ready_to_start'].includes(String(status \|\| ''))) return 'case-detail-pill-green';` |
| `src/pages/CaseDetail.tsx` | 612 | `case-detail-pill-blue` | `if (['uploaded', 'to_approve', 'in_progress', 'scheduled', 'planned', 'open'].includes(String(status \|\| ''))) return 'case-detail-pill-blue';` |
| `src/pages/CaseDetail.tsx` | 613 | `case-detail-pill-red` | `if (['rejected', 'blocked', 'overdue'].includes(String(status \|\| ''))) return 'case-detail-pill-red';` |
| `src/pages/CaseDetail.tsx` | 614 | `case-detail-pill-amber` | `if (['missing', 'waiting_on_client', 'on_hold'].includes(String(status \|\| ''))) return 'case-detail-pill-amber';` |
| `src/pages/CaseDetail.tsx` | 615 | `case-detail-pill-muted` | `return 'case-detail-pill-muted';` |
| `src/pages/CaseDetail.tsx` | 789 | `case-detail-recent-move-dot-task` | `if (eventType.includes('task')) return { label: 'Zadanie', className: 'case-detail-recent-move-dot-task' };` |
| `src/pages/CaseDetail.tsx` | 790 | `case-detail-recent-move-dot-event` | `if (eventType.includes('event')) return { label: 'Wydarzenie', className: 'case-detail-recent-move-dot-event' };` |
| `src/pages/CaseDetail.tsx` | 791 | `case-detail-recent-move-dot-item` | `if (eventType.includes('item') \|\| eventType.includes('file') \|\| eventType.includes('decision')) return { label: 'Kompletność', className: 'case-detail-recent-move-dot-item' };` |
| `src/pages/CaseDetail.tsx` | 792 | `case-detail-recent-move-dot-status` | `if (eventType.includes('status') \|\| eventType.includes('lifecycle')) return { label: 'Status', className: 'case-detail-recent-move-dot-status' };` |
| `src/pages/CaseDetail.tsx` | 793 | `case-detail-recent-move-dot-note` | `if (eventType.includes('note')) return { label: 'Notatka', className: 'case-detail-recent-move-dot-note' };` |
| `src/pages/CaseDetail.tsx` | 794 | `case-detail-recent-move-dot-note` | `return { label: 'Ruch', className: 'case-detail-recent-move-dot-note' };` |
| `src/pages/CaseDetail.tsx` | 991 | `case-detail-page` | `<main className="case-detail-page case-detail-page-loading" data-case-detail-loading="true">` |
| `src/pages/CaseDetail.tsx` | 991 | `case-detail-page-loading` | `<main className="case-detail-page case-detail-page-loading" data-case-detail-loading="true">` |
| `src/pages/CaseDetail.tsx` | 991 | `case-detail-loading` | `<main className="case-detail-page case-detail-page-loading" data-case-detail-loading="true">` |
| `src/pages/CaseDetail.tsx` | 992 | `case-detail-transition-loader` | `<section className="case-detail-transition-loader" role="status" aria-live="polite">` |
| `src/pages/CaseDetail.tsx` | 1001 | `case-detail-delete-confirm` | `data-case-detail-delete-confirm="true"` |
| `src/pages/CaseDetail.tsx` | 1855 | `case-detail-vnext-page` | `<main className="case-detail-vnext-page">` |
| `src/pages/CaseDetail.tsx` | 1856 | `case-detail-loading-card` | `<section className="case-detail-loading-card">` |
| `src/pages/CaseDetail.tsx` | 1880 | `case-detail-vnext-page` | `<main className="case-detail-vnext-page">` |
| `src/pages/CaseDetail.tsx` | 1881 | `case-detail-empty-card` | `<section className="case-detail-empty-card">` |
| `src/pages/CaseDetail.tsx` | 1898 | `case-detail-delete-shortcut` | `<div className="cf-case-detail-delete-shortcut">` |
| `src/pages/CaseDetail.tsx` | 1902 | `case-detail-delete-action` | `data-case-detail-delete-action="true"` |
| `src/pages/CaseDetail.tsx` | 1913 | `case-detail-vnext-page` | `<main className="case-detail-vnext-page">` |
| `src/pages/CaseDetail.tsx` | 1914 | `case-detail-header` | `<header className="case-detail-header">` |
| `src/pages/CaseDetail.tsx` | 1915 | `case-detail-header-copy` | `<div className="case-detail-header-copy">` |
| `src/pages/CaseDetail.tsx` | 1916 | `case-detail-back-button` | `<button type="button" className="case-detail-back-button" onClick={() => navigate('/cases')}>` |
| `src/pages/CaseDetail.tsx` | 1920 | `case-detail-breadcrumb` | `<p className="case-detail-breadcrumb">Sprawy</p>` |
| `src/pages/CaseDetail.tsx` | 1921 | `case-detail-title-row` | `<div className="case-detail-title-row">` |
| `src/pages/CaseDetail.tsx` | 1923 | `case-detail-pill` | `<span className={\`case-detail-pill ${getStatusClass(effectiveStatus)}\`}>{getCaseStatusLabel(effectiveStatus)}</span>` |
| `src/pages/CaseDetail.tsx` | 1925 | `case-detail-header-meta` | `<div className="case-detail-header-meta">` |
| `src/pages/CaseDetail.tsx` | 1933 | `case-detail-top-grid` | `<section className="case-detail-top-grid">` |
| `src/pages/CaseDetail.tsx` | 1934 | `case-detail-top-card` | `<article className="case-detail-top-card case-detail-top-card-blue">` |
| `src/pages/CaseDetail.tsx` | 1934 | `case-detail-top-card-blue` | `<article className="case-detail-top-card case-detail-top-card-blue">` |
| `src/pages/CaseDetail.tsx` | 1935 | `case-detail-card-title-row` | `<div className="case-detail-card-title-row">` |
| `src/pages/CaseDetail.tsx` | 1942 | `case-detail-top-card` | `<article className="case-detail-top-card case-detail-top-card-green">` |
| `src/pages/CaseDetail.tsx` | 1942 | `case-detail-top-card-green` | `<article className="case-detail-top-card case-detail-top-card-green">` |
| `src/pages/CaseDetail.tsx` | 1943 | `case-detail-card-title-row` | `<div className="case-detail-card-title-row">` |
| `src/pages/CaseDetail.tsx` | 1949 | `case-detail-progress` | `<div className="case-detail-progress"><span style={{ width: \`${completionPercent}%\` }} /></div>` |
| `src/pages/CaseDetail.tsx` | 1951 | `case-detail-top-card` | `<article className="case-detail-top-card case-detail-top-card-amber">` |
| `src/pages/CaseDetail.tsx` | 1951 | `case-detail-top-card-amber` | `<article className="case-detail-top-card case-detail-top-card-amber">` |
| `src/pages/CaseDetail.tsx` | 1952 | `case-detail-card-title-row` | `<div className="case-detail-card-title-row">` |
| `src/pages/CaseDetail.tsx` | 1959 | `case-detail-top-card` | `<article className="case-detail-top-card case-detail-top-card-muted">` |
| `src/pages/CaseDetail.tsx` | 1959 | `case-detail-top-card-muted` | `<article className="case-detail-top-card case-detail-top-card-muted">` |
| `src/pages/CaseDetail.tsx` | 1960 | `case-detail-card-title-row` | `<div className="case-detail-card-title-row">` |
| `src/pages/CaseDetail.tsx` | 1969 | `case-detail-shell` | `<div className="case-detail-shell">` |
| `src/pages/CaseDetail.tsx` | 1970 | `case-detail-main-column` | `<section className="case-detail-main-column">` |
| `src/pages/CaseDetail.tsx` | 1973 | `case-detail-note-follow-up-panel` | `<section className="case-detail-note-follow-up-panel" data-case-note-follow-up-prompt="true">` |
| `src/pages/CaseDetail.tsx` | 1974 | `case-detail-note-follow-up-head` | `<div className="case-detail-note-follow-up-head">` |
| `src/pages/CaseDetail.tsx` | 1976 | `case-detail-eyebrow` | `<p className="case-detail-eyebrow">Następny ruch</p>` |
| `src/pages/CaseDetail.tsx` | 1984 | `case-detail-note-follow-up-preview` | `<div className="case-detail-note-follow-up-preview">{pendingNoteFollowUp.note}</div>` |
| `src/pages/CaseDetail.tsx` | 1985 | `case-detail-note-follow-up-actions` | `<div className="case-detail-note-follow-up-actions">` |
| `src/pages/CaseDetail.tsx` | 1991 | `case-detail-note-follow-up-custom` | `<div className="case-detail-note-follow-up-custom">` |
| `src/pages/CaseDetail.tsx` | 1999 | `case-detail-finance-history-panel` | `<section className="case-detail-finance-history-panel" data-case-finance-history-panel="true">` |
| `src/pages/CaseDetail.tsx` | 2001 | `case-detail-finance-payments-head` | `<div className="case-detail-finance-payments-head">` |
| `src/pages/CaseDetail.tsx` | 2011 | `case-detail-finance-history-list` | `<div className="case-detail-finance-history-list">` |
| `src/pages/CaseDetail.tsx` | 2015 | `case-detail-finance-payment-row` | `<article key={String(payment.id \|\| payment.createdAt \|\| payment.note \|\| getPaymentAmount(payment))} className="case-detail-finance-payment-row">` |
| `src/pages/CaseDetail.tsx` | 2035 | `case-detail-finance-empty` | `<p className="case-detail-finance-empty">Brak wpłat. Dodaj pierwszą zaliczkę albo płatność częściową.</p>` |
| `src/pages/CaseDetail.tsx` | 2044 | `case-detail-tabs` | `<TabsList className="case-detail-tabs">` |
| `src/pages/CaseDetail.tsx` | 2051 | `case-detail-tab-active` | `<TabsTrigger key={tab.key} value={tab.key} className={activeTab === tab.key ? 'case-detail-tab-active' : ''}>` |
| `src/pages/CaseDetail.tsx` | 2060 | `case-detail-section-card` | `<section className="case-detail-section-card">` |
| `src/pages/CaseDetail.tsx` | 2061 | `case-detail-section-head` | `<div className="case-detail-section-head">` |
| `src/pages/CaseDetail.tsx` | 2062 | `case-detail-section-card` | `<section className="case-detail-section-card case-detail-history-unified-panel" data-case-history-list="true">` |
| `src/pages/CaseDetail.tsx` | 2062 | `case-detail-history-unified-panel` | `<section className="case-detail-section-card case-detail-history-unified-panel" data-case-history-list="true">` |
| `src/pages/CaseDetail.tsx` | 2063 | `case-detail-section-head` | `<div className="case-detail-section-head">` |
| `src/pages/CaseDetail.tsx` | 2088 | `case-detail-light-empty` | `<p className="case-detail-light-empty">Brak historii sprawy.</p>` |
| `src/pages/CaseDetail.tsx` | 2092 | `case-detail-work-list` | `<div className="case-detail-work-list">` |
| `src/pages/CaseDetail.tsx` | 2094 | `case-detail-light-empty` | `<div className="case-detail-light-empty">Brak działań do pokazania. Dodaj brak, zadanie albo wydarzenie.</div>` |
| `src/pages/CaseDetail.tsx` | 2116 | `case-detail-section-card` | `<section className="case-detail-section-card">` |
| `src/pages/CaseDetail.tsx` | 2117 | `case-detail-section-head` | `<div className="case-detail-section-head">` |
| `src/pages/CaseDetail.tsx` | 2123 | `case-detail-path-grid` | `<div className="case-detail-path-grid">` |
| `src/pages/CaseDetail.tsx` | 2133 | `case-detail-section-card` | `<section className="case-detail-section-card">` |
| `src/pages/CaseDetail.tsx` | 2134 | `case-detail-section-head` | `<div className="case-detail-section-head">` |
| `src/pages/CaseDetail.tsx` | 2144 | `case-detail-checklist-list` | `<div className="case-detail-checklist-list">` |
| `src/pages/CaseDetail.tsx` | 2146 | `case-detail-light-empty` | `<div className="case-detail-light-empty">Brak checklisty. Dodaj pierwszy wymagany element sprawy.</div>` |
| `src/pages/CaseDetail.tsx` | 2149 | `case-detail-checklist-row` | `<article key={item.id} className="case-detail-checklist-row">` |
| `src/pages/CaseDetail.tsx` | 2151 | `case-detail-kind-pill` | `<span className="case-detail-kind-pill">{getItemTypeLabel(item.type)}</span>` |
| `src/pages/CaseDetail.tsx` | 2155 | `case-detail-pill` | `<span className={\`case-detail-pill ${getStatusClass(item.status)}\`}>{getItemStatusLabel(item.status)}</span>` |
| `src/pages/CaseDetail.tsx` | 2156 | `case-detail-row-actions` | `<div className="case-detail-row-actions">` |
| `src/pages/CaseDetail.tsx` | 2169 | `case-detail-section-card` | `<section className="case-detail-section-card">` |
| `src/pages/CaseDetail.tsx` | 2170 | `case-detail-section-head` | `<div className="case-detail-section-head">` |
| `src/pages/CaseDetail.tsx` | 2176 | `case-detail-history-list` | `<div className="case-detail-history-list">` |
| `src/pages/CaseDetail.tsx` | 2178 | `case-detail-light-empty` | `<div className="case-detail-light-empty">Brak historii do pokazania.</div>` |
| `src/pages/CaseDetail.tsx` | 2181 | `case-detail-history-row` | `<article key={activity.id} className="case-detail-history-row">` |
| `src/pages/CaseDetail.tsx` | 2195 | `case-detail-right-rail` | `<aside className="case-detail-right-rail" aria-label="Panel sprawy">` |
| `src/pages/CaseDetail.tsx` | 2205 | `right-card` | `<section className="right-card case-detail-right-card" data-fin10-legacy-finance-panel-removed="true" data-case-finance-panel="true" data-fin11-case-right-finance-panel="true">` |
| `src/pages/CaseDetail.tsx` | 2205 | `case-detail-right-card` | `<section className="right-card case-detail-right-card" data-fin10-legacy-finance-panel-removed="true" data-case-finance-panel="true" data-fin11-case-right-finance-panel="true">` |
| `src/pages/CaseDetail.tsx` | 2206 | `case-detail-card-title-row` | `<div className="case-detail-card-title-row">` |
| `src/pages/CaseDetail.tsx` | 2226 | `case-detail-right-actions` | `<div className="case-detail-right-actions">` |
| `src/pages/CaseDetail.tsx` | 2238 | `case-detail-dialog-grid` | `<div className="case-detail-dialog-grid">` |
| `src/pages/CaseDetail.tsx` | 2251 | `case-detail-payment-dialog` | `<DialogContent data-case-payment-dialog="true" className="case-detail-payment-dialog">` |
| `src/pages/CaseDetail.tsx` | 2255 | `case-detail-payment-form` | `<div className="case-detail-payment-form">` |
| `src/pages/CaseDetail.tsx` | 2435 | `case-detail-command-center` | `<section className="case-detail-command-center" data-testid="case-detail-v1-command-center">` |
| `src/pages/CaseDetail.tsx` | 2435 | `case-detail-v1-command-center` | `<section className="case-detail-command-center" data-testid="case-detail-v1-command-center">` |
| `src/pages/CaseDetail.tsx` | 2436 | `case-detail-card-title-row` | `<div className="case-detail-card-title-row">` |
| `src/pages/CaseDetail.tsx` | 2441 | `case-detail-command-status` | `<div className="case-detail-command-status">` |
| `src/pages/CaseDetail.tsx` | 2462 | `case-detail-path-card` | `<article className={\`case-detail-path-card case-detail-path-card-${tone}\`}>` |
| `src/pages/CaseDetail.tsx` | 2462 | `case-detail-path-card` | `<article className={\`case-detail-path-card case-detail-path-card-${tone}\`}>` |
| `src/pages/CaseDetail.tsx` | 2493 | `case-detail-work-row` | `<article className="case-detail-work-row">` |
| `src/pages/CaseDetail.tsx` | 2494 | `case-detail-work-icon` | `<span className="case-detail-work-icon"><WorkKindIcon kind={entry.kind} /></span>` |
| `src/pages/CaseDetail.tsx` | 2495 | `case-detail-work-main` | `<div className="case-detail-work-main">` |
| `src/pages/CaseDetail.tsx` | 2496 | `case-detail-kind-pill` | `<span className="case-detail-kind-pill">{getWorkKindLabel(entry.kind)}</span>` |
| `src/pages/CaseDetail.tsx` | 2500 | `case-detail-work-date` | `<div className="case-detail-work-date">` |
| `src/pages/CaseDetail.tsx` | 2504 | `case-detail-pill` | `<span className={\`case-detail-pill ${entry.statusClass}\`}>{entry.status}</span>` |
| `src/pages/CaseDetail.tsx` | 2505 | `case-detail-row-actions` | `<div className="case-detail-row-actions">` |
| `src/pages/CaseDetail.tsx` | 2522 | `case-detail-row-action-danger` | `<EntityActionButton type="button" tone="danger" className="case-detail-row-action-danger" onClick={() => onItemDelete(entry.source as CaseItem)}>Usuń</EntityActionButton>` |
| `src/pages/CaseDetail.tsx` | 2546 | `case-detail-dialog-grid` | `<div className="case-detail-dialog-grid">` |
| `src/pages/CaseDetail.tsx` | 2551 | `case-detail-checkbox-label` | `<label className="case-detail-checkbox-label"><input type="checkbox" checked={value.isRequired} onChange={(event) => onChange({ ...value, isRequired: event.target.checked })} /> Wymagane do startu / realizacji</label>` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3 | `client-detail-vnext-page` | `.client-detail-vnext-page {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 12 | `client-detail-header` | `.client-detail-header {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 21 | `client-detail-header-copy` | `.client-detail-header-copy {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 25 | `client-detail-back-button` | `.client-detail-back-button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 40 | `client-detail-breadcrumb` | `.client-detail-breadcrumb {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 47 | `client-detail-kicker` | `.client-detail-kicker {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 55 | `client-detail-header` | `.client-detail-header h1 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 63 | `client-detail-header-lead` | `.client-detail-header-lead {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 71 | `client-detail-header-meta` | `.client-detail-header-meta {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 77 | `client-detail-header-meta` | `.client-detail-header-meta span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 88 | `client-detail-header-actions` | `.client-detail-header-actions {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 95 | `client-detail-header-action-soft` | `.client-detail-header-action-soft {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 102 | `client-detail-header-action-primary` | `.client-detail-header-action-primary {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 106 | `client-detail-shell` | `.client-detail-shell {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 115 | `client-detail-left-rail` | `.client-detail-left-rail,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 116 | `client-detail-right-rail` | `.client-detail-right-rail {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 128 | `client-detail-left-rail` | `.client-detail-left-rail::before,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 129 | `client-detail-left-rail` | `.client-detail-left-rail::after,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 130 | `client-detail-right-rail` | `.client-detail-right-rail::before,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 131 | `client-detail-right-rail` | `.client-detail-right-rail::after,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 132 | `client-detail-side-card` | `.client-detail-side-card::before,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 133 | `client-detail-side-card` | `.client-detail-side-card::after,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 134 | `client-detail-right-card` | `.client-detail-right-card::before,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 135 | `client-detail-right-card` | `.client-detail-right-card::after,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 136 | `right-card` | `.right-card.client-detail-right-card::before,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 136 | `client-detail-right-card` | `.right-card.client-detail-right-card::before,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 137 | `right-card` | `.right-card.client-detail-right-card::after {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 137 | `client-detail-right-card` | `.right-card.client-detail-right-card::after {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 145 | `client-detail-side-card` | `.client-detail-side-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 146 | `client-detail-profile-card` | `.client-detail-profile-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 147 | `client-detail-actions-card` | `.client-detail-actions-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 148 | `right-card` | `.right-card.client-detail-right-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 148 | `client-detail-right-card` | `.right-card.client-detail-right-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 149 | `client-detail-right-card` | `.client-detail-right-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 150 | `client-detail-section-card` | `.client-detail-section-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 151 | `client-detail-summary-card` | `.client-detail-summary-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 152 | `client-detail-tabs` | `.client-detail-tabs,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 153 | `client-detail-empty-card` | `.client-detail-empty-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 154 | `client-detail-loading-card` | `.client-detail-loading-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 165 | `client-detail-side-card` | `.client-detail-side-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 166 | `client-detail-right-card` | `.client-detail-right-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 167 | `client-detail-section-card` | `.client-detail-section-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 168 | `client-detail-summary-card` | `.client-detail-summary-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 172 | `client-detail-profile-card` | `.client-detail-profile-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 176 | `client-detail-avatar-row` | `.client-detail-avatar-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 182 | `client-detail-avatar` | `.client-detail-avatar {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 194 | `client-detail-avatar-row` | `.client-detail-avatar-row h2 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 202 | `client-detail-avatar-row` | `.client-detail-avatar-row p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 208 | `client-detail-profile-meta` | `.client-detail-profile-meta {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 214 | `client-detail-profile-meta` | `.client-detail-profile-meta span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 224 | `client-detail-mini-stats` | `.client-detail-mini-stats {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 231 | `client-detail-stat-cell` | `.client-detail-stat-cell {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 239 | `client-detail-stat-cell` | `.client-detail-stat-cell strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 246 | `client-detail-stat-cell` | `.client-detail-stat-cell span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 254 | `client-detail-contact-list` | `.client-detail-contact-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 260 | `client-detail-info-row` | `.client-detail-info-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 271 | `client-detail-info-icon` | `.client-detail-info-icon {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 281 | `client-detail-info-row` | `.client-detail-info-row small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 282 | `client-detail-source-grid` | `.client-detail-source-grid small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 283 | `client-detail-right-card` | `.client-detail-right-card small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 290 | `client-detail-info-row` | `.client-detail-info-row strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 298 | `client-detail-icon-button` | `.client-detail-icon-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 299 | `client-detail-mini-button` | `.client-detail-mini-button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 314 | `client-detail-mini-button-muted` | `.client-detail-mini-button-muted {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 318 | `client-detail-edit-main-button` | `.client-detail-edit-main-button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 323 | `client-detail-edit-form` | `.client-detail-edit-form {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 329 | `client-detail-edit-field` | `.client-detail-edit-field {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 334 | `client-detail-edit-label-row` | `.client-detail-edit-label-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 335 | `client-detail-edit-actions` | `.client-detail-edit-actions {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 342 | `client-detail-edit-actions` | `.client-detail-edit-actions {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 347 | `client-detail-contact-repeat-list` | `.client-detail-contact-repeat-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 352 | `client-detail-contact-repeat-row` | `.client-detail-contact-repeat-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 358 | `client-detail-actions-card` | `.client-detail-actions-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 362 | `client-detail-card-title-row` | `.client-detail-card-title-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 370 | `client-detail-card-title-row` | `.client-detail-card-title-row h2 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 378 | `client-detail-action-grid` | `.client-detail-action-grid,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 379 | `client-detail-right-shortcuts` | `.client-detail-right-shortcuts {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 384 | `client-detail-action-grid` | `.client-detail-action-grid button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 385 | `client-detail-right-shortcuts` | `.client-detail-right-shortcuts button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 396 | `client-detail-action-grid` | `.client-detail-action-grid button:not(:disabled):hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 397 | `client-detail-right-shortcuts` | `.client-detail-right-shortcuts button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 398 | `client-detail-back-button` | `.client-detail-back-button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 399 | `client-detail-icon-button` | `.client-detail-icon-button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 400 | `client-detail-mini-button` | `.client-detail-mini-button:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 406 | `client-detail-action-grid` | `.client-detail-action-grid button:disabled {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 411 | `client-detail-main-column` | `.client-detail-main-column {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 418 | `client-detail-tabs` | `.client-detail-tabs {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 425 | `client-detail-tabs` | `.client-detail-tabs button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 436 | `client-detail-tabs` | `.client-detail-tabs button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 437 | `client-detail-tabs` | `.client-detail-tabs .client-detail-tab-active {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 437 | `client-detail-tab-active` | `.client-detail-tabs .client-detail-tab-active {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 443 | `client-detail-tab-panel` | `.client-detail-tab-panel {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 448 | `client-detail-summary-grid` | `.client-detail-summary-grid {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 454 | `client-detail-top-cards` | `.client-detail-top-cards {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 461 | `client-detail-top-cards-side` | `.client-detail-top-cards-side {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 467 | `client-detail-hero-card` | `.client-detail-hero-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 479 | `client-detail-hero-kicker` | `.client-detail-hero-kicker {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 487 | `client-detail-hero-date` | `.client-detail-hero-date {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 494 | `client-detail-hero-sub` | `.client-detail-hero-sub {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 501 | `client-detail-hero-cta` | `.client-detail-hero-cta {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 511 | `client-detail-completeness-card` | `.client-detail-completeness-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 516 | `client-detail-completeness-card` | `.client-detail-completeness-card strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 525 | `client-detail-completeness-note` | `.client-detail-completeness-note {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 539 | `client-detail-summary-card` | `.client-detail-summary-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 544 | `client-detail-summary-card` | `.client-detail-summary-card strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 552 | `client-detail-finance-card` | `.client-detail-finance-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 556 | `client-detail-finance-metrics` | `.client-detail-finance-metrics {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 561 | `client-detail-finance-metrics` | `.client-detail-finance-metrics small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 569 | `client-detail-finance-metrics` | `.client-detail-finance-metrics strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 573 | `client-detail-summary-card` | `.client-detail-summary-card p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 580 | `client-detail-summary-card` | `.client-detail-summary-card button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 595 | `client-detail-callout-danger` | `.client-detail-callout-danger {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 600 | `client-detail-callout-amber` | `.client-detail-callout-amber {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 605 | `client-detail-callout-blue` | `.client-detail-callout-blue {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 610 | `client-detail-callout-green` | `.client-detail-callout-green {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 615 | `client-detail-callout-muted` | `.client-detail-callout-muted {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 620 | `client-detail-progress` | `.client-detail-progress {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 628 | `client-detail-progress` | `.client-detail-progress span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 635 | `client-detail-section-card` | `.client-detail-section-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 639 | `client-detail-section-head` | `.client-detail-section-head {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 647 | `client-detail-section-head` | `.client-detail-section-head h2 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 655 | `client-detail-section-head` | `.client-detail-section-head p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 662 | `client-detail-case-list` | `.client-detail-case-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 667 | `client-detail-relations-list` | `.client-detail-relations-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 672 | `client-detail-relation-row` | `.client-detail-relation-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 683 | `client-detail-relation-main` | `.client-detail-relation-main h3 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 690 | `client-detail-relation-main` | `.client-detail-relation-main p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 697 | `client-detail-acquisition-line` | `.client-detail-acquisition-line {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 710 | `client-detail-acquisition-line` | `.client-detail-acquisition-line strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 715 | `client-detail-contact-panel` | `.client-detail-contact-panel {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 720 | `client-detail-contact-list-wide` | `.client-detail-contact-list-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 726 | `client-detail-note-inline` | `.client-detail-note-inline {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 733 | `client-detail-note-inline` | `.client-detail-note-inline p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 740 | `client-detail-quick-actions-list` | `.client-detail-quick-actions-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 746 | `client-detail-quick-actions-list` | `.client-detail-quick-actions-list button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 763 | `client-detail-quick-actions-list` | `.client-detail-quick-actions-list button:disabled {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 768 | `client-detail-note-text` | `.client-detail-note-text {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 775 | `client-detail-case-row` | `.client-detail-case-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 786 | `client-detail-case-row-wide` | `.client-detail-case-row-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 790 | `client-detail-case-row` | `.client-detail-case-row h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 791 | `client-detail-history-row` | `.client-detail-history-row h3 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 798 | `client-detail-case-row` | `.client-detail-case-row p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 799 | `client-detail-history-row` | `.client-detail-history-row p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 806 | `client-detail-case-row` | `.client-detail-case-row strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 811 | `client-detail-pill` | `.client-detail-pill {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 822 | `client-detail-pill-danger` | `.client-detail-pill-danger {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 828 | `client-detail-pill-amber` | `.client-detail-pill-amber {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 834 | `client-detail-pill-green` | `.client-detail-pill-green {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 840 | `client-detail-pill-blue` | `.client-detail-pill-blue {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 846 | `client-detail-pill-muted` | `.client-detail-pill-muted {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 852 | `client-detail-source-grid` | `.client-detail-source-grid {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 858 | `client-detail-source-grid` | `.client-detail-source-grid > div {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 865 | `client-detail-source-grid` | `.client-detail-source-grid strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 873 | `client-detail-history-list` | `.client-detail-history-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 878 | `client-detail-history-row` | `.client-detail-history-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 889 | `client-detail-history-dot` | `.client-detail-history-dot {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 899 | `client-detail-right-card` | `.client-detail-right-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 905 | `client-detail-right-card` | `.client-detail-right-card p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 913 | `client-detail-right-card` | `.client-detail-right-card small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 917 | `client-detail-right-metrics` | `.client-detail-right-metrics {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 922 | `client-detail-right-metrics` | `.client-detail-right-metrics span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 932 | `client-detail-right-metrics` | `.client-detail-right-metrics strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 936 | `client-detail-light-empty` | `.client-detail-light-empty {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 946 | `client-detail-empty-card` | `.client-detail-empty-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 947 | `client-detail-loading-card` | `.client-detail-loading-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 956 | `client-detail-empty-card` | `.client-detail-empty-card h1 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 962 | `client-detail-empty-card` | `.client-detail-empty-card p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 963 | `client-detail-loading-card` | `.client-detail-loading-card span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 970 | `client-detail-shell` | `.client-detail-shell {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 974 | `client-detail-right-rail` | `.client-detail-right-rail {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 980 | `client-detail-summary-grid` | `.client-detail-summary-grid {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 984 | `client-detail-top-cards` | `.client-detail-top-cards {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 990 | `client-detail-header` | `.client-detail-header {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 995 | `client-detail-header-actions` | `.client-detail-header-actions {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 999 | `client-detail-shell` | `.client-detail-shell {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1003 | `client-detail-left-rail` | `.client-detail-left-rail {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1007 | `client-detail-main-column` | `.client-detail-main-column {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1011 | `client-detail-right-rail` | `.client-detail-right-rail {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1016 | `client-detail-case-row` | `.client-detail-case-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1017 | `client-detail-case-row-wide` | `.client-detail-case-row-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1022 | `client-detail-source-grid` | `.client-detail-source-grid {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1026 | `client-detail-contact-list-wide` | `.client-detail-contact-list-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1032 | `client-detail-vnext-page` | `.client-detail-vnext-page {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1036 | `client-detail-header` | `.client-detail-header h1 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1040 | `client-detail-header-actions` | `.client-detail-header-actions {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1045 | `client-detail-tabs` | `.client-detail-tabs {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1051 | `client-detail-tabs` | `.client-detail-tabs button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1055 | `client-detail-section-head` | `.client-detail-section-head {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1059 | `client-detail-contact-repeat-row` | `.client-detail-contact-repeat-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1066 | `client-detail-relations-list-acquisition-only` | `.client-detail-relations-list-acquisition-only {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1070 | `client-detail-relation-row-acquisition-only` | `.client-detail-relation-row-acquisition-only {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1075 | `client-detail-relation-row-acquisition-only` | `.client-detail-relation-row-acquisition-only .client-detail-relation-main p strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1075 | `client-detail-relation-main` | `.client-detail-relation-row-acquisition-only .client-detail-relation-main p strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1080 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-relations-acquisition-only="true"] .client-detail-section-head {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1080 | `client-detail-section-head` | `.client-detail-vnext-page [data-client-relations-acquisition-only="true"] .client-detail-section-head {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1087 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1087 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1087 | `client-detail-callout-danger` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1088 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1088 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1088 | `client-detail-callout-amber` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1089 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1089 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1089 | `client-detail-callout-blue` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1090 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1090 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1090 | `client-detail-callout-green` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1091 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1091 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1091 | `client-detail-callout-muted` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1095 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1095 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1095 | `client-detail-callout-danger` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1096 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1096 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1096 | `client-detail-callout-amber` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1097 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1097 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1097 | `client-detail-callout-blue` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1098 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1098 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1098 | `client-detail-callout-green` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1099 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1099 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1099 | `client-detail-callout-muted` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1100 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1100 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1100 | `client-detail-callout-danger` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1101 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1101 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1101 | `client-detail-callout-amber` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1102 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1102 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1102 | `client-detail-callout-blue` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1103 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1103 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1103 | `client-detail-callout-green` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1104 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted h3 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1104 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted h3 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1104 | `client-detail-callout-muted` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted h3 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1108 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1108 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1108 | `client-detail-callout-danger` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1109 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1109 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1109 | `client-detail-callout-amber` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1110 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1110 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1110 | `client-detail-callout-blue` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1111 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1111 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1111 | `client-detail-callout-green` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1112 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1112 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1112 | `client-detail-callout-muted` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1113 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1113 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1113 | `client-detail-callout-danger` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1114 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1114 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1114 | `client-detail-callout-amber` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1115 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1115 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1115 | `client-detail-callout-blue` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1116 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1116 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1116 | `client-detail-callout-green` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1117 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1117 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1117 | `client-detail-callout-muted` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1121 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1121 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1121 | `client-detail-callout-danger` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1122 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1122 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1122 | `client-detail-callout-amber` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1123 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1123 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1123 | `client-detail-callout-blue` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1124 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1124 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1124 | `client-detail-callout-green` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1125 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1125 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1125 | `client-detail-callout-muted` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1126 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1126 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1126 | `client-detail-callout-danger` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-danger button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1127 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1127 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1127 | `client-detail-callout-amber` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-amber button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1128 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1128 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1128 | `client-detail-callout-blue` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-blue button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1129 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1129 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1129 | `client-detail-callout-green` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-green button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1130 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1130 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1130 | `client-detail-callout-muted` | `.client-detail-vnext-page .client-detail-summary-card.client-detail-callout-muted button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1134 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-inline button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1134 | `client-detail-note-inline` | `.client-detail-vnext-page .client-detail-note-inline button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1135 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-quick-actions-list button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1135 | `client-detail-quick-actions-list` | `.client-detail-vnext-page .client-detail-quick-actions-list button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1136 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-action-grid button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1136 | `client-detail-action-grid` | `.client-detail-vnext-page .client-detail-action-grid button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1137 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-actions="true"] button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1138 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-action],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1139 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-voice-note-action],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1140 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-add-note-action] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1148 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-inline button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1148 | `client-detail-note-inline` | `.client-detail-vnext-page .client-detail-note-inline button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1149 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-quick-actions-list button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1149 | `client-detail-quick-actions-list` | `.client-detail-vnext-page .client-detail-quick-actions-list button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1150 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-action-grid button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1150 | `client-detail-action-grid` | `.client-detail-vnext-page .client-detail-action-grid button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1151 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-actions="true"] button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1152 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-action] svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1153 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-voice-note-action] svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1154 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-add-note-action] svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1159 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-inline button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1159 | `client-detail-note-inline` | `.client-detail-vnext-page .client-detail-note-inline button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1160 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-quick-actions-list button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1160 | `client-detail-quick-actions-list` | `.client-detail-vnext-page .client-detail-quick-actions-list button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1161 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-action-grid button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1161 | `client-detail-action-grid` | `.client-detail-vnext-page .client-detail-action-grid button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1162 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-actions="true"] button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1163 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-action]:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1164 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-voice-note-action]:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1165 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-add-note-action]:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1171 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-inline button:disabled,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1171 | `client-detail-note-inline` | `.client-detail-vnext-page .client-detail-note-inline button:disabled,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1172 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-quick-actions-list button:disabled,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1172 | `client-detail-quick-actions-list` | `.client-detail-vnext-page .client-detail-quick-actions-list button:disabled,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1173 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-action-grid button:disabled,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1173 | `client-detail-action-grid` | `.client-detail-vnext-page .client-detail-action-grid button:disabled,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1174 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-actions="true"] button:disabled,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1175 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-action]:disabled,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1176 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-voice-note-action]:disabled,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1177 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-add-note-action]:disabled {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1187 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-breadcrumb {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1187 | `client-detail-breadcrumb` | `.client-detail-vnext-page .client-detail-breadcrumb {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1191 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-header-meta {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1191 | `client-detail-header-meta` | `.client-detail-vnext-page .client-detail-header-meta {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1203 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-header-meta span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1203 | `client-detail-header-meta` | `.client-detail-vnext-page .client-detail-header-meta span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1218 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-header-meta span:nth-child(1) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1218 | `client-detail-header-meta` | `.client-detail-vnext-page .client-detail-header-meta span:nth-child(1) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1224 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-header-meta span:nth-child(2) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1224 | `client-detail-header-meta` | `.client-detail-vnext-page .client-detail-header-meta span:nth-child(2) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1230 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-header-meta span:nth-child(3) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1230 | `client-detail-header-meta` | `.client-detail-vnext-page .client-detail-header-meta span:nth-child(3) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1236 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-header-meta span:nth-child(4) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1236 | `client-detail-header-meta` | `.client-detail-vnext-page .client-detail-header-meta span:nth-child(4) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1242 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-form,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1242 | `client-detail-edit-form` | `.client-detail-vnext-page .client-detail-edit-form,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1243 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-field,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1243 | `client-detail-edit-field` | `.client-detail-vnext-page .client-detail-edit-field,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1244 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-contact-repeat-list,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1244 | `client-detail-contact-repeat-list` | `.client-detail-vnext-page .client-detail-contact-repeat-list,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1245 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-contact-repeat-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1245 | `client-detail-contact-repeat-row` | `.client-detail-vnext-page .client-detail-contact-repeat-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1249 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-form label,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1249 | `client-detail-edit-form` | `.client-detail-vnext-page .client-detail-edit-form label,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1250 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-field label,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1250 | `client-detail-edit-field` | `.client-detail-vnext-page .client-detail-edit-field label,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1251 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-label-row label {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1251 | `client-detail-edit-label-row` | `.client-detail-vnext-page .client-detail-edit-label-row label {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1257 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-form input,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1257 | `client-detail-edit-form` | `.client-detail-vnext-page .client-detail-edit-form input,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1258 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-form textarea,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1258 | `client-detail-edit-form` | `.client-detail-vnext-page .client-detail-edit-form textarea,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1259 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-field input,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1259 | `client-detail-edit-field` | `.client-detail-vnext-page .client-detail-edit-field input,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1260 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-field textarea,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1260 | `client-detail-edit-field` | `.client-detail-vnext-page .client-detail-edit-field textarea,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1261 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-contact-repeat-row] input {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1270 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-form input::placeholder,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1270 | `client-detail-edit-form` | `.client-detail-vnext-page .client-detail-edit-form input::placeholder,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1271 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-form textarea::placeholder,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1271 | `client-detail-edit-form` | `.client-detail-vnext-page .client-detail-edit-form textarea::placeholder,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1272 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-field input::placeholder,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1272 | `client-detail-edit-field` | `.client-detail-vnext-page .client-detail-edit-field input::placeholder,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1273 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-field textarea::placeholder {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1273 | `client-detail-edit-field` | `.client-detail-vnext-page .client-detail-edit-field textarea::placeholder {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1278 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-form input:focus,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1278 | `client-detail-edit-form` | `.client-detail-vnext-page .client-detail-edit-form input:focus,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1279 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-form textarea:focus,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1279 | `client-detail-edit-form` | `.client-detail-vnext-page .client-detail-edit-form textarea:focus,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1280 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-field input:focus,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1280 | `client-detail-edit-field` | `.client-detail-vnext-page .client-detail-edit-field input:focus,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1281 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-field textarea:focus {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1281 | `client-detail-edit-field` | `.client-detail-vnext-page .client-detail-edit-field textarea:focus {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1287 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-actions button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1287 | `client-detail-edit-actions` | `.client-detail-vnext-page .client-detail-edit-actions button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1288 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-mini-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1288 | `client-detail-mini-button` | `.client-detail-vnext-page .client-detail-mini-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1289 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-quick-actions-list button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1289 | `client-detail-quick-actions-list` | `.client-detail-vnext-page .client-detail-quick-actions-list button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1290 | `client-detail-vnext-page` | `.client-detail-vnext-page button[data-client-note-dictate],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1291 | `client-detail-vnext-page` | `.client-detail-vnext-page button[data-client-note-save],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1292 | `client-detail-vnext-page` | `.client-detail-vnext-page button[aria-label*="notat" i],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1293 | `client-detail-vnext-page` | `.client-detail-vnext-page button[aria-label*="dykt" i] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1301 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-actions button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1301 | `client-detail-edit-actions` | `.client-detail-vnext-page .client-detail-edit-actions button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1302 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-mini-button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1302 | `client-detail-mini-button` | `.client-detail-vnext-page .client-detail-mini-button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1303 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-quick-actions-list button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1303 | `client-detail-quick-actions-list` | `.client-detail-vnext-page .client-detail-quick-actions-list button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1304 | `client-detail-vnext-page` | `.client-detail-vnext-page button[data-client-note-dictate]:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1305 | `client-detail-vnext-page` | `.client-detail-vnext-page button[data-client-note-save]:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1306 | `client-detail-vnext-page` | `.client-detail-vnext-page button[aria-label*="notat" i]:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1307 | `client-detail-vnext-page` | `.client-detail-vnext-page button[aria-label*="dykt" i]:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1315 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-right-card p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1315 | `client-detail-right-card` | `.client-detail-vnext-page .client-detail-right-card p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1316 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1316 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1317 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-summary-card strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1317 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-summary-card strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1318 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-relation-main h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1318 | `client-detail-relation-main` | `.client-detail-vnext-page .client-detail-relation-main h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1319 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-history-row h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1319 | `client-detail-history-row` | `.client-detail-vnext-page .client-detail-history-row h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1320 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-source-grid strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1320 | `client-detail-source-grid` | `.client-detail-vnext-page .client-detail-source-grid strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1324 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-relation-main p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1324 | `client-detail-relation-main` | `.client-detail-vnext-page .client-detail-relation-main p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1325 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-history-row p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1325 | `client-detail-history-row` | `.client-detail-vnext-page .client-detail-history-row p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1326 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-inline p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1326 | `client-detail-note-inline` | `.client-detail-vnext-page .client-detail-note-inline p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1327 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-section-head p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1327 | `client-detail-section-head` | `.client-detail-vnext-page .client-detail-section-head p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1328 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1328 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1329 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-right-card small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1329 | `client-detail-right-card` | `.client-detail-vnext-page .client-detail-right-card small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1330 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-info-row small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1330 | `client-detail-info-row` | `.client-detail-vnext-page .client-detail-info-row small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1331 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-text {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1331 | `client-detail-note-text` | `.client-detail-vnext-page .client-detail-note-text {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1337 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1337 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1338 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-right-card p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1338 | `client-detail-right-card` | `.client-detail-vnext-page .client-detail-right-card p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1343 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-pill {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1343 | `client-detail-pill` | `.client-detail-vnext-page .client-detail-pill {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1350 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1350 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1354 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1354 | `client-detail-recent-moves-list` | `.client-detail-vnext-page .client-detail-recent-moves-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1359 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-move-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1359 | `client-detail-recent-move-row` | `.client-detail-vnext-page .client-detail-recent-move-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1372 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-move-row strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1372 | `client-detail-recent-move-row` | `.client-detail-vnext-page .client-detail-recent-move-row strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1380 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-move-row small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1380 | `client-detail-recent-move-row` | `.client-detail-vnext-page .client-detail-recent-move-row small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1388 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-move-row em {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1388 | `client-detail-recent-move-row` | `.client-detail-vnext-page .client-detail-recent-move-row em {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1395 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-link {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1395 | `client-detail-recent-moves-link` | `.client-detail-vnext-page .client-detail-recent-moves-link {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1414 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1414 | `client-detail-case-list` | `.client-detail-vnext-page .client-detail-case-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1418 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1418 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1419 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1419 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1428 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row > *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1428 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row > *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1429 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide > * {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1429 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide > * {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1433 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1433 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1434 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide h3 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1434 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide h3 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1444 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1444 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1445 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1445 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1455 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1455 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1456 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1456 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1462 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row .client-detail-pill,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1462 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row .client-detail-pill,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1462 | `client-detail-pill` | `.client-detail-vnext-page .client-detail-case-row .client-detail-pill,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1463 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide .client-detail-pill {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1463 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide .client-detail-pill {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1463 | `client-detail-pill` | `.client-detail-vnext-page .client-detail-case-row-wide .client-detail-pill {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1473 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1473 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1474 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1474 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1475 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1475 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1476 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1476 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1484 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1484 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1485 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1485 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1494 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-header-lead:empty {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1494 | `client-detail-header-lead` | `.client-detail-vnext-page .client-detail-header-lead:empty {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1498 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1498 | `client-detail-case-list` | `.client-detail-vnext-page .client-detail-case-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1502 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1502 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1503 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1503 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1512 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row > *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1512 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row > *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1513 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide > * {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1513 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide > * {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1517 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1517 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1518 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide h3 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1518 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide h3 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1528 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1528 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1529 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1529 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1539 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1539 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1540 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1540 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1550 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row .client-detail-pill,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1550 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row .client-detail-pill,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1550 | `client-detail-pill` | `.client-detail-vnext-page .client-detail-case-row .client-detail-pill,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1551 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide .client-detail-pill {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1551 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide .client-detail-pill {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1551 | `client-detail-pill` | `.client-detail-vnext-page .client-detail-case-row-wide .client-detail-pill {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1561 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1561 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1562 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1562 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1563 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1563 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1564 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1564 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1574 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1574 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1575 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1575 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1581 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1581 | `client-detail-case-row` | `.client-detail-vnext-page .client-detail-case-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1582 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-row-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1582 | `client-detail-case-row-wide` | `.client-detail-vnext-page .client-detail-case-row-wide {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1589 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-edit-under-data="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1594 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-recent-moves-under-data="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1600 | `client-detail-left-rail` | `.client-detail-left-rail [data-client-recent-moves-under-data="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1604 | `client-detail-left-rail` | `.client-detail-left-rail .client-detail-recent-moves-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1604 | `client-detail-recent-moves-card` | `.client-detail-left-rail .client-detail-recent-moves-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1610 | `client-detail-left-rail` | `.client-detail-left-rail .client-detail-recent-moves-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1610 | `client-detail-recent-moves-card` | `.client-detail-left-rail .client-detail-recent-moves-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1614 | `client-detail-left-rail` | `.client-detail-left-rail .client-detail-recent-moves-card .client-detail-card-title-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1614 | `client-detail-recent-moves-card` | `.client-detail-left-rail .client-detail-recent-moves-card .client-detail-card-title-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1614 | `client-detail-card-title-row` | `.client-detail-left-rail .client-detail-recent-moves-card .client-detail-card-title-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1620 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-edit-under-data="true"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1621 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-main-button-visible {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1621 | `client-detail-edit-main-button-visible` | `.client-detail-vnext-page .client-detail-edit-main-button-visible {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1638 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-edit-under-data="true"]:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1639 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-edit-under-data="true"]:focus-visible,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1640 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-main-button-visible:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1640 | `client-detail-edit-main-button-visible` | `.client-detail-vnext-page .client-detail-edit-main-button-visible:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1641 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-main-button-visible:focus-visible {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1641 | `client-detail-edit-main-button-visible` | `.client-detail-vnext-page .client-detail-edit-main-button-visible:focus-visible {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1647 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-edit-under-data="true"] svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1648 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-edit-main-button-visible svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1648 | `client-detail-edit-main-button-visible` | `.client-detail-vnext-page .client-detail-edit-main-button-visible svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1652 | `client-detail-left-management-tiles` | `.client-detail-left-management-tiles {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1656 | `client-detail-left-management-title` | `.client-detail-left-management-title {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1660 | `client-detail-left-tile-grid` | `.client-detail-left-tile-grid {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1665 | `client-detail-left-tile` | `.client-detail-left-tile {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1670 | `client-detail-left-tile` | `.client-detail-left-tile small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1679 | `client-detail-left-tile` | `.client-detail-left-tile strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1688 | `client-detail-left-tile` | `.client-detail-left-tile p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1695 | `client-detail-left-tile-button` | `.client-detail-left-tile-button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1701 | `client-detail-finance-mini-metrics` | `.client-detail-finance-mini-metrics {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1707 | `client-detail-finance-mini-metrics` | `.client-detail-finance-mini-metrics span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1719 | `client-detail-today-info-tiles` | `.client-detail-today-info-tiles {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1724 | `client-detail-today-info-tile` | `.client-detail-today-info-tile {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1737 | `client-detail-today-info-tile-icon` | `.client-detail-today-info-tile-icon {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1747 | `client-detail-today-info-tile-body` | `.client-detail-today-info-tile-body {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1751 | `client-detail-today-info-tile` | `.client-detail-today-info-tile small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1760 | `client-detail-today-info-tile` | `.client-detail-today-info-tile strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1771 | `client-detail-today-info-tile` | `.client-detail-today-info-tile p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1778 | `client-detail-today-info-tile-action` | `.client-detail-today-info-tile-action {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1791 | `client-detail-today-info-tile-meta` | `.client-detail-today-info-tile-meta {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1798 | `client-detail-today-info-tile-meta` | `.client-detail-today-info-tile-meta span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1809 | `client-detail-today-info-tile` | `.client-detail-today-info-tile.client-detail-callout-danger {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1809 | `client-detail-callout-danger` | `.client-detail-today-info-tile.client-detail-callout-danger {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1814 | `client-detail-today-info-tile` | `.client-detail-today-info-tile.client-detail-callout-amber {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1814 | `client-detail-callout-amber` | `.client-detail-today-info-tile.client-detail-callout-amber {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1819 | `client-detail-today-info-tile` | `.client-detail-today-info-tile.client-detail-callout-blue {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1819 | `client-detail-callout-blue` | `.client-detail-today-info-tile.client-detail-callout-blue {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1824 | `client-detail-today-info-tile` | `.client-detail-today-info-tile.client-detail-callout-green {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1824 | `client-detail-callout-green` | `.client-detail-today-info-tile.client-detail-callout-green {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1829 | `client-detail-today-info-tile` | `.client-detail-today-info-tile.client-detail-callout-muted {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1829 | `client-detail-callout-muted` | `.client-detail-today-info-tile.client-detail-callout-muted {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1834 | `client-detail-today-info-tile-finance` | `.client-detail-today-info-tile-finance {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1839 | `client-detail-today-info-tile-finance` | `.client-detail-today-info-tile-finance .client-detail-today-info-tile-icon {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1839 | `client-detail-today-info-tile-icon` | `.client-detail-today-info-tile-finance .client-detail-today-info-tile-icon {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1846 | `client-detail-top-tiles` | `.client-detail-top-tiles {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1853 | `client-detail-top-tile` | `.client-detail-top-tile {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1869 | `client-detail-top-tile-head` | `.client-detail-top-tile-head {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1876 | `client-detail-top-tile-icon` | `.client-detail-top-tile-icon {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1887 | `client-detail-top-tile` | `.client-detail-top-tile small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1895 | `client-detail-top-tile` | `.client-detail-top-tile strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1904 | `client-detail-top-tile` | `.client-detail-top-tile p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1911 | `client-detail-top-tile` | `.client-detail-top-tile p b {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1916 | `client-detail-top-tile-link` | `.client-detail-top-tile-link {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1933 | `client-detail-top-tile-link` | `button.client-detail-top-tile-link {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1937 | `client-detail-top-tile-link` | `.client-detail-top-tile-link:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1943 | `client-detail-top-tile-muted` | `.client-detail-top-tile-muted {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1954 | `client-detail-top-tile-action` | `.client-detail-top-tile-action.client-detail-callout-danger,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1954 | `client-detail-callout-danger` | `.client-detail-top-tile-action.client-detail-callout-danger,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1955 | `client-detail-top-tile-action` | `.client-detail-top-tile-action.client-detail-callout-amber,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1955 | `client-detail-callout-amber` | `.client-detail-top-tile-action.client-detail-callout-amber,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1956 | `client-detail-top-tile-action` | `.client-detail-top-tile-action.client-detail-callout-blue,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1956 | `client-detail-callout-blue` | `.client-detail-top-tile-action.client-detail-callout-blue,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1957 | `client-detail-top-tile-action` | `.client-detail-top-tile-action.client-detail-callout-green,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1957 | `client-detail-callout-green` | `.client-detail-top-tile-action.client-detail-callout-green,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1958 | `client-detail-top-tile-action` | `.client-detail-top-tile-action.client-detail-callout-muted {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1958 | `client-detail-callout-muted` | `.client-detail-top-tile-action.client-detail-callout-muted {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1962 | `client-detail-top-tiles` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-tabs + .client-detail-tab-panel .client-detail-top-cards {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1962 | `client-detail-tabs` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-tabs + .client-detail-tab-panel .client-detail-top-cards {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1962 | `client-detail-tab-panel` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-tabs + .client-detail-tab-panel .client-detail-top-cards {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1962 | `client-detail-top-cards` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-tabs + .client-detail-tab-panel .client-detail-top-cards {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1967 | `client-detail-top-tiles` | `.client-detail-top-tiles {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1973 | `client-detail-top-tile` | `.client-detail-top-tile {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1982 | `client-detail-vnext-page` | `.client-detail-vnext-page > .client-detail-top-tiles,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1982 | `client-detail-top-tiles` | `.client-detail-vnext-page > .client-detail-top-tiles,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1983 | `client-detail-top-tiles` | `.client-detail-top-tiles {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1989 | `client-detail-vnext-page` | `.client-detail-vnext-page > .client-detail-top-tiles,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1989 | `client-detail-top-tiles` | `.client-detail-vnext-page > .client-detail-top-tiles,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1990 | `client-detail-top-tiles` | `.client-detail-top-tiles {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1997 | `client-detail-vnext-page` | `.client-detail-vnext-page > .client-detail-top-tiles.entity-overview-tiles,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1997 | `client-detail-top-tiles` | `.client-detail-vnext-page > .client-detail-top-tiles.entity-overview-tiles,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1998 | `client-detail-top-tiles` | `.client-detail-top-tiles.entity-overview-tiles {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2007 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-tiles.entity-overview-tiles .entity-overview-tile {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2007 | `client-detail-top-tiles` | `.client-detail-vnext-page .client-detail-top-tiles.entity-overview-tiles .entity-overview-tile {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2023 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-tile-head {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2030 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-tile-icon {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2041 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-tile small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2049 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-tile strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2058 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-tile p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2065 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-tile-link,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2066 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-tile-chip {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2083 | `client-detail-vnext-page` | `.client-detail-vnext-page button.entity-overview-tile-link {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2087 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-tile-chip-muted {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2093 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-metrics {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2100 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-metric-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2112 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-metric-row span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2118 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-metric-row b {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2125 | `client-detail-top-tiles` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-hero-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2125 | `client-detail-shell` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-hero-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2125 | `client-detail-hero-card` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-hero-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2126 | `client-detail-top-tiles` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-finance-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2126 | `client-detail-shell` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-finance-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2126 | `client-detail-finance-card` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-finance-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2127 | `client-detail-top-tiles` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell [data-client-summary-card="next-action"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2127 | `client-detail-shell` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell [data-client-summary-card="next-action"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2128 | `client-detail-top-tiles` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell [data-client-summary-card="finance-summary"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2128 | `client-detail-shell` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell [data-client-summary-card="finance-summary"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2132 | `client-detail-top-tiles` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-top-cards {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2132 | `client-detail-shell` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-top-cards {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2132 | `client-detail-top-cards` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-top-cards {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2136 | `client-detail-top-tiles` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-top-cards-side {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2136 | `client-detail-shell` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-top-cards-side {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2136 | `client-detail-top-cards-side` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-top-cards-side {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2141 | `client-detail-top-tiles` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-completeness-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2141 | `client-detail-shell` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-completeness-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2141 | `client-detail-completeness-card` | `.client-detail-top-tiles[data-client-top-tiles="true"] ~ .client-detail-shell .client-detail-completeness-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2146 | `client-detail-vnext-page` | `.client-detail-vnext-page > .client-detail-top-tiles.entity-overview-tiles,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2146 | `client-detail-top-tiles` | `.client-detail-vnext-page > .client-detail-top-tiles.entity-overview-tiles,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2147 | `client-detail-top-tiles` | `.client-detail-top-tiles.entity-overview-tiles {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2153 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-tiles.entity-overview-tiles .entity-overview-tile {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2153 | `client-detail-top-tiles` | `.client-detail-vnext-page .client-detail-top-tiles.entity-overview-tiles .entity-overview-tile {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2159 | `client-detail-vnext-page` | `.client-detail-vnext-page > .client-detail-top-tiles.entity-overview-tiles,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2159 | `client-detail-top-tiles` | `.client-detail-vnext-page > .client-detail-top-tiles.entity-overview-tiles,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2160 | `client-detail-top-tiles` | `.client-detail-top-tiles.entity-overview-tiles {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2174 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-finance-summary="true"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2175 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-left-finance-tile="true"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2176 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-today-info-tile-finance,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2176 | `client-detail-today-info-tile-finance` | `.client-detail-vnext-page .client-detail-today-info-tile-finance,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2177 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-operational-center,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2177 | `client-detail-operational-center` | `.client-detail-vnext-page .client-detail-operational-center,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2178 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-left-next-action-tile="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2186 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-today-info-tiles {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2186 | `client-detail-today-info-tiles` | `.client-detail-vnext-page .client-detail-today-info-tiles {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2194 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-left-rail {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2194 | `client-detail-left-rail` | `.client-detail-vnext-page .client-detail-left-rail {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2201 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-inline-contact-edit="true"].client-detail-profile-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2201 | `client-detail-profile-card` | `.client-detail-vnext-page [data-client-inline-contact-edit="true"].client-detail-profile-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2202 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-profile-card[data-client-inline-contact-edit="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2202 | `client-detail-profile-card` | `.client-detail-vnext-page .client-detail-profile-card[data-client-inline-contact-edit="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2207 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-recent-moves-panel="true"].client-detail-recent-moves-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2207 | `client-detail-recent-moves-card` | `.client-detail-vnext-page [data-client-recent-moves-panel="true"].client-detail-recent-moves-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2208 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card[data-client-recent-moves-panel="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2208 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card[data-client-recent-moves-panel="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2217 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-right-rail:has([data-client-finance-summary="true"]):has(.client-detail-operational-center) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2217 | `client-detail-right-rail` | `.client-detail-vnext-page .client-detail-right-rail:has([data-client-finance-summary="true"]):has(.client-detail-operational-center) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2217 | `client-detail-operational-center` | `.client-detail-vnext-page .client-detail-right-rail:has([data-client-finance-summary="true"]):has(.client-detail-operational-center) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2221 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-shell:has(.client-detail-right-rail[style*="display: none"]),` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2221 | `client-detail-shell` | `.client-detail-vnext-page .client-detail-shell:has(.client-detail-right-rail[style*="display: none"]),` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2221 | `client-detail-right-rail` | `.client-detail-vnext-page .client-detail-shell:has(.client-detail-right-rail[style*="display: none"]),` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2222 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-shell:has(.client-detail-right-rail:empty) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2222 | `client-detail-shell` | `.client-detail-vnext-page .client-detail-shell:has(.client-detail-right-rail:empty) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2222 | `client-detail-right-rail` | `.client-detail-vnext-page .client-detail-shell:has(.client-detail-right-rail:empty) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2227 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-left-rail {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2227 | `client-detail-left-rail` | `.client-detail-vnext-page .client-detail-left-rail {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2231 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-inline-contact-edit="true"].client-detail-profile-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2231 | `client-detail-profile-card` | `.client-detail-vnext-page [data-client-inline-contact-edit="true"].client-detail-profile-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2232 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-profile-card[data-client-inline-contact-edit="true"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2232 | `client-detail-profile-card` | `.client-detail-vnext-page .client-detail-profile-card[data-client-inline-contact-edit="true"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2233 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-recent-moves-panel="true"].client-detail-recent-moves-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2233 | `client-detail-recent-moves-card` | `.client-detail-vnext-page [data-client-recent-moves-panel="true"].client-detail-recent-moves-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2234 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card[data-client-recent-moves-panel="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2234 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card[data-client-recent-moves-panel="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2242 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-finance-summary="true"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2243 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-left-finance-tile="true"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2244 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-operational-center="true"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2245 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-nearest-planned-action="true"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2246 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-today-info-tile-finance,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2246 | `client-detail-today-info-tile-finance` | `.client-detail-vnext-page .client-detail-today-info-tile-finance,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2247 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-operational-center-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2247 | `client-detail-operational-center-card` | `.client-detail-vnext-page .client-detail-operational-center-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2251 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-left-rail {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2251 | `client-detail-left-rail` | `.client-detail-vnext-page .client-detail-left-rail {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2256 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-today-info-tiles="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2260 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-inline-contact-edit="true"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2261 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-profile-card[data-client-inline-contact-edit="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2261 | `client-detail-profile-card` | `.client-detail-vnext-page .client-detail-profile-card[data-client-inline-contact-edit="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2266 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-recent-moves-panel="true"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2267 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card[data-client-recent-moves-panel="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2267 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card[data-client-recent-moves-panel="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2272 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-right-rail [data-client-finance-summary="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2272 | `client-detail-right-rail` | `.client-detail-vnext-page .client-detail-right-rail [data-client-finance-summary="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2278 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-tiles.entity-overview-tiles {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2278 | `client-detail-top-tiles` | `.client-detail-vnext-page .client-detail-top-tiles.entity-overview-tiles {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2283 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-tile.entity-overview-tile {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2283 | `client-detail-top-tile` | `.client-detail-vnext-page .client-detail-top-tile.entity-overview-tile {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2289 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-tile-head {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2297 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-tile-icon {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2306 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-tile strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2311 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-tile p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2312 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-metric-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2317 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2317 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2318 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card *:not(svg):not(path) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2318 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card *:not(svg):not(path) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2322 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card .client-detail-note-text:empty,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2322 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card .client-detail-note-text:empty,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2322 | `client-detail-note-text` | `.client-detail-vnext-page .client-detail-note-card .client-detail-note-text:empty,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2323 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card .client-detail-note-text[data-empty="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2323 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card .client-detail-note-text[data-empty="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2323 | `client-detail-note-text` | `.client-detail-vnext-page .client-detail-note-card .client-detail-note-text[data-empty="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2327 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card .client-detail-note-text {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2327 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card .client-detail-note-text {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2327 | `client-detail-note-text` | `.client-detail-vnext-page .client-detail-note-card .client-detail-note-text {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2332 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2332 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2333 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card a {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2333 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card a {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2337 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-relations-acquisition-only="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2341 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2341 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2346 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card h2,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2346 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card h2,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2347 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2347 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card h3,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2348 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card [class*="title"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2348 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card [class*="title"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2352 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-completeness-card a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2352 | `client-detail-completeness-card` | `.client-detail-vnext-page .client-detail-completeness-card a,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2353 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-completeness-card .client-detail-open-case-link,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2353 | `client-detail-completeness-card` | `.client-detail-vnext-page .client-detail-completeness-card .client-detail-open-case-link,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2353 | `client-detail-open-case-link` | `.client-detail-vnext-page .client-detail-completeness-card .client-detail-open-case-link,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2354 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side a[href*="/cases/"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2354 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side a[href*="/cases/"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2408 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-tile.entity-overview-tile {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2408 | `client-detail-top-tile` | `.client-detail-vnext-page .client-detail-top-tile.entity-overview-tile {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2413 | `client-detail-vnext-page` | `.client-detail-vnext-page .entity-overview-tile strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2420 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-profile-card .client-detail-icon-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2420 | `client-detail-profile-card` | `.client-detail-vnext-page .client-detail-profile-card .client-detail-icon-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2420 | `client-detail-icon-button` | `.client-detail-vnext-page .client-detail-profile-card .client-detail-icon-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2421 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-contact-list .client-detail-icon-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2421 | `client-detail-contact-list` | `.client-detail-vnext-page .client-detail-contact-list .client-detail-icon-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2421 | `client-detail-icon-button` | `.client-detail-vnext-page .client-detail-contact-list .client-detail-icon-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2422 | `client-detail-vnext-page` | `.client-detail-vnext-page button.client-detail-icon-button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2422 | `client-detail-icon-button` | `.client-detail-vnext-page button.client-detail-icon-button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2439 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-profile-card .client-detail-icon-button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2439 | `client-detail-profile-card` | `.client-detail-vnext-page .client-detail-profile-card .client-detail-icon-button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2439 | `client-detail-icon-button` | `.client-detail-vnext-page .client-detail-profile-card .client-detail-icon-button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2440 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-contact-list .client-detail-icon-button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2440 | `client-detail-contact-list` | `.client-detail-vnext-page .client-detail-contact-list .client-detail-icon-button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2440 | `client-detail-icon-button` | `.client-detail-vnext-page .client-detail-contact-list .client-detail-icon-button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2441 | `client-detail-vnext-page` | `.client-detail-vnext-page button.client-detail-icon-button svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2441 | `client-detail-icon-button` | `.client-detail-vnext-page button.client-detail-icon-button svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2449 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-profile-card .client-detail-icon-button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2449 | `client-detail-profile-card` | `.client-detail-vnext-page .client-detail-profile-card .client-detail-icon-button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2449 | `client-detail-icon-button` | `.client-detail-vnext-page .client-detail-profile-card .client-detail-icon-button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2450 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-contact-list .client-detail-icon-button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2450 | `client-detail-contact-list` | `.client-detail-vnext-page .client-detail-contact-list .client-detail-icon-button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2450 | `client-detail-icon-button` | `.client-detail-vnext-page .client-detail-contact-list .client-detail-icon-button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2451 | `client-detail-vnext-page` | `.client-detail-vnext-page button.client-detail-icon-button:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2451 | `client-detail-icon-button` | `.client-detail-vnext-page button.client-detail-icon-button:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2457 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2457 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2458 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card .inline-flex,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2458 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card .inline-flex,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2459 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card [role="button"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2459 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card [role="button"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2471 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card button *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2471 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card button *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2472 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2472 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2473 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card .inline-flex *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2473 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card .inline-flex *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2474 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card .inline-flex svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2474 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card .inline-flex svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2480 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2480 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2481 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card .inline-flex:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2481 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card .inline-flex:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2486 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2492 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2492 | `client-detail-section-card` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2498 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-head h2 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2498 | `client-detail-section-head` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-head h2 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2502 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-head p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2502 | `client-detail-section-head` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-head p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2506 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2507 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] a {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2511 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2511 | `client-detail-relation-actions` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2512 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions a {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2512 | `client-detail-relation-actions` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions a {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2520 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions button:first-child,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2520 | `client-detail-relation-actions` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions button:first-child,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2521 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions a:first-child {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2521 | `client-detail-relation-actions` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions a:first-child {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2527 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions button:first-child *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2527 | `client-detail-relation-actions` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions button:first-child *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2528 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions a:first-child * {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2528 | `client-detail-relation-actions` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions a:first-child * {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2535 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-summary-source-lead-panel="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2539 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-side-quick-actions="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2548 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-side-quick-actions="true"] .client-detail-card-title-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2548 | `client-detail-card-title-row` | `.client-detail-vnext-page [data-client-side-quick-actions="true"] .client-detail-card-title-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2553 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-side-quick-actions-grid {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2553 | `client-detail-side-quick-actions-grid` | `.client-detail-vnext-page .client-detail-side-quick-actions-grid {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2559 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-side-quick-actions-grid button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2559 | `client-detail-side-quick-actions-grid` | `.client-detail-vnext-page .client-detail-side-quick-actions-grid button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2560 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-side-quick-actions-grid a {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2560 | `client-detail-side-quick-actions-grid` | `.client-detail-vnext-page .client-detail-side-quick-actions-grid a {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2571 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-side-quick-actions-grid button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2571 | `client-detail-side-quick-actions-grid` | `.client-detail-vnext-page .client-detail-side-quick-actions-grid button:hover,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2572 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-side-quick-actions-grid a:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2572 | `client-detail-side-quick-actions-grid` | `.client-detail-vnext-page .client-detail-side-quick-actions-grid a:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2577 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2577 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2578 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card button.inline-flex,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2578 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card button.inline-flex,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2579 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card .inline-flex.items-center.justify-center {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2579 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card .inline-flex.items-center.justify-center {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2588 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card button *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2588 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card button *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2589 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2589 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2590 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card .inline-flex.items-center.justify-center *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2590 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card .inline-flex.items-center.justify-center *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2591 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card .inline-flex.items-center.justify-center svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2591 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card .inline-flex.items-center.justify-center svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2598 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-head p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2598 | `client-detail-section-head` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-head p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2602 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2606 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2606 | `client-detail-section-card` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-section-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2612 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2612 | `client-detail-relation-card` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-card,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2613 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] [class*="relation"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2617 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2617 | `client-detail-relation-actions` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-actions {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2623 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2623 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2628 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2628 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2628 | `client-detail-recent-moves-list` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2639 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list::before {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2639 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list::before {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2639 | `client-detail-recent-moves-list` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list::before {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2651 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list > * {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2651 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list > * {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2651 | `client-detail-recent-moves-list` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list > * {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2661 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list > *::before {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2661 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list > *::before {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2661 | `client-detail-recent-moves-list` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list > *::before {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2674 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list > *:first-child::before {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2674 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list > *:first-child::before {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2674 | `client-detail-recent-moves-list` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list > *:first-child::before {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2681 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2681 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2682 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-completeness-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2682 | `client-detail-completeness-card` | `.client-detail-vnext-page .client-detail-completeness-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2686 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relations-list-acquisition-only,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2686 | `client-detail-relations-list-acquisition-only` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relations-list-acquisition-only,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2687 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-row-acquisition-only,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2687 | `client-detail-relation-row-acquisition-only` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] .client-detail-relation-row-acquisition-only,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2688 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-cases-list-panel="true"] [data-client-acquisition-history-row="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2692 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-case-smart-list="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2698 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-case-smart-card="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2710 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-main {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2710 | `client-detail-case-smart-main` | `.client-detail-vnext-page .client-detail-case-smart-main {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2716 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-kicker {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2716 | `client-detail-case-smart-kicker` | `.client-detail-vnext-page .client-detail-case-smart-kicker {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2728 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-main strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2728 | `client-detail-case-smart-main` | `.client-detail-vnext-page .client-detail-case-smart-main strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2734 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-meta {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2734 | `client-detail-case-smart-meta` | `.client-detail-vnext-page .client-detail-case-smart-meta {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2740 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-meta span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2740 | `client-detail-case-smart-meta` | `.client-detail-vnext-page .client-detail-case-smart-meta span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2749 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-value {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2749 | `client-detail-case-smart-value` | `.client-detail-vnext-page .client-detail-case-smart-value {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2758 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-value small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2758 | `client-detail-case-smart-value` | `.client-detail-vnext-page .client-detail-case-smart-value small {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2766 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-value b {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2766 | `client-detail-case-smart-value` | `.client-detail-vnext-page .client-detail-case-smart-value b {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2771 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-actions {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2771 | `client-detail-case-smart-actions` | `.client-detail-vnext-page .client-detail-case-smart-actions {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2778 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-actions button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2778 | `client-detail-case-smart-actions` | `.client-detail-vnext-page .client-detail-case-smart-actions button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2786 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-actions button:first-child {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2786 | `client-detail-case-smart-actions` | `.client-detail-vnext-page .client-detail-case-smart-actions button:first-child {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2793 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-empty {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2793 | `client-detail-case-smart-empty` | `.client-detail-vnext-page .client-detail-case-smart-empty {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2801 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-side-quick-actions="true"],` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2802 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-side-quick-actions="true"] *,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2803 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-side-quick-actions="true"] h2,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2804 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-side-quick-actions="true"] svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2812 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-side-quick-actions="true"] button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2819 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2819 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2824 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card .client-detail-card-title-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2824 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card .client-detail-card-title-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2824 | `client-detail-card-title-row` | `.client-detail-vnext-page .client-detail-note-card .client-detail-card-title-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2828 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2828 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2829 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card .inline-flex {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2829 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card .inline-flex {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2833 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-card .client-detail-note-text {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2833 | `client-detail-note-card` | `.client-detail-vnext-page .client-detail-note-card .client-detail-note-text {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2833 | `client-detail-note-text` | `.client-detail-vnext-page .client-detail-note-card .client-detail-note-text {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2842 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2842 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2846 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2846 | `client-detail-recent-moves-card` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2846 | `client-detail-recent-moves-list` | `.client-detail-vnext-page .client-detail-recent-moves-card .client-detail-recent-moves-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2851 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-case-smart-card="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2855 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-actions {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2855 | `client-detail-case-smart-actions` | `.client-detail-vnext-page .client-detail-case-smart-actions {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2859 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-actions button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2859 | `client-detail-case-smart-actions` | `.client-detail-vnext-page .client-detail-case-smart-actions button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2866 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-case-smart-card="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2871 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-case-smart-card="true"] .client-detail-case-smart-main {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2871 | `client-detail-case-smart-main` | `.client-detail-vnext-page [data-client-case-smart-card="true"] .client-detail-case-smart-main {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2877 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-case-smart-card="true"] .client-detail-case-smart-meta {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2877 | `client-detail-case-smart-meta` | `.client-detail-vnext-page [data-client-case-smart-card="true"] .client-detail-case-smart-meta {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2882 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-case-smart-card="true"] .client-detail-case-smart-kicker {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2882 | `client-detail-case-smart-kicker` | `.client-detail-vnext-page [data-client-case-smart-card="true"] .client-detail-case-smart-kicker {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2886 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-case-smart-card="true"] .client-detail-case-smart-main > strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2886 | `client-detail-case-smart-main` | `.client-detail-vnext-page [data-client-case-smart-card="true"] .client-detail-case-smart-main > strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2890 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2890 | `client-detail-case-smart-delete-icon-button` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2891 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-actions .client-detail-case-smart-delete-icon-button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2891 | `client-detail-case-smart-actions` | `.client-detail-vnext-page .client-detail-case-smart-actions .client-detail-case-smart-delete-icon-button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2891 | `client-detail-case-smart-delete-icon-button` | `.client-detail-vnext-page .client-detail-case-smart-actions .client-detail-case-smart-delete-icon-button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2904 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2904 | `client-detail-case-smart-delete-icon-button` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2905 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-actions .client-detail-case-smart-delete-icon-button svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2905 | `client-detail-case-smart-actions` | `.client-detail-vnext-page .client-detail-case-smart-actions .client-detail-case-smart-delete-icon-button svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2905 | `client-detail-case-smart-delete-icon-button` | `.client-detail-vnext-page .client-detail-case-smart-actions .client-detail-case-smart-delete-icon-button svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2913 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2913 | `client-detail-case-smart-delete-icon-button` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2920 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-tab-panel .client-detail-section-card:has(.client-detail-relations-list:not(.client-detail-relations-list-acquisition-only)) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2920 | `client-detail-tab-panel` | `.client-detail-vnext-page .client-detail-tab-panel .client-detail-section-card:has(.client-detail-relations-list:not(.client-detail-relations-list-acquisition-only)) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2920 | `client-detail-section-card` | `.client-detail-vnext-page .client-detail-tab-panel .client-detail-section-card:has(.client-detail-relations-list:not(.client-detail-relations-list-acquisition-only)) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2920 | `client-detail-relations-list` | `.client-detail-vnext-page .client-detail-tab-panel .client-detail-section-card:has(.client-detail-relations-list:not(.client-detail-relations-list-acquisition-only)) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2920 | `client-detail-relations-list-acquisition-only` | `.client-detail-vnext-page .client-detail-tab-panel .client-detail-section-card:has(.client-detail-relations-list:not(.client-detail-relations-list-acquisition-only)) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2924 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-tab-panel .client-detail-relations-list:not(.client-detail-relations-list-acquisition-only) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2924 | `client-detail-tab-panel` | `.client-detail-vnext-page .client-detail-tab-panel .client-detail-relations-list:not(.client-detail-relations-list-acquisition-only) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2924 | `client-detail-relations-list` | `.client-detail-vnext-page .client-detail-tab-panel .client-detail-relations-list:not(.client-detail-relations-list-acquisition-only) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2924 | `client-detail-relations-list-acquisition-only` | `.client-detail-vnext-page .client-detail-tab-panel .client-detail-relations-list:not(.client-detail-relations-list-acquisition-only) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2929 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-case-smart-card="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2936 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-notes-list="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2943 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-notes-list-head {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2943 | `client-detail-notes-list-head` | `.client-detail-vnext-page .client-detail-notes-list-head {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2951 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-notes-list-head strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2951 | `client-detail-notes-list-head` | `.client-detail-vnext-page .client-detail-notes-list-head strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2957 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-notes-list-head span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2957 | `client-detail-notes-list-head` | `.client-detail-vnext-page .client-detail-notes-list-head span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2970 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-notes-items {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2970 | `client-detail-notes-items` | `.client-detail-vnext-page .client-detail-notes-items {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2977 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-item="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2985 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-item="true"] p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2993 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-item="true"] small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2994 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-notes-empty {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2994 | `client-detail-notes-empty` | `.client-detail-vnext-page .client-detail-notes-empty {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3001 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3001 | `client-detail-case-smart-delete-icon-button` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3002 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3002 | `client-detail-case-smart-delete-icon-button` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3010 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-notes-list="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3017 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-notes-list-head {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3017 | `client-detail-notes-list-head` | `.client-detail-vnext-page .client-detail-notes-list-head {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3025 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-notes-list-head strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3025 | `client-detail-notes-list-head` | `.client-detail-vnext-page .client-detail-notes-list-head strong {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3031 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-notes-list-head span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3031 | `client-detail-notes-list-head` | `.client-detail-vnext-page .client-detail-notes-list-head span {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3044 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-notes-items {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3044 | `client-detail-notes-items` | `.client-detail-vnext-page .client-detail-notes-items {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3051 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-item="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3059 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-item="true"] p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3067 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-item="true"] small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3068 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-notes-empty {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3068 | `client-detail-notes-empty` | `.client-detail-vnext-page .client-detail-notes-empty {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3075 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3075 | `client-detail-case-smart-delete-icon-button` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3076 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3076 | `client-detail-case-smart-delete-icon-button` | `.client-detail-vnext-page .client-detail-case-smart-delete-icon-button svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3084 | `client-detail-vnext-page` | `.client-detail-vnext-page [data-client-note-pinned="true"] {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3089 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-item-toolbar {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3089 | `client-detail-note-item-toolbar` | `.client-detail-vnext-page .client-detail-note-item-toolbar {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3096 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-item-toolbar button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3096 | `client-detail-note-item-toolbar` | `.client-detail-vnext-page .client-detail-note-item-toolbar button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3110 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-item-toolbar button:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3110 | `client-detail-note-item-toolbar` | `.client-detail-vnext-page .client-detail-note-item-toolbar button:hover {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3115 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-item-toolbar .client-detail-note-delete-button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3115 | `client-detail-note-item-toolbar` | `.client-detail-vnext-page .client-detail-note-item-toolbar .client-detail-note-delete-button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3115 | `client-detail-note-delete-button` | `.client-detail-vnext-page .client-detail-note-item-toolbar .client-detail-note-delete-button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3121 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-note-item-toolbar .client-detail-note-delete-button svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3121 | `client-detail-note-item-toolbar` | `.client-detail-vnext-page .client-detail-note-item-toolbar .client-detail-note-delete-button svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3121 | `client-detail-note-delete-button` | `.client-detail-vnext-page .client-detail-note-item-toolbar .client-detail-note-delete-button svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3127 | `client-detail-note-row` | `.client-detail-note-row p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3128 | `client-detail-activity-row` | `.client-detail-activity-row p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3129 | `client-detail-recent-move-row` | `.client-detail-recent-move-row p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3136 | `client-detail-note-row` | `.client-detail-note-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3137 | `client-detail-activity-row` | `.client-detail-activity-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3138 | `client-detail-recent-move-row` | `.client-detail-recent-move-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3142 | `client-detail-note-list` | `.client-detail-note-list {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3149 | `client-detail-note-list` | `.client-detail-note-list,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3150 | `client-detail-note-row` | `.client-detail-note-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3151 | `client-detail-activity-row` | `.client-detail-activity-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3152 | `client-detail-recent-move-row` | `.client-detail-recent-move-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3156 | `client-detail-note-row` | `.client-detail-note-row p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3157 | `client-detail-activity-row` | `.client-detail-activity-row p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3158 | `client-detail-recent-move-row` | `.client-detail-recent-move-row p {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3166 | `client-detail-next-action-context` | `.client-detail-next-action-context {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3183 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3183 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3188 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-next-action-tile-polish,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3188 | `client-detail-next-action-tile-polish` | `.client-detail-vnext-page .client-detail-next-action-tile-polish,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3189 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3189 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3189 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3203 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-card-title-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3203 | `client-detail-next-action-tile-polish` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-card-title-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3203 | `client-detail-card-title-row` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-card-title-row,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3204 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-card-title-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3204 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-card-title-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3204 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-card-title-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3204 | `client-detail-card-title-row` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-card-title-row {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3213 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-card-title-row svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3213 | `client-detail-next-action-tile-polish` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-card-title-row svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3213 | `client-detail-card-title-row` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-card-title-row svg,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3214 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-card-title-row svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3214 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-card-title-row svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3214 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-card-title-row svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3214 | `client-detail-card-title-row` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-card-title-row svg {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3218 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-card-title-row h2,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3218 | `client-detail-next-action-tile-polish` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-card-title-row h2,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3218 | `client-detail-card-title-row` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-card-title-row h2,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3219 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-card-title-row h2 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3219 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-card-title-row h2 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3219 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-card-title-row h2 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3219 | `client-detail-card-title-row` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-card-title-row h2 {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3230 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-next-action-tile-polish > strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3230 | `client-detail-next-action-tile-polish` | `.client-detail-vnext-page .client-detail-next-action-tile-polish > strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3231 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-next-action-tile-polish > a:not(.client-detail-mini-button):not(.client-detail-icon-button),` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3231 | `client-detail-next-action-tile-polish` | `.client-detail-vnext-page .client-detail-next-action-tile-polish > a:not(.client-detail-mini-button):not(.client-detail-icon-button),` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3231 | `client-detail-mini-button` | `.client-detail-vnext-page .client-detail-next-action-tile-polish > a:not(.client-detail-mini-button):not(.client-detail-icon-button),` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3231 | `client-detail-icon-button` | `.client-detail-vnext-page .client-detail-next-action-tile-polish > a:not(.client-detail-mini-button):not(.client-detail-icon-button),` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3232 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3232 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3232 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > strong,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3233 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > a:not(.client-detail-mini-button):not(.client-detail-icon-button) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3233 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > a:not(.client-detail-mini-button):not(.client-detail-icon-button) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3233 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > a:not(.client-detail-mini-button):not(.client-detail-icon-button) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3233 | `client-detail-mini-button` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > a:not(.client-detail-mini-button):not(.client-detail-icon-button) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3233 | `client-detail-icon-button` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > a:not(.client-detail-mini-button):not(.client-detail-icon-button) {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3249 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-next-action-tile-polish > p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3249 | `client-detail-next-action-tile-polish` | `.client-detail-vnext-page .client-detail-next-action-tile-polish > p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3250 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-next-action-tile-polish > small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3250 | `client-detail-next-action-tile-polish` | `.client-detail-vnext-page .client-detail-next-action-tile-polish > small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3251 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-next-action-context,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3251 | `client-detail-next-action-tile-polish` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-next-action-context,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3251 | `client-detail-next-action-context` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-next-action-context,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3252 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3252 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3252 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > p,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3253 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3253 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3253 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > small,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3254 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-next-action-context {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3254 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-next-action-context {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3254 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-next-action-context {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3254 | `client-detail-next-action-context` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-next-action-context {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3266 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-pill,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3266 | `client-detail-next-action-tile-polish` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-pill,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3266 | `client-detail-pill` | `.client-detail-vnext-page .client-detail-next-action-tile-polish .client-detail-pill,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3267 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-next-action-tile-polish > button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3267 | `client-detail-next-action-tile-polish` | `.client-detail-vnext-page .client-detail-next-action-tile-polish > button,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3268 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-pill,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3268 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-pill,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3268 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-pill,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3268 | `client-detail-pill` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child .client-detail-pill,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3269 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3269 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3269 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child > button {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3283 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3283 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3289 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-next-action-tile-polish,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3289 | `client-detail-next-action-tile-polish` | `.client-detail-vnext-page .client-detail-next-action-tile-polish,` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3290 | `client-detail-vnext-page` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3290 | `client-detail-top-cards-side` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3290 | `client-detail-summary-card` | `.client-detail-vnext-page .client-detail-top-cards-side > .client-detail-summary-card:first-child {` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3299 | `client-detail-page` | `.client-detail-page .cf-fin13-client-case-finances {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 3 | `case-detail-vnext-page` | `.case-detail-vnext-page {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 12 | `case-detail-header` | `.case-detail-header,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 13 | `case-detail-top-grid` | `.case-detail-top-grid,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 14 | `case-detail-shell` | `.case-detail-shell {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 20 | `case-detail-header` | `.case-detail-header {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 28 | `case-detail-header-copy` | `.case-detail-header-copy {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 32 | `case-detail-back-button` | `.case-detail-back-button {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 47 | `case-detail-breadcrumb` | `.case-detail-breadcrumb {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 54 | `case-detail-title-row` | `.case-detail-title-row {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 62 | `case-detail-title-row` | `.case-detail-title-row h1 {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 70 | `case-detail-header-meta` | `.case-detail-header-meta {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 77 | `case-detail-header-meta` | `.case-detail-header-meta span {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 88 | `case-detail-header-actions` | `.case-detail-header-actions {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 95 | `case-detail-top-grid` | `.case-detail-top-grid {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 102 | `case-detail-top-card` | `.case-detail-top-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 103 | `case-detail-section-card` | `.case-detail-section-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 104 | `case-detail-tabs` | `.case-detail-tabs,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 105 | `right-card` | `.right-card.case-detail-right-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 105 | `case-detail-right-card` | `.right-card.case-detail-right-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 106 | `case-detail-right-card` | `.case-detail-right-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 107 | `case-detail-loading-card` | `.case-detail-loading-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 108 | `case-detail-empty-card` | `.case-detail-empty-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 109 | `case-detail-work-row` | `.case-detail-work-row,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 110 | `case-detail-checklist-row` | `.case-detail-checklist-row,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 111 | `case-detail-history-row` | `.case-detail-history-row,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 112 | `case-detail-path-card` | `.case-detail-path-card {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 123 | `case-detail-top-card` | `.case-detail-top-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 124 | `case-detail-section-card` | `.case-detail-section-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 125 | `case-detail-right-card` | `.case-detail-right-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 126 | `case-detail-work-row` | `.case-detail-work-row,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 127 | `case-detail-checklist-row` | `.case-detail-checklist-row,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 128 | `case-detail-history-row` | `.case-detail-history-row,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 129 | `case-detail-path-card` | `.case-detail-path-card {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 133 | `case-detail-top-card` | `.case-detail-top-card {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 138 | `case-detail-card-title-row` | `.case-detail-card-title-row {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 146 | `case-detail-card-title-row` | `.case-detail-card-title-row h2 {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 154 | `case-detail-top-card` | `.case-detail-top-card strong {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 162 | `case-detail-top-card` | `.case-detail-top-card p {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 169 | `case-detail-top-card-blue` | `.case-detail-top-card-blue {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 174 | `case-detail-top-card-green` | `.case-detail-top-card-green {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 179 | `case-detail-top-card-amber` | `.case-detail-top-card-amber {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 184 | `case-detail-top-card-muted` | `.case-detail-top-card-muted {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 188 | `case-detail-progress` | `.case-detail-progress {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 196 | `case-detail-progress` | `.case-detail-progress span {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 203 | `case-detail-shell` | `.case-detail-shell {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 210 | `case-detail-right-rail` | `.case-detail-right-rail {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 222 | `case-detail-right-rail` | `.case-detail-right-rail::before,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 223 | `case-detail-right-rail` | `.case-detail-right-rail::after,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 224 | `case-detail-right-card` | `.case-detail-right-card::before,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 225 | `case-detail-right-card` | `.case-detail-right-card::after,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 226 | `right-card` | `.right-card.case-detail-right-card::before,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 226 | `case-detail-right-card` | `.right-card.case-detail-right-card::before,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 227 | `right-card` | `.right-card.case-detail-right-card::after {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 227 | `case-detail-right-card` | `.right-card.case-detail-right-card::after {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 235 | `case-detail-main-column` | `.case-detail-main-column {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 242 | `case-detail-tabs` | `.case-detail-tabs {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 249 | `case-detail-tabs` | `.case-detail-tabs button {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 260 | `case-detail-tabs` | `.case-detail-tabs button:hover,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 261 | `case-detail-tabs` | `.case-detail-tabs .case-detail-tab-active {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 261 | `case-detail-tab-active` | `.case-detail-tabs .case-detail-tab-active {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 267 | `case-detail-section-card` | `.case-detail-section-card {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 271 | `case-detail-section-head` | `.case-detail-section-head {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 279 | `case-detail-section-head` | `.case-detail-section-head h2 {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 287 | `case-detail-section-head` | `.case-detail-section-head p {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 294 | `case-detail-work-list` | `.case-detail-work-list,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 295 | `case-detail-checklist-list` | `.case-detail-checklist-list,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 296 | `case-detail-history-list` | `.case-detail-history-list {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 301 | `case-detail-work-row` | `.case-detail-work-row {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 310 | `case-detail-work-icon` | `.case-detail-work-icon,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 311 | `case-detail-history-row` | `.case-detail-history-row > span {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 321 | `case-detail-work-main` | `.case-detail-work-main h3,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 322 | `case-detail-checklist-row` | `.case-detail-checklist-row h3,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 323 | `case-detail-history-row` | `.case-detail-history-row h3 {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 330 | `case-detail-work-main` | `.case-detail-work-main p,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 331 | `case-detail-checklist-row` | `.case-detail-checklist-row p,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 332 | `case-detail-history-row` | `.case-detail-history-row p {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 339 | `case-detail-kind-pill` | `.case-detail-kind-pill {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 351 | `case-detail-work-date` | `.case-detail-work-date small {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 358 | `case-detail-work-date` | `.case-detail-work-date strong {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 366 | `case-detail-pill` | `.case-detail-pill {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 377 | `case-detail-pill-green` | `.case-detail-pill-green {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 383 | `case-detail-pill-blue` | `.case-detail-pill-blue {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 389 | `case-detail-pill-red` | `.case-detail-pill-red {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 395 | `case-detail-pill-amber` | `.case-detail-pill-amber {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 401 | `case-detail-pill-muted` | `.case-detail-pill-muted {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 407 | `case-detail-row-actions` | `.case-detail-row-actions,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 408 | `case-detail-right-actions` | `.case-detail-right-actions {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 414 | `case-detail-row-actions` | `.case-detail-row-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 415 | `case-detail-right-actions` | `.case-detail-right-actions button {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 426 | `case-detail-row-actions` | `.case-detail-row-actions button:hover,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 427 | `case-detail-right-actions` | `.case-detail-right-actions button:hover {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 433 | `case-detail-row-action-danger` | `.case-detail-row-action-danger:hover {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 439 | `case-detail-path-grid` | `.case-detail-path-grid {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 445 | `case-detail-path-card` | `.case-detail-path-card {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 450 | `case-detail-path-card` | `.case-detail-path-card strong {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 457 | `case-detail-path-card` | `.case-detail-path-card span {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 465 | `case-detail-path-card` | `.case-detail-path-card p {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 472 | `case-detail-path-card-amber` | `.case-detail-path-card-amber {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 477 | `case-detail-path-card-blue` | `.case-detail-path-card-blue {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 482 | `case-detail-path-card-green` | `.case-detail-path-card-green {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 487 | `case-detail-checklist-row` | `.case-detail-checklist-row {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 496 | `case-detail-history-row` | `.case-detail-history-row {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 505 | `case-detail-right-card` | `.case-detail-right-card {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 511 | `case-detail-right-card` | `.case-detail-right-card p {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 519 | `case-detail-right-card` | `.case-detail-right-card small,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 520 | `case-detail-right-note` | `.case-detail-right-note {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 526 | `case-detail-right-metrics` | `.case-detail-right-metrics {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 531 | `case-detail-right-metrics` | `.case-detail-right-metrics span {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 541 | `case-detail-right-metrics` | `.case-detail-right-metrics strong {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 545 | `case-detail-right-actions-inline` | `.case-detail-right-actions-inline {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 549 | `case-detail-right-actions` | `.case-detail-right-actions button:disabled {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 554 | `case-detail-light-empty` | `.case-detail-light-empty {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 564 | `case-detail-loading-card` | `.case-detail-loading-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 565 | `case-detail-empty-card` | `.case-detail-empty-card {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 574 | `case-detail-empty-card` | `.case-detail-empty-card h1 {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 580 | `case-detail-empty-card` | `.case-detail-empty-card p,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 581 | `case-detail-loading-card` | `.case-detail-loading-card span {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 587 | `case-detail-dialog-grid` | `.case-detail-dialog-grid {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 592 | `case-detail-dialog-grid` | `.case-detail-dialog-grid label {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 600 | `case-detail-dialog-grid` | `.case-detail-dialog-grid select {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 610 | `case-detail-checkbox-label` | `.case-detail-checkbox-label {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 618 | `case-detail-top-grid` | `.case-detail-top-grid {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 622 | `case-detail-shell` | `.case-detail-shell {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 626 | `case-detail-right-rail` | `.case-detail-right-rail {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 633 | `case-detail-header` | `.case-detail-header {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 638 | `case-detail-header-actions` | `.case-detail-header-actions {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 642 | `case-detail-top-grid` | `.case-detail-top-grid,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 643 | `case-detail-path-grid` | `.case-detail-path-grid,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 644 | `case-detail-right-rail` | `.case-detail-right-rail {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 648 | `case-detail-work-row` | `.case-detail-work-row,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 649 | `case-detail-checklist-row` | `.case-detail-checklist-row {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 656 | `case-detail-vnext-page` | `.case-detail-vnext-page {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 660 | `case-detail-title-row` | `.case-detail-title-row h1 {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 664 | `case-detail-header-actions` | `.case-detail-header-actions {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 669 | `case-detail-tabs` | `.case-detail-tabs {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 675 | `case-detail-tabs` | `.case-detail-tabs button {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 679 | `case-detail-section-head` | `.case-detail-section-head {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 685 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-right-actions,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 685 | `case-detail-right-actions` | `.case-detail-vnext-page .case-detail-right-actions,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 686 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-row-actions {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 686 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-row-actions {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 690 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-right-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 690 | `case-detail-right-actions` | `.case-detail-vnext-page .case-detail-right-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 691 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-row-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 691 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-row-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 692 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-header-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 692 | `case-detail-header-actions` | `.case-detail-vnext-page .case-detail-header-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 693 | `case-detail-vnext-page` | `.case-detail-vnext-page button.case-detail-action-button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 693 | `case-detail-action-button` | `.case-detail-vnext-page button.case-detail-action-button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 694 | `case-detail-vnext-page` | `.case-detail-vnext-page [data-case-quick-action="true"] {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 703 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-right-actions button svg,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 703 | `case-detail-right-actions` | `.case-detail-vnext-page .case-detail-right-actions button svg,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 704 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-row-actions button svg,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 704 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-row-actions button svg,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 705 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-header-actions button svg,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 705 | `case-detail-header-actions` | `.case-detail-vnext-page .case-detail-header-actions button svg,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 706 | `case-detail-vnext-page` | `.case-detail-vnext-page button.case-detail-action-button svg,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 706 | `case-detail-action-button` | `.case-detail-vnext-page button.case-detail-action-button svg,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 707 | `case-detail-vnext-page` | `.case-detail-vnext-page [data-case-quick-action="true"] svg {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 712 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-right-actions button:hover,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 712 | `case-detail-right-actions` | `.case-detail-vnext-page .case-detail-right-actions button:hover,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 713 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-row-actions button:hover,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 713 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-row-actions button:hover,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 714 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-header-actions button:hover,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 714 | `case-detail-header-actions` | `.case-detail-vnext-page .case-detail-header-actions button:hover,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 715 | `case-detail-vnext-page` | `.case-detail-vnext-page button.case-detail-action-button:hover,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 715 | `case-detail-action-button` | `.case-detail-vnext-page button.case-detail-action-button:hover,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 716 | `case-detail-vnext-page` | `.case-detail-vnext-page [data-case-quick-action="true"]:hover {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 723 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-right-actions button:disabled,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 723 | `case-detail-right-actions` | `.case-detail-vnext-page .case-detail-right-actions button:disabled,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 724 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-row-actions button:disabled,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 724 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-row-actions button:disabled,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 725 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-header-actions button:disabled {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 725 | `case-detail-header-actions` | `.case-detail-vnext-page .case-detail-header-actions button:disabled {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 732 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-row-action-danger {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 732 | `case-detail-row-action-danger` | `.case-detail-vnext-page .case-detail-row-action-danger {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 737 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-row-action-danger svg {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 737 | `case-detail-row-action-danger` | `.case-detail-vnext-page .case-detail-row-action-danger svg {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 742 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-create-action-card {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 742 | `case-detail-create-action-card` | `.case-detail-vnext-page .case-detail-create-action-card {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 748 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-create-action-card > small:first-child {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 748 | `case-detail-create-action-card` | `.case-detail-vnext-page .case-detail-create-action-card > small:first-child {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 756 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-create-action-card > p {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 756 | `case-detail-create-action-card` | `.case-detail-vnext-page .case-detail-create-action-card > p {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 762 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-create-actions {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 762 | `case-detail-create-actions` | `.case-detail-vnext-page .case-detail-create-actions {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 768 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-create-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 768 | `case-detail-create-actions` | `.case-detail-vnext-page .case-detail-create-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 769 | `case-detail-vnext-page` | `.case-detail-vnext-page [data-case-create-action] {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 782 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-create-actions button svg,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 782 | `case-detail-create-actions` | `.case-detail-vnext-page .case-detail-create-actions button svg,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 783 | `case-detail-vnext-page` | `.case-detail-vnext-page [data-case-create-action] svg {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 788 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-create-actions button:hover,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 788 | `case-detail-create-actions` | `.case-detail-vnext-page .case-detail-create-actions button:hover,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 789 | `case-detail-vnext-page` | `.case-detail-vnext-page [data-case-create-action]:hover {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 797 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-create-action-card {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 797 | `case-detail-create-action-card` | `.case-detail-vnext-page .case-detail-create-action-card {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 803 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-moves-panel {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 803 | `case-detail-recent-moves-panel` | `.case-detail-vnext-page .case-detail-recent-moves-panel {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 807 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-link-button {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 807 | `case-detail-link-button` | `.case-detail-vnext-page .case-detail-link-button {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 815 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-moves-list {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 815 | `case-detail-recent-moves-list` | `.case-detail-vnext-page .case-detail-recent-moves-list {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 820 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-move {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 820 | `case-detail-recent-move` | `.case-detail-vnext-page .case-detail-recent-move {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 832 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-move-dot {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 832 | `case-detail-recent-move-dot` | `.case-detail-vnext-page .case-detail-recent-move-dot {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 841 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-move-dot-task {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 841 | `case-detail-recent-move-dot-task` | `.case-detail-vnext-page .case-detail-recent-move-dot-task {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 846 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-move-dot-event {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 846 | `case-detail-recent-move-dot-event` | `.case-detail-vnext-page .case-detail-recent-move-dot-event {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 851 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-move-dot-item {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 851 | `case-detail-recent-move-dot-item` | `.case-detail-vnext-page .case-detail-recent-move-dot-item {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 856 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-move-dot-status {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 856 | `case-detail-recent-move-dot-status` | `.case-detail-vnext-page .case-detail-recent-move-dot-status {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 861 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-move-dot-note {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 861 | `case-detail-recent-move-dot-note` | `.case-detail-vnext-page .case-detail-recent-move-dot-note {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 866 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-move-topline {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 866 | `case-detail-recent-move-topline` | `.case-detail-vnext-page .case-detail-recent-move-topline {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 877 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-move-topline time {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 877 | `case-detail-recent-move-topline` | `.case-detail-vnext-page .case-detail-recent-move-topline time {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 883 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-move p {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 883 | `case-detail-recent-move` | `.case-detail-vnext-page .case-detail-recent-move p {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 892 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-move small {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 892 | `case-detail-recent-move` | `.case-detail-vnext-page .case-detail-recent-move small {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 902 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-recent-move-topline {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 902 | `case-detail-recent-move-topline` | `.case-detail-vnext-page .case-detail-recent-move-topline {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 910 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-panel {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 910 | `case-detail-note-follow-up-panel` | `.case-detail-vnext-page .case-detail-note-follow-up-panel {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 920 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-head {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 920 | `case-detail-note-follow-up-head` | `.case-detail-vnext-page .case-detail-note-follow-up-head {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 927 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-head h3 {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 927 | `case-detail-note-follow-up-head` | `.case-detail-vnext-page .case-detail-note-follow-up-head h3 {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 934 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-head p,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 934 | `case-detail-note-follow-up-head` | `.case-detail-vnext-page .case-detail-note-follow-up-head p,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 935 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-custom label {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 935 | `case-detail-note-follow-up-custom` | `.case-detail-vnext-page .case-detail-note-follow-up-custom label {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 940 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-preview {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 940 | `case-detail-note-follow-up-preview` | `.case-detail-vnext-page .case-detail-note-follow-up-preview {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 954 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-actions,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 954 | `case-detail-note-follow-up-actions` | `.case-detail-vnext-page .case-detail-note-follow-up-actions,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 955 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-custom {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 955 | `case-detail-note-follow-up-custom` | `.case-detail-vnext-page .case-detail-note-follow-up-custom {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 963 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 963 | `case-detail-note-follow-up-actions` | `.case-detail-vnext-page .case-detail-note-follow-up-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 964 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-custom button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 964 | `case-detail-note-follow-up-custom` | `.case-detail-vnext-page .case-detail-note-follow-up-custom button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 965 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-head button {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 965 | `case-detail-note-follow-up-head` | `.case-detail-vnext-page .case-detail-note-follow-up-head button {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 970 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-custom input {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 970 | `case-detail-note-follow-up-custom` | `.case-detail-vnext-page .case-detail-note-follow-up-custom input {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 978 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-head,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 978 | `case-detail-note-follow-up-head` | `.case-detail-vnext-page .case-detail-note-follow-up-head,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 979 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-custom {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 979 | `case-detail-note-follow-up-custom` | `.case-detail-vnext-page .case-detail-note-follow-up-custom {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 984 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 984 | `case-detail-note-follow-up-actions` | `.case-detail-vnext-page .case-detail-note-follow-up-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 985 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-custom button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 985 | `case-detail-note-follow-up-custom` | `.case-detail-vnext-page .case-detail-note-follow-up-custom button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 986 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-note-follow-up-custom input {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 986 | `case-detail-note-follow-up-custom` | `.case-detail-vnext-page .case-detail-note-follow-up-custom input {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 999 | `case-detail-vnext-page` | `.case-detail-vnext-page [data-case-create-action="note"] {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1005 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-create-actions [data-case-create-action="note"] {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1005 | `case-detail-create-actions` | `.case-detail-vnext-page .case-detail-create-actions [data-case-create-action="note"] {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1011 | `case-detail-finance-panel` | `.case-detail-finance-panel {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1021 | `case-detail-finance-head` | `.case-detail-finance-head {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1029 | `case-detail-finance-head` | `.case-detail-finance-head p {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1038 | `case-detail-finance-head` | `.case-detail-finance-head h2 {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1045 | `case-detail-finance-grid` | `.case-detail-finance-grid {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1051 | `case-detail-finance-stat` | `.case-detail-finance-stat {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1058 | `case-detail-finance-stat` | `.case-detail-finance-stat span {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1066 | `case-detail-finance-stat` | `.case-detail-finance-stat strong {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1072 | `case-detail-finance-stat` | `.case-detail-finance-stat.is-paid {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1077 | `case-detail-finance-stat` | `.case-detail-finance-stat.is-paid strong {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1081 | `case-detail-finance-stat` | `.case-detail-finance-stat.is-left {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1086 | `case-detail-finance-stat` | `.case-detail-finance-stat.is-left strong {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1090 | `case-detail-finance-progress` | `.case-detail-finance-progress {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1098 | `case-detail-finance-progress` | `.case-detail-finance-progress span {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1105 | `case-detail-finance-payments` | `.case-detail-finance-payments {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1111 | `case-detail-finance-payments-head` | `.case-detail-finance-payments-head,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1112 | `case-detail-finance-payment-row` | `.case-detail-finance-payment-row {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1119 | `case-detail-finance-payments-head` | `.case-detail-finance-payments-head strong {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1124 | `case-detail-finance-payments-head` | `.case-detail-finance-payments-head span {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1137 | `case-detail-finance-payment-row` | `.case-detail-finance-payment-row {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1144 | `case-detail-finance-payment-row` | `.case-detail-finance-payment-row div {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1149 | `case-detail-finance-payment-row` | `.case-detail-finance-payment-row strong {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1154 | `case-detail-finance-payment-row` | `.case-detail-finance-payment-row span,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1155 | `case-detail-finance-payment-row` | `.case-detail-finance-payment-row small,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1156 | `case-detail-finance-empty` | `.case-detail-finance-empty {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1162 | `case-detail-payment-dialog` | `.case-detail-payment-dialog select {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1172 | `case-detail-payment-form` | `.case-detail-payment-form {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1178 | `case-detail-finance-head` | `.case-detail-finance-head,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1179 | `case-detail-finance-payment-row` | `.case-detail-finance-payment-row {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1184 | `case-detail-finance-grid` | `.case-detail-finance-grid {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1191 | `case-detail-finance-history-panel` | `.case-detail-finance-history-panel {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1200 | `case-detail-finance-history-list` | `.case-detail-finance-history-list {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1206 | `case-detail-finance-history-panel` | `.case-detail-finance-history-panel .case-detail-finance-empty {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1206 | `case-detail-finance-empty` | `.case-detail-finance-history-panel .case-detail-finance-empty {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1212 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-right-rail,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1212 | `case-detail-right-rail` | `.case-detail-vnext-page .case-detail-right-rail,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1213 | `case-detail-shell` | `.case-detail-shell .case-detail-right-rail,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1213 | `case-detail-right-rail` | `.case-detail-shell .case-detail-right-rail,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1214 | `case-detail-right-rail` | `aside.case-detail-right-rail {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1221 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-right-rail::before,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1221 | `case-detail-right-rail` | `.case-detail-vnext-page .case-detail-right-rail::before,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1222 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-right-rail::after,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1222 | `case-detail-right-rail` | `.case-detail-vnext-page .case-detail-right-rail::after,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1223 | `case-detail-shell` | `.case-detail-shell .case-detail-right-rail::before,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1223 | `case-detail-right-rail` | `.case-detail-shell .case-detail-right-rail::before,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1224 | `case-detail-shell` | `.case-detail-shell .case-detail-right-rail::after,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1224 | `case-detail-right-rail` | `.case-detail-shell .case-detail-right-rail::after,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1225 | `case-detail-right-rail` | `aside.case-detail-right-rail::before,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1226 | `case-detail-right-rail` | `aside.case-detail-right-rail::after {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1232 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-right-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1232 | `case-detail-right-card` | `.case-detail-vnext-page .case-detail-right-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1233 | `case-detail-vnext-page` | `.case-detail-vnext-page [data-case-create-actions-panel="true"],` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1234 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-create-action-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1234 | `case-detail-create-action-card` | `.case-detail-vnext-page .case-detail-create-action-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1235 | `case-detail-shell` | `.case-detail-shell .case-detail-right-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1235 | `case-detail-right-card` | `.case-detail-shell .case-detail-right-card,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1236 | `case-detail-shell` | `.case-detail-shell [data-case-create-actions-panel="true"],` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1237 | `case-detail-shell` | `.case-detail-shell .case-detail-create-action-card {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1237 | `case-detail-create-action-card` | `.case-detail-shell .case-detail-create-action-card {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1246 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-right-card *,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1246 | `case-detail-right-card` | `.case-detail-vnext-page .case-detail-right-card *,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1247 | `case-detail-vnext-page` | `.case-detail-vnext-page [data-case-create-actions-panel="true"] *,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1248 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-create-action-card * {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1248 | `case-detail-create-action-card` | `.case-detail-vnext-page .case-detail-create-action-card * {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1254 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-right-card button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1254 | `case-detail-right-card` | `.case-detail-vnext-page .case-detail-right-card button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1255 | `case-detail-vnext-page` | `.case-detail-vnext-page [data-case-create-actions-panel="true"] button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1256 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-create-action-card button {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1256 | `case-detail-create-action-card` | `.case-detail-vnext-page .case-detail-create-action-card button {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1317 | `case-detail-dialog-stack` | `.case-detail-dialog-stack {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1321 | `case-detail-dialog-stack` | `.case-detail-dialog-stack label {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1325 | `case-detail-dialog-stack` | `.case-detail-dialog-stack label > span {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1333 | `case-detail-page-loading` | `.case-detail-page-loading {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1341 | `case-detail-transition-loader` | `.case-detail-transition-loader {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1354 | `case-detail-transition-loader` | `.case-detail-transition-loader p {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1360 | `case-detail-transition-loader` | `.case-detail-transition-loader span {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1369 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1379 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions__header {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1385 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions__header h2,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1386 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions__header strong {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1391 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions__header p,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1392 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions__header small {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1397 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions__grid,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1398 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions__list,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1399 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions__body {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1404 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions button,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1405 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions__button {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1414 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions button:hover,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1415 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions__button:hover {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1422 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions button svg,` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1423 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-quick-actions__button svg {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1428 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-history-list {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1433 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-history-row {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1445 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-history-kind {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1455 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-history-row p {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1466 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-history-row time {` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1474 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-history-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 8 | `case-detail-vnext-page` | `.case-detail-vnext-page {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 18 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 18 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 28 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 28 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 41 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-row > span {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 41 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-row > span {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 45 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-row > div {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 45 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-row > div {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 53 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-row .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 53 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-row .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 53 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-history-row .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 69 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-row h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 69 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-row h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 84 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-row p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 84 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-row p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 99 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 99 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 99 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 112 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 112 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 112 | `case-detail-work-icon` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 113 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > span,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 113 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > span,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 113 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > span,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 114 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 114 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 114 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-history-list .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 115 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 115 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 115 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 115 | `case-detail-pill` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 116 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill) {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 116 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill) {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 116 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill) {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 116 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill) {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 120 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 120 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 120 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 128 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 128 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 128 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 128 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 140 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 140 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 140 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 155 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 155 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 155 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 159 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 159 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 159 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 165 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 165 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 165 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 169 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 169 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 169 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 181 | `case-detail-vnext-page` | `.case-detail-vnext-page [data-case-history-summary="true"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 182 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-summary-card {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 182 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-history-summary-card {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 187 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 187 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 188 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 188 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 188 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 193 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 193 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 193 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 198 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 198 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 199 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-row p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 199 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-row p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 200 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 200 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 200 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 204 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 204 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 204 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-list .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 215 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 215 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 219 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-history-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 219 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-history-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 219 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-history-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 220 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-history-list {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 220 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-history-list {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 220 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-history-list {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 220 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-history-list {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 225 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 225 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 225 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 226 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 226 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 226 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 226 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 239 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 239 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 239 | `case-detail-work-icon` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 240 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 240 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 240 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 241 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 241 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 241 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 241 | `case-detail-pill` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 242 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 242 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 242 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 242 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 243 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 243 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 243 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 243 | `case-detail-work-icon` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 244 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 244 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 244 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 244 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 245 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 245 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 245 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 245 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 245 | `case-detail-pill` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 246 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill) {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 246 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill) {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 246 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill) {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 246 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill) {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 246 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill) {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 250 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 250 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 250 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 251 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 251 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 251 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 251 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 259 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main .case-detail-kind-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 259 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main .case-detail-kind-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 259 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main .case-detail-kind-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 259 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main .case-detail-kind-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 260 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 260 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 260 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 260 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 260 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 276 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 276 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 276 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 277 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 277 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 277 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 277 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 292 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 292 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 292 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 293 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 293 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 293 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 293 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 294 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-date small,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 294 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-date small,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 294 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-date small,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 295 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 295 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 295 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 295 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 299 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-date,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 299 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-date,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 299 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-date,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 300 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 300 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 300 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 300 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 306 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-date strong,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 306 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-date strong,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 306 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-date strong,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 307 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 307 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 307 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 307 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 319 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 319 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 319 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 320 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 320 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 320 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 320 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-row {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 325 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 325 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 325 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 326 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 326 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 326 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 326 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 331 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 331 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 331 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 332 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 332 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 332 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 332 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-main h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 336 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-date,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 336 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-date,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 336 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-section-card:has([data-case-history-summary="true"]) .case-detail-work-date,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 337 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 337 | `case-detail-section-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 337 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 337 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-section-card:has(.case-detail-history-summary-card) .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 344 | `case-detail-history-unified-panel` | `Real fix: CaseDetail.tsx marks the exact Historia sprawy section with .case-detail-history-unified-panel.` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 349 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 349 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 357 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 357 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 357 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 358 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 358 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 358 | `case-detail-work-list` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 359 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel [data-case-history-list="true"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 359 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel [data-case-history-list="true"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 369 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 369 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 369 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 370 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 370 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 370 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 371 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 371 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 371 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 372 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="history"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 372 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="history"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 385 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > span,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 385 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > span,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 385 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > span,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 386 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 386 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 386 | `case-detail-work-icon` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 387 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 387 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 387 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 388 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 388 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 388 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 388 | `case-detail-pill` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 389 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 389 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 389 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 389 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 390 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="icon"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 390 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="icon"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 390 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="icon"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 391 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="actions"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 391 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="actions"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 391 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="actions"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 395 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 395 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 395 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 396 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 396 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 396 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 397 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > div:first-of-type {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 397 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > div:first-of-type {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 397 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > div:first-of-type {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 405 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-kind-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 405 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-kind-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 405 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-kind-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 406 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 406 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 406 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 406 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 422 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 422 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 422 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 423 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 423 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 423 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 424 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 424 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 424 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 439 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 439 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 439 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 453 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 453 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 453 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 454 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 454 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 454 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 458 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 458 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 458 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 464 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 464 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 464 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 475 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 475 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 475 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 476 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-action-button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 476 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-action-button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 476 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-action-button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 476 | `case-detail-action-button` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-action-button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 477 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row .case-detail-row-actions {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 477 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row .case-detail-row-actions {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 477 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row .case-detail-row-actions {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 477 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row .case-detail-row-actions {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 481 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-summary-card,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 481 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-summary-card,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 481 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-summary-card,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 482 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel [data-case-history-summary="true"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 482 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel [data-case-history-summary="true"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 487 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 487 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 487 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 488 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 488 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 488 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 489 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 489 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 489 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 490 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="history"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 490 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="history"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 495 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 495 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 495 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 496 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 496 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 496 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 497 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > div:first-of-type {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 497 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > div:first-of-type {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 497 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > div:first-of-type {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 502 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 502 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 502 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 503 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 503 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 503 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 504 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 504 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 504 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 505 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 505 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 505 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 509 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 509 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 509 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 519 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 519 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 527 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 527 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 527 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 528 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 528 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 528 | `case-detail-work-list` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 529 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel [data-case-history-list="true"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 529 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel [data-case-history-list="true"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 539 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 539 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 539 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 540 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 540 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 540 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 541 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 541 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 541 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 542 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="history"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 542 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="history"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 555 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > span,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 555 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > span,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 555 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > span,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 556 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 556 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 556 | `case-detail-work-icon` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 557 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 557 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 557 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 558 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 558 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 558 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 558 | `case-detail-pill` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 559 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 559 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 559 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 559 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 560 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="icon"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 560 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="icon"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 560 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="icon"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 561 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="actions"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 561 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="actions"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 561 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="actions"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 565 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 565 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 565 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 566 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 566 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 566 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 567 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > div:first-of-type {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 567 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > div:first-of-type {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 567 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > div:first-of-type {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 575 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-kind-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 575 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-kind-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 575 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-kind-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 576 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 576 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 576 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 576 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 592 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 592 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 592 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 593 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 593 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 593 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 594 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 594 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 594 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 609 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 609 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 609 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 623 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 623 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 623 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 624 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 624 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 624 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 628 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 628 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 628 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 634 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 634 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 634 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 645 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 645 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 645 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 646 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-action-button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 646 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-action-button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 646 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-action-button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 646 | `case-detail-action-button` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-action-button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 647 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row .case-detail-row-actions {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 647 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row .case-detail-row-actions {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 647 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row .case-detail-row-actions {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 647 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row .case-detail-row-actions {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 651 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-summary-card,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 651 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-summary-card,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 651 | `case-detail-history-summary-card` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-summary-card,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 652 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel [data-case-history-summary="true"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 652 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel [data-case-history-summary="true"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 660 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 660 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 668 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 668 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 668 | `case-detail-history-list` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 669 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 669 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 669 | `case-detail-work-list` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-list,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 670 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel [data-case-history-list="true"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 670 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel [data-case-history-list="true"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 680 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 680 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 680 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 681 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 681 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 681 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 682 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 682 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 682 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 683 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="history"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 683 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="history"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 696 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > span,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 696 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > span,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 696 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > span,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 697 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 697 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 697 | `case-detail-work-icon` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-icon,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 698 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 698 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 698 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-row-actions,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 699 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 699 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 699 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 699 | `case-detail-pill` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 700 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 700 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 700 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 700 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > [class*="pill"]:not(.case-detail-kind-pill),` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 701 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="icon"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 701 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="icon"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 701 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="icon"],` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 702 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="actions"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 702 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="actions"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 702 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > [class*="actions"] {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 706 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 706 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 706 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row > div,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 707 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 707 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 707 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 708 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > div:first-of-type {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 708 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > div:first-of-type {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 708 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] > div:first-of-type {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 716 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-kind-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 716 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-kind-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 716 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-kind-pill,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 717 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 717 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 717 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 717 | `case-detail-kind-pill` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main .case-detail-kind-pill {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 733 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 733 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 733 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 734 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 734 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 734 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main h3,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 735 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 735 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 735 | `case-detail-work` | `.case-detail-vnext-page .case-detail-history-unified-panel article[class*="case-detail-work"] h3 {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 750 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 750 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 750 | `case-detail-history-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-history-row p {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 764 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 764 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 764 | `case-detail-work-main` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-main p,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 765 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 765 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 765 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date small {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 769 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 769 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 769 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 775 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 775 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 775 | `case-detail-work-date` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-date strong {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 786 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 786 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 786 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 787 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-action-button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 787 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-action-button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 787 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-action-button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 787 | `case-detail-action-button` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row > .case-detail-action-button,` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 788 | `case-detail-vnext-page` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row .case-detail-row-actions {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 788 | `case-detail-history-unified-panel` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row .case-detail-row-actions {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 788 | `case-detail-work-row` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row .case-detail-row-actions {` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 788 | `case-detail-row-actions` | `.case-detail-vnext-page .case-detail-history-unified-panel .case-detail-work-row .case-detail-row-actions {` |

## 4. Wystąpienia `!important`

| Plik | Linia | Fragment |
| --- | --- | --- |
| `src/styles/visual-stage12-client-detail-vnext.css` | 96 | `background: rgba(255, 255, 255, 0.86) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 97 | `border: 1px solid #bfdbfe !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 98 | `color: #1d4ed8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 99 | `border-radius: 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 103 | `border-radius: 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 117 | `background: transparent !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 118 | `background-image: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 119 | `border: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 120 | `box-shadow: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 121 | `padding: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 138 | `content: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 139 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 140 | `background: transparent !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 141 | `background-image: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 142 | `box-shadow: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 155 | `background: rgba(255, 255, 255, 0.92) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 156 | `background-image: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 157 | `border: 1px solid #e4e7ec !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 158 | `border-radius: 28px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 159 | `box-shadow: 0 8px 22px rgba(16, 24, 40, 0.05) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 160 | `color: #111827 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 161 | `backdrop-filter: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 162 | `filter: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 502 | `margin-top: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 504 | `border-radius: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 505 | `background: #2563eb !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 506 | `border: 1px solid rgba(255, 255, 255, 0.18) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 507 | `color: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 508 | `box-shadow: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 596 | `background: #fff1f3 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 597 | `border-color: #ffe4e8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 601 | `background: #fffaeb !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 602 | `border-color: #fedf89 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 606 | `background: #eff6ff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 607 | `border-color: #bfdbfe !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 611 | `background: #ecfdf3 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 612 | `border-color: #abefc6 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 616 | `background: #f9fafb !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 617 | `border-color: #e4e7ec !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1071 | `grid-template-columns: minmax(0, 1fr) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1072 | `align-items: start !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1092 | `color: #111827 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1105 | `color: #111827 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1118 | `color: #475467 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1131 | `color: #1d4ed8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1142 | `border: 1px solid #d0d5dd !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1143 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1144 | `color: #111827 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1145 | `box-shadow: 0 8px 18px rgba(16, 24, 40, 0.04) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1155 | `color: #1d4ed8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1156 | `stroke: currentColor !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1166 | `border-color: #93c5fd !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1167 | `background: #eff6ff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1168 | `color: #1d4ed8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1178 | `color: #667085 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1179 | `background: #f9fafb !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1188 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1192 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1193 | `flex-wrap: nowrap !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1194 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1195 | `gap: 6px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1196 | `max-width: 100% !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1197 | `overflow-x: auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1198 | `padding-bottom: 2px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1204 | `flex: 0 0 auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1205 | `min-height: 24px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1206 | `padding: 4px 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1207 | `border-radius: 999px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1208 | `font-size: 10.5px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1209 | `line-height: 1.1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1210 | `font-weight: 850 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1211 | `letter-spacing: 0.01em !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1212 | `white-space: nowrap !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1213 | `color: #1f2937 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1214 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1215 | `border-color: #d0d5dd !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1219 | `color: #1d4ed8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1220 | `background: #eff6ff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1221 | `border-color: #bfdbfe !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1225 | `color: #047857 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1226 | `background: #ecfdf3 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1227 | `border-color: #abefc6 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1231 | `color: #b45309 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1232 | `background: #fffaeb !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1233 | `border-color: #fedf89 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1237 | `color: #be123c !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1238 | `background: #fff1f3 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1239 | `border-color: #fecdd3 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1246 | `color: #111827 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1252 | `color: #344054 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1253 | `font-size: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1254 | `font-weight: 850 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1262 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1263 | `color: #111827 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1264 | `-webkit-text-fill-color: #111827 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1265 | `border-color: #d0d5dd !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1266 | `caret-color: #2563eb !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1267 | `box-shadow: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1274 | `color: #98a2b3 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1275 | `-webkit-text-fill-color: #98a2b3 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1282 | `border-color: #2563eb !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1283 | `outline: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1284 | `box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1294 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1295 | `color: #111827 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1296 | `-webkit-text-fill-color: #111827 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1297 | `border: 1px solid #d0d5dd !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1298 | `box-shadow: 0 8px 18px rgba(16, 24, 40, 0.06) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1308 | `background: #eff6ff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1309 | `color: #1d4ed8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1310 | `-webkit-text-fill-color: #1d4ed8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1311 | `border-color: #bfdbfe !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1321 | `color: #111827 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1332 | `color: #475467 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1333 | `font-size: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1334 | `line-height: 1.45 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1339 | `font-size: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1340 | `line-height: 1.35 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1344 | `min-height: 24px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1345 | `padding: 4px 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1346 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1351 | `gap: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1355 | `display: grid !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1356 | `gap: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1360 | `display: grid !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1361 | `grid-template-columns: minmax(0, 1fr) auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1362 | `gap: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1363 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1364 | `padding: 10px 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1365 | `border: 1px solid #e4e7ec !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1366 | `border-radius: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1367 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1368 | `text-decoration: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1369 | `color: #111827 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1373 | `display: block !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1374 | `color: #111827 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1375 | `font-size: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1376 | `line-height: 1.35 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1377 | `font-weight: 850 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1381 | `display: block !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1382 | `margin-top: 3px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1383 | `color: #475467 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1384 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1385 | `line-height: 1.35 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1389 | `color: #667085 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1390 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1391 | `font-style: normal !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1392 | `white-space: nowrap !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1396 | `display: inline-flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1397 | `width: fit-content !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1398 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1399 | `justify-content: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1400 | `min-height: 32px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1401 | `padding: 6px 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1402 | `border-radius: 999px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1403 | `border: 1px solid #bfdbfe !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1404 | `background: #eff6ff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1405 | `color: #1d4ed8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1406 | `font-size: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1407 | `font-weight: 850 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1408 | `text-decoration: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1415 | `gap: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1420 | `grid-template-columns: minmax(150px, 1.15fr) minmax(84px, 0.44fr) minmax(130px, 0.86fr) minmax(72px, 0.34fr) auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1421 | `gap: 9px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1422 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1423 | `padding: 10px 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1424 | `border-radius: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1425 | `min-width: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1430 | `min-width: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1435 | `font-size: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1436 | `line-height: 1.18 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1437 | `letter-spacing: -0.015em !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1438 | `overflow: hidden !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1439 | `display: -webkit-box !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1446 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1447 | `line-height: 1.28 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1448 | `margin-top: 3px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1449 | `overflow: hidden !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1450 | `display: -webkit-box !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1457 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1458 | `line-height: 1.22 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1459 | `overflow-wrap: anywhere !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1464 | `min-height: 22px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1465 | `padding: 3px 7px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1466 | `font-size: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1467 | `line-height: 1.1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1468 | `max-width: 100% !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1469 | `overflow: hidden !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1470 | `text-overflow: ellipsis !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1477 | `min-height: 30px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1478 | `padding: 5px 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1479 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1480 | `white-space: nowrap !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1486 | `grid-template-columns: minmax(0, 1fr) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1487 | `align-items: stretch !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1495 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1499 | `gap: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1504 | `grid-template-columns: minmax(0, 1.15fr) minmax(82px, .42fr) minmax(0, .92fr) minmax(70px, .34fr) auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1505 | `gap: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1506 | `align-items: start !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1507 | `padding: 10px 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1508 | `border-radius: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1509 | `overflow: hidden !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1514 | `min-width: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1519 | `font-size: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1520 | `line-height: 1.22 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1521 | `letter-spacing: -0.02em !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1522 | `display: -webkit-box !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1523 | `-webkit-line-clamp: 2 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1524 | `-webkit-box-orient: vertical !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1525 | `overflow: hidden !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1530 | `margin-top: 3px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1531 | `font-size: 10.5px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1532 | `line-height: 1.28 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1533 | `display: -webkit-box !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1534 | `-webkit-line-clamp: 2 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1535 | `-webkit-box-orient: vertical !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1536 | `overflow: hidden !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1541 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1542 | `line-height: 1.2 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1543 | `display: block !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1544 | `max-width: 100% !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1545 | `overflow: hidden !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1546 | `text-overflow: ellipsis !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1547 | `white-space: nowrap !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1552 | `min-height: 21px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1553 | `padding: 3px 7px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1554 | `font-size: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1555 | `line-height: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1556 | `max-width: 100% !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1557 | `overflow: hidden !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1558 | `text-overflow: ellipsis !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1565 | `min-height: 28px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1566 | `padding: 5px 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1567 | `border-radius: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1568 | `font-size: 10.5px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1569 | `line-height: 1.1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1570 | `white-space: nowrap !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1576 | `grid-template-columns: minmax(0, 1.1fr) minmax(74px, .36fr) minmax(0, .8fr) auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1583 | `grid-template-columns: 1fr !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1584 | `gap: 7px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1585 | `padding: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1622 | `display: inline-flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1623 | `visibility: visible !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1624 | `opacity: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1625 | `width: 100% !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1626 | `min-height: 46px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1627 | `margin-top: 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1628 | `border-radius: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1629 | `background: #2563eb !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1630 | `border: 1px solid #2563eb !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1631 | `color: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1632 | `font-weight: 900 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1633 | `justify-content: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1634 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1635 | `box-shadow: 0 14px 28px rgba(37, 99, 235, 0.24) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1642 | `background: #1d4ed8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1643 | `border-color: #1d4ed8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1644 | `color: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1649 | `color: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1653 | `padding: 18px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1657 | `margin-bottom: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1666 | `min-height: auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1667 | `padding: 18px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1697 | `margin-top: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1698 | `border-radius: 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1781 | `min-height: 34px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1782 | `margin-top: 2px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1783 | `border-radius: 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1784 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1785 | `border-color: #dbeafe !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1786 | `color: #1d4ed8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1787 | `font-size: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1788 | `font-weight: 850 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1810 | `background: #fff1f3 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1811 | `border-color: #ffe4e8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1815 | `background: #fffaeb !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1816 | `border-color: #fedf89 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1820 | `background: #eff6ff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1821 | `border-color: #bfdbfe !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1825 | `background: #ecfdf3 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1826 | `border-color: #abefc6 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1830 | `background: #f9fafb !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1831 | `border-color: #e4e7ec !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1835 | `background: rgba(255, 255, 255, 0.92) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1836 | `border-color: #e4e7ec !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 1959 | `box-shadow: 0 8px 22px rgba(16, 24, 40, 0.05) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2009 | `border: 1px solid #e4e7ec !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2010 | `border-radius: 22px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2011 | `background: rgba(255, 255, 255, 0.96) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2012 | `color: #111827 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2013 | `padding: 14px 15px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2014 | `box-shadow: 0 8px 18px rgba(16, 24, 40, 0.045) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2129 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2133 | `grid-template-columns: 1fr !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2137 | `grid-template-columns: 1fr !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2138 | `grid-template-rows: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2142 | `min-height: 150px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2155 | `border-radius: 20px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2156 | `padding: 13px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2179 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2187 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2195 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2196 | `flex-direction: column !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2197 | `align-self: start !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2198 | `gap: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2203 | `order: 20 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2204 | `margin-top: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2209 | `order: 30 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2210 | `margin-top: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2218 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2223 | `grid-template-columns: minmax(260px, 320px) minmax(0, 1fr) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2228 | `gap: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2235 | `width: 100% !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2248 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2263 | `margin-top: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2269 | `margin-top: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2273 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2279 | `gap: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2280 | `min-height: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2284 | `min-height: 118px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2285 | `padding: 12px 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2286 | `border-radius: 18px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2290 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2291 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2292 | `justify-content: flex-start !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2293 | `gap: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2294 | `min-height: 24px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2298 | `width: 26px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2299 | `height: 26px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2300 | `flex: 0 0 26px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2301 | `display: inline-flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2302 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2303 | `justify-content: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2307 | `font-size: 17px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2308 | `line-height: 1.15 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2313 | `font-size: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2314 | `line-height: 1.3 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2319 | `color: #172033 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2324 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2328 | `color: #334155 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2329 | `opacity: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2334 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2338 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2342 | `max-height: 360px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2343 | `overflow: auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2349 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2355 | `display: inline-flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2356 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2357 | `justify-content: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2358 | `min-height: 34px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2359 | `padding: 8px 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2360 | `margin-top: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2361 | `border-radius: 999px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2362 | `background: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2363 | `color: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2364 | `font-weight: 800 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2365 | `text-decoration: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2371 | `width: 176px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2372 | `min-width: 176px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2379 | `gap: 7px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2380 | `padding-left: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2381 | `padding-right: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2382 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2383 | `line-height: 1.15 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2388 | `width: 15px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2389 | `height: 15px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2390 | `flex: 0 0 15px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2399 | `display: inline !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2400 | `opacity: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2401 | `visibility: visible !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2402 | `max-width: 116px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2403 | `white-space: normal !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2404 | `overflow: hidden !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2405 | `text-overflow: ellipsis !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2409 | `min-height: 104px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2410 | `padding: 10px 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2414 | `font-size: 15px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2423 | `width: 34px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2424 | `min-width: 34px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2425 | `height: 32px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2426 | `min-height: 32px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2427 | `display: inline-flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2428 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2429 | `justify-content: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2430 | `opacity: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2431 | `visibility: visible !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2432 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2433 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2434 | `border: 1px solid #94a3b8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2435 | `border-radius: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2436 | `box-shadow: 0 6px 14px rgba(15, 23, 42, 0.12) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2442 | `width: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2443 | `height: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2444 | `opacity: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2445 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2446 | `stroke: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2452 | `background: #e2e8f0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2453 | `border-color: #64748b !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2454 | `color: #020617 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2460 | `width: 100% !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2461 | `justify-content: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2462 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2463 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2464 | `border: 1px solid #94a3b8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2465 | `opacity: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2466 | `visibility: visible !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2467 | `text-shadow: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2468 | `box-shadow: 0 6px 14px rgba(15, 23, 42, 0.10) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2475 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2476 | `stroke: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2477 | `opacity: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2482 | `background: #e2e8f0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2483 | `color: #020617 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2487 | `display: block !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2488 | `visibility: visible !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2489 | `opacity: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2493 | `display: block !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2494 | `border: 1px solid rgba(148, 163, 184, 0.45) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2495 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2499 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2503 | `color: #475569 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2508 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2513 | `min-height: 32px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2514 | `border: 1px solid #94a3b8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2515 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2516 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2517 | `box-shadow: 0 4px 10px rgba(15, 23, 42, 0.08) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2522 | `background: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2523 | `color: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2524 | `border-color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2529 | `color: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2530 | `stroke: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2536 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2540 | `display: block !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2541 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2542 | `border: 1px solid rgba(148, 163, 184, 0.45) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2543 | `border-radius: 18px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2544 | `padding: 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2545 | `box-shadow: 0 14px 32px rgba(15, 23, 42, 0.08) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2549 | `margin-bottom: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2550 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2554 | `display: grid !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2555 | `grid-template-columns: 1fr !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2556 | `gap: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2561 | `min-height: 34px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2562 | `justify-content: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2563 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2564 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2565 | `border: 1px solid #94a3b8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2566 | `font-weight: 800 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2567 | `opacity: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2568 | `visibility: visible !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2573 | `background: #e2e8f0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2574 | `color: #020617 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2580 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2581 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2582 | `border-color: #94a3b8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2583 | `opacity: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2584 | `visibility: visible !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2585 | `-webkit-text-fill-color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2592 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2593 | `stroke: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2594 | `opacity: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2595 | `-webkit-text-fill-color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2599 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2603 | `background: transparent !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2607 | `border-radius: 22px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2608 | `border: 1px solid rgba(148, 163, 184, 0.5) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2609 | `box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2614 | `border-radius: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2618 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2619 | `flex-wrap: wrap !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2620 | `gap: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2624 | `max-height: 302px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2625 | `overflow: hidden !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2629 | `position: relative !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2630 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2631 | `flex-direction: column !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2632 | `gap: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2633 | `max-height: 232px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2634 | `overflow: auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2635 | `padding-left: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2636 | `padding-right: 2px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2640 | `content: "" !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2641 | `position: absolute !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2642 | `left: 5px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2643 | `top: 7px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2644 | `bottom: 7px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2645 | `width: 2px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2646 | `border-radius: 999px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2647 | `background: linear-gradient(180deg, #2563eb, #22c55e) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2648 | `opacity: 0.55 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2652 | `position: relative !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2653 | `padding: 8px 8px 8px 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2654 | `border: 1px solid rgba(148, 163, 184, 0.35) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2655 | `border-radius: 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2656 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2657 | `color: #172033 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2658 | `box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2662 | `content: "" !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2663 | `position: absolute !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2664 | `left: -15px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2665 | `top: 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2666 | `width: 9px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2667 | `height: 9px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2668 | `border-radius: 999px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2669 | `background: #2563eb !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2670 | `border: 2px solid #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2671 | `box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.18) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2675 | `background: #22c55e !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2676 | `box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.18) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2683 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2689 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2693 | `display: grid !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2694 | `gap: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2695 | `margin-top: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2699 | `display: grid !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2700 | `grid-template-columns: minmax(0, 1.4fr) minmax(120px, 0.7fr) auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2701 | `gap: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2702 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2703 | `padding: 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2704 | `border-radius: 18px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2705 | `border: 1px solid rgba(148, 163, 184, 0.42) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2706 | `background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2707 | `box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2711 | `display: grid !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2712 | `gap: 5px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2713 | `min-width: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2717 | `width: fit-content !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2718 | `padding: 3px 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2719 | `border-radius: 999px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2720 | `background: #e0f2fe !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2721 | `color: #075985 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2722 | `font-size: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2723 | `font-weight: 900 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2724 | `letter-spacing: .08em !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2725 | `text-transform: uppercase !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2729 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2730 | `font-size: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2731 | `line-height: 1.2 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2735 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2736 | `flex-wrap: wrap !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2737 | `gap: 6px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2741 | `padding: 4px 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2742 | `border-radius: 999px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2743 | `background: #f1f5f9 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2744 | `color: #334155 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2745 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2746 | `font-weight: 800 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2750 | `display: grid !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2751 | `gap: 4px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2752 | `padding: 10px 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2753 | `border-radius: 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2754 | `background: #ecfdf5 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2755 | `border: 1px solid #bbf7d0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2759 | `color: #047857 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2760 | `font-size: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2761 | `font-weight: 900 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2762 | `text-transform: uppercase !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2763 | `letter-spacing: .05em !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2767 | `color: #064e3b !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2768 | `font-size: 15px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2772 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2773 | `flex-wrap: wrap !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2774 | `justify-content: flex-end !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2775 | `gap: 7px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2779 | `min-height: 32px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2780 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2781 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2782 | `border-color: #94a3b8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2783 | `-webkit-text-fill-color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2787 | `color: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2788 | `background: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2789 | `border-color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2790 | `-webkit-text-fill-color: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2794 | `padding: 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2795 | `border-radius: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2796 | `background: #f8fafc !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2797 | `color: #475569 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2798 | `border: 1px dashed #cbd5e1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2805 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2806 | `stroke: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2807 | `opacity: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2808 | `visibility: visible !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2809 | `-webkit-text-fill-color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2813 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2814 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2815 | `border: 1px solid #94a3b8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2816 | `-webkit-text-fill-color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2820 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2821 | `flex-direction: column !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2825 | `order: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2830 | `order: 10 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2834 | `order: 30 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2835 | `margin-top: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2836 | `padding-top: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2837 | `border-top: 1px solid rgba(148, 163, 184, 0.35) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2838 | `color: #334155 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2839 | `-webkit-text-fill-color: #334155 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2843 | `max-height: 340px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2847 | `max-height: 270px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2852 | `grid-template-columns: 1fr !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2856 | `justify-content: stretch !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2860 | `flex: 1 1 90px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2867 | `grid-template-columns: minmax(0, 1.12fr) minmax(130px, 0.75fr) auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2868 | `align-items: start !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2872 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2873 | `flex-direction: column !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2874 | `gap: 7px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2878 | `order: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2879 | `margin-bottom: 2px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2883 | `order: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2887 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2892 | `width: 34px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2893 | `min-width: 34px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2894 | `height: 34px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2895 | `min-height: 34px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2896 | `padding: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2897 | `border-radius: 999px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2898 | `border: 1px solid #fecaca !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2899 | `background: #fef2f2 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2900 | `color: #dc2626 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2901 | `-webkit-text-fill-color: #dc2626 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2906 | `width: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2907 | `height: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2908 | `color: #dc2626 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2909 | `stroke: #dc2626 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2910 | `opacity: 1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2914 | `background: #fee2e2 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2915 | `border-color: #fca5a5 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2916 | `color: #b91c1c !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2917 | `-webkit-text-fill-color: #b91c1c !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2921 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2925 | `display: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2930 | `grid-template-columns: 1fr !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2937 | `order: 40 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2938 | `margin-top: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2939 | `display: grid !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2940 | `gap: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2944 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2945 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2946 | `justify-content: space-between !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2947 | `padding-top: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2948 | `border-top: 1px solid rgba(148, 163, 184, 0.35) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2952 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2953 | `font-size: 13px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2954 | `font-weight: 900 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2958 | `min-width: 24px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2959 | `height: 24px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2960 | `border-radius: 999px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2961 | `display: inline-flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2962 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2963 | `justify-content: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2964 | `background: #e2e8f0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2965 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2966 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2967 | `font-weight: 900 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2971 | `display: grid !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2972 | `gap: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2973 | `max-height: 280px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2974 | `overflow: auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2978 | `padding: 10px 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2979 | `border-radius: 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2980 | `background: #f8fafc !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2981 | `border: 1px solid rgba(148, 163, 184, 0.35) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2982 | `color: #172033 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2986 | `margin: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2987 | `color: #172033 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2988 | `font-size: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2989 | `line-height: 1.45 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2990 | `white-space: pre-wrap !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2995 | `margin: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2996 | `color: #64748b !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2997 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 2998 | `line-height: 1.35 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3003 | `color: #dc2626 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3004 | `stroke: #dc2626 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3005 | `-webkit-text-fill-color: #dc2626 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3011 | `order: 40 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3012 | `margin-top: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3013 | `display: grid !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3014 | `gap: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3018 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3019 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3020 | `justify-content: space-between !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3021 | `padding-top: 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3022 | `border-top: 1px solid rgba(148, 163, 184, 0.35) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3026 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3027 | `font-size: 13px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3028 | `font-weight: 900 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3032 | `min-width: 24px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3033 | `height: 24px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3034 | `border-radius: 999px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3035 | `display: inline-flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3036 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3037 | `justify-content: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3038 | `background: #e2e8f0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3039 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3040 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3041 | `font-weight: 900 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3045 | `display: grid !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3046 | `gap: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3047 | `max-height: 280px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3048 | `overflow: auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3052 | `padding: 10px 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3053 | `border-radius: 14px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3054 | `background: #f8fafc !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3055 | `border: 1px solid rgba(148, 163, 184, 0.35) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3056 | `color: #172033 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3060 | `margin: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3061 | `color: #172033 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3062 | `font-size: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3063 | `line-height: 1.45 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3064 | `white-space: pre-wrap !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3069 | `margin: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3070 | `color: #64748b !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3071 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3072 | `line-height: 1.35 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3077 | `color: #dc2626 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3078 | `stroke: #dc2626 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3079 | `-webkit-text-fill-color: #dc2626 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3085 | `border-color: #f59e0b !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3086 | `background: #fffbeb !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3090 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3091 | `justify-content: flex-end !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3092 | `gap: 5px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3093 | `margin: -2px -2px 6px 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3097 | `width: 25px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3098 | `height: 25px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3099 | `min-width: 25px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3100 | `padding: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3101 | `border-radius: 999px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3102 | `border: 1px solid #cbd5e1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3103 | `background: #ffffff !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3104 | `color: #334155 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3105 | `display: inline-flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3106 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3107 | `justify-content: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3111 | `background: #f1f5f9 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3112 | `color: #0f172a !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3116 | `border-color: #fecaca !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3117 | `background: #fef2f2 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3118 | `color: #dc2626 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3122 | `stroke: #dc2626 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3184 | `grid-template-rows: auto auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3185 | `align-content: start !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3190 | `min-height: 156px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3191 | `height: auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3192 | `padding: 18px 18px 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3193 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3194 | `flex-direction: column !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3195 | `align-items: flex-start !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3196 | `justify-content: flex-start !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3197 | `gap: 7px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3198 | `overflow: visible !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3199 | `border-radius: 26px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3200 | `box-shadow: 0 10px 24px rgba(37, 99, 235, 0.09) !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3205 | `width: 100% !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3206 | `min-width: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3207 | `margin: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3208 | `display: flex !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3209 | `align-items: center !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3210 | `gap: 8px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3215 | `flex: 0 0 auto !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3220 | `margin: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3221 | `min-width: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3222 | `color: #101828 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3223 | `font-size: 13px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3224 | `line-height: 1.18 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3225 | `font-weight: 900 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3226 | `letter-spacing: -0.02em !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3227 | `white-space: normal !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3234 | `display: block !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3235 | `max-width: 100% !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3236 | `margin: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3237 | `color: #1d4ed8 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3238 | `font-size: 17px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3239 | `line-height: 1.16 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3240 | `font-weight: 950 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3241 | `letter-spacing: -0.035em !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3242 | `text-decoration: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3243 | `white-space: normal !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3244 | `overflow: visible !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3245 | `overflow-wrap: anywhere !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3246 | `word-break: normal !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3255 | `max-width: 100% !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3256 | `margin: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3257 | `color: #475467 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3258 | `font-size: 12px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3259 | `line-height: 1.35 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3260 | `font-weight: 750 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3261 | `white-space: normal !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3262 | `overflow: visible !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3263 | `overflow-wrap: anywhere !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3270 | `align-self: flex-start !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3271 | `width: fit-content !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3272 | `min-height: 27px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3273 | `margin: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3274 | `padding: 5px 10px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3275 | `border-radius: 999px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3276 | `font-size: 11px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3277 | `line-height: 1.1 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3278 | `font-weight: 900 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3279 | `white-space: nowrap !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3284 | `grid-template-rows: none !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3291 | `min-height: 0 !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3292 | `padding: 16px !important;` |
| `src/styles/visual-stage12-client-detail-vnext.css` | 3293 | `gap: 8px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 113 | `background: rgba(255, 255, 255, 0.92) !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 114 | `background-image: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 115 | `border: 1px solid #e4e7ec !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 116 | `border-radius: 28px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 117 | `box-shadow: 0 8px 22px rgba(16, 24, 40, 0.05) !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 118 | `color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 119 | `backdrop-filter: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 120 | `filter: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 170 | `background: #eff6ff !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 171 | `border-color: #bfdbfe !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 175 | `background: #ecfdf3 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 176 | `border-color: #abefc6 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 180 | `background: #fffaeb !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 181 | `border-color: #fedf89 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 185 | `background: #f9fafb !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 211 | `background: transparent !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 212 | `background-image: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 213 | `border: 0 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 214 | `box-shadow: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 215 | `padding: 0 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 228 | `content: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 229 | `display: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 230 | `background: transparent !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 231 | `background-image: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 232 | `box-shadow: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 307 | `border-radius: 22px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 434 | `border-color: #fecdd3 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 435 | `background: #fff1f3 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 436 | `color: #be123c !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 447 | `border-radius: 22px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 473 | `background: #fffaeb !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 474 | `border-color: #fedf89 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 478 | `background: #eff6ff !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 479 | `border-color: #bfdbfe !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 483 | `background: #ecfdf3 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 484 | `border-color: #abefc6 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 493 | `border-radius: 22px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 502 | `border-radius: 22px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 611 | `display: flex !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 687 | `align-items: center !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 695 | `border: 1px solid #d0d5dd !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 696 | `background: #ffffff !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 697 | `color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 698 | `box-shadow: 0 7px 18px rgba(16, 24, 40, 0.08) !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 699 | `text-shadow: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 700 | `-webkit-text-fill-color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 708 | `color: #2563eb !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 709 | `stroke: currentColor !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 717 | `border-color: #93c5fd !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 718 | `background: #eff6ff !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 719 | `color: #1d4ed8 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 720 | `-webkit-text-fill-color: #1d4ed8 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 726 | `background: #f9fafb !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 727 | `color: #667085 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 728 | `-webkit-text-fill-color: #667085 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 729 | `opacity: 0.72 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 733 | `color: #be123c !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 734 | `-webkit-text-fill-color: #be123c !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 738 | `color: #be123c !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 743 | `gap: 12px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 744 | `border-color: #bfdbfe !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 745 | `background: #ffffff !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 749 | `color: #2563eb !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 750 | `font-size: 11px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 751 | `font-weight: 900 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 752 | `letter-spacing: 0.02em !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 753 | `text-transform: uppercase !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 757 | `color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 758 | `font-size: 14px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 759 | `font-weight: 900 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 763 | `display: grid !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 764 | `grid-template-columns: 1fr !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 765 | `gap: 8px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 770 | `width: 100% !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 771 | `min-height: 38px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 772 | `justify-content: flex-start !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 773 | `border: 1px solid #d0d5dd !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 774 | `background: #ffffff !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 775 | `color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 776 | `-webkit-text-fill-color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 777 | `box-shadow: 0 8px 18px rgba(16, 24, 40, 0.08) !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 778 | `font-size: 12px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 779 | `font-weight: 900 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 784 | `color: #2563eb !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 785 | `stroke: currentColor !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 790 | `border-color: #93c5fd !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 791 | `background: #eff6ff !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 792 | `color: #1d4ed8 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 793 | `-webkit-text-fill-color: #1d4ed8 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 798 | `order: -10 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 808 | `display: inline-flex !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 809 | `align-items: center !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 810 | `gap: 8px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 811 | `color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 812 | `-webkit-text-fill-color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 917 | `color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 931 | `color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 936 | `color: #374151 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 937 | `-webkit-text-fill-color: #374151 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 946 | `color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 947 | `-webkit-text-fill-color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 966 | `color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 967 | `-webkit-text-fill-color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 972 | `color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 973 | `-webkit-text-fill-color: #111827 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 974 | `background: #ffffff !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1215 | `background: transparent !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1216 | `background-image: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1217 | `box-shadow: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1218 | `color: #0f172a !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1227 | `display: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1228 | `background: transparent !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1229 | `content: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1238 | `background: #ffffff !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1239 | `background-image: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1240 | `color: #0f172a !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1241 | `border-color: rgba(148, 163, 184, 0.42) !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1242 | `box-shadow: 0 18px 42px rgba(15, 23, 42, 0.08) !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1243 | `-webkit-text-fill-color: #0f172a !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1249 | `color: inherit !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1250 | `opacity: 1 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1251 | `visibility: visible !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1257 | `background: #ffffff !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1258 | `color: #0f172a !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1259 | `border-color: #cbd5e1 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1370 | `background: #ffffff !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1371 | `background-image: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1372 | `border: 1px solid rgba(148, 163, 184, 0.28) !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1373 | `border-radius: 28px !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1374 | `box-shadow: 0 18px 50px rgba(15, 23, 42, 0.08) !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1375 | `color: #0f172a !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1376 | `overflow: hidden !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1380 | `background: linear-gradient(180deg, rgba(248, 250, 252, 0.98), #ffffff) !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1381 | `border-bottom: 1px solid rgba(148, 163, 184, 0.22) !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1382 | `color: #0f172a !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1387 | `color: #0f172a !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1388 | `-webkit-text-fill-color: #0f172a !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1393 | `color: #64748b !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1394 | `-webkit-text-fill-color: #64748b !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1400 | `background: #ffffff !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1401 | `color: #0f172a !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1406 | `background: #ffffff !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1407 | `background-image: none !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1408 | `color: #0f172a !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1409 | `-webkit-text-fill-color: #0f172a !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1410 | `border-color: rgba(148, 163, 184, 0.36) !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1411 | `box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06) !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1416 | `background: #f8fafc !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1417 | `color: #1d4ed8 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1418 | `-webkit-text-fill-color: #1d4ed8 !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1419 | `border-color: rgba(37, 99, 235, 0.32) !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1424 | `color: #2563eb !important;` |
| `src/styles/visual-stage13-case-detail-vnext.css` | 1425 | `stroke: currentColor !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 19 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 20 | `gap: 0.48rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 21 | `padding: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 22 | `background: transparent !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 23 | `border: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 24 | `box-shadow: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 29 | `min-height: 2.85rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 30 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 31 | `grid-template-columns: minmax(0, 1fr) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 32 | `align-items: center !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 33 | `gap: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 34 | `padding: 0.46rem 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 35 | `border: 1px solid var(--cf-case-history-line) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 36 | `border-radius: 1rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 37 | `background: var(--cf-case-history-bg) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 38 | `box-shadow: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 42 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 46 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 47 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 48 | `grid-template-columns: 7.75rem minmax(0, 1fr) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 49 | `align-items: center !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 50 | `gap: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 54 | `grid-column: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 55 | `grid-row: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 56 | `width: fit-content !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 57 | `min-height: 1.42rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 58 | `padding: 0.16rem 0.5rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 59 | `border-radius: 999px !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 60 | `border-color: #dbeafe !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 61 | `background: var(--cf-case-history-blue-soft) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 62 | `color: #1d4ed8 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 63 | `-webkit-text-fill-color: #1d4ed8 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 64 | `font-size: 0.68rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 65 | `font-weight: 920 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 66 | `line-height: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 70 | `grid-column: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 71 | `grid-row: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 72 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 73 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 74 | `color: var(--cf-case-history-text) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 75 | `-webkit-text-fill-color: var(--cf-case-history-text) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 76 | `font-size: 0.82rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 77 | `font-weight: 900 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 78 | `line-height: 1.22 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 79 | `overflow: hidden !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 80 | `text-overflow: ellipsis !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 81 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 85 | `grid-column: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 86 | `grid-row: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 87 | `margin: 0.12rem 0 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 88 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 89 | `color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 90 | `-webkit-text-fill-color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 91 | `font-size: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 92 | `line-height: 1.25 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 93 | `overflow: hidden !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 94 | `text-overflow: ellipsis !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 95 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 100 | `min-height: 2.85rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 101 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 102 | `grid-template-columns: minmax(0, 1fr) 8.5rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 103 | `align-items: center !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 104 | `gap: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 105 | `padding: 0.46rem 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 106 | `border: 1px solid var(--cf-case-history-line) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 107 | `border-radius: 1rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 108 | `background: var(--cf-case-history-bg) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 109 | `box-shadow: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 117 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 121 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 122 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 123 | `grid-template-columns: 7.75rem minmax(0, 1fr) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 124 | `align-items: center !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 125 | `gap: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 129 | `grid-column: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 130 | `grid-row: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 131 | `width: fit-content !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 132 | `min-height: 1.42rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 133 | `padding: 0.16rem 0.5rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 134 | `border-radius: 999px !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 135 | `font-size: 0.68rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 136 | `font-weight: 920 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 137 | `line-height: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 141 | `grid-column: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 142 | `grid-row: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 143 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 144 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 145 | `color: var(--cf-case-history-text) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 146 | `-webkit-text-fill-color: var(--cf-case-history-text) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 147 | `font-size: 0.82rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 148 | `font-weight: 900 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 149 | `line-height: 1.22 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 150 | `overflow: hidden !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 151 | `text-overflow: ellipsis !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 152 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 156 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 160 | `justify-self: end !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 161 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 162 | `text-align: right !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 166 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 170 | `display: block !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 171 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 172 | `color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 173 | `-webkit-text-fill-color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 174 | `font-size: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 175 | `font-weight: 820 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 176 | `line-height: 1.15 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 177 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 183 | `max-width: 44rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 189 | `grid-template-columns: 1fr !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 190 | `gap: 0.28rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 194 | `grid-template-columns: 1fr !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 195 | `align-items: start !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 201 | `white-space: normal !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 205 | `justify-self: start !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 206 | `text-align: left !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 216 | `max-width: 44rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 221 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 222 | `gap: 0.48rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 227 | `min-height: 2.85rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 228 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 229 | `grid-template-columns: minmax(0, 1fr) 8.25rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 230 | `align-items: center !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 231 | `gap: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 232 | `padding: 0.46rem 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 233 | `border: 1px solid var(--cf-case-history-line) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 234 | `border-radius: 1rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 235 | `background: var(--cf-case-history-bg) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 236 | `box-shadow: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 247 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 252 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 253 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 254 | `grid-template-columns: 7.75rem minmax(0, 1fr) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 255 | `align-items: center !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 256 | `gap: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 261 | `grid-column: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 262 | `grid-row: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 263 | `width: fit-content !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 264 | `min-height: 1.42rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 265 | `padding: 0.16rem 0.5rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 266 | `border-radius: 999px !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 267 | `border-color: #dbeafe !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 268 | `background: var(--cf-case-history-blue-soft) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 269 | `color: #1d4ed8 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 270 | `-webkit-text-fill-color: #1d4ed8 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 271 | `font-size: 0.68rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 272 | `font-weight: 920 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 273 | `line-height: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 278 | `grid-column: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 279 | `grid-row: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 280 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 281 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 282 | `color: var(--cf-case-history-text) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 283 | `-webkit-text-fill-color: var(--cf-case-history-text) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 284 | `font-size: 0.82rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 285 | `font-weight: 900 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 286 | `line-height: 1.22 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 287 | `overflow: hidden !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 288 | `text-overflow: ellipsis !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 289 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 296 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 301 | `justify-self: end !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 302 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 303 | `text-align: right !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 308 | `display: block !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 309 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 310 | `color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 311 | `-webkit-text-fill-color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 312 | `font-size: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 313 | `font-weight: 820 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 314 | `line-height: 1.15 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 315 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 321 | `grid-template-columns: 1fr !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 322 | `align-items: start !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 327 | `grid-template-columns: 1fr !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 328 | `gap: 0.28rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 333 | `white-space: normal !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 338 | `justify-self: start !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 339 | `text-align: left !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 360 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 361 | `gap: 0.5rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 362 | `padding: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 363 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 364 | `background: transparent !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 365 | `border: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 366 | `box-shadow: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 373 | `min-height: 2.9rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 374 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 375 | `grid-template-columns: minmax(0, 1fr) 8.5rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 376 | `align-items: center !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 377 | `gap: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 378 | `padding: 0.5rem 0.75rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 379 | `border: 1px solid var(--cf-case-history-line) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 380 | `border-radius: 1rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 381 | `background: var(--cf-case-history-bg) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 382 | `box-shadow: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 392 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 398 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 399 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 400 | `grid-template-columns: 7.75rem minmax(0, 1fr) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 401 | `align-items: center !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 402 | `gap: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 407 | `grid-column: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 408 | `grid-row: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 409 | `width: fit-content !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 410 | `min-height: 1.42rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 411 | `padding: 0.16rem 0.5rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 412 | `border-radius: 999px !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 413 | `border: 1px solid #dbeafe !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 414 | `background: var(--cf-case-history-blue-soft) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 415 | `color: #1d4ed8 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 416 | `-webkit-text-fill-color: #1d4ed8 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 417 | `font-size: 0.68rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 418 | `font-weight: 920 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 419 | `line-height: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 425 | `grid-column: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 426 | `grid-row: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 427 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 428 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 429 | `color: var(--cf-case-history-text) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 430 | `-webkit-text-fill-color: var(--cf-case-history-text) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 431 | `font-size: 0.82rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 432 | `font-weight: 900 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 433 | `line-height: 1.22 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 434 | `overflow: hidden !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 435 | `text-overflow: ellipsis !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 436 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 440 | `grid-column: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 441 | `grid-row: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 442 | `margin: 0.12rem 0 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 443 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 444 | `color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 445 | `-webkit-text-fill-color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 446 | `font-size: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 447 | `line-height: 1.25 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 448 | `overflow: hidden !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 449 | `text-overflow: ellipsis !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 450 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 455 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 459 | `justify-self: end !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 460 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 461 | `text-align: right !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 465 | `display: block !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 466 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 467 | `color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 468 | `-webkit-text-fill-color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 469 | `font-size: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 470 | `font-weight: 820 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 471 | `line-height: 1.15 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 472 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 478 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 483 | `margin-bottom: 0.65rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 491 | `grid-template-columns: 1fr !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 492 | `align-items: start !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 498 | `grid-template-columns: 1fr !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 499 | `gap: 0.28rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 506 | `white-space: normal !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 510 | `justify-self: start !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 511 | `text-align: left !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 530 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 531 | `gap: 0.5rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 532 | `padding: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 533 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 534 | `background: transparent !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 535 | `border: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 536 | `box-shadow: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 543 | `min-height: 2.9rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 544 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 545 | `grid-template-columns: minmax(0, 1fr) 8.5rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 546 | `align-items: center !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 547 | `gap: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 548 | `padding: 0.5rem 0.75rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 549 | `border: 1px solid var(--cf-case-history-line) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 550 | `border-radius: 1rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 551 | `background: var(--cf-case-history-bg) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 552 | `box-shadow: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 562 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 568 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 569 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 570 | `grid-template-columns: 7.75rem minmax(0, 1fr) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 571 | `align-items: center !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 572 | `gap: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 577 | `grid-column: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 578 | `grid-row: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 579 | `width: fit-content !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 580 | `min-height: 1.42rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 581 | `padding: 0.16rem 0.5rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 582 | `border-radius: 999px !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 583 | `border: 1px solid #dbeafe !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 584 | `background: var(--cf-case-history-blue-soft) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 585 | `color: #1d4ed8 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 586 | `-webkit-text-fill-color: #1d4ed8 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 587 | `font-size: 0.68rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 588 | `font-weight: 920 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 589 | `line-height: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 595 | `grid-column: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 596 | `grid-row: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 597 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 598 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 599 | `color: var(--cf-case-history-text) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 600 | `-webkit-text-fill-color: var(--cf-case-history-text) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 601 | `font-size: 0.82rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 602 | `font-weight: 900 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 603 | `line-height: 1.22 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 604 | `overflow: hidden !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 605 | `text-overflow: ellipsis !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 606 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 610 | `grid-column: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 611 | `grid-row: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 612 | `margin: 0.12rem 0 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 613 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 614 | `color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 615 | `-webkit-text-fill-color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 616 | `font-size: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 617 | `line-height: 1.25 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 618 | `overflow: hidden !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 619 | `text-overflow: ellipsis !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 620 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 625 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 629 | `justify-self: end !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 630 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 631 | `text-align: right !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 635 | `display: block !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 636 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 637 | `color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 638 | `-webkit-text-fill-color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 639 | `font-size: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 640 | `font-weight: 820 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 641 | `line-height: 1.15 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 642 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 648 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 653 | `margin-bottom: 0.65rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 671 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 672 | `gap: 0.5rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 673 | `padding: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 674 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 675 | `background: transparent !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 676 | `border: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 677 | `box-shadow: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 684 | `min-height: 2.9rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 685 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 686 | `grid-template-columns: minmax(0, 1fr) 8.5rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 687 | `align-items: center !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 688 | `gap: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 689 | `padding: 0.5rem 0.75rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 690 | `border: 1px solid var(--cf-case-history-line) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 691 | `border-radius: 1rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 692 | `background: var(--cf-case-history-bg) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 693 | `box-shadow: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 703 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 709 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 710 | `display: grid !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 711 | `grid-template-columns: 7.75rem minmax(0, 1fr) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 712 | `align-items: center !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 713 | `gap: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 718 | `grid-column: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 719 | `grid-row: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 720 | `width: fit-content !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 721 | `min-height: 1.42rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 722 | `padding: 0.16rem 0.5rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 723 | `border-radius: 999px !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 724 | `border: 1px solid #dbeafe !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 725 | `background: var(--cf-case-history-blue-soft) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 726 | `color: #1d4ed8 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 727 | `-webkit-text-fill-color: #1d4ed8 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 728 | `font-size: 0.68rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 729 | `font-weight: 920 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 730 | `line-height: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 736 | `grid-column: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 737 | `grid-row: 1 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 738 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 739 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 740 | `color: var(--cf-case-history-text) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 741 | `-webkit-text-fill-color: var(--cf-case-history-text) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 742 | `font-size: 0.82rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 743 | `font-weight: 900 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 744 | `line-height: 1.22 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 745 | `overflow: hidden !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 746 | `text-overflow: ellipsis !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 747 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 751 | `grid-column: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 752 | `grid-row: 2 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 753 | `margin: 0.12rem 0 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 754 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 755 | `color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 756 | `-webkit-text-fill-color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 757 | `font-size: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 758 | `line-height: 1.25 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 759 | `overflow: hidden !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 760 | `text-overflow: ellipsis !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 761 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 766 | `display: none !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 770 | `justify-self: end !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 771 | `min-width: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 772 | `text-align: right !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 776 | `display: block !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 777 | `margin: 0 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 778 | `color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 779 | `-webkit-text-fill-color: var(--cf-case-history-muted) !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 780 | `font-size: 0.72rem !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 781 | `font-weight: 820 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 782 | `line-height: 1.15 !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 783 | `white-space: nowrap !important;` |
| `src/styles/closeflow-case-history-visual-source-truth.css` | 789 | `display: none !important;` |

## 5. Lokalne helpery finansowe w ClientDetail / CaseDetail

### 5.1. Kandydaci na lokalne definicje helperów finansowych

| Plik | Linia | Fragment |
| --- | --- | --- |
| `src/pages/ClientDetail.tsx` | 73 | `const FIN13_CLIENT_DETAIL_CASE_FINANCES_VISIBLE = 'FIN13_CLIENT_DETAIL_CASE_FINANCES_VISIBLE';` |
| `src/pages/ClientDetail.tsx` | 266 | `function isPaidPaymentStatus(status: unknown) {` |
| `src/pages/ClientDetail.tsx` | 331 | `function paymentStatusLabel(status?: string) {` |
| `src/pages/ClientDetail.tsx` | 636 | `function getCaseValueLabel(caseRecord: any) {` |
| `src/pages/ClientDetail.tsx` | 942 | `const STAGE28A_CLIENT_NOTE_ID_COMPAT_GUARD = 'client note listener id safe before finance';` |
| `src/pages/ClientDetail.tsx` | 948 | `function getClientPaymentAmount(payment: any) {` |
| `src/pages/ClientDetail.tsx` | 977 | `const paidPayments = payments.filter((payment) => isPaidPaymentStatus(payment?.status));` |
| `src/pages/ClientDetail.tsx` | 978 | `const paidTotal = paidPayments.reduce((sum, payment) => sum + getClientPaymentAmount(payment), 0);` |
| `src/pages/ClientDetail.tsx` | 979 | `const declaredTotal = payments.reduce((sum, payment) => sum + getClientPaymentAmount(payment), 0);` |
| `src/pages/ClientDetail.tsx` | 1340 | `const clientFinance = useMemo(() => {` |
| `src/pages/ClientDetail.tsx` | 1349 | `const casesExpected = cases.reduce((sum, caseRecord) => sum + (Number(caseRecord?.expectedRevenue \|\| caseRecord?.dealValue \|\| 0) \|\| 0), 0);` |
| `src/pages/ClientDetail.tsx` | 1350 | `const paidTotal = payments` |
| `src/pages/ClientDetail.tsx` | 1355 | `const currencies = [client?.currency, ...leads.map((lead) => lead?.currency), ...cases.map((entry) => entry?.currency), ...payments.map((entry) => entry?.currency)]` |
| `src/pages/ClientDetail.tsx` | 1368 | `const clientFinanceSummary = useMemo(() => {` |
| `src/pages/ClientDetail.tsx` | 1369 | `const caseValueTotal = cases.reduce((sum, caseRecord) => sum + (Number(caseRecord?.expectedRevenue \|\| caseRecord?.dealValue \|\| 0) \|\| 0), 0);` |
| `src/pages/ClientDetail.tsx` | 1370 | `const paymentsTotal = payments.reduce((sum, entry) => sum + (Number(entry?.amount) \|\| 0), 0);` |
| `src/pages/ClientDetail.tsx` | 1371 | `const remainingTotal = Math.max(0, caseValueTotal - paymentsTotal);` |
| `src/pages/ClientDetail.tsx` | 1372 | `const recentPayments = [...payments]` |
| `src/pages/ClientDetail.tsx` | 1744 | `const currency = payments.find((payment) => typeof payment?.currency === 'string' && payment.currency.trim())?.currency \|\| 'PLN';` |
| `src/pages/ClientDetail.tsx` | 1745 | `const amountOfPayment = (payment: any) =>` |
| `src/pages/ClientDetail.tsx` | 1754 | `const total = payments.reduce((sum, payment) => sum + amountOfPayment(payment), 0);` |
| `src/pages/ClientDetail.tsx` | 1755 | `const paid = payments` |
| `src/pages/ClientDetail.tsx` | 1759 | `const paymentsLabel = payments.length === 1 ? 'pozycja' : payments.length < 5 ? 'pozycje' : 'pozycji';` |
| `src/pages/ClientDetail.tsx` | 2100 | `const value = getCaseValueLabel(caseRecord);` |
| `src/pages/CaseDetail.tsx` | 129 | `const STAGE28A_CASE_FINANCE_CORE_GUARD = 'case finance core value paid remaining partial payments';` |
| `src/pages/CaseDetail.tsx` | 130 | `const STAGE28A3_CASE_FINANCE_HISTORY_VISIBLE_REPAIR_GUARD = 'case finance history visible separate section';` |
| `src/pages/CaseDetail.tsx` | 131 | `const FIN11_CASE_RIGHT_FINANCE_PANEL = 'FIN-11_CASE_RIGHT_FINANCE_PANEL_VISIBLE_EDIT_VALUE_COMMISSION';` |
| `src/pages/CaseDetail.tsx` | 348 | `function isPaidPaymentStatus(status: unknown) {` |
| `src/pages/CaseDetail.tsx` | 368 | `function getPaymentAmount(payment: CasePaymentRecord) {` |
| `src/pages/CaseDetail.tsx` | 369 | `const raw = payment.amount ?? payment.value ?? payment.paidAmount ?? 0;` |
| `src/pages/CaseDetail.tsx` | 373 | `function getCaseExpectedRevenue(caseData?: CaseRecord \| null) {` |
| `src/pages/CaseDetail.tsx` | 388 | `const paid = Number((caseData as any)?.paidAmount ?? (caseData as any)?.paid_amount ?? 0);` |
| `src/pages/CaseDetail.tsx` | 389 | `const remaining = Number((caseData as any)?.remainingAmount ?? (caseData as any)?.remaining_amount ?? 0);` |
| `src/pages/CaseDetail.tsx` | 390 | `const totalFromSettlement = (Number.isFinite(paid) ? paid : 0) + (Number.isFinite(remaining) ? remaining : 0);` |
| `src/pages/CaseDetail.tsx` | 393 | `function getCaseFinanceSummary(caseData: CaseRecord \| null, payments: CasePaymentRecord[]) {` |
| `src/pages/CaseDetail.tsx` | 394 | `const source = getCaseFinanceSourceSummary(caseData, payments);` |
| `src/pages/CaseDetail.tsx` | 395 | `const progress = source.contractValue > 0 ? Math.min(100, Math.round((source.clientPaidAmount / source.contractValue) * 100)) : 0;` |
| `src/pages/CaseDetail.tsx` | 465 | `function formatCaseFinanceValueOrUnset(value: unknown, currency?: string) {` |
| `src/pages/CaseDetail.tsx` | 470 | `function buildFin11FinanceEditState(caseData: CaseRecord \| null, payments: CasePaymentRecord[]): CaseFinanceEditFormState {` |
| `src/pages/CaseDetail.tsx` | 471 | `const summary = getCaseFinanceSourceSummary(caseData, payments);` |
| `src/pages/CaseDetail.tsx` | 482 | `function buildFin11PaymentState(type: 'partial' \| 'commission', currency: string): CaseFinancePaymentFormState {` |
| `src/pages/CaseDetail.tsx` | 494 | `function getFin11FinancePreview(form: CaseFinanceEditFormState, payments: CasePaymentRecord[]) {` |
| `src/pages/CaseDetail.tsx` | 495 | `const contractValue = fin11Amount(form.contractValue);` |
| `src/pages/CaseDetail.tsx` | 496 | `const clientPaidAmount = getCaseFinanceSourceSummary({ contractValue, currency: form.currency } as CaseRecord, payments).clientPaidAmount;` |
| `src/pages/CaseDetail.tsx` | 497 | `const commissionRate = form.commissionMode === 'percent' ? Math.min(100, fin11Amount(form.commissionRate)) : 0;` |
| `src/pages/CaseDetail.tsx` | 498 | `const commissionAmount = form.commissionMode === 'fixed'` |
| `src/pages/CaseDetail.tsx` | 503 | `const commissionPaidAmount = getCaseFinanceSourceSummary({ contractValue, currency: form.currency } as CaseRecord, payments).commissionPaidAmount;` |
| `src/pages/CaseDetail.tsx` | 515 | `function sortCasePayments(payments: CasePaymentRecord[]) {` |
| `src/pages/CaseDetail.tsx` | 743 | `for (const payment of input.payments \|\| []) {` |
| `src/pages/CaseDetail.tsx` | 744 | `const currency = typeof payment.currency === 'string' && payment.currency.trim() ? payment.currency : 'PLN';` |
| `src/pages/CaseDetail.tsx` | 745 | `const amountLabel = formatMoney(getPaymentAmount(payment), currency);` |
| `src/pages/CaseDetail.tsx` | 746 | `const note = pickCaseHistoryBodyStage14D(payment.note, billingStatusLabel(payment.status));` |
| `src/pages/CaseDetail.tsx` | 1046 | `const financeEditPreview = useMemo(() => getFin11FinancePreview(financeEditForm, casePayments), [casePayments, financeEditForm]);` |
| `src/pages/CaseDetail.tsx` | 1048 | `function openCaseFinanceEditModal() {` |
| `src/pages/CaseDetail.tsx` | 1053 | `function openCaseFinancePaymentModal(type: 'partial' \| 'commission') {` |
| `src/pages/CaseDetail.tsx` | 1054 | `const summary = getCaseFinanceSourceSummary(caseData, casePayments);` |
| `src/pages/CaseDetail.tsx` | 1059 | `async function reloadCaseFinanceData(nextCaseFallback?: CaseRecord \| null) {` |
| `src/pages/CaseDetail.tsx` | 1071 | `async function handleSaveCaseFinanceEdit() {` |
| `src/pages/CaseDetail.tsx` | 1073 | `const contractValue = financeEditPreview.contractValue;` |
| `src/pages/CaseDetail.tsx` | 1074 | `const commissionMode = financeEditForm.commissionMode;` |
| `src/pages/CaseDetail.tsx` | 1075 | `const patch = buildCaseFinancePatch({` |
| `src/pages/CaseDetail.tsx` | 1106 | `async function handleSaveCaseFinancePayment() {` |
| `src/pages/CaseDetail.tsx` | 1108 | `const amount = fin11Amount(financePaymentForm.amount);` |
| `src/pages/CaseDetail.tsx` | 1178 | `const caseFinanceSummary = useMemo(` |
| `src/pages/CaseDetail.tsx` | 1182 | `const visibleCasePayments = useMemo(() => sortCasePayments(payments as CasePaymentRecord[]).slice(0, 8), [payments]);` |
| `src/pages/CaseDetail.tsx` | 1184 | `const handleCreateCasePayment = async () => {` |
| `src/pages/CaseDetail.tsx` | 1190 | `const amount = Number(casePaymentDraft.amount \|\| 0);` |
| `src/pages/CaseDetail.tsx` | 1209 | `const created = await createPaymentInSupabase(input as any);` |
| `src/pages/CaseDetail.tsx` | 1364 | `const caseFinance = useMemo(() => {` |
| `src/pages/CaseDetail.tsx` | 1365 | `const expected = Number(caseData?.expectedRevenue \|\| 0);` |
| `src/pages/CaseDetail.tsx` | 1366 | `const paidFromPayments = payments` |
| `src/pages/CaseDetail.tsx` | 1369 | `const paid = paidFromPayments > 0 ? paidFromPayments : Number(caseData?.paidAmount \|\| 0);` |
| `src/pages/CaseDetail.tsx` | 1370 | `const remainingFromCase = Number(caseData?.remainingAmount);` |
| `src/pages/CaseDetail.tsx` | 1425 | `const openCasePaymentDialog = (type: 'deposit' \| 'partial') => {` |
| `src/pages/CaseDetail.tsx` | 1439 | `const remaining = Number(caseFinance.remaining \|\| 0);` |
| `src/pages/CaseDetail.tsx` | 1464 | `const handleSaveCasePayment = async () => {` |
| `src/pages/CaseDetail.tsx` | 1466 | `const amount = Number(casePaymentDraft.amount \|\| 0);` |
| `src/pages/CaseDetail.tsx` | 1691 | `const refreshCaseSettlementPayments = useCallback(async () => {` |
| `src/pages/CaseDetail.tsx` | 1693 | `const refreshedPayments = await fetchPaymentsFromSupabase({ caseId });` |
| `src/pages/CaseDetail.tsx` | 1702 | `const handleAddCaseSettlementPayment = async (value: CaseSettlementPaymentInput) => {` |
| `src/pages/CaseDetail.tsx` | 1738 | `const handleEditCaseSettlementCommission = async (value: CaseSettlementCommissionInput) => {` |
| `src/pages/CaseDetail.tsx` | 1745 | `const nextContractValue = Number(value.contractValue \|\| 0);` |
| `src/pages/CaseDetail.tsx` | 1830 | `for (const payment of visibleCasePayments) {` |
| `src/pages/CaseDetail.tsx` | 1831 | `const amountLabel = formatMoney(getPaymentAmount(payment), payment.currency \|\| caseFinanceSummary.currency);` |
| `src/pages/CaseDetail.tsx` | 1832 | `const note = pickCaseHistoryBodyStage14D(payment.note);` |

### 5.2. Luźne referencje finansowe do ręcznej oceny

| Plik | Linia | Fragment |
| --- | --- | --- |
| `src/pages/ClientDetail.tsx` | 32 | `import { ClientFinanceRelationSummary } from '../components/finance/FinanceMiniSummary';` |
| `src/pages/ClientDetail.tsx` | 112 | `fetchPaymentsFromSupabase,` |
| `src/pages/ClientDetail.tsx` | 338 | `case 'awaiting_payment':` |
| `src/pages/ClientDetail.tsx` | 446 | `if (type.includes('payment') \|\| type.includes('finance')) return 'Płatność';` |
| `src/pages/ClientDetail.tsx` | 639 | `caseRecord?.caseValue ??` |
| `src/pages/ClientDetail.tsx` | 640 | `caseRecord?.dealValue ??` |
| `src/pages/ClientDetail.tsx` | 950 | `payment?.amount ??` |
| `src/pages/ClientDetail.tsx` | 951 | `payment?.amountPln ??` |
| `src/pages/ClientDetail.tsx` | 952 | `payment?.value ??` |
| `src/pages/ClientDetail.tsx` | 953 | `payment?.total ??` |
| `src/pages/ClientDetail.tsx` | 954 | `payment?.totalAmount ??` |
| `src/pages/ClientDetail.tsx` | 955 | `payment?.paidAmount ??` |
| `src/pages/ClientDetail.tsx` | 956 | `payment?.grossAmount ??` |
| `src/pages/ClientDetail.tsx` | 957 | `payment?.netAmount ??` |
| `src/pages/ClientDetail.tsx` | 970 | `payments: any[];` |
| `src/pages/ClientDetail.tsx` | 975 | `function ClientTopTiles({ clientId, leads, cases, payments, tasks, events, onOpenCases }: ClientTopTilesProps) {` |
| `src/pages/ClientDetail.tsx` | 1007 | `<article className="client-detail-top-tile entity-overview-tile entity-overview-tile-finance" data-client-top-tile="finance-summary">` |
| `src/pages/ClientDetail.tsx` | 1024 | `<b>{payments.length}</b>` |
| `src/pages/ClientDetail.tsx` | 1075 | `const [payments, setPayments] = useState<any[]>([]);` |
| `src/pages/ClientDetail.tsx` | 1225 | `const [clientRow, leadRows, caseRows, paymentRows, taskRows, eventRows, activityRows] = await Promise.all([` |
| `src/pages/ClientDetail.tsx` | 1229 | `fetchPaymentsFromSupabase({ clientId }),` |
| `src/pages/ClientDetail.tsx` | 1238 | `setPayments(Array.isArray(paymentRows) ? paymentRows : []);` |
| `src/pages/ClientDetail.tsx` | 1347 | `.reduce((sum, lead) => sum + (Number(lead?.dealValue) \|\| 0), 0);` |
| `src/pages/ClientDetail.tsx` | 1351 | `.filter((entry) => isPaidPaymentStatus(entry?.status))` |
| `src/pages/ClientDetail.tsx` | 1367 | `}, [cases, client?.currency, leads, payments]);` |
| `src/pages/ClientDetail.tsx` | 1377 | `caseValueTotal,` |
| `src/pages/ClientDetail.tsx` | 1378 | `paymentsTotal,` |
| `src/pages/ClientDetail.tsx` | 1380 | `recentPayments,` |
| `src/pages/ClientDetail.tsx` | 1384 | `}, [activeCases.length, cases, closedCases.length, payments]);` |
| `src/pages/ClientDetail.tsx` | 1713 | `payments={payments}` |
| `src/pages/ClientDetail.tsx` | 1747 | `payment?.amount ??` |
| `src/pages/ClientDetail.tsx` | 1748 | `payment?.grossAmount ??` |
| `src/pages/ClientDetail.tsx` | 1749 | `payment?.totalAmount ??` |
| `src/pages/ClientDetail.tsx` | 1750 | `payment?.value ??` |
| `src/pages/ClientDetail.tsx` | 1751 | `payment?.price ??` |
| `src/pages/ClientDetail.tsx` | 1756 | `.filter((payment) => isPaidPaymentStatus(payment?.status))` |
| `src/pages/ClientDetail.tsx` | 1757 | `.reduce((sum, payment) => sum + amountOfPayment(payment), 0);` |
| `src/pages/ClientDetail.tsx` | 1761 | `<article className="client-detail-today-info-tile client-detail-today-info-tile-finance" data-client-left-finance-tile="true">` |
| `src/pages/ClientDetail.tsx` | 1768 | `<p>Opłacone · {payments.length} {paymentsLabel}</p>` |
| `src/pages/ClientDetail.tsx` | 1945 | `<section className="client-detail-summary-card client-detail-finance-card" aria-label="Finanse klienta">` |
| `src/pages/ClientDetail.tsx` | 1950 | `<div className="client-detail-finance-metrics">` |
| `src/pages/ClientDetail.tsx` | 1953 | `<strong>{formatMoneyWithCurrency(clientFinance.potentialTotal, clientFinance.currency)}</strong>` |
| `src/pages/ClientDetail.tsx` | 1957 | `<strong>{formatMoneyWithCurrency(clientFinance.paidTotal, clientFinance.currency)}</strong>` |
| `src/pages/ClientDetail.tsx` | 1961 | `<strong>{formatMoneyWithCurrency(clientFinance.remainingTotal, clientFinance.currency)}</strong>` |
| `src/pages/ClientDetail.tsx` | 1964 | `{clientFinance.hasMixedCurrencies ? <p>Wykryto wiele walut, podsumowanie pokazuje walutę dominującą.</p> : null}` |
| `src/pages/ClientDetail.tsx` | 2371 | `<section className="right-card client-detail-right-card" data-client-finance-summary="true">` |
| `src/pages/ClientDetail.tsx` | 2376 | `<small>Suma wartości spraw: {formatMoneyWithCurrency(clientFinanceSummary.caseValueTotal, clientFinance.currency)}</small>` |
| `src/pages/ClientDetail.tsx` | 2377 | `<small>Suma wpłat: {formatMoneyWithCurrency(clientFinanceSummary.paymentsTotal, clientFinance.currency)}</small>` |
| `src/pages/ClientDetail.tsx` | 2378 | `<small>Pozostało do zapłaty: {formatMoneyWithCurrency(clientFinanceSummary.remainingTotal, clientFinance.currency)}</small>` |
| `src/pages/ClientDetail.tsx` | 2379 | `<small>Sprawy aktywne / rozliczone: {clientFinanceSummary.activeCases} / {clientFinanceSummary.settledCases}</small>` |
| `src/pages/ClientDetail.tsx` | 2381 | `{clientFinanceSummary.recentPayments.length === 0 ? (` |
| `src/pages/ClientDetail.tsx` | 2384 | `clientFinanceSummary.recentPayments.map((entry) => (` |
| `src/pages/ClientDetail.tsx` | 2387 | `<strong>{formatMoneyWithCurrency(entry.amount, entry.currency \|\| clientFinance.currency)}</strong>` |
| `src/pages/CaseDetail.tsx` | 72 | `import { CaseSettlementSection, type CaseSettlementCommissionInput, type CaseSettlementPaymentInput } from '../components/finance/CaseSettlementSection';` |
| `src/pages/CaseDetail.tsx` | 81 | `fetchPaymentsFromSupabase,` |
| `src/pages/CaseDetail.tsx` | 83 | `createPaymentInSupabase,` |
| `src/pages/CaseDetail.tsx` | 102 | `import { buildCaseFinancePatch, getCaseFinanceSummary as getCaseFinanceSourceSummary } from '../lib/finance/case-finance-source';` |
| `src/pages/CaseDetail.tsx` | 151 | `expectedRevenue?: number;` |
| `src/pages/CaseDetail.tsx` | 152 | `paidAmount?: number;` |
| `src/pages/CaseDetail.tsx` | 153 | `remainingAmount?: number;` |
| `src/pages/CaseDetail.tsx` | 155 | `contractValue?: number;` |
| `src/pages/CaseDetail.tsx` | 156 | `commissionMode?: string;` |
| `src/pages/CaseDetail.tsx` | 157 | `commissionBase?: string;` |
| `src/pages/CaseDetail.tsx` | 158 | `commissionRate?: number;` |
| `src/pages/CaseDetail.tsx` | 159 | `commissionAmount?: number;` |
| `src/pages/CaseDetail.tsx` | 160 | `commissionStatus?: string;` |
| `src/pages/CaseDetail.tsx` | 211 | `type CasePaymentRecord = {` |
| `src/pages/CaseDetail.tsx` | 220 | `paidAmount?: number \| string;` |
| `src/pages/CaseDetail.tsx` | 238 | `kind: 'note' \| 'task' \| 'event' \| 'payment' \| 'status' \| 'case';` |
| `src/pages/CaseDetail.tsx` | 360 | `case 'awaiting_payment':` |
| `src/pages/CaseDetail.tsx` | 374 | `// CLOSEFLOW_CASE_SETTLEMENT_EXPECTED_VALUE_V29` |
| `src/pages/CaseDetail.tsx` | 376 | `caseData?.expectedRevenue ??` |
| `src/pages/CaseDetail.tsx` | 378 | `(caseData as any)?.caseValue ??` |
| `src/pages/CaseDetail.tsx` | 380 | `(caseData as any)?.dealValue ??` |
| `src/pages/CaseDetail.tsx` | 391 | `return totalFromSettlement > 0 ? totalFromSettlement : 0;` |
| `src/pages/CaseDetail.tsx` | 397 | `source.contractValue <= 0` |
| `src/pages/CaseDetail.tsx` | 399 | `: source.clientPaidAmount <= 0` |
| `src/pages/CaseDetail.tsx` | 401 | `: source.remainingAmount <= 0` |
| `src/pages/CaseDetail.tsx` | 405 | `expected: source.contractValue,` |
| `src/pages/CaseDetail.tsx` | 406 | `paid: source.clientPaidAmount,` |
| `src/pages/CaseDetail.tsx` | 407 | `remaining: source.remainingAmount,` |
| `src/pages/CaseDetail.tsx` | 414 | `/* FIN-11_CASE_RIGHT_FINANCE_HELPERS */` |
| `src/pages/CaseDetail.tsx` | 415 | `type CaseFinanceEditFormState = {` |
| `src/pages/CaseDetail.tsx` | 416 | `contractValue: string;` |
| `src/pages/CaseDetail.tsx` | 418 | `commissionMode: 'none' \| 'percent' \| 'fixed';` |
| `src/pages/CaseDetail.tsx` | 419 | `commissionRate: string;` |
| `src/pages/CaseDetail.tsx` | 420 | `commissionAmount: string;` |
| `src/pages/CaseDetail.tsx` | 421 | `commissionStatus: string;` |
| `src/pages/CaseDetail.tsx` | 424 | `type CaseFinancePaymentFormState = {` |
| `src/pages/CaseDetail.tsx` | 425 | `type: 'partial' \| 'commission';` |
| `src/pages/CaseDetail.tsx` | 473 | `contractValue: fin11MoneyInput(summary.contractValue),` |
| `src/pages/CaseDetail.tsx` | 475 | `commissionMode: summary.commissionMode === 'percent' \|\| summary.commissionMode === 'fixed' ? summary.commissionMode : 'none',` |
| `src/pages/CaseDetail.tsx` | 476 | `commissionRate: fin11MoneyInput(summary.commissionRate),` |
| `src/pages/CaseDetail.tsx` | 477 | `commissionAmount: fin11MoneyInput(summary.commissionAmount),` |
| `src/pages/CaseDetail.tsx` | 478 | `commissionStatus: summary.commissionStatus \|\| 'not_set',` |
| `src/pages/CaseDetail.tsx` | 499 | `? fin11Amount(form.commissionAmount)` |
| `src/pages/CaseDetail.tsx` | 500 | `: form.commissionMode === 'percent'` |
| `src/pages/CaseDetail.tsx` | 501 | `? Math.round(((contractValue * commissionRate) / 100) * 100) / 100` |
| `src/pages/CaseDetail.tsx` | 505 | `contractValue,` |
| `src/pages/CaseDetail.tsx` | 507 | `commissionRate,` |
| `src/pages/CaseDetail.tsx` | 508 | `commissionAmount,` |
| `src/pages/CaseDetail.tsx` | 509 | `clientPaidAmount,` |
| `src/pages/CaseDetail.tsx` | 510 | `commissionPaidAmount,` |
| `src/pages/CaseDetail.tsx` | 511 | `remainingAmount: Math.max(contractValue - clientPaidAmount, 0),` |
| `src/pages/CaseDetail.tsx` | 512 | `commissionRemainingAmount: Math.max(commissionAmount - commissionPaidAmount, 0),` |
| `src/pages/CaseDetail.tsx` | 516 | `return [...payments].sort((first, second) => {` |
| `src/pages/CaseDetail.tsx` | 687 | `if (lowerType.includes('payment') \|\| lowerType.includes('billing')) {` |
| `src/pages/CaseDetail.tsx` | 688 | `return body ? { id: 'activity-' + id, kind: 'payment', title: 'Wpłata', body, occurredAt } : null;` |
| `src/pages/CaseDetail.tsx` | 714 | `payments?: CasePaymentRecord[];` |
| `src/pages/CaseDetail.tsx` | 749 | `id: 'payment-' + String(payment.id \|\| payment.paidAt \|\| payment.createdAt \|\| body),` |
| `src/pages/CaseDetail.tsx` | 750 | `kind: 'payment',` |
| `src/pages/CaseDetail.tsx` | 753 | `occurredAt: getCaseHistoryDateStage14D(payment.paidAt, payment.createdAt, payment.dueAt),` |
| `src/pages/CaseDetail.tsx` | 1037 | `const [casePayments, setCasePayments] = useState<CasePaymentRecord[]>([]);` |
| `src/pages/CaseDetail.tsx` | 1039 | `/* FIN-11_CASE_RIGHT_FINANCE_STATE_AND_HANDLERS */` |
| `src/pages/CaseDetail.tsx` | 1040 | `const [isFinanceEditOpen, setIsFinanceEditOpen] = useState(false);` |
| `src/pages/CaseDetail.tsx` | 1041 | `const [financeEditForm, setFinanceEditForm] = useState<CaseFinanceEditFormState>(() => buildFin11FinanceEditState(null, []));` |
| `src/pages/CaseDetail.tsx` | 1042 | `const [isFinanceSaving, setIsFinanceSaving] = useState(false);` |
| `src/pages/CaseDetail.tsx` | 1043 | `const [isFinancePaymentOpen, setIsFinancePaymentOpen] = useState(false);` |
| `src/pages/CaseDetail.tsx` | 1044 | `const [financePaymentForm, setFinancePaymentForm] = useState<CaseFinancePaymentFormState>(() => buildFin11PaymentState('partial', 'PLN'));` |
| `src/pages/CaseDetail.tsx` | 1049 | `setFinanceEditForm(buildFin11FinanceEditState(caseData, casePayments));` |
| `src/pages/CaseDetail.tsx` | 1050 | `setIsFinanceEditOpen(true);` |
| `src/pages/CaseDetail.tsx` | 1055 | `setFinancePaymentForm(buildFin11PaymentState(type, summary.currency));` |
| `src/pages/CaseDetail.tsx` | 1056 | `setIsFinancePaymentOpen(true);` |
| `src/pages/CaseDetail.tsx` | 1062 | `const [freshCase, freshPayments] = await Promise.all([` |
| `src/pages/CaseDetail.tsx` | 1064 | `fetchPaymentsFromSupabase({ caseId: currentCaseId }).catch(() => casePayments as unknown[]),` |
| `src/pages/CaseDetail.tsx` | 1068 | `setCasePayments((Array.isArray(freshPayments) ? freshPayments : []) as CasePaymentRecord[]);` |
| `src/pages/CaseDetail.tsx` | 1072 | `if (!caseData?.id \|\| isFinanceSaving) return;` |
| `src/pages/CaseDetail.tsx` | 1076 | `contractValue,` |
| `src/pages/CaseDetail.tsx` | 1077 | `expectedRevenue: contractValue,` |
| `src/pages/CaseDetail.tsx` | 1078 | `currency: financeEditPreview.currency,` |
| `src/pages/CaseDetail.tsx` | 1079 | `commissionMode,` |
| `src/pages/CaseDetail.tsx` | 1080 | `commissionBase: 'contract_value',` |
| `src/pages/CaseDetail.tsx` | 1081 | `commissionRate: commissionMode === 'percent' ? financeEditPreview.commissionRate : null,` |
| `src/pages/CaseDetail.tsx` | 1082 | `commissionAmount: commissionMode === 'fixed' ? financeEditPreview.commissionAmount : financeEditPreview.commissionAmount,` |
| `src/pages/CaseDetail.tsx` | 1083 | `commissionStatus: financeEditForm.commissionStatus,` |
| `src/pages/CaseDetail.tsx` | 1085 | `setIsFinanceSaving(true);` |
| `src/pages/CaseDetail.tsx` | 1090 | `// FIN-11: derived cache for current backend contract. Payments remain the source of truth.` |
| `src/pages/CaseDetail.tsx` | 1091 | `remainingAmount: financeEditPreview.remainingAmount,` |
| `src/pages/CaseDetail.tsx` | 1096 | `await reloadCaseFinanceData(nextCase);` |
| `src/pages/CaseDetail.tsx` | 1097 | `setIsFinanceEditOpen(false);` |
| `src/pages/CaseDetail.tsx` | 1102 | `setIsFinanceSaving(false);` |
| `src/pages/CaseDetail.tsx` | 1107 | `if (!caseData?.id \|\| isFinanceSaving) return;` |
| `src/pages/CaseDetail.tsx` | 1113 | `setIsFinanceSaving(true);` |
| `src/pages/CaseDetail.tsx` | 1115 | `await createPaymentInSupabase({` |
| `src/pages/CaseDetail.tsx` | 1119 | `type: financePaymentForm.type,` |
| `src/pages/CaseDetail.tsx` | 1120 | `status: financePaymentForm.status,` |
| `src/pages/CaseDetail.tsx` | 1122 | `currency: fin11Currency(financePaymentForm.currency),` |
| `src/pages/CaseDetail.tsx` | 1123 | `paidAt: fin11IsoFromLocal(financePaymentForm.paidAt),` |
| `src/pages/CaseDetail.tsx` | 1124 | `dueAt: fin11IsoFromLocal(financePaymentForm.dueAt),` |
| `src/pages/CaseDetail.tsx` | 1125 | `note: financePaymentForm.note.trim(),` |
| `src/pages/CaseDetail.tsx` | 1127 | `await reloadCaseFinanceData(caseData);` |
| `src/pages/CaseDetail.tsx` | 1128 | `setIsFinancePaymentOpen(false);` |
| `src/pages/CaseDetail.tsx` | 1129 | `toast.success(financePaymentForm.type === 'commission' ? 'Dodano płatność prowizji' : 'Dodano wpłatę');` |
| `src/pages/CaseDetail.tsx` | 1133 | `setIsFinanceSaving(false);` |
| `src/pages/CaseDetail.tsx` | 1136 | `const [caseSettlementSaving, setCaseSettlementSaving] = useState(false);` |
| `src/pages/CaseDetail.tsx` | 1141 | `const [payments, setPayments] = useState<any[]>([]);` |
| `src/pages/CaseDetail.tsx` | 1153 | `const [isCasePaymentOpen, setIsCasePaymentOpen] = useState(false);` |
| `src/pages/CaseDetail.tsx` | 1154 | `const [casePaymentSubmitting, setCasePaymentSubmitting] = useState(false);` |
| `src/pages/CaseDetail.tsx` | 1155 | `const [casePaymentDraft, setCasePaymentDraft] = useState({` |
| `src/pages/CaseDetail.tsx` | 1179 | `() => getCaseFinanceSummary(caseData, payments as CasePaymentRecord[]),` |
| `src/pages/CaseDetail.tsx` | 1180 | `[caseData, payments],` |
| `src/pages/CaseDetail.tsx` | 1196 | `setCasePaymentSubmitting(true);` |
| `src/pages/CaseDetail.tsx` | 1201 | `type: casePaymentDraft.type \|\| 'payment',` |
| `src/pages/CaseDetail.tsx` | 1202 | `status: casePaymentDraft.status \|\| 'partially_paid',` |
| `src/pages/CaseDetail.tsx` | 1205 | `dueAt: casePaymentDraft.dueAt ? toIsoFromLocalInput(casePaymentDraft.dueAt) : '',` |
| `src/pages/CaseDetail.tsx` | 1207 | `note: casePaymentDraft.note \|\| '',` |
| `src/pages/CaseDetail.tsx` | 1210 | `setPayments((previous) => [created \|\| input, ...previous]);` |
| `src/pages/CaseDetail.tsx` | 1216 | `eventType: 'payment_added',` |
| `src/pages/CaseDetail.tsx` | 1219 | `setCasePaymentDraft({ type: 'payment', amount: '', status: 'partially_paid', dueAt: '', note: '' });` |
| `src/pages/CaseDetail.tsx` | 1220 | `setIsCasePaymentOpen(false);` |
| `src/pages/CaseDetail.tsx` | 1226 | `setCasePaymentSubmitting(false);` |
| `src/pages/CaseDetail.tsx` | 1257 | `fetchPaymentsFromSupabase({ caseId }).catch(() => []),` |
| `src/pages/CaseDetail.tsx` | 1260 | `const [caseRowRaw, itemRowsRaw, activityRowsRaw, taskRowsRaw, eventRowsRaw, paymentRowsRaw] = await Promise.race([dataPromise, timeoutPromise]);` |
| `src/pages/CaseDetail.tsx` | 1294 | `setPayments(Array.isArray(paymentRowsRaw) ? paymentRowsRaw : []);` |
| `src/pages/CaseDetail.tsx` | 1301 | `setPayments([]);` |
| `src/pages/CaseDetail.tsx` | 1367 | `.filter((entry) => isPaidPaymentStatus(entry?.status))` |
| `src/pages/CaseDetail.tsx` | 1381 | `}, [caseData?.currency, caseData?.expectedRevenue, caseData?.paidAmount, caseData?.remainingAmount, payments]);` |
| `src/pages/CaseDetail.tsx` | 1427 | `setCasePaymentDraft({` |
| `src/pages/CaseDetail.tsx` | 1434 | `setIsCasePaymentOpen(true);` |
| `src/pages/CaseDetail.tsx` | 1445 | `await createPaymentInSupabase({` |
| `src/pages/CaseDetail.tsx` | 1452 | `currency: caseFinance.currency,` |
| `src/pages/CaseDetail.tsx` | 1456 | `await updateCaseInSupabase({ id: caseId, paidAmount: caseFinance.paid + remaining, remainingAmount: 0 }).catch(() => null);` |
| `src/pages/CaseDetail.tsx` | 1472 | `setCasePaymentSubmitting(true);` |
| `src/pages/CaseDetail.tsx` | 1473 | `await createPaymentInSupabase({` |
| `src/pages/CaseDetail.tsx` | 1477 | `type: casePaymentDraft.type,` |
| `src/pages/CaseDetail.tsx` | 1478 | `status: casePaymentDraft.status \|\| 'awaiting_payment',` |
| `src/pages/CaseDetail.tsx` | 1480 | `currency: caseFinance.currency,` |
| `src/pages/CaseDetail.tsx` | 1481 | `dueAt: casePaymentDraft.dueAt \|\| null,` |
| `src/pages/CaseDetail.tsx` | 1482 | `paidAt: isPaidPaymentStatus(casePaymentDraft.status) ? new Date().toISOString() : null,` |
| `src/pages/CaseDetail.tsx` | 1483 | `note: casePaymentDraft.note \|\| '',` |
| `src/pages/CaseDetail.tsx` | 1486 | `setIsCasePaymentOpen(false);` |
| `src/pages/CaseDetail.tsx` | 1491 | `setCasePaymentSubmitting(false);` |
| `src/pages/CaseDetail.tsx` | 1690 | `// FIN-5_CASE_SETTLEMENT_PAYMENTS_FROM_LOAD via isolated refresh hook` |
| `src/pages/CaseDetail.tsx` | 1694 | `setCasePayments(refreshedPayments as CasePaymentRecord[]);` |
| `src/pages/CaseDetail.tsx` | 1699 | `void refreshCaseSettlementPayments().catch(() => null);` |
| `src/pages/CaseDetail.tsx` | 1700 | `}, [caseId, refreshCaseSettlementPayments]);` |
| `src/pages/CaseDetail.tsx` | 1716 | `setCaseSettlementSaving(true);` |
| `src/pages/CaseDetail.tsx` | 1717 | `await createPaymentInSupabase({` |
| `src/pages/CaseDetail.tsx` | 1729 | `await refreshCaseSettlementPayments();` |
| `src/pages/CaseDetail.tsx` | 1730 | `toast.success(value.type === 'commission' ? 'Płatność prowizji dodana' : 'Wpłata klienta dodana');` |
| `src/pages/CaseDetail.tsx` | 1734 | `setCaseSettlementSaving(false);` |
| `src/pages/CaseDetail.tsx` | 1746 | `if (!Number.isFinite(nextContractValue) \|\| nextContractValue < 0) {` |
| `src/pages/CaseDetail.tsx` | 1752 | `setCaseSettlementSaving(true);` |
| `src/pages/CaseDetail.tsx` | 1755 | `contractValue: Math.max(0, nextContractValue),` |
| `src/pages/CaseDetail.tsx` | 1756 | `expectedRevenue: Math.max(0, nextContractValue),` |
| `src/pages/CaseDetail.tsx` | 1757 | `commissionMode: value.commissionMode,` |
| `src/pages/CaseDetail.tsx` | 1758 | `commissionBase: value.commissionBase,` |
| `src/pages/CaseDetail.tsx` | 1759 | `commissionRate: Number(value.commissionRate \|\| 0),` |
| `src/pages/CaseDetail.tsx` | 1760 | `commissionAmount: Number(value.commissionAmount \|\| 0),` |
| `src/pages/CaseDetail.tsx` | 1761 | `commissionStatus: value.commissionStatus,` |
| `src/pages/CaseDetail.tsx` | 1767 | `contractValue: payload.contractValue,` |
| `src/pages/CaseDetail.tsx` | 1768 | `expectedRevenue: payload.expectedRevenue,` |
| `src/pages/CaseDetail.tsx` | 1769 | `commissionMode: payload.commissionMode,` |
| `src/pages/CaseDetail.tsx` | 1770 | `commissionBase: payload.commissionBase,` |
| `src/pages/CaseDetail.tsx` | 1771 | `commissionRate: payload.commissionRate,` |
| `src/pages/CaseDetail.tsx` | 1772 | `commissionAmount: payload.commissionAmount,` |
| `src/pages/CaseDetail.tsx` | 1773 | `commissionStatus: payload.commissionStatus,` |
| `src/pages/CaseDetail.tsx` | 1780 | `setCaseSettlementSaving(false);` |
| `src/pages/CaseDetail.tsx` | 1834 | `history.push({ id: \`payment-${payment.id \|\| body}\`, kind: 'payment', title: 'Wpłata', body, occurredAt: getCaseHistoryDateStage14D(payment.paidAt, payment.createdAt, payment.dueAt) });` |
| `src/pages/CaseDetail.tsx` | 1851 | `}, [activities, tasks, events, visibleCasePayments, items, caseFinanceSummary.currency]);` |
| `src/pages/CaseDetail.tsx` | 1857 | `<div data-fin5-case-settlement-instance="true">` |
| `src/pages/CaseDetail.tsx` | 1858 | `<CaseSettlementSection` |
| `src/pages/CaseDetail.tsx` | 1861 | `payments={casePayments}` |
| `src/pages/CaseDetail.tsx` | 1863 | `isSaving={caseSettlementSaving}` |
| `src/pages/CaseDetail.tsx` | 1864 | `onAddPayment={handleAddCaseSettlementPayment}` |
| `src/pages/CaseDetail.tsx` | 1865 | `onEditCommission={handleEditCaseSettlementCommission}` |
| `src/pages/CaseDetail.tsx` | 1999 | `<section className="case-detail-finance-history-panel" data-case-finance-history-panel="true">` |
| `src/pages/CaseDetail.tsx` | 2001 | `<div className="case-detail-finance-payments-head">` |
| `src/pages/CaseDetail.tsx` | 2005 | `<span>{visibleCasePayments.length}</span>` |
| `src/pages/CaseDetail.tsx` | 2009 | `{visibleCasePayments.length ? (` |
| `src/pages/CaseDetail.tsx` | 2011 | `<div className="case-detail-finance-history-list">` |
| `src/pages/CaseDetail.tsx` | 2013 | `{visibleCasePayments.map((payment) => (` |
| `src/pages/CaseDetail.tsx` | 2015 | `<article key={String(payment.id \|\| payment.createdAt \|\| payment.note \|\| getPaymentAmount(payment))} className="case-detail-finance-payment-row">` |
| `src/pages/CaseDetail.tsx` | 2019 | `<strong>{formatMoney(getPaymentAmount(payment), payment.currency \|\| caseFinanceSummary.currency)}</strong>` |
| `src/pages/CaseDetail.tsx` | 2021 | `<span>{billingStatusLabel(payment.status)}</span>` |
| `src/pages/CaseDetail.tsx` | 2025 | `<small>{formatDate(payment.paidAt \|\| payment.createdAt \|\| payment.dueAt, 'Bez daty')}</small>` |
| `src/pages/CaseDetail.tsx` | 2035 | `<p className="case-detail-finance-empty">Brak wpłat. Dodaj pierwszą zaliczkę albo płatność częściową.</p>` |
| `src/pages/CaseDetail.tsx` | 2074 | `payments: casePayments,` |
| `src/pages/CaseDetail.tsx` | 2202 | `onAddPayment={() => setIsCasePaymentOpen(true)}` |
| `src/pages/CaseDetail.tsx` | 2205 | `<section className="right-card case-detail-right-card" data-fin10-legacy-finance-panel-removed="true" data-case-finance-panel="true" data-fin11-case-right-finance-panel="true">` |
| `src/pages/CaseDetail.tsx` | 2209 | `<div className="case-finance-panel-actions" data-fin11-case-right-finance-actions="true">` |
| `src/pages/CaseDetail.tsx` | 2210 | `<Button type="button" size="sm" onClick={openCaseFinanceEditModal} disabled={isFinanceSaving}>` |
| `src/pages/CaseDetail.tsx` | 2213 | `<Button type="button" size="sm" variant="outline" onClick={() => openCaseFinancePaymentModal('partial')} disabled={isFinanceSaving}>` |
| `src/pages/CaseDetail.tsx` | 2216 | `<Button type="button" size="sm" variant="outline" onClick={() => openCaseFinancePaymentModal('commission')} disabled={isFinanceSaving}>` |
| `src/pages/CaseDetail.tsx` | 2220 | `<span hidden data-fin11-case-right-finance-actions-marker="FIN-11_CASE_RIGHT_FINANCE_ACTIONS" />` |
| `src/pages/CaseDetail.tsx` | 2222 | `<small>Wartość: {formatMoney(caseFinance.expected, caseFinance.currency)}</small>` |
| `src/pages/CaseDetail.tsx` | 2223 | `<small>Wpłacono: {formatMoney(caseFinance.paid, caseFinance.currency)}</small>` |
| `src/pages/CaseDetail.tsx` | 2224 | `<small>Pozostało: {formatMoney(caseFinance.remaining, caseFinance.currency)}</small>` |
| `src/pages/CaseDetail.tsx` | 2225 | `<small>Status płatności: {billingStatusLabel(caseFinance.billingStatus)}</small>` |
| `src/pages/CaseDetail.tsx` | 2227 | `<button type="button" onClick={() => openCasePaymentDialog('deposit')}>Dodaj zaliczkę</button>` |
| `src/pages/CaseDetail.tsx` | 2228 | `<button type="button" onClick={() => openCasePaymentDialog('partial')}>Płatność częściowa</button>` |
| `src/pages/CaseDetail.tsx` | 2235 | `<Dialog open={isCasePaymentOpen} onOpenChange={setIsCasePaymentOpen}>` |
| `src/pages/CaseDetail.tsx` | 2237 | `<DialogHeader><DialogTitle>{casePaymentDraft.type === 'deposit' ? 'Dodaj zaliczkę' : 'Dodaj płatność częściową'}</DialogTitle></DialogHeader>` |
| `src/pages/CaseDetail.tsx` | 2239 | `<label>Kwota<Input type="number" min="0" step="0.01" value={casePaymentDraft.amount} onChange={(event) => setCasePaymentDraft((current) => ({ ...current, amount: event.target.value }))} /></label>` |
| `src/pages/CaseDetail.tsx` | 2240 | `<label>Status<select value={casePaymentDraft.status} onChange={(event) => setCasePaymentDraft((current) => ({ ...current, status: event.target.value }))}><option value="awaiting_payment">Czeka na płatność</option><option value="deposit_paid">Zaliczka wpłacona</option><option value="partially_paid">Częściowo opłacone</option><option value="paid">Opłacone</option></select></label>` |
| `src/pages/CaseDetail.tsx` | 2241 | `<label>Termin płatności<Input type="date" value={casePaymentDraft.dueAt} onChange={(event) => setCasePaymentDraft((current) => ({ ...current, dueAt: event.target.value }))} /></label>` |
| `src/pages/CaseDetail.tsx` | 2242 | `<label>Notatka<Textarea value={casePaymentDraft.note} onChange={(event) => setCasePaymentDraft((current) => ({ ...current, note: event.target.value }))} /></label>` |
| `src/pages/CaseDetail.tsx` | 2244 | `<DialogFooter className={modalFooterClass()}><Button type="button" variant="outline" onClick={() => setIsCasePaymentOpen(false)}>Anuluj</Button><Button type="button" onClick={handleSaveCasePayment} disabled={casePaymentSubmitting}>{casePaymentSubmitting ? 'Zapisywanie...' : 'Zapisz płatność'}</Button></DialogFooter>` |
| `src/pages/CaseDetail.tsx` | 2250 | `<Dialog open={isCasePaymentOpen} onOpenChange={setIsCasePaymentOpen}>` |
| `src/pages/CaseDetail.tsx` | 2251 | `<DialogContent data-case-payment-dialog="true" className="case-detail-payment-dialog">` |
| `src/pages/CaseDetail.tsx` | 2255 | `<div className="case-detail-payment-form">` |
| `src/pages/CaseDetail.tsx` | 2257 | `<Label htmlFor="case-payment-amount">Kwota wpłaty</Label>` |
| `src/pages/CaseDetail.tsx` | 2259 | `id="case-payment-amount"` |
| `src/pages/CaseDetail.tsx` | 2263 | `value={casePaymentDraft.amount}` |
| `src/pages/CaseDetail.tsx` | 2264 | `onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, amount: event.target.value }))}` |
| `src/pages/CaseDetail.tsx` | 2269 | `<Label htmlFor="case-payment-status">Status</Label>` |
| `src/pages/CaseDetail.tsx` | 2271 | `id="case-payment-status"` |
| `src/pages/CaseDetail.tsx` | 2272 | `value={casePaymentDraft.status}` |
| `src/pages/CaseDetail.tsx` | 2273 | `onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, status: event.target.value }))}` |
| `src/pages/CaseDetail.tsx` | 2278 | `<option value="awaiting_payment">Czeka na płatność</option>` |
| `src/pages/CaseDetail.tsx` | 2282 | `<Label htmlFor="case-payment-type">Typ</Label>` |
| `src/pages/CaseDetail.tsx` | 2284 | `id="case-payment-type"` |
| `src/pages/CaseDetail.tsx` | 2285 | `value={casePaymentDraft.type}` |
| `src/pages/CaseDetail.tsx` | 2286 | `onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, type: event.target.value }))}` |
| `src/pages/CaseDetail.tsx` | 2295 | `<Label htmlFor="case-payment-note">Notatka</Label>` |
| `src/pages/CaseDetail.tsx` | 2297 | `id="case-payment-note"` |
| `src/pages/CaseDetail.tsx` | 2298 | `value={casePaymentDraft.note}` |
| `src/pages/CaseDetail.tsx` | 2299 | `onChange={(event) => setCasePaymentDraft((draft) => ({ ...draft, note: event.target.value }))}` |
| `src/pages/CaseDetail.tsx` | 2305 | `<Button type="button" variant="outline" onClick={() => setIsCasePaymentOpen(false)}>` |
| `src/pages/CaseDetail.tsx` | 2308 | `<Button type="button" onClick={handleCreateCasePayment} disabled={casePaymentSubmitting \|\| !hasAccess}>` |
| `src/pages/CaseDetail.tsx` | 2309 | `{casePaymentSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}` |
| `src/pages/CaseDetail.tsx` | 2317 | `{/* FIN-11_CASE_RIGHT_FINANCE_MODALS */}` |
| `src/pages/CaseDetail.tsx` | 2318 | `<Dialog open={isFinanceEditOpen} onOpenChange={setIsFinanceEditOpen}>` |
| `src/pages/CaseDetail.tsx` | 2319 | `<DialogContent className="case-finance-edit-modal">` |
| `src/pages/CaseDetail.tsx` | 2323 | `<div className="case-finance-edit-form">` |
| `src/pages/CaseDetail.tsx` | 2324 | `<label className="case-finance-edit-field">` |
| `src/pages/CaseDetail.tsx` | 2326 | `<Input inputMode="decimal" value={financeEditForm.contractValue} placeholder="Nie ustawiono" onChange={(event) => setFinanceEditForm((current) => ({ ...current, contractValue: event.target.value }))} />` |
| `src/pages/CaseDetail.tsx` | 2328 | `<label className="case-finance-edit-field">` |
| `src/pages/CaseDetail.tsx` | 2330 | `<Input value={financeEditForm.currency} placeholder="PLN" maxLength={3} onChange={(event) => setFinanceEditForm((current) => ({ ...current, currency: event.target.value.toUpperCase() }))} />` |
| `src/pages/CaseDetail.tsx` | 2332 | `<label className="case-finance-edit-field">` |
| `src/pages/CaseDetail.tsx` | 2334 | `<select className="case-finance-edit-select" value={financeEditForm.commissionMode} onChange={(event) => setFinanceEditForm((current) => ({ ...current, commissionMode: event.target.value as 'none' \| 'percent' \| 'fixed' }))}>` |
| `src/pages/CaseDetail.tsx` | 2340 | `<label className="case-finance-edit-field">` |
| `src/pages/CaseDetail.tsx` | 2342 | `<Input inputMode="decimal" value={financeEditForm.commissionRate} disabled={financeEditForm.commissionMode !== 'percent'} placeholder="np. 3" onChange={(event) => setFinanceEditForm((current) => ({ ...current, commissionRate: event.target.value }))} />` |
| `src/pages/CaseDetail.tsx` | 2344 | `<label className="case-finance-edit-field">` |
| `src/pages/CaseDetail.tsx` | 2346 | `<Input inputMode="decimal" value={financeEditForm.commissionAmount} disabled={financeEditForm.commissionMode !== 'fixed'} placeholder="np. 3000" onChange={(event) => setFinanceEditForm((current) => ({ ...current, commissionAmount: event.target.value }))} />` |
| `src/pages/CaseDetail.tsx` | 2348 | `<label className="case-finance-edit-field">` |
| `src/pages/CaseDetail.tsx` | 2350 | `<select className="case-finance-edit-select" value={financeEditForm.commissionStatus} onChange={(event) => setFinanceEditForm((current) => ({ ...current, commissionStatus: event.target.value }))}>` |
| `src/pages/CaseDetail.tsx` | 2359 | `<div className="case-finance-edit-preview" data-fin11-case-finance-preview="true">` |
| `src/pages/CaseDetail.tsx` | 2360 | `<div><span>Prowizja należna:</span><strong>{formatMoney(financeEditPreview.commissionAmount, financeEditPreview.currency)}</strong></div>` |
| `src/pages/CaseDetail.tsx` | 2361 | `<div><span>Po wpłatach klienta pozostaje:</span><strong>{formatMoney(financeEditPreview.remainingAmount, financeEditPreview.currency)}</strong></div>` |
| `src/pages/CaseDetail.tsx` | 2362 | `<div><span>Do zapłaty prowizji:</span><strong>{formatMoney(financeEditPreview.commissionRemainingAmount, financeEditPreview.currency)}</strong></div>` |
| `src/pages/CaseDetail.tsx` | 2366 | `<Button type="button" variant="outline" onClick={() => setIsFinanceEditOpen(false)} disabled={isFinanceSaving}>Anuluj</Button>` |
| `src/pages/CaseDetail.tsx` | 2367 | `<Button type="button" onClick={handleSaveCaseFinanceEdit} disabled={isFinanceSaving \|\| financeEditPreview.contractValue <= 0}>Zapisz</Button>` |
| `src/pages/CaseDetail.tsx` | 2372 | `<Dialog open={isFinancePaymentOpen} onOpenChange={setIsFinancePaymentOpen}>` |
| `src/pages/CaseDetail.tsx` | 2373 | `<DialogContent className="case-finance-edit-modal">` |
| `src/pages/CaseDetail.tsx` | 2375 | `<DialogTitle>{financePaymentForm.type === 'commission' ? 'Dodaj płatność prowizji' : 'Dodaj wpłatę'}</DialogTitle>` |
| `src/pages/CaseDetail.tsx` | 2377 | `<div className="case-finance-edit-form">` |
| `src/pages/CaseDetail.tsx` | 2378 | `<label className="case-finance-edit-field">` |
| `src/pages/CaseDetail.tsx` | 2380 | `<Input inputMode="decimal" value={financePaymentForm.amount} placeholder="np. 20000" onChange={(event) => setFinancePaymentForm((current) => ({ ...current, amount: event.target.value }))} />` |
| `src/pages/CaseDetail.tsx` | 2382 | `<label className="case-finance-edit-field">` |
| `src/pages/CaseDetail.tsx` | 2384 | `<Input value={financePaymentForm.currency} maxLength={3} onChange={(event) => setFinancePaymentForm((current) => ({ ...current, currency: event.target.value.toUpperCase() }))} />` |
| `src/pages/CaseDetail.tsx` | 2386 | `<label className="case-finance-edit-field">` |
| `src/pages/CaseDetail.tsx` | 2388 | `<select className="case-finance-edit-select" value={financePaymentForm.status} onChange={(event) => setFinancePaymentForm((current) => ({ ...current, status: event.target.value }))}>` |
| `src/pages/CaseDetail.tsx` | 2397 | `<label className="case-finance-edit-field">` |
| `src/pages/CaseDetail.tsx` | 2399 | `<Input type="datetime-local" value={financePaymentForm.paidAt} onChange={(event) => setFinancePaymentForm((current) => ({ ...current, paidAt: event.target.value }))} />` |
| `src/pages/CaseDetail.tsx` | 2401 | `<label className="case-finance-edit-field">` |
| `src/pages/CaseDetail.tsx` | 2403 | `<Input type="datetime-local" value={financePaymentForm.dueAt} onChange={(event) => setFinancePaymentForm((current) => ({ ...current, dueAt: event.target.value }))} />` |
| `src/pages/CaseDetail.tsx` | 2405 | `<label className="case-finance-edit-field case-finance-edit-field--wide">` |
| `src/pages/CaseDetail.tsx` | 2407 | `<Textarea value={financePaymentForm.note} placeholder="np. przelew / gotówka / faktura" onChange={(event) => setFinancePaymentForm((current) => ({ ...current, note: event.target.value }))} />` |
| `src/pages/CaseDetail.tsx` | 2411 | `<Button type="button" variant="outline" onClick={() => setIsFinancePaymentOpen(false)} disabled={isFinanceSaving}>Anuluj</Button>` |
| `src/pages/CaseDetail.tsx` | 2412 | `<Button type="button" onClick={handleSaveCaseFinancePayment} disabled={isFinanceSaving \|\| fin11Amount(financePaymentForm.amount) <= 0}>Zapisz płatność</Button>` |

## 6. Lokalne helpery notatek w ClientDetail / CaseDetail

| Plik | Linia | Fragment |
| --- | --- | --- |
| `src/pages/ClientDetail.tsx` | 351 | `const CLIENT_NOTE_ACTIVITY_TYPES_A1_FINALIZER = new Set([` |
| `src/pages/ClientDetail.tsx` | 363 | `function isClientNoteActivityA1(activity: any) {` |
| `src/pages/ClientDetail.tsx` | 377 | `const STAGE14A_CLIENT_DETAIL_NOTES_HISTORY_GUARD = 'ClientDetail shows cases first, real client notes, readable history and recent moves';` |
| `src/pages/ClientDetail.tsx` | 380 | `const STAGE14A_REPAIR2_CLIENT_DETAIL_NOTES_HISTORY_GUARD = 'STAGE14A Repair2 removes side add-note quick action and hardens visible notes/history';` |
| `src/pages/ClientDetail.tsx` | 503 | `function isClientNoteActivityStage14A(activity: Stage14AActivityLike, clientId: string) {` |
| `src/pages/ClientDetail.tsx` | 941 | `const STAGE27E_CLIENT_NOTES_EVENT_FINAL_GUARD = 'client notes event final after failed 27ad';` |
| `src/pages/ClientDetail.tsx` | 942 | `const STAGE28A_CLIENT_NOTE_ID_COMPAT_GUARD = 'client note listener id safe before finance';` |
| `src/pages/ClientDetail.tsx` | 943 | `const STAGE29A_CLIENT_NOTE_ACTIONS_GUARD = 'client notes edit delete preview pin actions';` |
| `src/pages/ClientDetail.tsx` | 944 | `const STAGE27G_CLIENT_NOTE_LISTENER_ID_RUNTIME_FINAL_GUARD = 'client note listener uses client id only';` |
| `src/pages/ClientDetail.tsx` | 945 | `const STAGE27D_CLIENT_NOTES_RUNTIME_FINAL_GUARD = 'client notes runtime visibility final';` |
| `src/pages/ClientDetail.tsx` | 946 | `const STAGE27A_CLIENT_NOTES_TRASH2_GUARD = 'client notes visible after save and Trash2 imported';` |
| `src/pages/ClientDetail.tsx` | 947 | `const STAGE27B_TRASH2_IMPORT_AND_NOTES_FINAL_GUARD = 'Trash2 import fixed and client notes final';` |
| `src/pages/ClientDetail.tsx` | 1081 | `const clientNotePinStorageKey = useMemo(` |
| `src/pages/ClientDetail.tsx` | 1089 | `const raw = window.localStorage.getItem(clientNotePinStorageKey);` |
| `src/pages/ClientDetail.tsx` | 1096 | `const persistClientPinnedNotes = useCallback(` |
| `src/pages/ClientDetail.tsx` | 1109 | `const handlePreviewClientNote = useCallback((note: any) => {` |
| `src/pages/ClientDetail.tsx` | 1110 | `const content = String(note?.content \|\| '').trim();` |
| `src/pages/ClientDetail.tsx` | 1118 | `const handleToggleClientNotePin = useCallback(` |
| `src/pages/ClientDetail.tsx` | 1120 | `const noteId = String(note?.id \|\| '').trim();` |
| `src/pages/ClientDetail.tsx` | 1122 | `const nextPinnedIds = clientPinnedNoteIds.includes(noteId)` |
| `src/pages/ClientDetail.tsx` | 1130 | `const handleEditClientNote = useCallback(` |
| `src/pages/ClientDetail.tsx` | 1132 | `const noteId = String(note?.id \|\| '').trim();` |
| `src/pages/ClientDetail.tsx` | 1133 | `const previousContent = String(note?.content \|\| '');` |
| `src/pages/ClientDetail.tsx` | 1134 | `const nextContent = typeof window !== 'undefined' ? window.prompt('Edytuj notatkę', previousContent) : previousContent;` |
| `src/pages/ClientDetail.tsx` | 1177 | `const handleDeleteClientNote = useCallback(` |
| `src/pages/ClientDetail.tsx` | 1179 | `const noteId = String(note?.id \|\| '').trim();` |
| `src/pages/ClientDetail.tsx` | 1196 | `const handleContextNoteSaved = (event: Event) => {` |
| `src/pages/ClientDetail.tsx` | 1214 | `const clientNoteRecognitionRef = useRef<SpeechRecognitionLike \| null>(null);` |
| `src/pages/ClientDetail.tsx` | 1215 | `const clientNoteVoiceDirtyRef = useRef(false);` |
| `src/pages/ClientDetail.tsx` | 1512 | `const stopClientNoteSpeech = () => {` |
| `src/pages/ClientDetail.tsx` | 1513 | `const recognition = clientNoteRecognitionRef.current;` |
| `src/pages/ClientDetail.tsx` | 1529 | `const handleToggleClientNoteSpeech = () => {` |
| `src/pages/ClientDetail.tsx` | 1642 | `const clientNotesStage14A = useMemo(() => {` |
| `src/pages/ClientDetail.tsx` | 2399 | `function getClientVisibleNotes(activityRows: any[], clientRecord: any) {` |
| `src/pages/ClientDetail.tsx` | 2431 | `function getClientNotesForRender(notes: any[], pinnedIds: string[] = []) {` |
| `src/pages/CaseDetail.tsx` | 549 | `function buildCaseNoteFollowUpIso(choice: CaseNoteFollowUpChoice, customValue?: string) {` |
| `src/pages/CaseDetail.tsx` | 556 | `function getCaseNoteFollowUpChoiceLabel(choice: CaseNoteFollowUpChoice) {` |
| `src/pages/CaseDetail.tsx` | 644 | `const blocked = ['notatka', 'historia sprawy', 'dodano ruch w sprawie', 'dodano notatkę'];` |
| `src/pages/CaseDetail.tsx` | 672 | `const body = pickCaseHistoryBodyStage14D(payload.note, payload.content, payload.body, payload.message, payload.description, payload.summary, payload.itemTitle, payload.title, getActivityText(activity));` |
| `src/pages/CaseDetail.tsx` | 746 | `const note = pickCaseHistoryBodyStage14D(payment.note, billingStatusLabel(payment.status));` |
| `src/pages/CaseDetail.tsx` | 747 | `const body = note ? amountLabel + ' · ' + note : amountLabel;` |
| `src/pages/CaseDetail.tsx` | 922 | `const CLOSEFLOW_CASE_HISTORY_NO_ACTIVITY_NOTES_IN_WORKITEMS_2026_05_13 = 'CaseActivity notes belong only to history rows, never to workItems cards';` |
| `src/pages/CaseDetail.tsx` | 925 | `const CLOSEFLOW_CASE_HISTORY_NO_ACTIVITY_NOTES_FINAL_2026_05_13 = 'CaseActivity rows are history only; activities must not be converted to workItems';` |
| `src/pages/CaseDetail.tsx` | 1163 | `const STAGE86_CONTEXT_ACTION_EXPLICIT_TRIGGERS = 'Case detail uses shared context action dialogs instead of local simplified task, event and note forms';` |
| `src/pages/CaseDetail.tsx` | 1420 | `const openCaseNoteDialog = () => {` |
| `src/pages/CaseDetail.tsx` | 1501 | `const closeNoteFollowUpPrompt = () => {` |
| `src/pages/CaseDetail.tsx` | 1506 | `const handleCreateCaseNoteFollowUp = async (choice: CaseNoteFollowUpChoice) => {` |
| `src/pages/CaseDetail.tsx` | 1509 | `const scheduledAt = buildCaseNoteFollowUpIso(choice, customNoteFollowUpAt);` |
| `src/pages/CaseDetail.tsx` | 1832 | `const note = pickCaseHistoryBodyStage14D(payment.note);` |
| `src/pages/CaseDetail.tsx` | 1833 | `const body = note ? \`${amountLabel} · ${note}\` : amountLabel;` |
| `src/pages/CaseDetail.tsx` | 2572 | `const handleAddNote = async () => { guardCaseDetailWriteAccess(); }` |

## 7. Lokalne formularze / dialogi task/event/note w ClientDetail / CaseDetail

| Plik | Linia | Token | Fragment |
| --- | --- | --- | --- |
| `src/pages/ClientDetail.tsx` | 363 | `isClientNoteActivityA1` | `function isClientNoteActivityA1(activity: any) {` |
| `src/pages/ClientDetail.tsx` | 372 | `isClientNoteActivityA1` | `? activities.map((activity) => (isClientNoteActivityA1(activity) ? { ...activity, eventType: getActivityEventTypeA1(activity) \|\| 'client_note' } : activity))` |
| `src/pages/ClientDetail.tsx` | 503 | `isClientNoteActivityStage14A` | `function isClientNoteActivityStage14A(activity: Stage14AActivityLike, clientId: string) {` |
| `src/pages/ClientDetail.tsx` | 724 | `isEvent` | `const isEvent = nearest.type === 'event' \|\| nearest.type === 'meeting';` |
| `src/pages/ClientDetail.tsx` | 729 | `isEvent` | `kind: isEvent ? 'event' : 'task',` |
| `src/pages/ClientDetail.tsx` | 731 | `isEvent` | `subtitle: \`${isEvent ? 'Wydarzenie' : 'Zadanie'} · ${formatDateTime(nearest.when)}\`,` |
| `src/pages/ClientDetail.tsx` | 1076 | `setTasks` | `const [tasks, setTasks] = useState<any[]>([]);` |
| `src/pages/ClientDetail.tsx` | 1077 | `setEvents` | `const [events, setEvents] = useState<any[]>([]);` |
| `src/pages/ClientDetail.tsx` | 1079 | `setClientPinnedNoteIds` | `const [clientPinnedNoteIds, setClientPinnedNoteIds] = useState<string[]>([]);` |
| `src/pages/ClientDetail.tsx` | 1090 | `setClientPinnedNoteIds` | `setClientPinnedNoteIds(raw ? JSON.parse(raw) : []);` |
| `src/pages/ClientDetail.tsx` | 1092 | `setClientPinnedNoteIds` | `setClientPinnedNoteIds([]);` |
| `src/pages/ClientDetail.tsx` | 1098 | `setClientPinnedNoteIds` | `setClientPinnedNoteIds(nextPinnedIds);` |
| `src/pages/ClientDetail.tsx` | 1211 | `setClientNoteListening` | `const [clientNoteListening, setClientNoteListening] = useState(false);` |
| `src/pages/ClientDetail.tsx` | 1212 | `setClientNoteInterimText` | `const [clientNoteInterimText, setClientNoteInterimText] = useState('');` |
| `src/pages/ClientDetail.tsx` | 1213 | `setClientNoteAutosaving` | `const [clientNoteAutosaving, setClientNoteAutosaving] = useState(false);` |
| `src/pages/ClientDetail.tsx` | 1239 | `setTasks` | `setTasks(Array.isArray(taskRows) ? taskRows : []);` |
| `src/pages/ClientDetail.tsx` | 1240 | `setEvents` | `setEvents(Array.isArray(eventRows) ? eventRows : []);` |
| `src/pages/ClientDetail.tsx` | 1515 | `setClientNoteListening` | `setClientNoteListening(false);` |
| `src/pages/ClientDetail.tsx` | 1516 | `setClientNoteInterimText` | `setClientNoteInterimText('');` |
| `src/pages/ClientDetail.tsx` | 1559 | `setClientNoteInterimText` | `setClientNoteInterimText(interimTranscript);` |
| `src/pages/ClientDetail.tsx` | 1567 | `setClientNoteListening` | `setClientNoteListening(false);` |
| `src/pages/ClientDetail.tsx` | 1568 | `setClientNoteInterimText` | `setClientNoteInterimText('');` |
| `src/pages/ClientDetail.tsx` | 1572 | `setClientNoteListening` | `setClientNoteListening(true);` |
| `src/pages/ClientDetail.tsx` | 1586 | `setClientNoteAutosaving` | `setClientNoteAutosaving(true);` |
| `src/pages/ClientDetail.tsx` | 1594 | `setClientNoteAutosaving` | `setClientNoteAutosaving(false);` |
| `src/pages/ClientDetail.tsx` | 1646 | `isClientNoteActivityStage14A` | `.filter((activity: any) => isClientNoteActivityStage14A(activity, safeClientId))` |
| `src/pages/ClientDetail.tsx` | 2410 | `isClientNoteActivityA1` | `isClientNoteActivityA1(activity)` |
| `src/pages/CaseDetail.tsx` | 1139 | `setTasks` | `const [tasks, setTasks] = useState<TaskRecord[]>([]);` |
| `src/pages/CaseDetail.tsx` | 1140 | `setEvents` | `const [events, setEvents] = useState<EventRecord[]>([]);` |
| `src/pages/CaseDetail.tsx` | 1150 | `setPendingNoteFollowUp` | `const [pendingNoteFollowUp, setPendingNoteFollowUp] = useState<{ note: string; createdAt: string } \| null>(null);` |
| `src/pages/CaseDetail.tsx` | 1151 | `setCustomNoteFollowUpAt` | `const [customNoteFollowUpAt, setCustomNoteFollowUpAt] = useState('');` |
| `src/pages/CaseDetail.tsx` | 1152 | `isCreatingNoteFollowUp` | `const [isCreatingNoteFollowUp, setIsCreatingNoteFollowUp] = useState(false);` |
| `src/pages/CaseDetail.tsx` | 1152 | `setIsCreatingNoteFollowUp` | `const [isCreatingNoteFollowUp, setIsCreatingNoteFollowUp] = useState(false);` |
| `src/pages/CaseDetail.tsx` | 1267 | `setTasks` | `setTasks([]);` |
| `src/pages/CaseDetail.tsx` | 1268 | `setEvents` | `setEvents([]);` |
| `src/pages/CaseDetail.tsx` | 1276 | `setTasks` | `setTasks(` |
| `src/pages/CaseDetail.tsx` | 1285 | `setEvents` | `setEvents(` |
| `src/pages/CaseDetail.tsx` | 1299 | `setTasks` | `setTasks([]);` |
| `src/pages/CaseDetail.tsx` | 1300 | `setEvents` | `setEvents([]);` |
| `src/pages/CaseDetail.tsx` | 1327 | `openTasks` | `const openTasks = useMemo(() => tasks.filter((task) => !['done', 'completed', 'cancelled'].includes(String(task.status \|\| ''))), [tasks]);` |
| `src/pages/CaseDetail.tsx` | 1363 | `openTasks` | `const workItems = useMemo(() => dedupeCaseWorkItems(buildWorkItems(openTasks, plannedEvents, items)), [items, openTasks, plannedEvents]);` |
| `src/pages/CaseDetail.tsx` | 1363 | `openTasks` | `const workItems = useMemo(() => dedupeCaseWorkItems(buildWorkItems(openTasks, plannedEvents, items)), [items, openTasks, plannedEvents]);` |
| `src/pages/CaseDetail.tsx` | 1386 | `openTasks` | `items: [...openTasks, ...plannedEvents],` |
| `src/pages/CaseDetail.tsx` | 1387 | `openTasks` | `}), [caseData?.id, caseId, openTasks, plannedEvents]);` |
| `src/pages/CaseDetail.tsx` | 1410 | `openCaseTaskDialog` | `const openCaseTaskDialog = () => {` |
| `src/pages/CaseDetail.tsx` | 1415 | `openCaseEventDialog` | `const openCaseEventDialog = () => {` |
| `src/pages/CaseDetail.tsx` | 1420 | `openCaseNoteDialog` | `const openCaseNoteDialog = () => {` |
| `src/pages/CaseDetail.tsx` | 1502 | `setPendingNoteFollowUp` | `setPendingNoteFollowUp(null);` |
| `src/pages/CaseDetail.tsx` | 1503 | `setCustomNoteFollowUpAt` | `setCustomNoteFollowUpAt('');` |
| `src/pages/CaseDetail.tsx` | 1516 | `setIsCreatingNoteFollowUp` | `setIsCreatingNoteFollowUp(true);` |
| `src/pages/CaseDetail.tsx` | 1544 | `setIsCreatingNoteFollowUp` | `setIsCreatingNoteFollowUp(false);` |
| `src/pages/CaseDetail.tsx` | 1986 | `isCreatingNoteFollowUp` | `<Button type="button" onClick={() => handleCreateCaseNoteFollowUp('today')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="today">Dziś</Button>` |
| `src/pages/CaseDetail.tsx` | 1987 | `isCreatingNoteFollowUp` | `<Button type="button" onClick={() => handleCreateCaseNoteFollowUp('tomorrow')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="tomorrow">Jutro</Button>` |
| `src/pages/CaseDetail.tsx` | 1988 | `isCreatingNoteFollowUp` | `<Button type="button" onClick={() => handleCreateCaseNoteFollowUp('two_days')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="two_days">Za 2 dni</Button>` |
| `src/pages/CaseDetail.tsx` | 1989 | `isCreatingNoteFollowUp` | `<Button type="button" onClick={() => handleCreateCaseNoteFollowUp('week')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="week">Za tydzień</Button>` |
| `src/pages/CaseDetail.tsx` | 1993 | `setCustomNoteFollowUpAt` | `<Input id="case-note-follow-up-at" type="datetime-local" value={customNoteFollowUpAt} onChange={(event) => setCustomNoteFollowUpAt(event.target.value)} data-case-note-follow-up-custom-input="true" />` |
| `src/pages/CaseDetail.tsx` | 1994 | `isCreatingNoteFollowUp` | `<Button type="button" onClick={() => handleCreateCaseNoteFollowUp('custom')} disabled={isCreatingNoteFollowUp} data-case-note-follow-up-choice="custom">Ustaw własny</Button>` |
| `src/pages/CaseDetail.tsx` | 2126 | `openTasks` | `<PathCard label="Zadania" value={openTasks.length} helper="Otwarte zadania powiązane ze sprawą." tone="green" />` |

## 8. `getCaseFinanceSummary` poza źródłem prawdy

Docelowe źródło prawdy: `src/lib/finance/case-finance-source.ts`.

| Plik | Linia | Poza źródłem prawdy? | Fragment |
| --- | --- | --- | --- |
| `src/components/finance/CaseFinanceEditorDialog.tsx` | 8 | TAK | `getCaseFinanceSummary,` |
| `src/components/finance/CaseFinanceEditorDialog.tsx` | 84 | TAK | `const summary = getCaseFinanceSummary(caseRecord, payments);` |
| `src/components/finance/CaseFinanceEditorDialog.tsx` | 124 | TAK | `const summary = getCaseFinanceSummary({` |
| `src/components/finance/CaseSettlementPanel.tsx` | 12 | TAK | `import { getCaseFinanceSummary } from '../../lib/finance/case-finance-source';` |
| `src/components/finance/CaseSettlementPanel.tsx` | 239 | TAK | `const summary = useMemo(() => getCaseFinanceSummary(record, normalizedPayments), [record, normalizedPayments]);` |
| `src/components/finance/FinanceMiniSummary.tsx` | 6 | TAK | `import { getCaseFinanceSummary } from '../../lib/finance/case-finance-source';` |
| `src/components/finance/FinanceMiniSummary.tsx` | 113 | TAK | `const summary = getCaseFinanceSummary(caseRecord, casePayments);` |
| `src/lib/finance/case-finance-source.ts` | 311 | NIE | `const summary = getCaseFinanceSummary(caseRecord, []);` |
| `src/lib/finance/case-finance-source.ts` | 315 | NIE | `export function getCaseFinanceSummary(caseRecord: unknown, payments: unknown[] = []): CaseFinanceSummary {` |
| `src/lib/finance/case-finance-source.ts` | 416 | NIE | `return getCaseFinanceSummary(caseRecord, casePayments as FinancePaymentLike[]);` |
| `src/pages/CaseDetail.tsx` | 102 | TAK | `import { buildCaseFinancePatch, getCaseFinanceSummary as getCaseFinanceSourceSummary } from '../lib/finance/case-finance-source';` |
| `src/pages/CaseDetail.tsx` | 393 | TAK | `function getCaseFinanceSummary(caseData: CaseRecord \| null, payments: CasePaymentRecord[]) {` |
| `src/pages/CaseDetail.tsx` | 1179 | TAK | `() => getCaseFinanceSummary(caseData, payments as CasePaymentRecord[]),` |
| `scripts/audit-client-case-legacy-layers.cjs` | 150 | TAK | `"(finance\|payment\|settlement\|commission\|contractValue\|dealValue\|caseValue\|paidAmount\|remainingAmount\|expectedRevenue\|getCaseFinanceSummary)";` |
| `scripts/audit-client-case-legacy-layers.cjs` | 234 | TAK | `if (!line.includes("getCaseFinanceSummary")) return;` |
| `scripts/audit-client-case-legacy-layers.cjs` | 373 | TAK | `"## 8. \`getCaseFinanceSummary\` poza źródłem prawdy",` |
| `scripts/audit-client-case-legacy-layers.cjs` | 387 | TAK | `: "_Brak wystąpień \`getCaseFinanceSummary\` w skanowanych katalogach._",` |
| `scripts/audit-client-case-legacy-layers.cjs` | 397 | TAK | `"- Jeśli wartości finansowe są liczone lokalnie w ekranach, przenieść je do \`src/lib/finance/case-finance-source.ts\` albo używać wyłącznie \`getCaseFinanceSummary\`.",` |
| `scripts/audit-client-case-legacy-layers.cjs` | 424 | TAK | `console.log(\`- getCaseFinanceSummary poza źródłem prawdy: ${summaryOutsideSource.length}\`);` |
| `scripts/check-fin10-case-finance-source-truth.cjs` | 42 | TAK | `'getCaseFinanceSummary',` |
| `scripts/check-fin10-case-finance-source-truth.cjs` | 61 | TAK | `assert(panel.includes('getCaseFinanceSummary(record, normalizedPayments)'), 'CaseSettlementPanel nie używa getCaseFinanceSummary(record, payments)');` |
| `scripts/check-fin10-case-finance-source-truth.cjs` | 80 | TAK | `assert(!/function getCaseFinanceSummary[\s\S]{0,1600}payments\s*\.filter[\s\S]{0,800}reduce/.test(caseDetail), 'CaseDetail nadal lokalnie redukuje płatności w getCaseFinanceSummary');` |
| `scripts/check-fin13-client-case-finances.cjs` | 35 | TAK | `assert(financeMini.includes('getCaseFinanceSummary(caseRecord, casePayments)'), 'sprawy klienta nie są liczone przez getCaseFinanceSummary(case, paymentsForCase)');` |
| `scripts/check-stage28a-case-finance-core.cjs` | 19 | TAK | `assert(caseDetail.includes("function getCaseFinanceSummary("), "Brakuje helpera getCaseFinanceSummary");` |
| `scripts/repair-stage28a-case-finance-core.cjs` | 78 | TAK | `if (!text.includes("function getCaseFinanceSummary(")) {` |
| `scripts/repair-stage28a-case-finance-core.cjs` | 97 | TAK | `function getCaseFinanceSummary(caseData: CaseRecord \| null, payments: CasePaymentRecord[]) {` |
| `scripts/repair-stage28a-case-finance-core.cjs` | 132 | TAK | `() => getCaseFinanceSummary(caseData, payments as CasePaymentRecord[]),` |
| `tests/case-finance-source.test.cjs` | 36 | TAK | `'getCaseFinanceSummary',` |
| `tests/fin13-client-case-finances.test.cjs` | 26 | TAK | `assert.match(source, /getCaseFinanceSummary\(caseRecord, casePayments\)/);` |

**Do oceny:** znaleziono 26 wystąpień poza źródłem prawdy. Nie każde jest błędem, bo import/wywołanie w UI może być poprawne, ale trzeba sprawdzić, czy nie powstała druga logika liczenia finansów.

## 9. Interpretacja dla kolejnego etapu

- Jeśli `!important` jest w aktywnych warstwach `visual-stage12` / `visual-stage13`, nie dokładamy kolejnego CSS-a na wierzch. Najpierw trzeba zdecydować, która warstwa jest źródłem prawdy.
- Jeśli notatki lub formularze są renderowane lokalnie w `ClientDetail.tsx` w więcej niż jednym miejscu, nie maskować duplikatu CSS-em. Trzeba usunąć drugi render albo przenieść go do jednego komponentu.
- Jeśli wartości finansowe są liczone lokalnie w ekranach, przenieść je do `src/lib/finance/case-finance-source.ts` albo używać wyłącznie `getCaseFinanceSummary`.
- Jeśli `right-card` jest używany w wielu warstwach stylu, kolejny etap musi wskazać jedną klasę bazową i jedną warstwę override.

## 10. Kryterium zamknięcia ETAPU 0

- Raport został wygenerowany w `docs/audits/client-case-legacy-layers-2026-05-14.md`.
- Skrypt audytu istnieje w `scripts/audit-client-case-legacy-layers.cjs`.
- UI, dane i logika biznesowa nie zostały zmienione.
- Wynik raportu jest gotowy jako mapa do REPAIR4 / kolejnego etapu naprawy.
