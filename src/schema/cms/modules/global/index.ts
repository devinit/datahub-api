import {get} from '../../connector';
import * as R from 'ramda';

interface IEntity {
    id: string;
    type: string;
    name: string;
}

export const getEntities = (): Promise<IEntity[]> => get<IEntity>('global/entity.csv');

export const getEntity = (id: string): Promise<IEntity> =>
    R.pipeP(getEntities, R.find(R.propEq('id', id)))();

export interface Iglobal {
    getEntity: any;
    getEntities: any;
}

const global: Iglobal = {
    getEntities,
    getEntity
};

export default global;
