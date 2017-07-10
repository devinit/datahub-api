import * as R from 'ramda';
import {getPageData} from '../page';
import {get} from '../../connector';
import {getEntities, IEntity} from '../global';

export interface IFlowRef {
    id: string;
    flow_category: string;
    flow_category_order: number;
    type: string;
    flow_type: string;
    flow_name: string;
    short_name: string;
    used_in_area_treemap_chart: boolean;
    direction: string;
    color: string;
    concept: string;
}

export interface IFlowSelectionRaw {
    id: string;
    group_by_id: string;
    name: string;
    position: number;
}

export interface IBudgetLevelRef {
    id: string;
    level: number;
    name: string;
    color: string;
}
export const getCountryProfilePageData = async (countrySlug: string): Promise<DH.IPage[]> => {
    try {
        const data: DH.IPage[] = await getPageData('country-profile');
        const entities: IEntity[] = await getEntities();
        const entity: IEntity | undefined = entities.find(obj => obj.slug === countrySlug);
        if (!entity) throw Error('entity is undefined');
        return R.map((obj: DH.IPage) => {
            const title = obj.title && obj.title.includes('${country}') ?
                obj.title.replace('${country}', entity.name) : obj.title;
            const narrative = obj.narrative && obj.narrative.includes('${country}') ?
                obj.narrative.replace('${country}', entity.name) : obj.narrative;
            return {...obj, title, narrative};
        }, data);
    } catch (error) {
        throw new Error(error);
    }
};

export const getFlows = (): Promise<IFlowRef[]> => get<IFlowRef>('country-profile/flow-name.csv');

export const getBudgetLevels = (country?: string): Promise<IBudgetLevelRef[]> => {
    if (country && country.length) return get<IBudgetLevelRef>(`spotlight-${country}/${country}-budget-level.csv`);
    return get<IBudgetLevelRef>('country-profile/domestic-budget-level.csv');
};

export const getFlowTypes = (): Promise<IFlowRef[]> => get<IFlowRef>('country-profile/flow-type.csv');

export const getFlowByType = (type: string, flows: IFlowRef[]): IFlowRef[] =>
    R.filter(R.propEq('type', type), flows) as IFlowRef[];

export const getFlowByTypeAsync = async (type: string): Promise<IFlowRef[]> => {
    const flows: IFlowRef[] = await getFlows();
    return R.filter(R.propEq('type', type), flows) as IFlowRef[];
};

export const getFlowByIdAsync = async (countryType: string): Promise<IFlowRef> => {
    const flows: IFlowRef[] = await getFlows();
    const flow = R.find(R.propEq('id', countryType), flows);
    if (!flow) throw new Error ('flow is undefeined');
    return flow as IFlowRef;
};

export const getAllFlowSelections = (): Promise<IFlowSelectionRaw[]> =>
    get<IFlowSelectionRaw>('country-profile/flow-selections.csv');
