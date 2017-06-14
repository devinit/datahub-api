import {get} from '../../connector';
import * as R from 'ramda';

export interface IEntity {
    id: string;
    type: string;
    name: string;
}

export const getEntities = (): Promise<IEntity[]> => get<IEntity>('global/entity.csv');

// TODO: try to make work with pipeP or composeP
export const getEntity = async (id: string): Promise<IEntity> => {
    const entites: IEntity[] = await getEntities();
    return R.find(R.propEq('id', id), entites) as IEntity;
};

export default {
    getEntities,
    getEntity
};
