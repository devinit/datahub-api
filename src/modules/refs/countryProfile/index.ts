import * as R from 'ramda';
import { githubGet } from '../../../api/github';

export interface IFlowRef {
    id: string;
    flow_category: string;
    flow_category_order: number;
    type: string;
    flow_type: string;
    flow_name: string;
    short_name: string;
    used_in_area_treemap_chart: number;
    direction: string;
    color: string;
    concept: string;
}

export interface IFlowSelectionRaw {
    id: string;
    group_by_id: string;
    name: string;
    unbundle: number;
    position: number;
}

export interface IBudgetLevelRef {
    id: string;
    level: number;
    name: string;
    color: string;
}

export const getFlows = (): Promise<IFlowRef[]> => githubGet<IFlowRef>('country-profile/flow-name.csv');

export const getBudgetLevels = (country?: string): Promise<IBudgetLevelRef[]> => {
    return country && country.length
      ? githubGet<IBudgetLevelRef>(`spotlight-${country}/budget_level.csv`)
      : githubGet<IBudgetLevelRef>('country-profile/domestic-budget-level.csv');
};

export const getFlowTypes = (): Promise<IFlowRef[]> => githubGet<IFlowRef>('country-profile/flow-type.csv');

export const getFlowByType = (type: string, flows: IFlowRef[]): IFlowRef[] => {
  const flowRefs: IFlowRef[] = R.filter(R.propEq('type', type), flows);
  if (!flowRefs.length) {
    throw new Error(`failed to githubGet any flows for type ${type}`);
  }

  return flowRefs;
};

export const getFlowByTypeAsync = async (type: string): Promise<IFlowRef[]> => {
    const flows: IFlowRef[] = await getFlows();
    const flowRefs: IFlowRef[] = R.filter(R.propEq('type', type), flows);
    if (!flowRefs.length) { throw new Error (`failed to githubGet any flows for type ${type}`); }
    return flowRefs;
};

export const getFlowByIdAsync = async (countryType: string): Promise<IFlowRef> => {
    const flows: IFlowRef[] = await getFlows();
    const flow = R.find(R.propEq('id', countryType), flows);
    if (!flow) { throw new Error ('flow is undefeined'); }
    return flow as IFlowRef;
};

export const getAllFlowSelections = (): Promise<IFlowSelectionRaw[]> =>
    githubGet<IFlowSelectionRaw>('country-profile/flow-selections.csv');
