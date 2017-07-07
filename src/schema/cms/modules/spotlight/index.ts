/**
 * regional / district entities
 */
import {get} from '../../connector';

export interface IDistrict {
    id: string;
    slug: string;
    name: string;
}

export const getDistrictEntities = (country: string): Promise<IDistrict[]> =>
    get<IDistrict>(`spotlight-${country}/district-entity.csv`);

export const getDistrictBySlugAsync = async (country: string, slug: string): Promise<IDistrict> => {
     const entities: IDistrict[] = await getDistrictEntities(country);
     const district: IDistrict | undefined = entities.find(obj => obj.slug === slug);
     if (!district) throw new Error(`Error getting district entity for ${slug}`);
     return district;
};
