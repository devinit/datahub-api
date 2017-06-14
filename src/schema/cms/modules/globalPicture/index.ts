import {get} from '../../connector';
import * as R from 'ramda';

export interface ITheme {
    id: string;
    name: string;
    default: string;
    order: number;
}

export const getThemes = async (): Promise<ITheme[]> => get<ITheme>('global-picture/themes.csv');

export const getTheme: (id: string) => Promise<ITheme> = async (id) => {
    const entites: ITheme[] = await getThemes();
    return R.find(R.propEq('id', id), entites) as ITheme;
};

export default {
    getTheme,
    getThemes
};
