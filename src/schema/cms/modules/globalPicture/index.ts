import {get} from '../../connector';
import * as R from 'ramda';

export interface ITheme {
    id: string;
    name: string;
    default: string;
    order: number;
}

export const getThemes = async (): Promise<ITheme[]> => get<ITheme>('global-picture/themes.csv');

export const getTheme: (id: string, themes: ITheme[]) => ITheme = (id, themes) =>
    R.find(R.propEq('id', id), themes) as ITheme;

export default {
    getTheme,
    getThemes
};
