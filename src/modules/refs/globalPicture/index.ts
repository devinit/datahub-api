import {get} from '../../connector';

export interface IRevolutionColorMap {
    id: string;
    green: string;
    orange: string;
    red: string;
}

export const getDataRevolutionColors = (): Promise<IRevolutionColorMap[]> =>
    get<IRevolutionColorMap>('global-picture/data-revolution-colors.csv');
