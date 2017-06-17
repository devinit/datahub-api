import * as R from 'ramda';
import {getPageData} from '../page';
import {getEntities, getEntityBySlug, IEntity} from '../global';


export const getCountryProfilePageData = async (countrySlug: string): promise<DH.IPage> => {
    const data: DH.IPage[] = await getPageData('country-profile');
    const entities: IEntity[] = await getEntities();
    const entity: IEntity = getEntityBySlug(countrySlug, entities);
    return R.map((obj: DH.IPage) {
        const title  = obj.title.includes('${country}') ?
            obj.title.replace('${country}', entity.name) : obj.title;
        const narrative = obj.narrative.includes('${country}') ?
            obj.narrative.replace('${country}', entity.name) : obj.narrative;
        return {...obj, title, narrative};
    }, data);
};
