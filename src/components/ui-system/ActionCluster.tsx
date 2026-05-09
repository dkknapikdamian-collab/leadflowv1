import type { ReactNode } from 'react';
import {
  dangerActionZoneClass,
  entityActionClusterClass,
  panelActionRowClass,
  panelHeaderActionsClass,
  type EntityActionRegion,
} from '../entity-actions';

export type ActionClusterProps = {
  children: ReactNode;
  className?: string;
  region?: EntityActionRegion;
};

function regionClass(region: EntityActionRegion, className?: string) {
  if (region === 'danger-action-zone') return dangerActionZoneClass(className);
  if (region === 'entity-header-action-cluster') return entityActionClusterClass(className);
  if (region === 'info-row-inline-action') return panelActionRowClass(className);
  return panelHeaderActionsClass(className);
}

export function ActionCluster({ children, className = '', region = 'entity-header-action-cluster' }: ActionClusterProps) {
  return (
    <div
      className={regionClass(region, className)}
      data-cf-ui-component="ActionCluster"
      data-cf-action-region={region}
      data-standard-action-cluster="true"
    >
      {children}
    </div>
  );
}
