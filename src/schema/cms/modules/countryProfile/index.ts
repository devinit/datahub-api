import * as R from 'ramda';
import {getPageData} from '../page';
import {get} from '../../connector';
import {getEntities, getEntityBySlug, IEntity} from '../global';

export interface IFlowRaw {
    id: string;
    flowCategory: string;
    flowCategoryOrder: number;
    donorRecipientType: string;
    flowType: string;
    name: string;
    usedInAreaTreemapChart: boolean;
    concept: string;
}

export interface IFlowSelectionRaw {
    id: string;
    groupById: string;
    name: string;
    position: number;
}

export const getCountryProfilePageData = async (countrySlug: string): Promise<DH.IPage[]> => {
    const data: DH.IPage[] = await getPageData('country-profile');
    const entities: IEntity[] = await getEntities();
    const entity: IEntity = getEntityBySlug(countrySlug, entities);
    return R.map((obj: DH.IPage) => {
        const title = obj.title && obj.title.includes('${country}') ?
            obj.title.replace('${country}', entity.name) : obj.title;
        const narrative = obj.narrative && obj.narrative.includes('${country}') ?
            obj.narrative.replace('${country}', entity.name) : obj.narrative;
        return {...obj, title, narrative};
    }, data);
};

export const getFlows = (): Promise<IFlowRaw[]> => get<IFlowRaw>('country-profile/flow-name.csv');

export const getFlowById = (id: string, flows: IFlowRaw[]): IFlowRaw =>
    R.find(R.propEq('id', id), flows) as IFlowRaw;

export const getFlowByIdAsync = async (id: string): Promise<IFlowRaw> => {
    const flows: IFlowRaw[] = await getFlows();
    return R.find(R.propEq('id', id), flows) as IFlowRaw;
};

export const getAllFlowSelections = (): Promise<IFlowSelectionRaw[]> =>
    get<IFlowSelectionRaw>('country-profile/flow-selections.csv');

// selections for a flow / resource id
export const getFlowSelectionsByIdAsync = async (id: string): Promise <IFlowSelectionRaw[]> => {
    const flowSelections: IFlowSelectionRaw[] = await getAllFlowSelections();
    return  flowSelections.filter(obj => obj.id === id);
};

export const getFlowSelectionAsync = async (selection: string): Promise<IFlowSelectionRaw | undefined> => {
    const flowSelections: IFlowSelectionRaw[] = await getAllFlowSelections();
    return flowSelections.find(obj => obj.groupById === selection);
};
