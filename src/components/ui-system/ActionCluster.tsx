import type { ReactNode } from 'react';
import {
  dangerActionZoneClass,
  entityActionClusterClass,
  panelActionRowClass,
  panelHeaderActionsClass,
  type EntityActionRegion,
} from '../entity-actions';

export const CLOSEFLOW_ACTION_CLUSTERS_FINAL_CONTRACT_VS6 = 'ActionCluster is the ui-system action group wrapper. Use data-cf-action-region and do not create local action cluster layout in pages.';

export type ActionClusterProps = {
  primary?: ReactNode;
  secondary?: ReactNode;
  danger?: ReactNode;
  children?: ReactNode;
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

export function ActionCluster({
  primary,
  secondary,
  danger,
  children,
  className = '',
  region = 'entity-header-action-cluster',
  density = 'default',
}: ActionClusterProps) {
  return (
    <div
      className={regionClass(region, className)}
      data-cf-ui-component="ActionCluster"
      data-cf-action-region={region}
      data-standard-action-cluster="true"
      data-cf-action-cluster-density={density}
      data-cf-action-cluster-contract="VS6"
      data-cf-action-cluster-api="primary,secondary,danger"
    >
      {children ? (
        children
      ) : (
        <>
          {secondary ? <div className="cf-action-cluster-secondary">{secondary}</div> : null}
          {danger ? <div className="cf-action-cluster-danger">{danger}</div> : null}
          {primary ? <div className="cf-action-cluster-primary">{primary}</div> : null}
        </>
      )}
    </div>
  );
}

/* CLOSEFLOW_COMPONENT_REGISTRY_VS2_API ActionCluster: primary?, secondary?, danger? */
