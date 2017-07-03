import * as R from 'ramda';
import {getPageData} from '../page';
import {get} from '../../connector';
import {getEntities, IEntity} from '../global';

export interface IFlowRef {
    id: string;
    flowCategory: string;
    flowCategoryOrder: number;
    donorRecipientType: string;
    flowType: string;
    name: string;
    shortName: string;
    usedInAreaTreemapChart: boolean;
    direction: string;
    color: string;
    concept: string;
}

export interface IFlowTypeRef {
    id: string;
    name: string;
    concept: string;
    color: string;
}

export interface IFlowSelectionRaw {
    id: string;
    groupById: string;
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
};

export const getFlows = (): Promise<IFlowRef[]> => get<IFlowRef>('country-profile/flow-name.csv');

export const getBudgetLevels = (): Promise<IBudgetLevelRef[]> =>
    get<IBudgetLevelRef>('country-profile/domestic-budget-level.csv');

export const getFlowTypes = (): Promise<IFlowRef[]> => get<IFlowTypeRef>('country-profile/flow-type.csv');

export const getFlowByType = (type: string, flows: IFlowRef[]): IFlowRef[] =>
    R.filter(R.propEq('type', type), flows) as IFlowRef[];

export const getFlowByTypeAsync = async (type: string): Promise<IFlowRef[]> => {
    const flows: IFlowRef[] = await getFlows();
    return R.filter(R.propEq('type', type), flows) as IFlowRef[];
};

export const getFlowByIdAsync = async (countryType: string): Promise<IFlowRef> => {
    const flows: IFlowRef[] = await getFlows();
    return R.find(R.propEq('id', countryType), flows) as IFlowRef;
};

export const getAllFlowSelections = (): Promise<IFlowSelectionRaw[]> =>
    get<IFlowSelectionRaw>('country-profile/flow-selections.csv');

// selections for a flow / resource id
// export const getFlowSelectionsByIdAsync = async (id: string): Promise <IFlowSelectionRaw[]> => {
//     const flowSelections: IFlowSelectionRaw[] = await getAllFlowSelections();
//     return  flowSelections.filter(obj => obj.id === id);
// };

// export const getFlowSelectionAsync = async (selection: string): Promise<IFlowSelectionRaw | undefined> => {
//     const flowSelections: IFlowSelectionRaw[] = await getAllFlowSelections();
//     return flowSelections.find(obj => obj.groupById === selection);
// };
