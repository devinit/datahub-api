import {get} from '../../connector';
import * as R from 'ramda';

interface IEntity {
    id: string;
    type: string;
    name: string;
}

export const getEntities (): Promise<IEntity[]> => get('global/entity.csv');

export const getEntity (id: string): Promise<IEntity> =>
    R.pipeP(getEntities, R.find(R.propEq('id', id)))();

export default {
    getEntities,
    getEntity
};
