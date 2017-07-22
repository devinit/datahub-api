import {get} from '../../connector';
import {getPageData} from '../page';

export interface IRevolutionColorMap {
    id: string;
    green: string;
    orange: string;
    red: string;
}

export const getGlobalPicturePageData = (): Promise<DH.IPage[]> => getPageData('global-picture/page.csv');

export const getDataRevolutionColors = (): Promise<IRevolutionColorMap[]> =>
    get<IRevolutionColorMap>('global-picture/data-revolution-colors.csv');
