import {get} from '../../connector';
import {getEntities, IEntity} from '../global';
import * as R from 'ramda';

const getPageData = (moduleName: string): Promise <DH.IPage[]> => {
    const endPoint: string = `${moduleName}/page.csv`;
    return get<DH.IPage>(endPoint);
};

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
        throw new Error(`Error getting country profile page data: ${error}`);
    }
};
export const getGlobalPicturePageData = (): Promise<DH.IPage[]> => getPageData('global-picture');
export const getPovertyBubbleChartPageData = (): Promise<DH.IPage[]> => getPageData('bubble-chart-poverty');
export const getOdaDonorBubbleChartPageData = (): Promise<DH.IPage[]> => getPageData('bubble-chart-oda');
export const getUnbundlingOdaPageData = (): Promise<DH.IPage[]> => getPageData('unbundling-oda');
export const getUnbundlingOOfPageData = (): Promise<DH.IPage[]> => getPageData('unbundling-oof');
export const getWhereThePoorPageData = (): Promise<DH.IPage[]> => getPageData('where-the-poor');
