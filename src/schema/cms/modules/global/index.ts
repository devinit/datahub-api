import {get} from '../../connector';
import * as R from 'ramda';

export interface IEntity {
    id: string;
    type: string;
    name: string;
}

export const getEntities = (): Promise<IEntity[]> => get<IEntity>('global/entity.csv');

export const getEntity = (id: string, entities: IEntity[]): IEntity =>
    R.find(R.propEq('id', id), entities) as IEntity;

export default {
    getEntities,
    getEntity
};
