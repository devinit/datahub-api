/**
 * regional / district entities
 */
import {get} from '../../connector';
import * as R from 'ramda';

export interface IDistrict {
    id: string;
    slug: string;
    name: string;
}

export const getDistrictEntities = (country: string): Promise<IDistrict[]> =>
    get<IDistrict>(`spotlight-${country}/district-entity.csv`);

export const getDistrictBySlugAsync = async (country: string, slug: string): Promise<IDistrict> => {
     const entities: IDistrict[] = await getDistrictEntities(country);
     return R.find(R.propEq('slug', slug), entities) as IDistrict;
};
