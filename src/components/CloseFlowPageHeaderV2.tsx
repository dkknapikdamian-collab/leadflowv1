import type { ReactNode } from 'react';
import { PAGE_HEADER_CONTENT, type CloseFlowPageHeaderKey } from '../lib/page-header-content';
import '../styles/closeflow-page-header-v2.css';

type CloseFlowPageHeaderV2Props = {
  pageKey: CloseFlowPageHeaderKey;
  actions?: ReactNode;
};

export function CloseFlowPageHeaderV2({ pageKey, actions }: CloseFlowPageHeaderV2Props) {
  const content = PAGE_HEADER_CONTENT[pageKey];

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
