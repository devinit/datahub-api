import {githubGet} from '@devinit/graphql-next/lib/github';

export interface IRevolutionColorMap {
    id: string;
    green: string;
    orange: string;
    red: string;
}

export const getDataRevolutionColors = (): Promise<IRevolutionColorMap[]> =>
    githubGet<IRevolutionColorMap>('global-picture/data-revolution-colors.csv');
