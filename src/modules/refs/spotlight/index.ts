/**
 * regional / district entities
 */
import {githubGet} from '@devinit/graphql-next/lib/github';

export interface IDistrict {
    id: string;
    name: string;
}

export const getDistrictEntities = async (country: string): Promise<IDistrict[]> => {
    const data = await githubGet<IDistrict>(`spotlight-${country}/district.csv`);
    return data.map(obj => ({id: obj.id, name: obj.name}));
};

export const getDistrictBySlugAsync = async (country: string, slug: string): Promise<IDistrict> => {
     const entities: IDistrict[] = await getDistrictEntities(country);
     const district: IDistrict | undefined = entities.find(obj => obj.name.toLowerCase() === slug);
     if (!district) throw new Error(`Error getting district entity for ${slug}`);
     return district;
};
