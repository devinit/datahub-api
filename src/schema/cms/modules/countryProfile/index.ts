import * as R from 'ramda';
import {get} from '../../connector';

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

export const getFlows = (): Promise<IFlowRef[]> => get<IFlowRef>('country-profile/flow-name.csv');

export const getBudgetLevels = (country?: string): Promise<IBudgetLevelRef[]> => {
    if (country && country.length) return get<IBudgetLevelRef>(`spotlight-${country}/${country}-budget-level.csv`);
    return get<IBudgetLevelRef>('country-profile/domestic-budget-level.csv');
};

export const getFlowTypes = (): Promise<IFlowRef[]> => get<IFlowRef>('country-profile/flow-type.csv');

export const getFlowByType = (type: string, flows: IFlowRef[]): IFlowRef[] => {
    const flowRefs: IFlowRef[] = R.filter(R.propEq('type', type), flows);
    if (!flowRefs.length) throw new Error (`failed to get any flows for type ${type}`);
    return flowRefs;
};

export const getFlowByTypeAsync = async (type: string): Promise<IFlowRef[]> => {
    const flows: IFlowRef[] = await getFlows();
    const flowRefs: IFlowRef[] = R.filter(R.propEq('type', type), flows);
    if (!flowRefs.length) throw new Error (`failed to get any flows for type ${type}`);
    return flowRefs;
};

export const getFlowByIdAsync = async (countryType: string): Promise<IFlowRef> => {
    const flows: IFlowRef[] = await getFlows();
    const flow = R.find(R.propEq('id', countryType), flows);
    if (!flow) throw new Error ('flow is undefeined');
    return flow as IFlowRef;
};

export const getAllFlowSelections = (): Promise<IFlowSelectionRaw[]> =>
    get<IFlowSelectionRaw>('country-profile/flow-selections.csv');
