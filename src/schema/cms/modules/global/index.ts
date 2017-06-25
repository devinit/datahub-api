import {get} from '../../connector';
import * as R from 'ramda';

export interface IEntity {
    id: string;
    type: string;
    name: string;
    slug: string;
    donorRecipientType: string;
}

export const getEntities = (): Promise<IEntity[]> => get<IEntity>('global/entity.csv');

export const getEntityById = (id: string, entities: IEntity[]): IEntity =>
    R.find(R.propEq('id', id), entities) as IEntity;

export const getEntityBySlug = (slug: string, entities: IEntity[]): IEntity =>
    R.find(R.propEq('slug', slug), entities) as IEntity;

export const getEntityByIdAsync = async (id: string): Promise<IEntity> => {
    const entities: IEntity[] = await getEntities();
    return R.find(R.propEq('id', id), entities) as IEntity;
};
