import {get} from '../../connector';
import * as R from 'ramda';

interface ITheme {
    id: string;
    name: string;
    default: string;
    order: number;
}

export const getThemes = async (): Promise<ITheme[]> => get('global-picture/themes.csv');

export const getTheme async (id: string): Promise<IEntity> =>
    R.pipeP(getThemes, R.find(R.propEq('id', id)))();

export default {
    getTheme,
    getThemes
};
