import {get} from '../../connector';
import * as R from 'ramda';
import {getPageData} from '../page';

export interface IRevolutionColorMap {
    id: string;
    green: string;
    orange: string;
    red: string;
}

export const getGlobalPictureThemes = (): Promise<DH.ITheme[]> => get<DH.ITheme>('global-picture/theme.csv');

export const getTheme: (id: string, themes: DH.ITheme[]) => DH.ITheme = (id, themes) =>
    R.find(R.propEq('id', id), themes) as DH.ITheme;

export const getGlobalPicturePageData = (): Promise<DH.IPage[]> => getPageData('global-picture/page.csv');

export const getDataRevolutionColors = (): Promise<IRevolutionColorMap[]> =>
    get<IRevolutionColorMap>('global-picture/data-revolution-colors.csv');
