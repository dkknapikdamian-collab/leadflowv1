import type { ReactNode } from 'react';

export const CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_VS6 = 'ActionCluster is the ui-system action group wrapper. Use data-cf-action-region and do not create local action cluster layout in pages.';
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
  density?: 'default' | 'compact';
};

function regionClass(region: EntityActionRegion, className?: string) {
  if (region === 'danger-action-zone') return dangerActionZoneClass(className);
  if (region === 'entity-header-action-cluster') return entityActionClusterClass(className);
  if (region === 'info-row-inline-action') return panelActionRowClass(className);
  return panelHeaderActionsClass(className);
}

export function ActionCluster({ children, className = '', region = 'entity-header-action-cluster', density = 'default' }: ActionClusterProps) {
  return (
    <div
      className={regionClass(region, className)}
      data-cf-ui-component="ActionCluster"
      data-cf-action-region={region}
      data-standard-action-cluster="true"
      data-cf-action-cluster-density={density}
      data-cf-action-cluster-contract="VS6"
    >
      {children}
    </div>
  );
}
